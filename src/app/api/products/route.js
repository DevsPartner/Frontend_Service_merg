// app/api/products/route.js
// WARUM: Client ruft /api/products statt direktes Backend
// - Versteckt Backend-URLs
// - Ermöglicht Caching
// - Zentrale Error-Behandlung

import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/apiClient";

export async function GET(request) {
  try {
    const res = await backendFetch("products", "/products");

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "Produkte konnten nicht geladen werden" },
        { status: res.status }
      );
    }

    const products = await res.json();
    return NextResponse.json(products);

  } catch (err) {
    console.error("Products fetch error:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

// Optional: Caching für bessere Performance
export const revalidate = 60; // ISR - alle 60 Sekunden revalidieren