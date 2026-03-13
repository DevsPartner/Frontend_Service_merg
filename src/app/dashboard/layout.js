// src/app/dashboard/layout.js
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Navbar/AuthContext';
import { Sidebar } from "@/components/Sidebar/Sidebar"; 
import DashboardHeader from "@/components/DashboardHeader/DashboardHeader"; // Note: Fixed spelling from "Heder"
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/'); 
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0B1120] fixed inset-0 z-[60]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <div className="text-slate-400 font-medium">Verifying Credentials...</div>
        </div>
      </div>
    );
  }

  if (user?.isAdmin) {
    return (
      // Added fixed position and high z-index to overlay the main app's navbar
      <div className="fixed inset-0 z-[55] flex h-screen w-full bg-[#0B1120] text-white overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  return null;
}