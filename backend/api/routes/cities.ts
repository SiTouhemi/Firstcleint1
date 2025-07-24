import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "../config/database"

export async function GET(request: NextRequest) {
  try {
    const { data: cities, error } = await supabase
      .from("cities")
      .select("id, name")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching cities:", error)
      return NextResponse.json({ success: false, error: "Failed to fetch cities" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: cities })
  } catch (error) {
    console.error("Error fetching cities:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch cities" }, { status: 500 })
  }
} 