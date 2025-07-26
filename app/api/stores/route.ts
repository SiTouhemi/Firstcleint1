import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    const url = `${backendUrl}/api/stores${request.nextUrl.search}`
    const response = await fetch(url)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error proxying stores request:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch stores" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    console.log("🔍 Backend URL:", backendUrl)

    if (!backendUrl) {
      console.error("❌ Backend URL not configured")
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    const body = await request.json()
    console.log("📤 Sending request to backend:", `${backendUrl}/api/stores`)
    console.log("📦 Request body:", body)

    const response = await fetch(`${backendUrl}/api/stores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    console.log("📥 Backend response status:", response.status)
    
    if (!response.ok) {
      console.error("❌ Backend response not OK:", response.status, response.statusText)
    }

    const data = await response.json()
    console.log("📋 Backend response data:", data)

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("❌ Error proxying store creation:", error)
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json({ 
        success: false, 
        error: "Cannot connect to backend server. Make sure it's running on port 4000." 
      }, { status: 503 })
    }
    
    return NextResponse.json({ success: false, error: "Failed to create store" }, { status: 500 })
  }
}
