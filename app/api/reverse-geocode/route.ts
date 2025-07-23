import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    const response = await fetch(`${backendUrl}/api/reverse-geocode?${searchParams.toString()}`)

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying reverse-geocode request:", error)
    return NextResponse.json({ success: false, error: "Failed to reverse geocode" }, { status: 500 })
  }
}
