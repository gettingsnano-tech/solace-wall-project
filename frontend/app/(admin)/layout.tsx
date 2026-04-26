"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart, 
  Users, 
  Coins, 
  Wallet, 
  ArrowDownCircle, 
  LogOut,
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Toaster } from "react-hot-toast";

const AdminSidebarItem = ({ icon: Icon, label, href, active }: { icon: any, label: string, href: string, active: boolean }) => (
  <Link href={href}>
    <div className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-200 ${
      active 
        ? "bg-white/[0.08] text-[var(--primary)] font-bold border border-white/5" 
        : "text-gray-400 hover:bg-white/[0.03] hover:text-white"
    }`}>
      <Icon className="w-5 h-5" />
      <span className="text-sm">{label}</span>
    </div>
  </Link>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await fetchMe();
    };
    init();
  }, []);

  useEffect(() => {
     if (user && user.role !== "admin") {
        router.push("/dashboard");
     }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const menuItems = [
    { icon: BarChart, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Coins, label: "Coin Management", href: "/admin/coins" },
    { icon: Wallet, label: "Wallet Addresses", href: "/admin/wallets" },
    { icon: ArrowDownCircle, label: "Withdrawals", href: "/admin/withdrawals" },
  ];

  return (
    <div className="flex h-screen bg-[#080B14] text-white overflow-hidden">
      {/* Admin Sidebar */}
      <div className="w-72 flex flex-col h-full border-r border-white/[0.05] bg-[#0A0E1A]">
        <div className="p-8 flex items-center space-x-3 mb-8">
           <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center">
              <ShieldAlert className="text-[var(--background)] w-6 h-6" />
           </div>
           <span className="font-bold text-lg">ADMIN <span className="text-[var(--primary)] text-sm ml-1 uppercase tracking-tighter">Panel</span></span>
        </div>

        <div className="px-4 space-y-2 flex-1">
          <p className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Core Management</p>
          {menuItems.map((item) => (
            <AdminSidebarItem 
              key={item.href}
              {...item}
              active={pathname === item.href}
            />
          ))}
        </div>

        <div className="p-8 border-t border-white/[0.05]">
          <div className="bg-white/[0.03] p-4 rounded-2xl mb-6">
             <div className="flex items-center space-x-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-[var(--secondary)]"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Active Admin</span>
             </div>
             <p className="text-sm font-bold truncate">{user?.full_name}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-red-500 font-bold hover:underline py-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Panel</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#080B14]">
        <header className="h-20 flex items-center px-10 border-b border-white/[0.05] bg-[#0A0E1A]/40">
           <h2 className="text-xl font-black tracking-tight">{menuItems.find(m => m.href === pathname)?.label || "Administration"}</h2>
        </header>
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
