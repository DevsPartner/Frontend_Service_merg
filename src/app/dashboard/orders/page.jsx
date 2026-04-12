"use client";

import React, { useEffect, useState } from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import { OrderService } from '@/lib/OrderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ minTotal: '', maxTotal: '', minItems: '', maxItems: '' });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getRecentOrders(0, 500);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter(o => {
    const total = parseFloat(o.totalAmount || 0);
    const items = o.items?.length ?? 0;
    const matchSearch = String(o.orderId || '').includes(search) || String(o.user_id || '').includes(search);
    const matchMinTotal = !filters.minTotal || total >= parseFloat(filters.minTotal);
    const matchMaxTotal = !filters.maxTotal || total <= parseFloat(filters.maxTotal);
    const matchMinItems = !filters.minItems || items >= parseInt(filters.minItems);
    const matchMaxItems = !filters.maxItems || items <= parseInt(filters.maxItems);
    return matchSearch && matchMinTotal && matchMaxTotal && matchMinItems && matchMaxItems;
  });

  const inputCls = "bg-slate-950 text-white px-3 py-2 rounded-xl border border-slate-800 focus:border-indigo-500 outline-none text-sm";

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Orders</h1>
          <p className="text-slate-400 text-sm">All customer orders.</p>
        </div>
        <button onClick={fetchOrders} className="p-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 border border-slate-700 transition-all">
          <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input type="text" placeholder="Order ID or Customer ID..." value={search}
              onChange={e => setSearch(e.target.value)} className={`pl-9 w-52 ${inputCls}`} />
          </div>
          <input type="number" placeholder="Min Total (€)" value={filters.minTotal}
            onChange={e => setFilters(f => ({ ...f, minTotal: e.target.value }))} className={`w-32 ${inputCls}`} />
          <input type="number" placeholder="Max Total (€)" value={filters.maxTotal}
            onChange={e => setFilters(f => ({ ...f, maxTotal: e.target.value }))} className={`w-32 ${inputCls}`} />
          <input type="number" placeholder="Min Items" value={filters.minItems}
            onChange={e => setFilters(f => ({ ...f, minItems: e.target.value }))} className={`w-28 ${inputCls}`} />
          <input type="number" placeholder="Max Items" value={filters.maxItems}
            onChange={e => setFilters(f => ({ ...f, maxItems: e.target.value }))} className={`w-28 ${inputCls}`} />
          {(search || filters.minTotal || filters.maxTotal || filters.minItems || filters.maxItems) && (
            <button onClick={() => { setSearch(''); setFilters({ minTotal: '', maxTotal: '', minItems: '', maxItems: '' }); }}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors">
              Clear
            </button>
          )}
          <span className="ml-auto text-xs text-slate-500 self-center">{filtered.length} results</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-800 bg-slate-900/50">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer ID</th>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Items</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-500 text-xs uppercase tracking-widest">Loading orders...</span>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-slate-500">No orders found.</td></tr>
              ) : filtered.map((order, index) => (
                <tr key={order.orderId ?? index} className="border-b border-slate-800/50 hover:bg-indigo-500/5 transition-all">
                  <td className="py-4 px-6 font-mono text-xs font-bold text-indigo-400">
                    #{String(order.orderId || '').padStart(6, '0')}
                  </td>
                  <td className="py-4 px-6 text-slate-300">{order.user_id || '—'}</td>
                  <td className="py-4 px-6 text-slate-400 whitespace-nowrap">
                    {order.orderDate ? new Date(order.orderDate).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-4 px-6 font-black text-white">€{parseFloat(order.totalAmount || 0).toFixed(2)}</td>
                  <td className="py-4 px-6 text-slate-400">{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}