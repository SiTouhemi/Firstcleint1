"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const distance_1 = require("../utils/distance");
const router = express_1.default.Router();
// GET /api/products
router.get("/", async (req, res) => {
    try {
        const { category, search, city, sortBy = "name", nearbyOnly, latitude, longitude, limit = "50" } = req.query;
        let query = database_1.supabase
            .from("products")
            .select(`
        *,
        category:categories!products_category_id_fkey(name),
        subcategory:categories!products_subcategory_id_fkey(name),
        store:stores!inner(id, name, slug, city_id, location_lat, location_lng, delivery_range)
      `)
            .eq("available", true)
            .eq("is_active", true);
        // Apply category filter
        if (category) {
            query = query.eq("category_id", category);
        }
        // Apply city filter
        if (city) {
            const { data: cityData, error: cityError } = await database_1.supabase
                .from("cities")
                .select("id")
                .eq("name", city)
                .single();
            if (cityError) {
                console.error("Database error (city lookup):", cityError);
                return res.status(500).json({
                    success: false,
                    error: "Database error during city lookup",
                });
            }
            if (!cityData) {
                console.warn(`No city found for name: ${city}`);
                return res.json({ success: true, data: [] });
            }
            const cityId = cityData.id;
            const { data: stores, error: storesError } = await database_1.supabase
                .from("stores")
                .select("id")
                .eq("city_id", cityId);
            if (storesError) {
                console.error("Database error (stores lookup):", storesError);
                return res.status(500).json({
                    success: false,
                    error: "Database error during stores lookup",
                });
            }
            if (!stores || stores.length === 0) {
                console.warn(`No stores found for city id: ${cityId}`);
                return res.json({ success: true, data: [] });
            }
            query = query.in("store_id", stores.map((store) => store.id));
        }
        // Apply search filter
        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        // Apply sorting
        if (sortBy === "price") {
            query = query.order("price", { ascending: true });
        }
        else {
            query = query.order("name", { ascending: true });
        }
        query = query.limit(Number.parseInt(limit));
        const { data: products, error } = await query;
        if (error) {
            console.error("Database error (products):", error);
            return res.status(500).json({
                success: false,
                error: "Failed to fetch products",
            });
        }
        if (!products || products.length === 0) {
            console.warn("No products found for the given filters.");
            return res.json({ success: true, data: [] });
        }
        let processedProducts = products || [];
        // Apply nearby filter if location is provided
        if (nearbyOnly === "true" && latitude && longitude) {
            const userLat = Number.parseFloat(latitude);
            const userLng = Number.parseFloat(longitude);
            processedProducts = processedProducts
                .filter((product) => {
                if (!product.store?.location_lat || !product.store?.location_lng) {
                    return false;
                }
                const distance = (0, distance_1.calculateDistance)(userLat, userLng, product.store.location_lat, product.store.location_lng);
                const deliveryRadius = product.store.delivery_range || 10;
                return distance <= deliveryRadius;
            })
                .map((product) => ({
                ...product,
                distance: (0, distance_1.calculateDistance)(userLat, userLng, product.store.location_lat, product.store.location_lng),
                store_name: product.store.name,
                category_name: product.categories?.name,
            }))
                .sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }
        else {
            processedProducts = processedProducts.map((product) => ({
                ...product,
                store_name: product.store?.name,
                category_name: product.categories?.name,
            }));
        }
        res.json({
            success: true,
            data: processedProducts,
        });
    }
    catch (error) {
        console.error("API error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
// POST /api/products
router.post("/", async (req, res) => {
    try {
        const body = req.body;
        // Validate required fields
        const requiredFields = ["name", "price", "store_id"];
        const missingFields = requiredFields.filter((field) => !body[field]);
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Missing required fields",
                fields: missingFields,
            });
        }
        // Validate price is a positive number
        if (typeof body.price !== "number" || body.price <= 0) {
            return res.status(400).json({
                success: false,
                error: "Price must be a positive number",
            });
        }
        const { data: product, error } = await database_1.supabase
            .from("products")
            .insert([
            {
                name: body.name,
                description: body.description || "",
                price: body.price,
                compare_price: body.compare_price,
                discount: body.discount || 0,
                image_url: body.image_url,
                category_id: body.category_id,
                store_id: body.store_id,
                is_active: body.is_active !== false,
                available: body.available !== false,
                stock_quantity: body.stock_quantity || 0,
                unit: body.unit || "قطعة",
                is_featured: body.is_featured || false,
            },
        ])
            .select()
            .single();
        if (error) {
            console.error("Database error:", error);
            return res.status(500).json({
                success: false,
                error: "Failed to create product",
                details: error.message,
            });
        }
        res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        console.error("API error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map