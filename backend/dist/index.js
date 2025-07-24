"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
const stores_1 = __importDefault(require("./routes/stores"));
const banners_1 = __importDefault(require("./routes/banners"));
const orders_1 = __importDefault(require("./routes/orders"));
const geocode_1 = __importDefault(require("./routes/geocode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Request logging middleware
app.use((req, res, next) => {
    console.log(`🌐 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log(`📍 Headers:`, req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📦 Body:`, req.body);
    }
    next();
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// API Routes
app.use("/api/products", products_1.default);
app.use("/api/categories", categories_1.default);
app.use("/api/stores", stores_1.default);
app.use("/api/banners", banners_1.default);
app.use("/api/orders", orders_1.default);
app.use("/api", geocode_1.default);
// Admin login endpoint
app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ success: false, error: "اسم المستخدم وكلمة المرور مطلوبة" });
    }
    // Fetch admin user from Supabase
    const { data: admin, error } = await supabase
        .from("admin_users")
        .select("id, username, password_hash, full_name, role")
        .eq("username", username)
        .single();
    if (error || !admin) {
        return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" });
    }
    // Check password
    const valid = await bcryptjs_1.default.compare(password, admin.password_hash);
    if (!valid) {
        return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" });
    }
    // Issue JWT
    const token = jsonwebtoken_1.default.sign({ adminId: admin.id, username: admin.username, role: admin.role }, process.env.ADMIN_JWT_SECRET, { expiresIn: "2h" });
    // Set as HTTP-only cookie (optional, for extra security)
    res.cookie("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
    return res.json({ success: true, token });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        error: "Internal server error",
    });
});
// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`);
});
//# sourceMappingURL=index.js.map