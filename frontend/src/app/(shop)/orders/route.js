import { NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:8003";

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/api/orders`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
