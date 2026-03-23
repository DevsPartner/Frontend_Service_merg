"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Navbar/AuthContext";
import { cartApi } from "@/lib/cartApi";

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }
    fetchCart();
  }, [user]);

  async function fetchCart() {
    try {
      const data = await cartApi.getCart(user.customer_id);
      if (!data || !data.items || data.items.length === 0) {
        router.push("/cart");
        return;
      }
      setCart(data);
    } catch (err) {
      setError("Fehler beim Laden des Warenkorbs");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const orderData = {
        user_id: user.customer_id,
        cartId: cart.id,
        totalAmount: cart.total_amount,
        orderDate: new Date().toISOString(),
        items: cart.items.map((item) => ({
          product_Id: item.product_id,
          productName: item.product_name,
          price: item.product_price,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.detail || responseData.error || "Bestellung fehlgeschlagen");
      }

      router.push(`/payment?order_id=${responseData.orderId}&total=${cart.total_amount}`);
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Fehler bei Bestellung");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">Lade Warenkorb...</p>
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Checkout</h1>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Bestellübersicht</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.product_id} className="flex justify-between items-center text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {(item.product_price * item.quantity).toFixed(2)} €
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-900 dark:text-white">Gesamt</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {parseFloat(cart.total_amount).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bestellung für: <span className="text-blue-500">{user?.name}</span>
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg font-semibold transition bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Wird verarbeitet..." : "Bestellung absenden"}
          </button>
        </form>
      </div>
    </div>
  );
}