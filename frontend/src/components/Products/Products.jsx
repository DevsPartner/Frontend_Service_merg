"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Navbar/AuthContext";
import { cartApi } from "@/lib/cartApi";
import Recommendations from "@/components/Recommendations/Recommendations";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [trainingModel, setTrainingModel] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();

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

  async function handleAddToCart(product) {
    // Check if user is logged in
    if (!user) {
      alert('Bitte melde dich zuerst an!');
      router.push('/login?redirect=/products');
      return;
    }

    setAddingToCart(product.id);
    
    try {
      await cartApi.addToCart(user.id, user.name, {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        image_link: product.imageLink || 'https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image',
        quantity: 1,
      });

      alert("Produkt wurde zum Warenkorb hinzugefügt!");
      
    } catch (err) {
      console.error('Add to cart error:', err);
      alert('Fehler: ' + err.message);
    } finally {
      setAddingToCart(null);
    }
  }

  async function handleTrainModel() {
    if (!user || !user.isAdmin) {
      alert("Only admins can trigger model training");
      return;
    }

    setTrainingModel(true);
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('✅ Model training started! ' + (data.message || ''));
        // Refresh recommendations after a delay
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start training');
      }
    } catch (err) {
      console.error('Training error:', err);
      alert('❌ Error: ' + err.message);
    } finally {
      setTrainingModel(false);
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 animate-pulse">
              Loading Products...
            </h1>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-72 bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                  <div className="flex justify-between items-center pt-4">
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

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <>
        <Recommendations />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Keine Produkte gefunden</h2>
            <p className="text-gray-600 dark:text-gray-400">Schau später wieder vorbei!</p>
          </div>
        </div>
      </>
    );
  }

  // Products Grid
  return (
    <>
      {/* Add Recommendations section at the top */}
      <Recommendations />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                All Products
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Browse our complete collection
              </p>
            </div>
            
            {/* Admin Controls */}
            {user?.isAdmin && (
              <div className="flex gap-3">
                <button
                  onClick={handleTrainModel}
                  disabled={trainingModel}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {trainingModel ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Training...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Train AI Model
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => window.open('http://localhost:8006/docs', '_blank')}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  API Docs
                </button>
                
                <button
                  onClick={() => window.open(`http://localhost:8006/simulate/${user.id}`, '_blank')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
              </div>
            )}
          </div>
          
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article
                key={product.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                  <img 
                    src={product.imageLink}
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image";
                    }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* MLOps Badge - Show if product is in recommendations */}
                  {user && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                        AI Recommended
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed h-10">
                    {product.description}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>In Stock</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Fast Delivery</span>
                    </div>
                  </div>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preis</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {product.price}€
                      </span>
                    </div>

                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart === product.id}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingToCart === product.id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Wird hinzugefügt...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Hinzufügen
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* MLOps Info Banner */}
          <div className="mt-12 p-6 bg-gradient-to-r from-gray-900 to-black rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">MLOps Recommender System</h3>
                  <p className="text-gray-300">Personalized recommendations powered by AI</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('http://localhost:8006/health', '_blank')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg border border-white/20 transition-colors"
                >
                  Health Check
                </button>
                <button
                  onClick={() => window.open('http://localhost:8006/model-info', '_blank')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg border border-white/20 transition-colors"
                >
                  Model Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}