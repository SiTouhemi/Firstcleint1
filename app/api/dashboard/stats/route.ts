import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    // Get stores stats
    const { data: stores, error: storesError } = await supabase.from("stores").select("id, is_active")

    if (storesError) throw storesError

    // Get products stats
    const { data: products, error: productsError } = await supabase.from("products").select("id").eq("is_active", true)

    if (productsError) throw productsError

    // Get orders stats
    const { data: orders, error: ordersError } = await supabase.from("orders").select("id, status, total")

    if (ordersError) throw ordersError

    // Calculate stats
    const totalStores = stores?.length || 0
    const activeStores = stores?.filter((store) => store.is_active).length || 0
    const totalProducts = products?.length || 0
    const totalOrders = orders?.length || 0
    const totalRevenue = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0

    // Count orders by status
    const pendingOrders = orders?.filter((order) => order.status === "pending").length || 0
    const processingOrders =
      orders?.filter((order) => ["confirmed", "preparing", "ready", "out_for_delivery"].includes(order.status))
        .length || 0
    const deliveredOrders = orders?.filter((order) => order.status === "delivered").length || 0
    const cancelledOrders = orders?.filter((order) => order.status === "cancelled").length || 0

    return NextResponse.json({
      success: true,
      data: {
        totalStores,
        activeStores,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        processingOrders,
        deliveredOrders,
        cancelledOrders,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
