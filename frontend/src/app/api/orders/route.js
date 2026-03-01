import { NextResponse } from "next/server";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:8003";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const guestId = searchParams.get('guestId');
    
    let url = `${ORDER_SERVICE_URL}/api/orders`;
    if (email) {
      url += `?email=${encodeURIComponent(email)}`;
    } else if (guestId) {
      url += `?guest_id=${guestId}`;
    }
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "