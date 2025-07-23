import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ success: false, error: "Address parameter is required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Google Maps API key not configured" }, { status: 500 })
    }

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`

    const response = await fetch(geocodeUrl)
    const data = await response.json()

    if (data.status === "OK" && data.results.length > 0) {
      const result = data.results[0]
      const location = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        formatted_address: result.formatted_address,
      }

      return NextResponse.json({
        success: true,
        location,
        full_response: result,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: "Location not found",
        status: data.status,
      })
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ success: false, error: "Failed to geocode address" }, { status: 500 })
  }
}
