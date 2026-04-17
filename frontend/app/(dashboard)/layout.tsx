"use client";

import React, { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { Bell, User, Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchMe } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      await fetchMe();
    };
    init();
  }, []);

  // Simple route protection (In a real app, do this in middleware)
  useEffect(() => {
    // Note: We check user after fetchMe finishes
  }, [user]);

  if (!user && typeof window !== "undefined") {
     // Optional: loading state until fetchMe finishes
  }

  return (
    <div className="flex h-screen bg-[#0A0E1A] text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/[0.05] bg-[#0A0E1A]/40 backdrop-blur-md">
          <div className="flex items-center space-x-4">
             <h2 className="text-xl font-bold text-gray-400">Overview</h2>
          </div>

          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A0E1A]"></span>
            </button>
            
            <div className="flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-white/[0.05] border border-white/10">
               <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--background)] flex items-center justify-center font-bold text-sm">
                  {user?.full_name?.charAt(0) || "U"}
               </div>
               <div className="hidden sm:block text-sm font-semibold">
                  {user?.full_name || "Guest User"}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-[#0E1322] to-[#0A0E1A]">
          {children}
        </main>
      </div>
    </div>
  );
}
