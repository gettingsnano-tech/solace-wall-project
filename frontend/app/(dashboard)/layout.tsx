"use client";

import React, { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useAuthStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Loader2, Check, ExternalLink, Menu, X } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchMe } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const init = async () => {
      setChecking(true);
      const currentUser = await fetchMe();
      if (!currentUser) {
        router.push("/auth/login");
      } else if (!currentUser.is_verified) {
        router.push("/auth/verify-required");
      } else {
        setIsAuthorized(true);
      }
      setChecking(false);
    };
    init();
  }, [fetchMe, router]);

  // Fetch notifications
  useEffect(() => {
    if (!isAuthorized) return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/user/notifications");
        setNotifications(res.data);
      } catch {}
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [isAuthorized]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await api.put(`/api/user/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch {}
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay}d ago`;
  };

  // Derive page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last || last === "dashboard") return "Overview";
    return last.charAt(0).toUpperCase() + last.slice(1);
  };

  if (checking || !isAuthorized) {
    return (
      <div className="h-screen w-screen bg-[#0A0E1A] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">Accessing Secure Vault</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0E1A] text-white overflow-hidden relative">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] z-[101] lg:hidden"
            >
              <Sidebar mobile onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 border-b border-white/[0.05] bg-[#0A0E1A]/40 backdrop-blur-md relative z-20">
          <div className="flex items-center space-x-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
             >
               <Menu className="w-6 h-6" />
             </button>
             <h2 className="text-lg lg:text-xl font-bold text-gray-400 truncate max-w-[150px] sm:max-w-none">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center space-x-6">
            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-[#0A0E1A] flex items-center justify-center text-[10px] font-bold text-white px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifPanel && (
                <div className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] bg-[#0E1322] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-300">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[340px]">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        <Bell className="w-10 h-10 text-gray-700 mb-3" />
                        <p className="text-gray-500 text-sm font-semibold">No notifications yet</p>
                        <p className="text-gray-600 text-xs mt-1">Activity alerts will appear here</p>
                      </div>
                    ) : (
                      notifications.slice(0, 15).map(n => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] transition-colors hover:bg-white/[0.03] ${
                            !n.is_read ? "bg-[var(--primary)]/[0.03]" : ""
                          }`}
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.is_read ? "bg-[var(--primary)]" : "bg-gray-700"}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!n.is_read ? "text-white font-semibold" : "text-gray-400"}`}>
                              {n.message}
                            </p>
                            <p className="text-[11px] text-gray-600 mt-1">{formatTime(n.created_at)}</p>
                          </div>
                          {!n.is_read && (
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="shrink-0 p-1 rounded-lg text-gray-500 hover:text-[var(--primary)] hover:bg-white/[0.05] transition-all"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-5 py-3 border-t border-white/[0.06]">
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setShowNotifPanel(false)}
                      className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--primary)] hover:underline"
                    >
                      <span>View All Notifications</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-3 p-1 sm:p-1.5 pr-1 sm:pr-4 rounded-full bg-white/[0.05] border border-white/10">
               <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--primary)] text-[var(--background)] flex items-center justify-center font-bold text-xs sm:text-sm">
                  {user?.full_name?.charAt(0) || "U"}
               </div>
               <div className="hidden sm:block text-sm font-semibold truncate max-w-[100px]">
                  {user?.full_name?.split(' ')[0] || "User"}
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-gradient-to-b from-[#0E1322] to-[#0A0E1A]">
          {children}
        </main>
      </div>
    </div>
  );
}
