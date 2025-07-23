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

// Create category
router.post("/", async (req, res) => {
  try {
    const { name, slug, description, icon, parent_id, sort_order } = req.body
    if (!name) {
      return res.status(400).json({ success: false, error: "Name is required" })
    }
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name,
        slug, // Add slug to DB insert
        description: description || null,
        icon: icon || null,
        parent_id: parent_id || null,
        sort_order: typeof sort_order === "number" ? sort_order : 0,
        is_active: true,
      })
      .select()
      .single()
    if (error) {
      console.error("Database error (create):", error)
      return res.status(500).json({ success: false, error: "Failed to create category" })
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error("Error creating category:", error)
    res.status(500).json({ success: false, error: "Internal server error" })
  }
})

// Update category
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, icon, parent_id, sort_order } = req.body
    if (!name) {
      return res.status(400).json({ success: false, error: "Name is required" })
    }
    const { data, error } = await supabase
      .from("categories")
      .update({
        name,
        description: description || null,
        icon: icon || null,
        parent_id: parent_id || null,
        sort_order: typeof sort_order === "number" ? sort_order : 0,
      })
      .eq("id", id)
      .select()
      .single()
    if (error) {
      console.error("Database error (update):", error)
      return res.status(500).json({ success: false, error: "Failed to update category" })
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error("Error updating category:", error)
    res.status(500).json({ success: false, error: "Internal server error" })
  }
})

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    // Optionally: delete subcategories as well
    const { error: subError } = await supabase
      .from("categories")
      .delete()
      .eq("parent_id", id)
    if (subError) {
      console.error("Database error (delete subcategories):", subError)
      return res.status(500).json({ success: false, error: "Failed to delete subcategories" })
    }
    const { data, error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id)
      .select()
      .single()
    if (error) {
      console.error("Database error (delete):", error)
      return res.status(500).json({ success: false, error: "Failed to delete category" })
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error("Error deleting category:", error)
    res.status(500).json({ success: false, error: "Internal server error" })
  }
})

export default router
