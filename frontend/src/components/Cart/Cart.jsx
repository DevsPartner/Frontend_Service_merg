"use client";
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

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
          </Link>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    </div>
  );
}