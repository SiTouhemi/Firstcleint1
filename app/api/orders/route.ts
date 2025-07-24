import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/backend/api/config/database"
import { process } from "process"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const storeId = searchParams.get("storeId")
    const status = searchParams.get("status")
    const customerPhone = searchParams.get("customerPhone")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 20
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0

    let query = supabase.from("orders").select(`
        id,
        order_number,
        store_id,
        customer_name,
        customer_phone,
        customer_email,
        customer_address,
        customer_notes,
        items,
        subtotal,
        delivery_fee,
        tax_amount,
        total,
        payment_method,
        payment_status,
        status,
        delivery_type,
        created_at,
        updated_at,
        stores!inner(
          id,
          name,
          theme_color
        )
      `)

    // Apply store filter
    if (storeId) {
      query = query.eq("store_id", storeId)
    }

    // Apply status filter
    if (status) {
      query = query.eq("status", status)
    }

    // Apply customer phone filter
    if (customerPhone) {
      query = query.eq("customer_phone", customerPhone)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Apply sorting
    query = query.order("created_at", { ascending: false })

    const { data: orders, error } = await query

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: orders || [],
      total: orders?.length || 0,
      hasMore: orders?.length === limit,
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    const body = await request.json()

    const response = await fetch(`${backendUrl}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying orders request:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
