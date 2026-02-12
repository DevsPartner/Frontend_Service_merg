// src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // 1. Allow public paths even without a token
  const publicPaths = ['/', '/products', '/login', '/register'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. Redirect to login for protected dashboard routes
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}