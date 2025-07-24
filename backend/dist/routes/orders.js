"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { customer_name, customer_phone, customer_address, items, subtotal, delivery_fee, total } = req.body;
        // Validate required fields
        if (!customer_name ||
            !customer_phone ||
            !customer_address ||
            !items ||
            !Array.isArray(items) ||
            items.length === 0) {
            return res.status(400).json({
                success: false,
                error: "يرجى ملء جميع الحقول المطلوبة وإضافة منتجات للسلة.",
                details: "Missing required fields: customer_name, customer_phone, customer_address, items"
            });
        }
        // Generate order number
        const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
        // Create order
        const { data: order, error: orderError } = await database_1.supabase
            .from("orders")
            .insert({
            order_number: orderNumber,
            customer_name,
            customer_phone,
            customer_address,
            items: JSON.stringify(items),
            subtotal: subtotal || 0,
            delivery_fee: delivery_fee || 0,
            total: total || subtotal || 0,
            status: "pending",
        })
            .select()
            .single();
        if (orderError) {
            console.error("Database error creating order:", orderError);
            return res.status(500).json({
                success: false,
                error: "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
                details: orderError.message || orderError
            });
        }
        res.json({
            success: true,
            data: order,
        });
    }
    catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({
            success: false,
            error: "حدث خطأ غير متوقع أثناء معالجة الطلب.",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const { phone, limit = "20" } = req.query;
        let query = database_1.supabase
            .from("orders")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(Number.parseInt(limit));
        if (phone) {
            query = query.eq("customer_phone", phone);
        }
        const { data: orders, error } = await query;
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "حدث خطأ أثناء جلب الطلبات.",
                details: error.message || error
            });
        }
        res.json({
            success: true,
            data: orders || [],
        });
    }
    catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            error: "حدث خطأ غير متوقع أثناء جلب الطلبات.",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map