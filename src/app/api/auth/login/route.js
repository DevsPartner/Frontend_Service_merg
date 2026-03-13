// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';

console.log('LOGIN ROUTE LOADED');

const LOGIN_SERVICE_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:8004/api/auth';

export async function POST(request) {
  console.log('LOGIN POST HIT');
  console.log('LOGIN_SERVICE_URL:', LOGIN_SERVICE_URL);
  
  try {
    const body = await request.json();
    const { email, password } = body;
    console.log('Attempting login for:', email);

    const response = await fetch(`${LOGIN_SERVICE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Login service response status:', response.status);

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { detail: text };
    }

    console.log('Login service response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Login failed' },
        { status: response.status }
      );
    }

    const res = NextResponse.json({
      success: true,
      user: data.user,
      token: data.access_token,
    });

    res.cookies.set('auth_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log('Cookie set, returning success');
    return res;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}