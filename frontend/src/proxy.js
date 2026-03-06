import { NextResponse } from 'next/server';

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Debug - log all cookies
  console.log('PROXY - pathname:', pathname);
  console.log('PROXY - all cookies:', request.cookies.getAll());
  console.log('PROXY - auth_token:', request.cookies.get('auth_token'));

  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const publicPaths = ['/', '/products', '/login', '/register'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};