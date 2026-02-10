// src/app/payment-success/page.jsx
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentId = params.get("payment_id");
  const amount = params.get("amount") || "0.00";

  useEffect(() => {
    if (paymentId) {
      // Fetch payment details
      fetch(`http://localhost:8002/payments/${paymentId}`)
        .then(res => res.json())
        .then(data => {
          setPayment(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching payment:", err);
          setLoading(false);
        });
    }
  }, [paymentId]);

  if (loading) return <div>Loading payment confirmation...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Payment Successful! 🎉
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Test payment completed successfully. No real money was charged.
        </p>
        
        {/* Payment Details */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 text-left">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Payment ID</p>
              <p className="font-mono text-sm">{paymentId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                €{amount}
              </p>
            </div>
            {payment && (
              <>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {payment.payment_status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Method</p>
                  <p className="font-semibold">{payment.payment_method}</p>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Success Message */}
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
          <p className="text-green-700 dark:text-green-300">
            ✅ Payment recorded in database. Order is now complete!
          </p>
        </div>
        
        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={() => router.push("/products")}
            className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            View Products
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
          This was a test payment. No real transaction occurred.
        </p>
      </div>
    </div>
  );
}