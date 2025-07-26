import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    if (!backendUrl) {
      return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 })
    }

    const url = `${backendUrl}/api/stores/${params.id}`
    const response = await fetch(url)
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error proxying store request:", error)
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
