import { type NextRequest, NextResponse } from "next/server"
import { OrderService } from "../services/orderService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get("storeId")

    if (!storeId) {
      return NextResponse.json({ success: false, error: "Store ID is required" }, { status: 400 })
    }

    const orders = await OrderService.getOrdersByStore(storeId)
    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { orderData, items } = await request.json()
    const order = await OrderService.createOrder(orderData, items)
    return NextResponse.json({ success: true, data: order })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
