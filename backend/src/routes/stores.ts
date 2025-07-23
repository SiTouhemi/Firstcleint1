import express from "express"
import { supabase } from "../config/database"

const router = express.Router()

router.get("/", async (req, res) => {
  try {
    const { city } = req.query

    let query = supabase.from("stores").select("*").eq("is_active", true)

    // Remove: if (city) { query = query.eq("city", city) }
    // Instead, look up city id and filter by city_id as in ProductService

    const { data: stores, error } = await query.order("name", { ascending: true })

    if (error) {
      console.error("Database error:", error)
      return res.status(500).json({
        success: false,
        error: "Failed to fetch stores",
      })
    }

    res.json({
      success: true,
      data: stores || [],
    })
  } catch (error) {
    console.error("Error fetching stores:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router
