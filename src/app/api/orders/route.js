// src/app/api/orders/route.js
import { NextResponse } from 'next/server';

const ORDER_SERVICE_URL = (process.env.ORDER_SERVICE_URL || 'http://localhost:8003/api').replace('/api', '');

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(`${ORDER_SERVICE_URL}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { detail: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to create order' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/orders/`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { detail: text };
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to fetch orders' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}