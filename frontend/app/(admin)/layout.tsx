"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  BarChart, 
  Users, 
  Coins, 
  Wallet, 
  ArrowDownCircle, 
  LogOut,
  ShieldAlert,
  Settings,
  Loader2,
  Globe,
  RefreshCcw,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const AdminSidebarItem = ({ 
  icon: Icon, 
  label, 
  href, 
  active,
  onClose
}: { 
  icon: any; 
  label: string; 
  href: string; 
  active: boolean;
  onClose?: () => void;
}) => (
  <Link href={href} onClick={onClose}>
    <div className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-200 ${
      active 
        ? "bg-white/[0.08] text-[var(--primary)] font-bold border border-white/5" 
        : "text-gray-400 hover:bg-white/[0.03] hover:text-white"
    }`}>
      <Icon className="w-5 h-5 shrink-0" />
      <span className="text-sm">{label}</span>
    </div>
  </Link>
);

function AdminSidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: BarChart, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Coins, label: "Coin Management", href: "/admin/coins" },
    { icon: RefreshCcw, label: "Swap History", href: "/admin/swaps" },
    { icon: Globe, label: "External Exchanges", href: "/admin/exchanges" },
    { icon: Wallet, label: "Wallet Addresses", href: "/admin/wallets" },
    { icon: ArrowDownCircle, label: "Withdrawals", href: "/admin/withdrawals" },
    { icon: MessageSquare, label: "Support Tickets", href: "/admin/support" },
    { icon: Settings, label: "Platform Settings", href: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="w-72 flex flex-col h-full border-r border-white/[0.05] bg-[#0A0E1A]">
      <div className="p-8 flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center shrink-0">
            <ShieldAlert className="text-[var(--background)] w-6 h-6" />
          </div>
          <span className="font-bold text-lg">ADMIN <span className="text-[var(--primary)] text-sm ml-1 uppercase tracking-tighter">Panel</span></span>
        </div>
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="px-4 space-y-2 flex-1 overflow-y-auto">
        <p className="px-6 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Core Management</p>
        {menuItems.map((item) => (
          <AdminSidebarItem 
            key={item.href}
            {...item}
            active={pathname === item.href}
            onClose={onClose}
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
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, fetchMe } = useAuthStore();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  useEffect(() => {
    const init = async () => {
      setChecking(true);
      const currentUser = await fetchMe();
      
      if (!currentUser) {
         router.push("/auth/login");
      } else if (!currentUser.is_verified) {
         router.push("/auth/verify-required");
      } else if (currentUser.role !== "admin") {
         router.push("/dashboard");
      } else {
         setIsAuthorized(true);
      }
      setChecking(false);
    };
    init();
  }, [fetchMe, router]);

  const menuItems = [
    { icon: BarChart, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: Coins, label: "Coin Management", href: "/admin/coins" },
    { icon: RefreshCcw, label: "Swap History", href: "/admin/swaps" },
    { icon: Globe, label: "External Exchanges", href: "/admin/exchanges" },
    { icon: Wallet, label: "Wallet Addresses", href: "/admin/wallets" },
    { icon: ArrowDownCircle, label: "Withdrawals", href: "/admin/withdrawals" },
    { icon: MessageSquare, label: "Support Tickets", href: "/admin/support" },
    { icon: Settings, label: "Platform Settings", href: "/admin/settings" },
  ];

  if (checking || !isAuthorized) {
    return (
      <div className="h-screen w-screen bg-[#080B14] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">Verifying Administrative Access</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#080B14] text-white overflow-hidden relative">
      {/* Admin Sidebar — Desktop */}
      <div className="hidden lg:flex h-full">
        <AdminSidebarContent />
      </div>

      {/* Admin Sidebar — Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[101] lg:hidden"
            >
              <AdminSidebarContent onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#080B14]">
        <header className="h-16 lg:h-20 flex items-center px-4 lg:px-10 border-b border-white/[0.05] bg-[#0A0E1A]/40 gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/[0.05] text-gray-400 hover:text-white transition-all"
            aria-label="Open admin menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-base lg:text-xl font-black tracking-tight truncate">
            {menuItems.find(m => m.href === pathname)?.label || "Administration"}
          </h2>
        </header>
        <main className="flex-1 overflow-y-auto px-4 lg:px-10 pb-10 pt-8 lg:pt-16">
          {children}
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
}
