import express from "express"
import { supabase } from "../config/database"

const router = express.Router()

router.post("/", async (req, res) => {
  try {
    const { customer_name, customer_phone, customer_address, customer_lat, customer_lng, items, subtotal, delivery_fee, total } = req.body

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
        error: "يرجى ملء جميع الحقول المطلوبة وإضافة منتجات للسلة.",
        details: "Missing required fields: customer_name, customer_phone, customer_address, items"
      })
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`

    // Create order with location data
    const orderData: any = {
      order_number: orderNumber,
      customer_name,
      customer_phone,
      customer_address,
      items: JSON.stringify(items),
      subtotal: subtotal || 0,
      delivery_fee: delivery_fee || 0,
      total: total || subtotal || 0,
      status: "pending",
    }

    // Add location coordinates if provided
    if (customer_lat !== undefined && customer_lng !== undefined) {
      orderData.customer_lat = customer_lat
      orderData.customer_lng = customer_lng
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single()

    if (orderError) {
      console.error("Database error creating order:", orderError)
      return res.status(500).json({
        success: false,
        error: "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
        details: orderError.message || orderError
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
      error: "حدث خطأ غير متوقع أثناء معالجة الطلب.",
      details: error instanceof Error ? error.message : String(error)
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
        error: "حدث خطأ أثناء جلب الطلبات.",
        details: error.message || error
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
      error: "حدث خطأ غير متوقع أثناء جلب الطلبات.",
      details: error instanceof Error ? error.message : String(error)
    })
  }
})

// PATCH /api/orders/:id - Update order status
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ success: false, error: 'Status is required' });
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: String((err as Error).message || err) });
  }
});

export default router
