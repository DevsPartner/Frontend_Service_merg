"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Recommendations from "@/components/recommendations/Recommendations";
import { Loader2, ShoppingCart, Star, Sparkles } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/products?skip=0&limit=100");
      const data = await res.json();

      if (data && Array.isArray(data)) {
        setProducts(data);
      } else if (data && Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        console.error("API did not return an array:", data);
        setProducts([]);
      }
    } catch (err) {
      setError("Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      router.push("/login");
      return;
    }

    setAddingToCart(product.id);
    try {
      await addToCart(product);
    } catch (err) {
      console.error("Cart error:", err);
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-slate-400 font-medium">Curating Collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Premium Products
          </h1>
          <p className="text-slate-400 text-lg">Modern technology for the modern creator.</p>
        </div>

        {/* AI Recommendations Section */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-emerald-400 w-5 h-5" />
            <h2 className="text-xl font-bold">AI Recommended for You</h2>
          </div>
          <Recommendations />
        </section>

        {/* Product Grid */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl text-red-400">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <div 
                  key={product.id} 
                  className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-xl"
                >
                  {/* Image Placeholder */}
                  <div className="aspect-square bg-slate-800 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                      <ShoppingCart size={48} />
                    </div>
                    {product.isNew && (
                      <span className="absolute top-4 left-4 bg-blue-600 text-[10px] font-black uppercase px-2 py-1 rounded">New</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-bold text-slate-400">{product.rating || '4.9'}</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xl font-black">€{product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart === product.id}
                        className="p-3 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all active:scale-90 disabled:opacity-50"
                      >
                        {addingToCart === product.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ShoppingCart size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-slate-500">
                No products found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}