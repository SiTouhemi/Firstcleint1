import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(req: NextRequest, { params }) {
  const { id } = params
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const res = await fetch(`${backendUrl}/api/banners/${id}`, { method: 'DELETE' })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
}

export async function PUT(req: NextRequest, { params }) {
  const { id } = params
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
  const body = await req.json()
  const res = await fetch(`${backendUrl}/api/banners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return NextResponse.json(data, { status: res.status })
} 