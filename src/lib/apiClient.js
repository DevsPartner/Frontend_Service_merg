// lib/api-client.js
// Zentrale Stelle für alle Backend-Aufrufe mit JWT und User-ID Handling

const BASE_URLS = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:8000",
  products: process.env.PRODUCT_SERVICE_URL || "http://localhost:8001",
  cart: process.env.CART_SERVICE_URL || "http://localhost:8009",
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:8003",
};

/**
 * Decode JWT to extract user_id (simple implementation)
 * For production, use a proper JWT library
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
 * Generische Fetch-Funktion für Backend-Services
 * @param {string} service - Service-Name (auth, products, cart, orders)
 * @param {string} path - API-Pfad
 * @param {RequestInit} options - Fetch-Optionen
 * @param {Request} [request] - Next.js Request für Cookie-Weiterleitung
 */
export async function backendFetch(service, path, options = {}, request = null) {
  const url = `${BASE_URLS[service]}${path}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // JWT Cookie vom Client an Backend weiterleiten
  let userId = null;
  if (request) {
    const cookieName = process.env.JWT_COOKIE_NAME || "auth_token";
    const token = request.cookies.get(cookieName)?.value;
    
    if (token) {
      headers["Cookie"] = `${cookieName}=${token}`;
      
      // Für Cart-Service: User-ID aus JWT extrahieren
      if (service === "cart") {
        const payload = decodeJWT(token);
        userId = payload?.user_id || payload?.sub || payload?.id;
      }
    }
  }

  // WICHTIG: Cart-Service braucht X-User-Id Header
  if (service === "cart" && userId) {
    headers["X-User-Id"] = String(userId);
  }

  // FALLBACK für Testing: Wenn keine User-ID gefunden, temporär hardcoden
  // ENTFERNEN in Production!
  if (service === "cart" && !userId) {
    console.warn("⚠️ No user_id found, using fallback. Remove in production!");
    headers["X-User-Id"] = "1"; // Temporär für Tests
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
 * Client-side fetch (für use client Komponenten)
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
      credentials: "include", // Wichtig für Cookies
    });
    
    return res;
  } catch (err) {
    console.error(`Client fetch failed (${service}):`, err);
    throw err;
  }
}