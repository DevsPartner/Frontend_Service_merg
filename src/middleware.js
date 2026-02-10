// middleware.js (im Root-Verzeichnis)
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token');
  const { pathname } = request.nextUrl;

  // Geschützte Routen
  const protectedRoutes = ['/cart', '/checkout', '/profile', '/orders'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Wenn geschützte Route ohne Token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Wenn auf Login/Register mit Token
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/profile/:path*',
    '/orders/:path*',
    '/login',
    '/register'
  ]
};