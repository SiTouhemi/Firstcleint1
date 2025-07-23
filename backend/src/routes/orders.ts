import express from "express"
import { supabase } from "../config/database"

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_address, items, subtotal, delivery_fee, total } = req.body

    // Validate required fields
    if (
      !customer_name ||
      !customer_phone ||
      !customer_address ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name,
        customer_phone,
        customer_address,
        items: JSON.stringify(items),
        subtotal: subtotal || 0,
        delivery_fee: delivery_fee || 0,
        total: total || subtotal || 0,
        status: "pending",
      })
      .select()
      .single()

    if (orderError) {
      console.error("Database error creating order:", orderError)
      return res.status(500).json({
        success: false,
        error: "Failed to create order",
      })
    }

    res.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

router.get("/", async (req, res) => {
  try {
    const { phone, limit = "20" } = req.query

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(Number.parseInt(limit as string))

    if (phone) {
      query = query.eq("customer_phone", phone)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error("Database error:", error)
      return res.status(500).json({
        success: false,
        error: "Failed to fetch orders",
      })
    }

    res.json({
      success: true,
      data: orders || [],
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
    })
  }
})

export default router
