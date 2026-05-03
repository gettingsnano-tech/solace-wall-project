"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Repeat,
  X
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/lib/store";

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: { icon: any, label: string, href: string, active: boolean, collapsed: boolean }) => (
  <Link href={href}>
    <div className={`flex items-center space-x-4 px-4 py-3 rounded-2xl transition-all duration-200 group ${
      active 
        ? "bg-[var(--primary)] text-[var(--background)] font-bold shadow-lg shadow-[var(--primary)]/20" 
        : "text-gray-400 hover:bg-white/[0.05] hover:text-white"
    }`}>
      <Icon className={`w-6 h-6 shrink-0 ${active ? "text-[var(--background)]" : "group-hover:text-[var(--primary)] transition-colors"}`} />
      {!collapsed && <span className="whitespace-nowrap">{label}</span>}
    </div>
  </Link>
);

export default function Sidebar({ mobile, onClose }: { mobile?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Wallet, label: "My Wallets", href: "/dashboard/wallet" },
    { icon: ArrowDownLeft, label: "Deposit", href: "/dashboard/deposit" },
    { icon: DollarSign, label: "Buy Crypto", href: "/dashboard/buy" },
    { icon: Repeat, label: "Swap Crypto", href: "/dashboard/swap" },
    { icon: ShoppingCart, label: "Sell Crypto", href: "/dashboard/sell" },
    { icon: History, label: "Transactions", href: "/dashboard/transactions" },
    { icon: ArrowUpRight, label: "Withdraw", href: "/dashboard/withdraw" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className={`relative flex flex-col h-full bg-[#0E1322] border-r border-white/[0.05] transition-all duration-300 ${collapsed && !mobile ? "w-20" : "w-full lg:w-72"}`}>
      {/* Sidebar Toggle - Desktop only */}
      {!mobile && (
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 bg-[var(--primary)] text-[var(--background)] rounded-full p-1 shadow-lg z-50 hover:scale-110 transition-transform hidden lg:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}

      {/* Close Button - Mobile only */}
      {mobile && (
        <button 
          onClick={onClose}
          className="absolute right-4 top-6 p-2 text-gray-500 hover:text-white lg:hidden"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Header */}
      <div className={`p-6 pb-10 flex items-center ${collapsed && !mobile ? "justify-center" : "justify-start pl-8"}`}>
        {collapsed && !mobile ? (
          <div className="w-14 h-14 bg-white/[0.05] rounded-xl flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="Core Capital" className="w-12 h-12 object-contain" />
          </div>
        ) : (
          <img src="/logo.png" alt="Core Capital Digital Currency" className="h-16 lg:h-20 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]" />
        )}
      </div>

      {/* Nav Items */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem 
            key={item.href}
            {...item}
            active={pathname === item.href}
            collapsed={collapsed && !mobile}
          />
        ))}
      </div>

      {/* User Session Footer */}
      <div className="p-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors group"
        >
          <LogOut className="w-6 h-6" />
          {(!collapsed || mobile) && <span className="font-bold">Sign Out</span>}
        </button>
      </div>
    </div>
  );
}
