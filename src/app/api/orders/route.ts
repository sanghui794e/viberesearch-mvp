import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, orders: [] }, { status: 200 });
}

export async function POST() {
  return NextResponse.json({ ok: true, orders: [] }, { status: 200 });
}

export async function PATCH() {
  return NextResponse.json({ ok: true, orders: [] }, { status: 200 });
}

export async function DELETE() {
  return NextResponse.json({ ok: true, orders: [] }, { status: 200 });
}
