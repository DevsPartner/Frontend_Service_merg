"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentForm({ orderId, totalAmount, customerName, email }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState("");
  const router = useRouter();

  const testConnection = async () => {
    try {
      const res = await fetch("http://localhost:8002/health");
      const data = await res.json();
      setDebug(`Health check: ${JSON.stringify(data)}`);
      return res.ok;
    } catch (err) {
      setDebug(`Health check failed: ${err.message}`);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDebug("");
    
    try {
      console.log("🔄 Starting payment process...");
      setDebug("Step 1: Testing connection...");
      
      // First test connection
      const isHealthy = await testConnection();
      if (!isHealthy) {
        throw new Error("Payment service is not responding. Check if it's running.");
      }
      
      setDebug("Step 2: Preparing payment data...");
      
      // Prepare payment data - use 0.01 if amount is 0
      const paymentAmount = parseFloat(totalAmount) === 0 ? 0.01 : parseFloat(totalAmount);
      
      const paymentData = {
        customer_id: `customer_${orderId}`,
        cart_id: `cart_${orderId}`,
        order_id: `order_${orderId}`,
        name: customerName || "Test Customer",
        amount: paymentAmount,
        email: email || "test@example.com",
        payment_method: paymentMethod,
        currency: "EUR",
        discount_rate: 0
      };
      
      console.log("📤 Sending payment:", paymentData);
      setDebug(`Step 3: Sending to payment service: ${JSON.stringify(paymentData, null, 2)}`);
      
      const res = await fetch("http://localhost:8002/payments/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(paymentData),
        mode: "cors" // Explicitly request CORS
      });
      
      console.log("📥 Response status:", res.status);
      setDebug(`Step 4: Response status: ${res.status} ${res.statusText}`);
      
      let responseData;
      try {
        responseData = await res.json();
        console.log("Response data:", responseData);
      } catch (jsonError) {
        const text = await res.text();
        responseData = { raw: text };
      }
      
      if (!res.ok) {
        throw new Error(`Payment failed (${res.status}): ${JSON.stringify(responseData)}`);
      }
      
      setDebug("Step 5: Payment successful! Redirecting...");
      console.log("✅ Payment created:", responseData);
      
      // Redirect to success page
      setTimeout(() => {
        router.push(`/payment-success?payment_id=${responseData.payment_id}&amount=${totalAmount}`);
      }, 1000);
      
    } catch (err) {
      console.error("❌ Payment error:", err);
      setError(err.message);
      setDebug(`ERROR: ${err.message}`);
      
      // Show detailed error
      alert(`Payment failed:\n\n${err.message}\n\nCheck:\n1. Payment service running?\n2. CORS configured?\n3. Database connected?`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Complete Payment</h2>
      
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Order:</span> {orderId}<br/>
          <span className="font-semibold">Amount:</span> 
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 ml-2">
            €{totalAmount || "0.00"}
          </span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Test payment - no real money charged
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-red-700 dark:text-red-300">Error</span>
          </div>
          <p className="text-red-600 dark:text-red-400 mt-1 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["card", "paypal", "bank_transfer"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`p-3 rounded-lg border text-center transition ${
                  paymentMethod === method
                    ? "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-300"
                    : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                }`}
              >
                {method === "card" && "💳"}
                {method === "paypal" && "💰"}
                {method === "bank_transfer" && "🏦"}
                <div className="text-xs mt-1 capitalize">{method.replace("_", " ")}</div>
              </button>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing Payment...
            </div>
          ) : (
            `Pay €${totalAmount || "0.00"}`
          )}
        </button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={testConnection}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Test Payment Service Connection
          </button>
        </div>
      </form>
      
      {debug && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-xs font-mono text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {debug}
          </p>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <strong>Note:</strong> This is a test environment. 
          Payments are recorded in the database but no real transaction occurs.
        </p>
      </div>
    </div>
  );
}