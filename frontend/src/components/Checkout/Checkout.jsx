"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  // Check if user is guest on mount - but don't pre-fill email for guests
  useEffect(() => {
    const guestEmail = localStorage.getItem('guestEmail');
    const isGuestUser = localStorage.getItem('isGuest') === 'true';
    
    // Only pre-fill if there's a stored email AND it's a guest
    // But still make it editable
    if (guestEmail && isGuestUser) {
      setEmail(guestEmail);
      setIsGuest(true);
    } else if (user?.email) {
      setEmail(user.email);
      setIsGuest(false);
    }
  }, [user]);

  // Safely get cart items
  const cartItems = cart?.items || [];
  
  // Calculate total
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.product_price || 0;
    const quantity = item.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Submit started with:", { email, address, cartItems });
      
      const guestId = localStorage.getItem('guestId');
      
      // Prepare order data matching the schema exactly
      const orderData = {
        totalAmount: totalAmount,
        cartId: user?.customer_id || guestId ? parseInt(user?.customer_id || guestId) : null,
        gender: user?.gender || 'other',
        username: user?.email || email,  // Use the email from form
        name: user?.name || 'Guest',
        orderDate: new Date().toISOString(),
        items: cartItems.map(item => ({
          product_Id: item.product_id,
          productName: item.product_name,
          price: item.product_price,
          quantity: item.quantity
        }))
      };

      console.log("Sending order:", JSON.stringify(orderData, null, 2));

      // Call your order service
      const response = await fetch("http://localhost:8003/orders/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      console.log("Response:", responseData);

      if (!response.ok) {
        if (response.status === 422) {
          console.error("Validation error:", responseData);
          throw new Error(`Validation error: ${JSON.stringify(responseData.detail || responseData)}`);
        }
        throw new Error(responseData.detail || "Bestellung fehlgeschlagen");
      }

      // Success - store the email they actually used
      if (!user) {
        localStorage.setItem('paymentEmail', email);
        // Also update the stored guest email to what they entered
        localStorage.setItem('guestEmail', email);
      }
      
      clearCart();
      router.push(`/payment?order_id=${responseData.orderId}&total=${totalAmount}`);
      
    } catch (err) {
      console.error("Order error:", err);
      setError(err.message || "Fehler bei Bestellung");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Dein Warenkorb ist leer</h2>
          <button 
            onClick={() => router.push("/products")} 
            className="text-blue-600 hover:underline"
          >
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
          
          {/* Guest info banner */}
          {isGuest && (
            <div className="p-4 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl text-sm border border-blue-100 dark:border-blue-800">
              Sie checken als Gast aus. Bitte geben Sie Ihre E-Mail-Adresse ein.
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Order Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 dark:text-white">Ihre Bestellung</h2>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <span className="dark:text-gray-300">
                    {item.product_name} x {item.quantity}
                  </span>
                  <span className="dark:text-white font-medium">
                    €{(item.product_price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between font-bold">
                  <span className="dark:text-white">Zwischensumme</span>
                  <span className="dark:text-white">€{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-gray-300">
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ihre@email.de"
              // Removed readOnly and disabled - now fully editable for everyone
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Wir senden die Bestellbestätigung an diese Adresse
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-gray-300">Lieferadresse *</label>
            <textarea
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Straße, Hausnummer, PLZ, Stadt"
            />
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-bold dark:text-white">Gesamtbetrag</span>
              <span className="text-2xl font-black text-blue-600">{totalAmount.toFixed(2)} €</span>
            </div>
            
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Wird verarbeitet..." : "Kostenpflichtig bestellen"}
            </button>

            {/* Guest checkout info */}
            {isGuest && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                Mit dem Absenden der Bestellung bestätigen Sie, dass Sie unsere AGB gelesen und akzeptiert haben.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}