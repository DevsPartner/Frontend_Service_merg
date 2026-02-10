// app/api/cart/route.js
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/apiClient";

export async function GET(request) {
  try {
    const res = await backendFetch(
      "cart",
      "/api/v1/cart",
      {
        method: "GET"
      },
      request
    );

    if (res.status === 401) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "Cart konnte nicht geladen werden" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("Cart fetch error:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const res = await backendFetch(
      "cart",
      "/api/v1/cart",
      {
        method: "DELETE"
      },
      request
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "Cart konnte nicht geleert werden" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Cart clear error:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}