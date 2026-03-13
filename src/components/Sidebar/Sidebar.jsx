"use client";

import { Cpu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PieChart, ShoppingBag, Users, Settings, LogOut, Package } from 'lucide-react';

export const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path 
      ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-500' 
      : 'text-slate-400 hover:text-white hover:bg-white/5';
  };

  return (
    // Sidebar matches the #0B1120 background from your layout
    <aside className="flex w-64 bg-[#0B1120] border-r border-slate-800/50 flex-col h-screen">
      
      <div className="p-8">
        <div className="text-xs font-semibold text-slate-500 tracking-widest uppercase">Menu</div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavItem href="/dashboard" icon={<LayoutDashboard size={20}/>} label="Overview" active={isActive('/dashboard')} />
        <NavItem href="/dashboard/analytics" icon={<PieChart size={20}/>} label="Analytics" active={isActive('/dashboard/analytics')} />
        <NavItem href="/dashboard/customers" icon={<Users size={20}/>} label="Customers" active={isActive('/dashboard/customers')} />
        <NavItem href="/dashboard/orders" icon={<ShoppingBag size={20}/>} label="Orders" active={isActive('/dashboard/orders')} />
        <NavItem href="/dashboard/products" icon={<Package size={20}/>} label="Products" active={isActive('/dashboard/products')} />
        <NavItem  href="/dashboard/ai-engine" icon={<Cpu size={20}/>} label="AI Engine" active={isActive('/dashboard/ai-engine')} 
/>
      </nav>

      <div className="p-4 border-t border-slate-800/50 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white rounded-xl transition-colors">
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/5 rounded-xl transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

// Helper component
const NavItem = ({ href, icon, label, active }) => (
  <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${active}`}>
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);