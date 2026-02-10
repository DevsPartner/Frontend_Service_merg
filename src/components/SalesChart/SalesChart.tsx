'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical } from 'lucide-react';
import { MonthlyData } from '../../types';

interface SalesChartProps {
  data: MonthlyData[];
}

// Custom Tooltip Component for a cleaner look
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-2xl">
        <p className="text-slate-400 text-xs mb-1 font-medium">{label}</p>
        <p className="text-indigo-400 font-bold text-lg">
          €{Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/5 h-full flex flex-col transition-all hover:border-white/10">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Monthly Sales</h2>
          <p className="text-slate-400 text-sm mt-1">Revenue overview for the year</p>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      
      {/* Chart Container */}
      <div className="flex-1 w-full min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              
              {/* Define Gradients */}
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={1} /> {/* Indigo-400 */}
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} /> {/* Indigo-500 */}
                </linearGradient>
                <linearGradient id="barHoverGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} /> {/* Violet-400 */}
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} /> {/* Violet-500 */}
                </linearGradient>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#334155" 
                opacity={0.2} 
              />
              
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                dy={12}
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                tickFormatter={(value) => `€${value / 1000}k`}
              />
              
              <Tooltip 
                cursor={{ fill: '#334155', opacity: 0.1, radius: 4 }}
                content={<CustomTooltip />}
              />
              
              <Bar 
                dataKey="sales" 
                radius={[6, 6, 6, 6]} // Fully rounded top and bottom for "capsule" look
                barSize={24}          // Slightly wider bars
                fill="url(#barGradient)"
                activeBar={{ fill: 'url(#barHoverGradient)' }} // Changes color on hover
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
            <span className="text-sm">Loading chart data...</span>
          </div>
        )}
      </div>
    </div>
  );
};