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
import citiesRouter from "./routes/cities"
import promoCodesRouter from "./routes/promo-codes"

dotenv.config({ path: path.resolve(__dirname, "../.env") })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const app = express()
const PORT = process.env.PORT || 4000

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.url}`)
  console.log(`📍 Headers:`, req.headers)
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body)
  }
  next()
})

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
app.use("/api/cities", citiesRouter)
app.use("/api/promo-codes", promoCodesRouter)

// Admin login endpoint
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body
  console.log(`[ADMIN LOGIN] Attempt for username: ${username}`)
  if (!username || !password) {
    console.error(`[ADMIN LOGIN] Missing username or password`)
    return res.status(400).json({ success: false, error: "اسم المستخدم وكلمة المرور مطلوبة" })
  }
  // Fetch admin user from Supabase
  const { data: admin, error } = await supabase
    .from("admin_users")
    .select("id, username, password_hash, full_name, role")
    .eq("username", username)
    .single()
  console.log(`[ADMIN LOGIN] Supabase result:`, { admin, error })
  if (error || !admin) {
    console.error(`[ADMIN LOGIN] User not found or Supabase error:`, error)
    return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" })
  }
  // Check password
  let valid = false
  try {
    valid = await bcrypt.compare(password, admin.password_hash)
    console.log(`[ADMIN LOGIN] Password comparison result:`, valid)
  } catch (err) {
    console.error(`[ADMIN LOGIN] Error comparing password:`, err)
    return res.status(500).json({ success: false, error: "خطأ في التحقق من كلمة المرور" })
  }
  if (!valid) {
    console.error(`[ADMIN LOGIN] Invalid password for username: ${username}`)
    return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" })
  }
  // Issue JWT
  let token
  try {
    token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: admin.role },
      process.env.ADMIN_JWT_SECRET!,
      { expiresIn: "2h" }
    )
    console.log(`[ADMIN LOGIN] JWT issued for username: ${username}`)
  } catch (err) {
    console.error(`[ADMIN LOGIN] Error issuing JWT:`, err)
    return res.status(500).json({ success: false, error: "خطأ في إنشاء التوكن" })
  }
  // Set as HTTP-only cookie (optional, for extra security)
  try {
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
    })
    console.log(`[ADMIN LOGIN] Cookie set for username: ${username}`)
  } catch (err) {
    console.error(`[ADMIN LOGIN] Error setting cookie:`, err)
    // Continue, as cookie is optional
  }
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
