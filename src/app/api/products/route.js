// src/app/api/products/route.js
import { NextResponse } from 'next/server';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8000';

export async function GET(request) {
  try {
    console.log('Fetching products from:', `${PRODUCT_SERVICE_URL}/products`);

    const response = await fetch(`${PRODUCT_SERVICE_URL}/products`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const altResponse = await fetch(`${PRODUCT_SERVICE_URL}/`, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!altResponse.ok) {
        const errorText = await response.text();
        console.error('Product service error:', response.status, errorText);
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await altResponse.json();
      return Response.json(data);
    }

    const data = await response.json();
    console.log('Products fetched:', data.length);
    return Response.json(data);

  } catch (error) {
    console.error('Error fetching products:', error.message);

    // Fallback data if service is down
    return Response.json([
      {
        id: 101,
        name: "Wireless Earbuds Pro",
        description: "Noise cancelling wireless earbuds",
        price: 199.99,
        imageLink: "https://placehold.co/800x800/e5e7eb/6b7280?text=Earbuds"
      },
      {
        id: 102,
        name: "Smart Watch X",
        description: "Advanced smartwatch with health tracking",
        price: 349.99,
        imageLink: "https://placehold.co/800x800/e5e7eb/6b7280?text=Smart+Watch"
      },
      {
        id: 103,
        name: "Phone Case Ultra",
        description: "Shockproof phone case",
        price: 39.99,
        imageLink: "https://placehold.co/800x800/e5e7eb/6b7280?text=Phone+Case"
      }
    ], { status: 200 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, price } = body;
    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${PRODUCT_SERVICE_URL}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Failed to create product' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}