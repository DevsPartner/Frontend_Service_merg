"use client";

import React, { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard/StatCard';
import { SalesChart } from '@/components/SalesChart/SalesChart';
import { TargetCard } from '@/components/TargetCard/TargetCard';
import { RecentOrders } from '@/components/RecentOrders/RecentOrders';
import { Users, Box, Wallet, Loader2 } from 'lucide-react';
import { OrderService } from '@/lib/OrderServer';
import { 
  transformOrderForDisplay,
  transformMonthlySalesForChart,
  transformStatsToTargetCard
} from '@/lib/utils/dataTransformers';
import {
  calculateOrderStats,
  calculateMonthlySales,
  calculateUniqueCustomers,
  getPreviousMonthStats,
  calculatePercentageChange,
  calculateTrend
} from '@/lib/utils/dashboardCalculations';

export default function DashboardPage() {
  const [stats, setStats] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [targetStats, setTargetStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch ALL orders from backend
        const allOrders = await OrderService.getRecentOrders(0,500);

        // Calculate statistics in frontend
        const currentMonthStats = calculateOrderStats(allOrders);
        const previousMonthStats = getPreviousMonthStats(allOrders);
        const monthlySalesData = calculateMonthlySales(allOrders, 12);
        const uniqueCustomers = calculateUniqueCustomers(allOrders);

        // Create stat cards
        const statsCards = [
          {
            label: 'Total Customers',
            value: uniqueCustomers.toString(),
            percentage: calculatePercentageChange(uniqueCustomers, Math.floor(uniqueCustomers * 0.9)),
            trend: calculateTrend(uniqueCustomers, Math.floor(uniqueCustomers * 0.9)),
            icon: 'users'
          },
          {
            label: 'Total Orders',
            value: currentMonthStats.totalOrders.toString(),
            percentage: calculatePercentageChange(currentMonthStats.totalOrders, previousMonthStats.totalOrders),
            trend: calculateTrend(currentMonthStats.totalOrders, previousMonthStats.totalOrders),
            icon: 'box'
          },
          {
            label: 'Total Revenue',
            value: `€${currentMonthStats.totalRevenue.toLocaleString('de-DE', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}`,
            percentage: calculatePercentageChange(currentMonthStats.totalRevenue, previousMonthStats.totalRevenue),
            trend: calculateTrend(currentMonthStats.totalRevenue, previousMonthStats.totalRevenue),
            icon: 'wallet'
          }
        ];

        // Transform data
        const transformedSales = transformMonthlySalesForChart(monthlySalesData);
        const transformedOrders = allOrders.slice(0, 10).map(transformOrderForDisplay);
        const transformedTarget = transformStatsToTargetCard(currentMonthStats);

        // Update state
        setStats(statsCards);
        setSalesData(transformedSales);
        setRecentOrders(transformedOrders);
        setTargetStats(transformedTarget);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Updated Icon Logic: Returns icons with specific friendly colors and backgrounds
  const getIcon = (iconName) => {
    switch(iconName) {
      case 'users': 
        return (
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        );
      case 'box': 
        return (
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <Box className="w-6 h-6 text-amber-400" />
          </div>
        );
      case 'wallet': 
        return (
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Wallet className="w-6 h-6 text-emerald-400" />
          </div>
        );
      default: 
        return (
          <div className="p-3 bg-slate-500/10 rounded-xl">
            <Users className="w-6 h-6 text-slate-400" />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <div className="text-slate-400 font-medium">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
           <h3 className="text-red-400 font-semibold mb-2">Error Loading Data</h3>
           <p className="text-red-300/80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    // Added a fade-in animation keyframe class
    <div className="space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-100 to-indigo-200 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-400 text-lg">
          Welcome back! Here is your store's daily performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="transition-transform hover:scale-[1.02] duration-300">
             <StatCard
              label={stat.label}
              value={stat.value}
              percentage={stat.percentage}
              trend={stat.trend}
              icon={getIcon(stat.icon)}
            />
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-h-[400px]">
          <SalesChart data={salesData} />
        </div>
        <div className="lg:col-span-1 min-h-[400px]">
          <TargetCard stats={targetStats} />
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between mb-2">
           <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}