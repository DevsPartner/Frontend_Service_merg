'use client';

import React from 'react';
import { 
  ComposedChart, // Changed to ComposedChart to allow both Bars and Lines
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { MoreVertical, TrendingUp } from 'lucide-react';
import { MonthlyData } from '../../types';

interface SalesChartProps {
  data: MonthlyData[]; // Your data should now include a 'predicted' field
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl">
        <p className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wider">{label}</p>
        <div className="space-y-2">
          {/* Actual Sales Row */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400 text-sm">Actual:</span>
            <span className="text-white font-bold">
              €{Number(payload[0].value).toLocaleString()}
            </span>
          </div>
          {/* AI Prediction Row (only shows if predicted data exists) */}
          {payload[1] && (
            <div className="flex items-center justify-between gap-4 border-t border-slate-700 pt-2">
              <span className="text-emerald-400 text-sm flex items-center gap-1">
                <TrendingUp size={12} /> AI Forecast:
              </span>
              <span className="text-emerald-400 font-bold">
                €{Number(payload[1].value).toLocaleString()}
              </span>
            </div>
          )}
        </div>
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
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Sales Analysis</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              AI Powered
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">Actual revenue vs. AI predictions</p>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      
      {/* Chart Container */}
      <div className="flex-1 w-full min-h-[250px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.6} />
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
              
              {/* Actual Sales Bars */}
              <Bar 
                dataKey="sales" 
                radius={[6, 6, 0, 0]} 
                barSize={24}
                fill="url(#barGradient)"
                animationDuration={1500}
              />

              {/* AI Prediction Line */}
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#0f172a' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                strokeDasharray="5 5" // Makes it a dashed line for "future/prediction" feel
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin"></div>
            <span className="text-sm">Calculating Forecasts...</span>
          </div>
        )}
      </div>
    </div>
  );
};