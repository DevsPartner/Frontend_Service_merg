// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  // Middleware disabled - no protection
  return NextResponse.next();
}

export const config = {
  matcher: [], // Empty matcher = middleware won't run
};