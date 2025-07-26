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
const database_1 = require("./config/database");
const cities_1 = __importDefault(require("./routes/cities"));
const promo_codes_1 = __importDefault(require("./routes/promo-codes"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const notifications_1 = __importDefault(require("./routes/notifications"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
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
app.use("/api/cities", cities_1.default);
app.use("/api/promo-codes", promo_codes_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.use("/api/notifications", notifications_1.default);
// Admin login endpoint
app.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(`[ADMIN LOGIN] Attempt for username: ${username}`);
    if (!username || !password) {
        console.error(`[ADMIN LOGIN] Missing username or password`);
        return res.status(400).json({ success: false, error: "اسم المستخدم وكلمة المرور مطلوبة" });
    }
    // Fetch admin user from Supabase
    const { data: admin, error } = await database_1.supabase
        .from("admin_users")
        .select("id, username, password_hash, full_name, role")
        .eq("username", username)
        .single();
    console.log(`[ADMIN LOGIN] Supabase result:`, { admin, error });
    if (error || !admin) {
        console.error(`[ADMIN LOGIN] User not found or Supabase error:`, error);
        return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" });
    }
    // Check password
    let valid = false;
    try {
        valid = await bcryptjs_1.default.compare(password, admin.password_hash);
        console.log(`[ADMIN LOGIN] Password comparison result:`, valid);
    }
    catch (err) {
        console.error(`[ADMIN LOGIN] Error comparing password:`, err);
        return res.status(500).json({ success: false, error: "خطأ في التحقق من كلمة المرور" });
    }
    if (!valid) {
        console.error(`[ADMIN LOGIN] Invalid password for username: ${username}`);
        return res.status(401).json({ success: false, error: "بيانات الدخول غير صحيحة" });
    }
    // Issue JWT
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ adminId: admin.id, username: admin.username, role: admin.role }, process.env.ADMIN_JWT_SECRET, { expiresIn: "2h" });
        console.log(`[ADMIN LOGIN] JWT issued for username: ${username}`);
    }
    catch (err) {
        console.error(`[ADMIN LOGIN] Error issuing JWT:`, err);
        return res.status(500).json({ success: false, error: "خطأ في إنشاء التوكن" });
    }
    // Set as HTTP-only cookie (optional, for extra security)
    try {
        res.cookie("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });
        console.log(`[ADMIN LOGIN] Cookie set for username: ${username}`);
    }
    catch (err) {
        console.error(`[ADMIN LOGIN] Error setting cookie:`, err);
        // Continue, as cookie is optional
    }
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