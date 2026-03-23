// src/app/api/forecast/train/route.js
import { NextResponse } from 'next/server';

const FORECASTING_SERVICE_URL = process.env.FORECASTING_SERVICE_URL || 'http://localhost:8008';

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch(`${FORECASTING_SERVICE_URL}/train`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}