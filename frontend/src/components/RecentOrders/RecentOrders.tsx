'use client';

import React from 'react';
import { MoreHorizontal, FileText } from 'lucide-react';
import { Order } from '../../types';

interface RecentOrdersProps {
  orders: Order[];
}

const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'cancelled':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

export const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-xl border border-white/5 flex flex-col h-full">
      
      {/* Header - Adjusted layout for mobile */}
      <div className="flex flex-row justify-between items-center mb-6 gap-4">
        <div>
           <h2 className="text-lg font-bold text-white">Recent Orders</h2>
           <p className="text-slate-400 text-sm mt-1">Transactions from your store</p>
        </div>
        <button className="px-4 py-2 text-sm text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 whitespace-nowrap">
          View All
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto -mx-4 md:mx-0"> {/* Negative margin on mobile to let table touch edges */}
        <div className="inline-block min-w-full align-middle px-4 md:px-0">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                <th className="pb-4 font-semibold pl-2 whitespace-nowrap">Customer</th>
                <th className="pb-4 font-semibold whitespace-nowrap">Status</th>
                <th className="pb-4 font-semibold whitespace-nowrap">Amount</th>
                {/* Hidden on mobile (sm), visible on medium (md) */}
                <th className="pb-4 font-semibold whitespace-nowrap hidden md:table-cell">Date</th> 
                <th className="pb-4 font-semibold text-right pr-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="group hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                  >
                    {/* Customer Column */}
                    <td className="py-3 md:py-4 pl-2 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.avatar}`} 
                            alt={order.customer}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 border border-white/10" 
                          />
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                        </div>
                        <div>
                          <span className="block font-semibold text-white text-sm md:text-base">{order.customer}</span>
                          <span className="block text-xs text-slate-500">
                              #{String(order.id).slice(0,8)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-3 md:py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(order.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          order.status === 'Completed' ? 'bg-emerald-400' : 
                          order.status === 'Pending' ? 'bg-amber-400' : 'bg-rose-400'
                        }`}></span>
                        {order.status}
                      </span>
                    </td>

                    {/* Amount Column */}
                    <td className="py-3 md:py-4 font-medium text-white whitespace-nowrap">
                      {order.amount}
                    </td>

                    {/* Date Column - Hidden on mobile */}
                    <td className="py-3 md:py-4 text-slate-400 whitespace-nowrap hidden md:table-cell">
                      {order.date}
                    </td>

                    {/* Action Column */}
                    <td className="py-3 md:py-4 text-right pr-2">
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                      <div className="p-3 bg-slate-800/50 rounded-full">
                         <FileText className="w-6 h-6 text-slate-600" />
                      </div>
                      <p>No recent orders found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};