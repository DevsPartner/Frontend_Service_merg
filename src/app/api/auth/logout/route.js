// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/apiClient";

export async function POST(request) {
  try {
    // Backend-Logout aufrufen
    const res = await backendFetch(
      "auth",
      "/auth/logout",
      {
        method: "POST"
      },
      request
    );

    const response = NextResponse.json({ success: true });

    // Cookie löschen (falls Backend es nicht tut)
    if (res.headers.get("set-cookie")) {
      response.headers.set("set-cookie", res.headers.get("set-cookie"));
    } else {
      // Fallback: Cookie manuell löschen
      response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
    }

    return response;

  } catch (err) {
    console.error("Logout error:", err);
    
    // Auch bei Fehler Cookie löschen
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      maxAge: 0,
      path: '/'
    });
    
    return response;
  }
}