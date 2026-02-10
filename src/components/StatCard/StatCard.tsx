'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { TrendDirection } from '../../types';

interface StatCardProps {
  label: string;
  value: string;
  percentage: number;
  trend: TrendDirection;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, percentage, trend, icon }) => {
  const isUp = trend === TrendDirection.UP;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/5 flex flex-col justify-between h-full min-h-[160px] transition-all duration-300 hover:border-white/10 hover:translate-y-[-2px]">
      
      {/* Icon Header */}
      <div className="flex justify-between items-start mb-4">
        {/* We render the icon directly because the parent component 
            now handles the specific background color (blue/amber/emerald) */}
        <div className="rounded-xl">
          {icon}
        </div>
        
        {/* Optional: You could add a small 'dots' menu here if needed, 
            or leave empty for a cleaner look */}
      </div>
      
      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3 className="text-slate-400 text-sm font-medium tracking-wide">{label}</h3>
        
        <div className="flex items-end justify-between gap-2">
          <span className="text-3xl font-bold text-white tracking-tight leading-none">
            {value}
          </span>
          
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            isUp 
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
          }`}>
            {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};