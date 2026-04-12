"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/Navbar/AuthContext";
import { cartApi } from "@/lib/cartApi";
import Recommendations from "@/components/Recommendations/Recommendations";

export default function ProductsPage({ limit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Fehler beim Laden");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.items || data.products || data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : '/products');
  }

  async function handleAddToCart(product) {
    if (!user) { router.push("/login?redirect=/products"); return; }
    setAddingToCart(product.id);
    try {
      await cartApi.addToCart(user.customer_id, user.name, {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        image_link: product.imageLink || "https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image",
        quantity: 1,
      });
      alert("Produkt wurde zum Warenkorb hinzugefügt!");
    } catch (err) {
      alert("Fehler: " + err.message);
    } finally {
      setAddingToCart(null);
    }
  }

  const filtered = search
    ? products.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      )
    : limit ? products.slice(0, limit) : products;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500 animate-pulse">Loading products...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

  return (
    <>
      <Recommendations />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">All Products</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {search ? `${filtered.length} results for "${search}"` : 'Browse our complete collection'}
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Produkt suchen..."
                className="flex-1 sm:w-64 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">🔍</button>
              {search && (
                <button type="button" onClick={() => { setSearch(''); router.push('/products'); }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl">✕</button>
              )}
            </form>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg mb-4">Kein Produkt gefunden für "{search}"</p>
              <button onClick={() => { setSearch(''); router.push('/products'); }} className="text-blue-600 hover:underline">Alle Produkte anzeigen</button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <article key={product.id} className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-60 bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer" onClick={() => setSelected(product)}>
                    <img
                      src={product.imageLink || "https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = "https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image"; }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 cursor-pointer hover:text-blue-600" onClick={() => setSelected(product)}>{product.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 line-clamp-2">{product.description}</p>
                    {product.country_of_origin && <p className="text-xs text-gray-400 mb-3">🌍 {product.country_of_origin}</p>}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">{product.price}€</span>
                      <button onClick={() => handleAddToCart(product)} disabled={addingToCart === product.id}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50">
                        {addingToCart === product.id ? "Wird hinzugefügt..." : "Hinzufügen"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 bg-gray-100 dark:bg-gray-700">
              <img
                src={selected.imageLink || "https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image"}
                alt={selected.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image"; }}
              />
              <button onClick={() => setSelected(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all">
                ✕
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selected.name}</h2>
              {selected.category && <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">{selected.category}{selected.subCategory ? ` — ${selected.subCategory}` : ''}</p>}
              {selected.description && <p className="text-gray-600 dark:text-gray-400 mb-3">{selected.description}</p>}
              {selected.details && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{selected.details}</p>}
              {selected.country_of_origin && <p className="text-sm text-gray-400 mb-4">🌍 {selected.country_of_origin}</p>}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{selected.price}€</span>
                <button onClick={() => { handleAddToCart(selected); setSelected(null); }}
                  disabled={addingToCart === selected.id}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
                  {addingToCart === selected.id ? "Wird hinzugefügt..." : "In den Warenkorb"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}