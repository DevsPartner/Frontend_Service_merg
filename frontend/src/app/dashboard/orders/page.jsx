"use client";

import React, { useEffect, useState } from 'react';
import { Search, ShoppingBag, Eye, Trash2, Download, RefreshCcw } from 'lucide-react';
import { OrderService } from '@/lib/OrderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getRecentOrders();
      // Ensure we handle different possible API response structures
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed' || s === 'delivered') 
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s === 'pending' || s === 'processing') 
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Expert Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Order Intelligence</h1>
          <p className="text-slate-400 text-sm font-medium">Monitoring real-time transaction flow.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchOrders}
            className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all font-black text-sm shadow-lg shadow-indigo-500/20">
            <ShoppingBag size={18} /> New Order
          </button>
        </div>
      </div>

      {/* Main Intelligent Table Card */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Order ID or Customer..." 
              className="w-full bg-slate-950 text-white pl-10 pr-4 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-xl border border-slate-700 text-sm font-bold hover:text-white transition-colors">
            <Download size={16} /> Export Data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-800 bg-slate-900/50">
                <th className="py-5 px-8">Order ID</th>
                <th className="py-5 px-6">Customer</th>
                <th className="py-5 px-6">Timestamp</th>
                <th className="py-5 px-6">Total</th>
                <th className="py-5 px-6">Status</th>
                <th className="py-5 px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Syncing with Node Engine...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center text-slate-500 font-bold">No transactions found.</td></tr>
              ) : orders.map((order) => (
                <tr key={order.id || order._id} className="border-b border-slate-800/50 hover:bg-indigo-500/5 transition-all group">
                  <td className="py-5 px-8 font-mono text-xs font-bold text-indigo-400">
                    #{order.id?.toString().slice(-8).toUpperCase()}
                  </td>
                  <td className="py-5 px-6">
                    <div className="font-bold text-slate-200">{order.customer_name || 'Anonymous'}</div>
                    <div className="text-[10px] text-slate-500 font-medium">{order.customer_email || 'no-email@store.ai'}</div>
                  </td>
                  <td className="py-5 px-6 text-slate-400 font-medium whitespace-nowrap">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                  </td>
                  <td className="py-5 px-6 font-black text-white text-base">
                    ${(order.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-5 px-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(order.status)}`}>
                      {order.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-700">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-500 transition-colors border border-transparent hover:border-rose-500/20">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}