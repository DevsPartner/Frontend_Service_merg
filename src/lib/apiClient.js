// lib/api-client.js
// WARUM: Zentrale Stelle für alle Backend-Aufrufe
// - Verhindert Code-Duplikation
// - Einheitliches Error Handling
// - Einfache Konfigurationsänderungen

const BASE_URLS = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:8004",
  products: process.env.PRODUCT_SERVICE_URL || "http://localhost:8000",
  cart: process.env.CART_SERVICE_URL || "http://localhost:8001",
  orders: process.env.ORDER_SERVICE_URL || "http://localhost:8003",
};

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

  // WICHTIG: JWT Cookie vom Client an Backend weiterleiten
  if (request) {
    const cookieName = process.env.JWT_COOKIE_NAME || "auth_token";
    const token = request.cookies.get(cookieName)?.value;
    if (token) {
      headers["Cookie"] = `${cookieName}=${token}`;
    }
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