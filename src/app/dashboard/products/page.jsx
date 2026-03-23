"use client";

import { useState, useEffect } from "react";
import { Package, TrendingUp, DollarSign, RefreshCcw, Search, Eye, Plus, X } from "lucide-react";

export default function ProductsDashboardPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", details: "",
    category: "", subCategory: "", country_of_origin: "",
  });
  const [formMsg, setFormMsg] = useState(null);
  const [formMsgType, setFormMsgType] = useState("success");
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.items || data.products || data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setFormMsg(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create product");
      setFormMsgType("success");
      setFormMsg("Product created successfully!");
      setFormData({ name: "", description: "", price: "", details: "", category: "", subCategory: "", country_of_origin: "" });
      fetchProducts();
    } catch (err) {
      setFormMsgType("error");
      setFormMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalProducts = products.length;
  const avgPrice = products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map((p) => parseFloat(p.price) || 0)) : 0;
  const minPrice = products.length > 0 ? Math.min(...products.map((p) => parseFloat(p.price) || 0)) : 0;

  const buckets = [
    { label: "< €50", count: products.filter((p) => parseFloat(p.price) < 50).length },
    { label: "€50–€200", count: products.filter((p) => parseFloat(p.price) >= 50 && parseFloat(p.price) < 200).length },
    { label: "€200–€500", count: products.filter((p) => parseFloat(p.price) >= 200 && parseFloat(p.price) < 500).length },
    { label: "€500+", count: products.filter((p) => parseFloat(p.price) >= 500).length },
  ];
  const maxBucket = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Product Analytics</h1>
          <p className="text-slate-400 text-sm font-medium">Catalog overview and price distribution.</p>
        </div>
        <div className="flex gap-2 self-start">
          <button
            onClick={() => { setShowModal(true); setFormMsg(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all"
          >
            <Plus size={16} /> Add Product
          </button>
          <button
            onClick={fetchProducts}
            className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Package size={20} />} label="Total Products" value={totalProducts} color="indigo" />
        <StatCard icon={<DollarSign size={20} />} label="Avg Price" value={`€${avgPrice.toFixed(2)}`} color="emerald" />
        <StatCard icon={<TrendingUp size={20} />} label="Highest Price" value={`€${maxPrice.toFixed(2)}`} color="amber" />
        <StatCard icon={<TrendingUp size={20} className="rotate-180" />} label="Lowest Price" value={`€${minPrice.toFixed(2)}`} color="rose" />
      </div>

      {/* Price Distribution */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Price Distribution</h2>
        <div className="space-y-4">
          {buckets.map((bucket) => (
            <div key={bucket.label} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 w-24 shrink-0">{bucket.label}</span>
              <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-700"
                  style={{ width: `${(bucket.count / maxBucket) * 100}%` }}
                />
              </div>
              <span className="text-xs font-black text-white w-6 text-right">{bucket.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex gap-4 items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-slate-950 text-white pl-9 pr-4 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-sm transition-all"
            />
          </div>
          <span className="text-xs text-slate-500 font-bold shrink-0">{filtered.length} results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-800 bg-slate-900/50">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Origin</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Loading catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-rose-400 font-bold">{error}</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500 font-bold">No products found.</td>
                </tr>
              ) : (
                filtered.map((product, index) => (
                  <tr key={product.id || index} className="border-b border-slate-800/50 hover:bg-indigo-500/5 transition-all group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-800 shrink-0">
                          <img
                            src={product.imageLink || "https://placehold.co/80x80/1e293b/64748b?text=?"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/80x80/1e293b/64748b?text=?"; }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 line-clamp-1">{product.name}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg uppercase tracking-wide">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      {product.country_of_origin || "—"}
                    </td>
                    <td className="py-4 px-6 font-black text-white">
                      €{parseFloat(product.price || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => window.open(`/products`, "_blank")}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all border border-transparent hover:border-slate-700"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-lg font-black text-white">Add New Product</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
              {formMsg && (
                <div className={`p-3 rounded-xl text-sm font-medium ${formMsgType === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                  {formMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name *</label>
                  <input name="name" value={formData.name} onChange={handleFormChange} required
                    className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm"
                    placeholder="Product name" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price (€) *</label>
                  <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleFormChange} required
                    className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm"
                    placeholder="0.00" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category</label>
                  <input name="category" value={formData.category} onChange={handleFormChange}
                    className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm"
                    placeholder="e.g. Electronics" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sub Category</label>
                  <input name="subCategory" value={formData.subCategory} onChange={handleFormChange}
                    className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm"
                    placeholder="e.g. Smartphones" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Country of Origin</label>
                  <input name="country_of_origin" value={formData.country_of_origin} onChange={handleFormChange}
                    className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm"
                    placeholder="e.g. Germany" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleFormChange} rows={2}
                    className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm resize-none"
                    placeholder="Short product description" />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Details</label>
                  <textarea name="details" value={formData.details} onChange={handleFormChange} rows={2}
                    className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:border-indigo-500 outline-none text-sm resize-none"
                    placeholder="Technical specs, etc." />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl transition-all border border-slate-700">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    rose: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}