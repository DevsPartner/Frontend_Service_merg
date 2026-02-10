// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';

const LOGIN_SERVICE_URL = process.env.LOGIN_SERVICE_URL || 'http://localhost:8004';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, birthday, address } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Call your login service
    const response = await fetch(`${LOGIN_SERVICE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        name,
        birthday,
        address,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Registration failed' },
        { status: response.status }
      );
    }

    // Success
    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user: data.user,
    });
  } catch (error) {
    console.error('Register API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}