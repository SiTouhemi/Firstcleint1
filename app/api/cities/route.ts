import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:4000/api/cities';

export async function GET() {
  const res = await fetch(BACKEND_URL, { method: 'GET' });
  const data = await res.json();
  // Always wrap in { success, data }
  return NextResponse.json({ success: true, data }, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  // PATCH requests must include the city id in the body as { id }
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'City id is required' }, { status: 400 });
  const res = await fetch(`${BACKEND_URL}/${id}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 