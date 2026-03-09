// src/app/payment/page.jsx
"use client";
import { useSearchParams } from "next/navigation";
import PaymentForm from "@/components/Payment/PaymentForm";

export default function PaymentPage() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const totalAmount = params.get("total");
  
  if (!orderId) return <div>No order found</div>;
  
  return (
    <div>
      <h1>Complete Payment</h1>
      <p>Order: {orderId} | Amount: €{totalAmount}</p>
      <PaymentForm 
        orderId={orderId}
        totalAmount={parseFloat(totalAmount)}
        customerName="Customer" // Get from user context
        email="customer@example.com" // Get from user context
      />
    </div>
  );
}