import express from "express"
import { supabase } from "../config/database"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    console.log("[BANNERS ROUTE] Fetching banners...");
    console.log("[BANNERS ROUTE] process.env.NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("[BANNERS ROUTE] process.env.SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
    console.log("[BANNERS ROUTE] Supabase client config:", supabase);
    // Try a direct query to another table
    const { data: storesTest, error: storesError } = await supabase.from("stores").select("*").limit(1);
    console.log("[BANNERS ROUTE] Test query to stores table:", storesTest, storesError);
    // Now query banners
    const { data: banners, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    console.log("[BANNERS ROUTE] Query result:", banners);
    console.log("[BANNERS ROUTE] Query error:", error);
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
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const banner = req.body;
    if (!banner.background_color) {
      return res.status(400).json({ success: false, error: 'background_color is required' });
    }
    const { data, error } = await supabase.from("banners").insert([banner]).select();
    if (error) return res.status(500).json({ success: false, error: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabase.from("banners").update(updates).eq("id", id).select();
    if (error) return res.status(500).json({ success: false, error: error.message });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from("banners").delete().eq("id", id);
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router
