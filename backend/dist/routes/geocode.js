"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/reverse-geocode", async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                error: "Latitude and longitude are required",
            });
        }
        // Simple city mapping based on coordinates (Saudi Arabia focus)
        const latitude = Number.parseFloat(lat);
        const longitude = Number.parseFloat(lng);
        let city = "غير محدد";
        // Riyadh area
        if (latitude >= 24.4 && latitude <= 24.9 && longitude >= 46.3 && longitude <= 47.0) {
            city = "الرياض";
        }
        // Jeddah area
        else if (latitude >= 21.3 && latitude <= 21.8 && longitude >= 39.0 && longitude <= 39.4) {
            city = "جدة";
        }
        // Dammam area
        else if (latitude >= 26.3 && latitude <= 26.5 && longitude >= 49.9 && longitude <= 50.2) {
            city = "الدمام";
        }
        // Mecca area
        else if (latitude >= 21.3 && latitude <= 21.5 && longitude >= 39.7 && longitude <= 40.0) {
            city = "مكة المكرمة";
        }
        // Medina area
        else if (latitude >= 24.4 && latitude <= 24.5 && longitude >= 39.5 && longitude <= 39.7) {
            city = "المدينة المنورة";
        }
        res.json({
            success: true,
            city,
            coordinates: {
                latitude,
                longitude,
            },
        });
    }
    catch (error) {
        console.error("Error in reverse geocoding:", error);
        res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
});
exports.default = router;
//# sourceMappingURL=geocode.js.map