import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/backend/api/config/database"

// Helper function to calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const featured = searchParams.get("featured") === "true"
    const active = searchParams.get("active") !== "false" // Default to true
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : 0

    // Location-based filtering
    const lat = searchParams.get("lat")
    const lng = searchParams.get("lng")
    const radius = searchParams.get("radius") ? Number.parseInt(searchParams.get("radius")!) : 10

    let query = supabase.from("stores").select(`
        id,
        name,
        slug,
        description,
        email,
        phone,
        whatsapp,
        website,
        address,
        location_lat,
        location_lng,
        delivery_range,
        delivery_fee,
        min_order_amount,
        logo_url,
        cover_image_url,
        theme_color,
        is_active,
        is_featured,
        opening_hours,
        social_media,
        created_at,
        updated_at
      `)

    // Apply active filter
    if (active) {
      query = query.eq("is_active", true)
    }

    // Apply featured filter
    if (featured) {
      query = query.eq("is_featured", true)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Apply sorting
    query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false })

    const { data: stores, error } = await query

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    let filteredStores = stores || []

    // Apply location-based filtering if coordinates are provided
    if (lat && lng && filteredStores.length > 0) {
      const userLat = Number.parseFloat(lat)
      const userLng = Number.parseFloat(lng)

      // Filter stores by proximity
      filteredStores = filteredStores.filter((store) => {
        if (!store.location_lat || !store.location_lng) {
          return false
        }

        // Calculate distance using Haversine formula
        const distance = calculateDistance(userLat, userLng, store.location_lat, store.location_lng)

        return distance <= Math.min(radius, store.delivery_range)
      })

      // Sort by distance
      filteredStores.sort((a, b) => {
        const distanceA = calculateDistance(userLat, userLng, a.location_lat, a.location_lng)
        const distanceB = calculateDistance(userLat, userLng, b.location_lat, b.location_lng)
        return distanceA - distanceB
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredStores,
      total: filteredStores.length,
      hasMore: filteredStores.length === limit,
    })
  } catch (error) {
    console.error("Error fetching stores:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.address) {
      return NextResponse.json({ success: false, error: "Missing required fields: name, address" }, { status: 400 })
    }

    // Insert store
    const { data: store, error } = await supabase
      .from("stores")
      .insert({
        name: body.name,
        slug: body.slug || null,
        description: body.description || null,
        email: body.email || null,
        phone: body.phone || null,
        whatsapp: body.whatsapp || null,
        website: body.website || null,
        address: body.address,
        location_lat: body.location_lat || null,
        location_lng: body.location_lng || null,
        delivery_range: body.delivery_range || 10,
        delivery_fee: body.delivery_fee || 0,
        min_order_amount: body.min_order_amount || 0,
        theme_color: body.theme_color || "#3B82F6",
        is_featured: body.is_featured || false,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      throw error
    }

    return NextResponse.json({ success: true, data: store })
  } catch (error) {
    console.error("Error creating store:", error)
    return NextResponse.json({ success: false, error: "Failed to create store" }, { status: 500 })
  }
}
