import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest, { params }) {
  const { id } = params
  const body = await req.json()
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const res = await fetch(`${backendUrl}/api/banners/${id}/status`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
} 