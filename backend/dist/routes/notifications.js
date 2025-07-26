"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const router = express_1.default.Router();
// GET /api/notifications - Get all notifications
router.get("/", async (req, res) => {
    try {
        const { data: notifications, error } = await database_1.supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "حدث خطأ أثناء جلب الإشعارات",
                details: error.message
            });
        }
        res.json({
            success: true,
            data: notifications || []
        });
    }
    catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            success: false,
            error: "حدث خطأ غير متوقع"
        });
    }
});
// POST /api/notifications - Create new notification
router.post("/", async (req, res) => {
    try {
        const { type, title, message, data, admin_user_id } = req.body;
        if (!type || !title || !message) {
            return res.status(400).json({
                success: false,
                error: "يرجى إدخال نوع الإشعار والعنوان والرسالة"
            });
        }
        const notificationData = {
            type,
            title,
            message,
            data: data ? JSON.stringify(data) : null,
            admin_user_id: admin_user_id || null,
            is_read: false
        };
        const { data: notification, error } = await database_1.supabase
            .from("notifications")
            .insert(notificationData)
            .select()
            .single();
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "حدث خطأ أثناء إنشاء الإشعار",
                details: error.message
            });
        }
        res.json({
            success: true,
            data: notification
        });
    }
    catch (error) {
        console.error("Error creating notification:", error);
        res.status(500).json({
            success: false,
            error: "حدث خطأ غير متوقع"
        });
    }
});
// POST /api/notifications/:id/read - Mark notification as read
router.post("/:id/read", async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await database_1.supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "حدث خطأ أثناء تحديث الإشعار",
                details: error.message
            });
        }
        res.json({
            success: true,
            data
        });
    }
    catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({
            success: false,
            error: "حدث خطأ غير متوقع"
        });
    }
});
// POST /api/notifications/mark-all-read - Mark all notifications as read
router.post("/mark-all-read", async (req, res) => {
    try {
        const { data, error } = await database_1.supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("is_read", false);
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "حدث خطأ أثناء تحديث الإشعارات",
                details: error.message
            });
        }
        res.json({
            success: true,
            data: { message: "تم تحديث جميع الإشعارات" }
        });
    }
    catch (error) {
        console.error("Error updating notifications:", error);
        res.status(500).json({
            success: false,
            error: "حدث خطأ غير متوقع"
        });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map