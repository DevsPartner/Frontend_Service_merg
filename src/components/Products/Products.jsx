"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null); 
 
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Laden");
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = async (product) => {
    setAddingToCart(product.id);
    
    try {
      // Simulate a small delay for better UX feel or handle async cart logic
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image_link,
        description: product.description,
        quantity: 1
      });
      // Optional: Replace alert with a toast notification library like react-hot-toast
      console.log(`${product.name} added to cart`);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAddingToCart(null);
    }
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-72 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Fehler aufgetreten</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">Erneut versuchen</button>
        </div>
      </div>
    );
  }

  // --- PRODUCT GRID ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image Container */}
<div className="relative h-72 bg-gray-100 dark:bg-gray-700 overflow-hidden">
  <img 
    src={product.image_link}
    alt={product.name} 
    // Optimization: Add 'loading="lazy"' for performance
    loading="lazy"
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
    onError={(e) => {
      // Prevents infinite loop if placeholder also fails
      e.currentTarget.onerror = null; 
      e.currentTarget.src = "https://placehold.co/800x800/1e293b/white?text=Tech+Image";
    }} 
  />
  {/* Darker overlay on hover for better text contrast */}
  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-300" />
</div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed h-10">
                  {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Preis</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Number(product.price).toFixed(2)}€
                    </span>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 disabled:cursor-not-allowed"
                  >
                    {addingToCart === product.id ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Lädt...
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Hinzufügen
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}