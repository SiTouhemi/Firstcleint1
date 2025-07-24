"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const router = express_1.default.Router();
// Add logging for stores routes
router.use((req, res, next) => {
    console.log(`🏪 Stores route: ${req.method} ${req.path}`);
    next();
});
router.get("/", async (req, res) => {
    try {
        // No filter for city by default
        let query = database_1.supabase.from("stores").select("*").eq("is_active", true);
        const { data: stores, error } = await query.order("name", { ascending: true });
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to fetch stores",
            });
        }
        res.json({
            success: true,
            data: stores || [],
        });
    }
    catch (error) {
        console.error("Error fetching stores:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
router.post("/", async (req, res) => {
    try {
        const { name, description, email, phone, whatsapp, website, address, location_lat, location_lng, delivery_range, delivery_fee, min_order_amount, theme_color, } = req.body;
        if (!name || !address || !location_lat || !location_lng) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }
        const { data: store, error } = await database_1.supabase
            .from("stores")
            .insert({
            name,
            description: description || null,
            email: email || null,
            phone: phone || null,
            whatsapp: whatsapp || null,
            website: website || null,
            address,
            location_lat,
            location_lng,
            delivery_range: delivery_range || 10,
            delivery_fee: delivery_fee || 0,
            min_order_amount: min_order_amount || 0,
            theme_color: theme_color || "#3B82F6",
            is_active: true,
        })
            .select()
            .single();
        if (error) {
            console.error("Database error (create store):", error);
            return res.status(500).json({ success: false, error: "Failed to create store" });
        }
        res.json({ success: true, data: store });
    }
    catch (error) {
        console.error("Error creating store:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, email, phone, whatsapp, website, address, location_lat, location_lng, delivery_range, delivery_fee, min_order_amount, theme_color, is_active, is_featured, } = req.body;
        // Remove fields that shouldn't be updated
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (email !== undefined)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        if (whatsapp !== undefined)
            updateData.whatsapp = whatsapp;
        if (website !== undefined)
            updateData.website = website;
        if (address !== undefined)
            updateData.address = address;
        if (location_lat !== undefined)
            updateData.location_lat = location_lat;
        if (location_lng !== undefined)
            updateData.location_lng = location_lng;
        if (delivery_range !== undefined)
            updateData.delivery_range = delivery_range;
        if (delivery_fee !== undefined)
            updateData.delivery_fee = delivery_fee;
        if (min_order_amount !== undefined)
            updateData.min_order_amount = min_order_amount;
        if (theme_color !== undefined)
            updateData.theme_color = theme_color;
        if (is_active !== undefined)
            updateData.is_active = is_active;
        if (is_featured !== undefined)
            updateData.is_featured = is_featured;
        const { data: store, error } = await database_1.supabase
            .from("stores")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Database error (update store):", error);
            if (error.code === "PGRST116") {
                return res.status(404).json({ success: false, error: "Store not found" });
            }
            return res.status(500).json({ success: false, error: "Failed to update store" });
        }
        res.json({ success: true, data: store });
    }
    catch (error) {
        console.error("Error updating store:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // Soft delete by setting is_active to false
        const { data: store, error } = await database_1.supabase
            .from("stores")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();
        if (error) {
            console.error("Database error (delete store):", error);
            if (error.code === "PGRST116") {
                return res.status(404).json({ success: false, error: "Store not found" });
            }
            return res.status(500).json({ success: false, error: "Failed to delete store" });
        }
        res.json({ success: true, data: store });
    }
    catch (error) {
        console.error("Error deleting store:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=stores.js.map