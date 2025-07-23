import express from "express"
import { supabase } from "../config/database"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return res.status(500).json({
        success: false,
        error: "Failed to fetch categories",
      })
    }

    res.json({
      success: true,
      data: categories || [],
    })
  } catch (error) {
    console.error("Error fetching categories:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router
