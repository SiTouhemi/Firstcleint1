import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 });

  const body = await request.json();
  const response = await fetch(`${backendUrl}/api/products/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) return NextResponse.json({ success: false, error: "Backend URL not configured" }, { status: 500 });

  const response = await fetch(`${backendUrl}/api/products/${params.id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
} 