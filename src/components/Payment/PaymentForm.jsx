"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Navbar/AuthContext";


export default function PaymentForm({ orderId, totalAmount }) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      const paymentAmount = parseFloat(totalAmount) === 0 ? 0.01 : parseFloat(totalAmount);
      const userEmail = user?.email || "customer@example.com";


      const paymentData = {
        customer_id: String(user?.customer_id || orderId),
        cart_id: String(orderId),
        order_id: String(orderId),
        email: userEmail,
        amount: paymentAmount,
        payment_method: paymentMethod,
        currency: "EUR",
        discount_rate: 0,
      };


      // 1. Process the payment
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });


      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { detail: text };
      }


      if (!res.ok) {
        throw new Error(data.error || data.detail || "Payment failed");
      }


      // 2. Send the confirmation email
      try {
        const userName = user?.name || user?.firstName || "Valued Customer";
        
        await fetch("http://localhost:8020/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: [userEmail],
            subject: `Order Confirmation: ${orderId}`,
            body: `Hello {{user_name}}, your order {{order_id}} has been successfully processed for €${paymentAmount.toFixed(2)}!`,
            user_name: userName,
            order_id: String(orderId),
            is_html: false
          })
        });
        console.log("Confirmation email triggered successfully.");
      } catch (emailErr) {
        console.error("Failed to send confirmation email. Proceeding to success page anyway.", emailErr);
        // We do not throw an error here because the payment was successful.
      }


      // 3. Redirect to success page
      router.push(`/payment-success?payment_id=${data.payment_id}&amount=${totalAmount}`);
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Complete Payment</h2>


      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-gray-700 dark:text-gray-300">
          <span className="font-semibold">Order:</span> {orderId}<br />
          <span className="font-semibold">Amount:</span>
          <span className="text-2xl font-bold text-green-600 dark:text-green-400 ml-2">
            €{parseFloat(totalAmount || 0).toFixed(2)}
          </span>
        </p>
      </div>


      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
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
          {loading ? "Processing Payment..." : `Pay €${parseFloat(totalAmount || 0).toFixed(2)}`}
        </button>
      </form>


      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Test environment — no real transaction occurs.
        </p>
      </div>
    </div>
  );
}