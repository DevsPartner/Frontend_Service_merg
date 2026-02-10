import { Sidebar } from "@/components/Sidebar/Sidebar"; 
import DashboardHeader from "@/components/DashboardHeader/DashboardHeder";

export default function DashboardLayout({ children }) {
  return (
    // Use the exact background color from your screenshot: #0B1120
    <div className="flex h-screen w-full bg-[#0B1120] text-white overflow-hidden">
      
      {/* Sidebar - Visible only on large screens per your code */}
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