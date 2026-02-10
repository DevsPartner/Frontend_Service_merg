"use client";
<<<<<<< HEAD

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function CartPage() {
  const { cart, loading, error, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();

  // Calculate Total Safely
  const total =
    cart?.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0) || 0;

  // --- 1. LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex gap-6 animate-pulse border border-gray-100 dark:border-gray-800"
              >
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
=======
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/Navbar/AuthContext";
import { cartApi } from "@/lib/cartApi";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      router.push("/login?redirect=/cart");
    }
  }, [user, router]);

  async function fetchCart() {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await cartApi.getCart(user.id);
      setCart(data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError(err.message || "Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await cartApi.updateQuantity(user.id, productId, newQuantity);
      await fetchCart();
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartApi.removeItem(user.id, productId);
      await fetchCart();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md animate-pulse p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
>>>>>>> 0c7699ac5d95bfd72131d9d871243d5964dd418c
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // --- 1.5 ERROR STATE (optional aber sinnvoll) ---
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            Fehler
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95"
          >
            Erneut versuchen
          </button>
=======
  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fehler</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button 
              onClick={fetchCart}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
            >
              Erneut versuchen
            </button>
          </div>
>>>>>>> 0c7699ac5d95bfd72131d9d871243d5964dd418c
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // --- 2. EMPTY STATE ---
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">
            Dein Warenkorb ist leer
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium">
            Es sieht so aus, als hättest du noch keine Produkte hinzugefügt.
          </p>
          <Link
            href="/products"
            className="inline-block w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all active:scale-95"
          >
            Jetzt shoppen
=======
  // Empty State
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Dein Warenkorb ist leer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Füge Produkte hinzu, um fortzufahren.
          </p>
          <Link 
            href="/products"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            Zu den Produkten
>>>>>>> 0c7699ac5d95bfd72131d9d871243d5964dd418c
          </Link>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  // ✅ Checkout-Link abhängig von Login
  const checkoutHref = user ? "/checkout" : "/login?redirect=/checkout";

  // --- 3. MAIN CART UI ---
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">
          Warenkorb
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold uppercase text-xs tracking-widest">
          {cart.length} Artikel in deiner Auswahl
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* CART ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="group bg-white dark:bg-gray-900 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row gap-6 border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 transition-all shadow-sm"
              >
                {/* Product Image */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                  <img
                    src={item.image || item.imageLink || item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/400x400/1e293b/white?text=Tech")
                    }
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1 font-medium">
                        {item.description || "Premium Technology"}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                    {/* Modern Quantity Selector */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 font-black text-lg transition-colors"
                      >
                        –
                      </button>
                      <span className="w-10 text-center font-black text-gray-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 font-black text-lg transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                        Gesamtpreis
                      </p>
                      <p className="text-lg font-black text-gray-900 dark:text-white">
                        {((item.price || 0) * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-28">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Bestellübersicht
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wide">
                  <span>Zwischensumme</span>
                  <span className="text-gray-900 dark:text-white">
                    {total.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wide">
                  <span>Versand</span>
                  <span className="text-green-500">Kostenlos</span>
                </div>
                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-end">
                  <span className="text-gray-900 dark:text-white font-black text-lg">
                    Summe
                  </span>
                  <span className="text-3xl font-black text-blue-600">
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>

              <Link
                href={checkoutHref}
                className="block w-full py-5 bg-blue-600 hover:bg-blue-700 text-white text-center font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all transform active:scale-[0.98]"
              >
                Zur Kasse gehen
              </Link>

              {!user && (
                <p className="mt-3 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                  Zum Checkout musst du dich einloggen
                </p>
              )}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-bold uppercase tracking-widest text-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                SSL Verschlüsselt & Sicher
              </div>
            </div>
          </div>
=======
  // Cart mit Artikeln
  const total = cart.total_amount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dein Warenkorb
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {cart.items.length} {cart.items.length === 1 ? 'Artikel' : 'Artikel'}
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.items.map(item => (
            <div 
              key={item.product_id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow"
            >
              <img 
                src={item.image_link}
                alt={item.product_name}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/200x200/e5e7eb/6b7280?text=Produkt";
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {item.product_name}
                </h2>
                <p className="text-gray-900 dark:text-white font-semibold mb-2">
                  {item.product_price.toFixed(2)} €
                </p>
                
                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                    className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                    className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    +
                  </button>
                  
                  <button
                    onClick={() => handleRemoveItem(item.product_id)}
                    className="ml-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    Entfernen
                  </button>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  Zwischensumme: {(item.product_price * item.quantity).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total & Checkout */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              Gesamtsumme
            </span>
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {total.toFixed(2)} €
            </span>
          </div>
          <Link
            href="/checkout"
            className="block w-full py-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Zur Kasse
          </Link>
>>>>>>> 0c7699ac5d95bfd72131d9d871243d5964dd418c
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 0c7699ac5d95bfd72131d9d871243d5964dd418c
