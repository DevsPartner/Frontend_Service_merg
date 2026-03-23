// src/app/payment/page.jsx
"use client";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/Navbar/AuthContext";
import PaymentForm from "@/components/Payment/PaymentForm";

export default function PaymentPage() {
  const params = useSearchParams();
  const { user } = useAuth();
  const orderId = params.get("order_id");
  const totalAmount = params.get("total");

  if (!orderId) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">No order found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-lg mx-auto px-4">
        <PaymentForm
          orderId={orderId}
          totalAmount={totalAmount}
        />
      </div>
    </div>
  );
}