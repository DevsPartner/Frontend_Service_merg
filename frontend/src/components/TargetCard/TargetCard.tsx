'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MoreVertical, ArrowDown, ArrowUp } from 'lucide-react';
import { TargetStats } from '../../types'; // Adjust path if needed

interface TargetCardProps {
  stats: TargetStats | null;
}

export const TargetCard: React.FC<TargetCardProps> = ({ stats }) => {
  // Safe default if stats are null
  const percentage = stats ? stats.percentage : 0;
  
  const data = [
    { name: 'Completed', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/5 h-full flex flex-col justify-between transition-all hover:border-white/10">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-bold text-white">Monthly Target</h2>
          <p className="text-slate-400 text-sm mt-1">Target you've set for each month</p>
        </div>
        <button className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Radial Chart */}
      <div className="relative h-64 w-full flex items-center justify-center -my-4">
        {stats ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="70%"
                startAngle={180}
                endAngle={0}
                innerRadius="75%"
                outerRadius="95%"
                paddingAngle={0}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                {/* Active Gradient Segment */}
                <Cell key="cell-0" fill="url(#targetGradient)" />
                {/* Empty Background Segment */}
                <Cell key="cell-1" fill="#1e293b" />
              </Pie>
              <defs>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" /> {/* Indigo-500 */}
                  <stop offset="100%" stopColor="#a855f7" /> {/* Purple-500 */}
                </linearGradient>
              </defs>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
             <div className="w-4 h-4 rounded-full border-2 border-slate-600 border-t-transparent animate-spin"></div>
             Loading...
          </div>
        )}
        
        {/* Center Text Overlay */}
        {stats && (
          <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-5xl font-bold text-white tracking-tight">
              {stats.percentage}%
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full mt-3 border border-emerald-500/20">
              <ArrowUp size={12} />
              +10%
            </div>
          </div>
        )}
      </div>

      {/* Context Text */}
      <div className="text-center mb-6 px-4">
        <p className="text-slate-400 text-sm leading-relaxed">
           You earned <span className="text-white font-bold text-base">{stats?.todayRevenue || '...'}</span> today, which is higher than yesterday.
        </p>
        <p className="text-indigo-400 font-medium text-sm mt-1">Keep up the good work!</p>
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
        {/* Target Stat */}
        <div className="text-center group">
           <div className="text-slate-500 text-xs mb-1 font-medium uppercase tracking-wider">Target</div>
           <div className="text-white font-bold flex items-center justify-center gap-1 group-hover:text-indigo-400 transition-colors">
              {stats?.target || '...'}
              <ArrowDown size={14} className="text-rose-500" />
           </div>
        </div>

        {/* Revenue Stat */}
        <div className="text-center group">
           <div className="text-slate-500 text-xs mb-1 font-medium uppercase tracking-wider">Revenue</div>
           <div className="text-white font-bold flex items-center justify-center gap-1 group-hover:text-emerald-400 transition-colors">
              {stats?.totalRevenue || '...'}
              <ArrowUp size={14} className="text-emerald-500" />
           </div>
        </div>

        {/* Today Stat */}
        <div className="text-center group">
           <div className="text-slate-500 text-xs mb-1 font-medium uppercase tracking-wider">Today</div>
           <div className="text-white font-bold flex items-center justify-center gap-1 group-hover:text-emerald-400 transition-colors">
              {stats?.today || '...'}
              <ArrowUp size={14} className="text-emerald-500" />
           </div>
        </div>
      </div>
    </div>
  );
};