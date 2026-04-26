"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Users, 
  Coins, 
  ArrowDownCircle, 
  CreditCard,
  Loader2,
  TrendingUp,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    users: 0,
    coins: 0,
    pendingWithdrawals: 0,
    totalDeposits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, coinsRes, withdrawRes] = await Promise.all([
          api.get("/api/admin/users"),
          api.get("/api/admin/coins"),
          api.get("/api/admin/withdrawals")
        ]);
        
        setStats({
          users: usersRes.data.length,
          coins: coinsRes.data.length,
          pendingWithdrawals: withdrawRes.data.filter((w: any) => w.status === 'pending').length,
          totalDeposits: 1250000 // Simulated value for overview
        });
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  const statCards = [
    { label: "Total Registered Users", value: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Asset Coins", value: stats.coins, icon: Coins, color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
    { label: "Pending Withdrawals", value: stats.pendingWithdrawals, icon: ArrowDownCircle, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Simulated Deployment Vol.", value: `$${(stats.totalDeposits / 1e6).toFixed(1)}M`, icon: CreditCard, color: "text-[var(--secondary)]", bg: "bg-[var(--secondary)]/10" },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-8 rounded-[2rem]"
          >
             <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
             <h3 className="text-3xl font-black">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem]">
            <div className="flex justify-between items-center mb-10">
               <h4 className="text-xl font-bold">Platform Activity</h4>
               <div className="bg-white/[0.05] p-1.5 rounded-xl flex">
                  {['7d', '30d', 'all'].map(t => (
                    <button key={t} className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${t === '30d' ? 'bg-white/10' : 'text-gray-500'}`}>{t}</button>
                  ))}
               </div>
            </div>
            
            {/* Simulated Chart Placeholder */}
            <div className="h-64 flex items-end justify-between gap-4 px-4 overflow-hidden">
               {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85, 60, 95].map((h, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.05, duration: 1 }}
                    className="w-full bg-gradient-to-t from-[var(--primary)]/10 to-[var(--primary)]/40 rounded-t-lg"
                  />
               ))}
            </div>
            <div className="flex justify-between mt-6 px-4 text-[10px] font-black text-gray-600 uppercase tracking-widest">
               <span>Week 1</span>
               <span>Week 2</span>
               <span>Week 3</span>
               <span>Week 4</span>
            </div>
         </div>

         <div className="glass-card p-10 rounded-[2.5rem]">
            <h4 className="text-xl font-bold mb-8">System Health</h4>
            <div className="space-y-8">
               {[
                 { label: "API Base", status: "Operational", color: "text-[var(--secondary)]" },
                 { label: "Database Core", status: "Operational", color: "text-[var(--secondary)]" },
                 { label: "Auth Mesh", status: "Operational", color: "text-[var(--secondary)]" },
                 { label: "Price Feeds", status: "Operational", color: "text-[var(--secondary)]" },
                 { label: "Seed Pool", status: "Low Availability", color: "text-orange-500" }
               ].map((sys, idx) => (
                 <div key={idx} className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                    <span className="text-sm font-bold text-gray-400">{sys.label}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${sys.color}`}>{sys.status}</span>
                 </div>
               ))}
            </div>
            <div className="mt-8 pt-4">
               <div className="flex items-center space-x-3 text-xs text-gray-500 font-bold bg-white/[0.03] p-4 rounded-xl">
                  <Activity className="w-4 h-4 text-[var(--secondary)]" />
                  <span>Uptime: 99.98% (Last 30 Days)</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
