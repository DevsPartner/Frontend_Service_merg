// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';

const LOGIN_SERVICE_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:8004';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const response = await fetch(`${LOGIN_SERVICE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { detail: text };
    }

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

    return res;

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}