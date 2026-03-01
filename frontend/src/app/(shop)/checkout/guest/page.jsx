"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function GuestCheckoutPage() {
  const { cart, clearCart, getCartCount, getCartTotal } = useCart();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Deutschland'
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      // Get guest ID from localStorage
      const guestId = localStorage.getItem('guestId');
      
      if (!guestId) {
        throw new Error('Keine Gast-ID gefunden');
      }

      // 1. Create order
      const orderResponse = await fetch('http://localhost:8003/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          guestId,
          items: cart.items,
          total_amount: cart.total_amount,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          status: 'pending'
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Fehler beim Erstellen der Bestellung');
      }

      const orderData = await orderResponse.json();

      // 2. Initiate payment
      const paymentResponse = await fetch('http://localhost:8002/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          guestId,
          orderId: orderData.id || orderData.order_id,
          amount: cart.total_amount,
          paymentMethod,
          returnUrl: `${window.location.origin}/payment-success`,
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Fehler bei der Zahlungsinitialisierung');
      }

      const paymentData = await paymentResponse.json();

      // 3. Clear cart and redirect
      clearCart();
      
      // Redirect to payment URL or success page
      if (paymentData.payment_url) {
        window.location.href = paymentData.payment_url;
      } else {
        router.push(`/payment-success?orderId=${orderData.id || orderData.order_id}`);
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Ihr Warenkorb ist leer</h1>
        <button
          onClick={() => router.push('/products')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Weiter einkaufen
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Gast-Checkout</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                E-Mail-Adresse *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ihre@email.de"
              />
              <p className="text-sm text-gray-600 mt-1">
                Wir senden die Bestellbestätigung an diese Adresse
              </p>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Lieferadresse</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Vollständiger Name *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Straße und Hausnummer *
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stadt *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Land
                </label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Zahlungsmethode</h2>
              <div className="space-y-2">
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Kreditkarte</span>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>PayPal</span>
                </label>
                <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    value="invoice"
                    checked={paymentMethod === 'invoice'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Rechnung</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Wird bearbeitet...' : 'Bestellung abschließen'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Ihre Bestellung</h2>
            
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.product_id} className="flex justify-between">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">x {item.quantity}</span>
                  </div>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Gesamtsumme</span>
                <span>€{cart.total_amount?.toFixed(2) || '0.00'}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                inkl. MwSt. zzgl. Versandkosten
              </p>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p className="mb-2">✓ Keine Registrierung nötig</p>
              <p className="mb-2">✓ Sichere Zahlung</p>
              <p>✓ Bestellbestätigung per E-Mail</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}