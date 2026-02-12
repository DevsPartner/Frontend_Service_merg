// Zentrale Stelle für alle Backend-Aufrufe (Merged & AI-Ready)

const BASE_URLS = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:8000",
  products: process.env.PRODUCT_SERVICE_URL || "http://localhost:8001",
  cart: process.env.CART_SERVICE_URL || "http://localhost:8009",
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:8003",
  // Added from 0c76 version for Step 5
  forecast: process.env.FORECAST_SERVICE_URL || "http://localhost:8008", 
};

/**
 * Decode JWT to extract user_id 
 * Needed for services like 'Cart' that require X-User-Id header
 */
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('JWT decode error:', err);
    return null;
  }
}

/**
 * Server-side fetch (for Middleware or Server Components)
 */
export async function backendFetch(service, path, options = {}, request = null) {
  const url = `${BASE_URLS[service]}${path}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  let userId = null;

  // Forward JWT Cookie from Client to Backend
  if (request) {
    const cookieName = process.env.JWT_COOKIE_NAME || "auth_token";
    const token = request.cookies.get(cookieName)?.value;
    
    if (token) {
      headers["Cookie"] = `${cookieName}=${token}`;
      
      // Extract User-ID for services that need it
      const payload = decodeJWT(token);
      userId = payload?.user_id || payload?.sub || payload?.id;
    }
  }

  // Set X-User-Id header if needed (Cart and Order services usually require this)
  if (userId) {
    headers["X-User-Id"] = String(userId);
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });
    return res;
  } catch (err) {
    console.error(`Backend fetch failed (${service}):`, err);
    throw err;
  }
}

/**
 * Client-side fetch (for 'use client' components)
 */
export async function clientFetch(service, path, options = {}) {
  const url = `${BASE_URLS[service]}${path}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include", // Required for passing cookies to microservices
    });
    
    return res;
  } catch (err) {
    console.error(`Client fetch failed (${service}):`, err);
    throw err;
  }
}