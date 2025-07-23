import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    const response = await fetch(`${backendUrl}/api/banners`)

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying banners request:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch banners" }, { status: 500 })
  }
}
