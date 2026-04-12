"use client";

import React, { useEffect, useState } from 'react';
import { RecentOrders } from '@/components/RecentOrders/RecentOrders';
import { Loader2 } from 'lucide-react';
import { OrderService } from '@/lib/OrderServer';
import { transformOrderForDisplay } from '@/lib/utils/dataTransformers';
import Link from 'next/link';

export default function DashboardPage() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allOrders = await OrderService.getRecentOrders(0, 10);
        setRecentOrders(allOrders.slice(0, 10).map(transformOrderForDisplay));
      } catch (err) {
        setError("Failed to load recent orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <div className="text-slate-400 font-medium">Loading...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-lg mt-1">Welcome back! Here are your latest orders.</p>
      </div>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            View All →
          </Link>
        </div>
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}