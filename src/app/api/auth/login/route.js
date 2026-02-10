import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/apiClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-Mail und Passwort sind erforderlich" },
        { status: 400 }
      );
    }

    // Backend-Aufruf
    const res = await backendFetch(
      "auth",
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.detail || "Login fehlgeschlagen" },
        { status: res.status }
      );
    }

    // JWT Cookie vom Backend übernehmen
    const backendSetCookie = res.headers.get("set-cookie");
    const backendData = await res.json();

    const response = NextResponse.json({
      success: true,
      user: backendData.user || null,
    });

    // Set-Cookie Header weiterleiten
    if (backendSetCookie) {
      response.headers.set("set-cookie", backendSetCookie);
    }

    return response;

  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}