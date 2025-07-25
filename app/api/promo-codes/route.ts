import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:4000/api/promo-codes';

export async function GET() {
  const res = await fetch(BACKEND_URL, { method: 'GET' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
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
  const { id, ...update } = body;
  if (!id) return NextResponse.json({ success: false, error: 'Promo code id is required' }, { status: 400 });
  const res = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ success: false, error: 'Promo code id is required' }, { status: 400 });
  const res = await fetch(`${BACKEND_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
} 