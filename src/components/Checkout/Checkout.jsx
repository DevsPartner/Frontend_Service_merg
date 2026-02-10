"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState(""); // Add missing email state
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state for better UX
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("http://localhost:8003/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          address, 
          email 
          // Add cart data here if needed
        }),
      });
      
      if (!res.ok) throw new Error("Bestellung fehlgeschlagen");
      
      // Clear form and redirect on success
      setName("");
      setAddress("");
      setEmail("");
      router.push("/order-success");
    } catch (err) {
      setError(err.message || "Fehler bei Bestellung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Name" 
              required
              className="w-full border rounded-lg p-3 bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            <input 
              type="text" 
              placeholder="Adresse" 
              required
              className="w-full border rounded-lg p-3 bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={address} 
              onChange={e => setAddress(e.target.value)} 
            />
            <input 
              type="email" 
              placeholder="E-Mail" 
              required
              className="w-full border rounded-lg p-3 bg-transparent text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Wird verarbeitet...
              </span>
            ) : (
              "Bestellung absenden"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}