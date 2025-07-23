import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/backend/api/config/database"

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
    const body = await request.json()

    // Remove id from body to prevent updating it
    const { id, created_at, updated_at, ...updateData } = body

    const { data: store, error } = await supabase
      .from("stores")
      .update(updateData)
      .eq("id", params.id)
      .select()
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
    console.error("Error updating store:", error)
    return NextResponse.json({ success: false, error: "Failed to update store" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Soft delete by setting is_active to false
    const { data: store, error } = await supabase
      .from("stores")
      .update({ is_active: false })
      .eq("id", params.id)
      .select()
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
    console.error("Error deleting store:", error)
    return NextResponse.json({ success: false, error: "Failed to delete store" }, { status: 500 })
  }
}
