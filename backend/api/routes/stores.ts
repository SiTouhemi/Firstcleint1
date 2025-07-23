import { type NextRequest, NextResponse } from "next/server"
import { StoreService } from "../services/storeService"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const maxDistance = searchParams.get("maxDistance")

    let stores
    if (lat && lng) {
      stores = await StoreService.getStoresByLocation(
        Number.parseFloat(lat),
        Number.parseFloat(lng),
        maxDistance ? Number.parseInt(maxDistance) : 50,
      )
    } else {
      stores = await StoreService.getAllStores()
    }

    return NextResponse.json({ success: true, data: stores })
  } catch (error) {
    console.error("Error fetching stores:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const store = await StoreService.createStore(body)
    return NextResponse.json({ success: true, data: store })
  } catch (error) {
    console.error("Error creating store:", error)
    return NextResponse.json({ success: false, error: "Failed to create store" }, { status: 500 })
  }
}
