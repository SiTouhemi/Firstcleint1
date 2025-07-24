"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const { data: banners, error } = await database_1.supabase
            .from("banners")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to fetch banners",
            });
        }
        res.json({
            success: true,
            data: banners || [],
        });
    }
    catch (error) {
        console.error("Error fetching banners:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
exports.default = router;
//# sourceMappingURL=banners.js.map