"use client";

import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function DashboardHeader() {
  return (
    <header className="h-20 flex items-center justify-between px-6 bg-[#0B1120] border-b border-white/5 sticky top-0 z-20">
      
      {/* 1. Search Bar */}
      <div className="relative hidden md:block w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full bg-[#1A202C] border border-slate-800 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm placeholder:text-slate-600"
        />
      </div>

      {/* 2. Right Actions Area */}
      <div className="flex items-center gap-6 ml-auto">
        
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
          <Bell size={22} />
          {/* The Red Dot */}
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-[#0B1120] rounded-full"></span>
        </button>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <div className="text-right hidden md:block leading-tight">
            <div className="text-sm font-bold text-white">Alex Morgan</div>
            <div className="text-xs text-slate-400">Onwer</div>
          </div>
          
          <div className="relative">
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
              alt="Admin Profile" 
              className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700"
            />
            {/* Online Status Dot */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0B1120] rounded-full"></span>
          </div>
        </div>
      </div>
    </header>
  );
}