"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState(user?.email || "");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalAmount = cart?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user?.id,
          items: cart,
          total_amount: totalAmount,
          shipping_address: address,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Bestellung fehlgeschlagen");
      }

      // Clear local cart and redirect to payment
      clearCart();
      router.push(`/payment?order_id=${responseData.orderId}&total=${totalAmount}`);
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Fehler bei Bestellung");
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Dein Warenkorb ist leer</h2>
          <button onClick={() => router.push("/products")} className="text-blue-600 hover:underline">
            Zurück zu den Produkten
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-8 dark:text-white">Checkout</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Lieferadresse</label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold dark:text-white">Gesamtbetrag</span>
              <span className="text-2xl font-black text-blue-600">{totalAmount.toFixed(2)} €</span>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Wird verarbeitet..." : "Kostenpflichtig bestellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}