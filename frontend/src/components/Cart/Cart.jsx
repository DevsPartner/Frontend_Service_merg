"use client";

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    // Directly go to checkout page - no email asked here
    router.push('/checkout');
  };

  // Safely check if cart exists and has items
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Dein Warenkorb ist leer</h2>
          <button 
            onClick={() => router.push('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-2xl shadow-xl transition-all active:scale-95"
          >
            Produkte durchstöbern
          </button>
        </div>
      </div>
    );
  }

  // Helper function to safely get price as number
  const getItemPrice = (item) => {
    const price = item.product_price || item.price || 0;
    return typeof price === 'string' ? parseFloat(price) : price;
  };

  // Helper function to safely get item name
  const getItemName = (item) => {
    return item.product_name || item.name || 'Produkt';
  };

  // Helper function to safely get item ID
  const getItemId = (item) => {
    return item.product_id || item.id;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-black mb-8 dark:text-white">Warenkorb</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items - Left Column */}
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const itemId = getItemId(item);
              const itemName = getItemName(item);
              const itemPrice = getItemPrice(item);
              const itemQuantity = item.quantity || 1;
              
              return (
                <div key={itemId} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg dark:text-white">{itemName}</h3>
                      <p className="text-blue-600 font-bold mt-1">€{itemPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() => updateQuantity(itemId, Math.max(1, itemQuantity - 1))}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border-x dark:text-white">{itemQuantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, itemQuantity + 1)}
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(itemId)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Entfernen
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary - Right Column */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Bestellübersicht</h2>
            
            <div className="space-y-2 mb-4">
              {cart.items.map((item) => {
                const itemId = getItemId(item);
                const itemName = getItemName(item);
                const itemPrice = getItemPrice(item);
                const itemQuantity = item.quantity || 1;
                
                return (
                  <div key={itemId} className="flex justify-between text-sm">
                    <span className="dark:text-gray-300">
                      {itemName} x {itemQuantity}
                    </span>
                    <span className="dark:text-white font-medium">
                      €{(itemPrice * itemQuantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span className="dark:text-white">Gesamt</span>
                <span className="text-blue-600">€{getCartTotal().toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                inkl. MwSt., zzgl. Versand
              </p>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl transition-all active:scale-95"
            >
              Zur Kasse
            </button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              Sie werden im nächsten Schritt nach Ihrer E-Mail-Adresse gefragt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}