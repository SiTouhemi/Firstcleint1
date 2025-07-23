import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import path from "path"
import productsRouter from "./routes/products"
import categoriesRouter from "./routes/categories"
import storesRouter from "./routes/stores"
import bannersRouter from "./routes/banners"
import ordersRouter from "./routes/orders"
import geocodeRouter from "./routes/geocode"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { createClient } from "@supabase/supabase-js"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// API Routes
app.use("/api/products", productsRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/stores", storesRouter)
app.use("/api/banners", bannersRouter)
app.use("/api/orders", ordersRouter)
app.use("/api", geocodeRouter)

// Admin login endpoint
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ success: false, error: "اسم المستخدم وكلمة المرور مطلوبة" })
  }
  // Fetch admin user from Supabase
  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("id, username, password_hash, full_name, role")
    .eq("username", username)
    .single()
  if (error || !admin) {
    return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" })
  }
  // Check password
  const valid = await bcrypt.compare(password, admin.password_hash)
  if (!valid) {
    return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" })
  }
  // Issue JWT
  const token = jwt.sign(
    { adminId: admin.id, username: admin.username, role: admin.role },
    process.env.ADMIN_JWT_SECRET!,
    { expiresIn: "2h" }
  )
  // Set as HTTP-only cookie (optional, for extra security)
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
  })
  return res.json({ success: true, token })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    error: "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
})
