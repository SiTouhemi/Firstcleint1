import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/backend/src/config/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: store, error } = await supabase
      .from("stores")
      .select(`
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
      .eq("id", params.id)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ success: false, error: "Store not found" }, { status: 404 })
      }
      console.error("Database error:", error)
      throw error
    }

    return NextResponse.json({ success: true, data: store })
  } catch (error) {
    console.error("Error fetching store:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch store" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    console.log("🔍 Backend URL for PUT:", backendUrl)

    if (!backendUrl) {
      console.error("❌ Backend URL not configured")
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    const body = await request.json()
    console.log("📤 Sending PUT request to backend:", `${backendUrl}/api/stores/${params.id}`)
    console.log("📦 Request body:", body)

    const response = await fetch(`${backendUrl}/api/stores/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    console.log("📥 Backend PUT response status:", response.status)
    
    if (!response.ok) {
      console.error("❌ Backend PUT response not OK:", response.status, response.statusText)
    }

    const data = await response.json()
    console.log("📋 Backend PUT response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("❌ Error proxying store update:", error)
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json({ 
        success: false, 
        error: "Cannot connect to backend server. Make sure it's running on port 4000." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ success: false, error: "Failed to update store" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    console.log("🔍 Backend URL for DELETE:", backendUrl)

    if (!backendUrl) {
      console.error("❌ Backend URL not configured")
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    console.log("📤 Sending DELETE request to backend:", `${backendUrl}/api/stores/${params.id}`)

    const response = await fetch(`${backendUrl}/api/stores/${params.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    console.log("📥 Backend DELETE response status:", response.status)
    
    if (!response.ok) {
      console.error("❌ Backend DELETE response not OK:", response.status, response.statusText)
    }

    const data = await response.json()
    console.log("📋 Backend DELETE response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("❌ Error proxying store deletion:", error)
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json({ 
        success: false, 
        error: "Cannot connect to backend server. Make sure it's running on port 4000." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ success: false, error: "Failed to delete store" }, { status: 500 })
  }
}
