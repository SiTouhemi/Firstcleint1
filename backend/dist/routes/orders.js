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
        const { customer_name, customer_phone, customer_address, customer_lat, customer_lng, items, subtotal, delivery_fee, total } = req.body;
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
        // Create order with location data
        const orderData = {
            order_number: orderNumber,
            customer_name,
            customer_phone,
            customer_address,
            // items: JSON.stringify(items),  // Temporarily disabled - column doesn't exist
            subtotal: subtotal || 0,
            delivery_fee: delivery_fee || 0,
            total: total || subtotal || 0,
            status: "pending",
        };
        // Add location coordinates if provided (disabled - columns don't exist in database)
        // if (customer_lat !== undefined && customer_lng !== undefined) {
        //   orderData.customer_lat = customer_lat
        //   orderData.customer_lng = customer_lng
        // }
        const { data: order, error: orderError } = await database_1.supabase
            .from("orders")
            .insert(orderData)
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
        // Create notification for new order
        try {
            const notificationData = {
                type: "new_order",
                title: "طلب جديد",
                message: `طلب جديد من ${customer_name} - ${customer_phone}`,
                data: {
                    order_id: order.id,
                    order_number: order.order_number,
                    customer_name,
                    customer_phone,
                    total: total
                }
            };
            // Create notification in database
            const { data: notification, error: notificationError } = await database_1.supabase
                .from("notifications")
                .insert({
                type: notificationData.type,
                title: notificationData.title,
                message: notificationData.message,
                data: JSON.stringify(notificationData.data),
                is_read: false
            })
                .select()
                .single();
            if (notificationError) {
                console.error("Error creating notification:", notificationError);
            }
            else {
                console.log("Notification created:", notification);
            }
        }
        catch (error) {
            console.error("Error creating notification:", error);
            // Don't fail the order creation if notification fails
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
// PATCH /api/orders/:id - Update order status
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status)
        return res.status(400).json({ success: false, error: 'Status is required' });
    try {
        const { data, error } = await database_1.supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        res.json({ success: true, data });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err.message || err) });
    }
});
exports.default = router;
//# sourceMappingURL=orders.js.map