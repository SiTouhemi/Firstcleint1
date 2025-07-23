import express from "express"
import { supabase } from "../config/database"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const { data: banners, error } = await supabase
      .from("banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return res.status(500).json({
        success: false,
        error: "Failed to fetch banners",
      })
    }

    res.json({
      success: true,
      data: banners || [],
    })
  } catch (error) {
    console.error("Error fetching banners:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router
