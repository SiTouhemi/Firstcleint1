import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        customer_name,
        total,
        status,
        created_at,
        stores (
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error

    const formattedOrders =
      orders?.map((order) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        store_name: order.stores?.name || "غير محدد",
      })) || []

    return NextResponse.json({
      success: true,
      data: formattedOrders,
    })
  } catch (error) {
    console.error("Error fetching recent orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recent orders" }, { status: 500 })
  }
}
