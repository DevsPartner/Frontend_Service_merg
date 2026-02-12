"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Navbar/AuthContext'; //
import { Sidebar } from "@/components/Sidebar/Sidebar"; 
import DashboardHeader from "@/components/DashboardHeader/DashboardHeder";
import { Loader2 } from 'lucide-react'; //

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth(); //
  const router = useRouter();

  useEffect(() => {
    // If auth is finished and user is not logged in OR is not an admin, redirect home
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/'); 
    }
  }, [user, loading, router]);

  // 1. Show a high-end loading state while checking permissions
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0B1120]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <div className="text-slate-400 font-medium">Verifying Credentials...</div>
        </div>
      </div>
    );
  }

  // 2. Only render the layout and children if the user is confirmed as Admin
  if (user?.isAdmin) {
    return (
      <div className="flex h-screen w-full bg-[#0B1120] text-white overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        <div className="flex flex-1 flex-col min-w-0">
          
          {/* Top Navigation Bar */}
          <DashboardHeader />

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 3. Return null to prevent content flashing for unauthorized users
  return null;
}