"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const [balances, setBalances] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balRes, txRes] = await Promise.all([
          api.get("/api/user/balances"),
          api.get("/api/user/transactions")
        ]);
        setBalances(balRes.data);
        setTransactions(txRes.data.slice(0, 5)); // Only last 5
      } catch (error) {
        console.error("Dashboard data fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const totalBalance = balances.reduce((sum, b) => sum + (parseFloat(b.amount) * 65000), 0); // Simplified USD conversion

  return (
    <div className="space-y-10">
      {/* Portfolio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-[0.05] blur-[80px] rounded-full"></div>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">Total Portfolio Value</p>
            <h1 className="text-5xl font-black mb-8">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
            
            <div className="flex flex-wrap gap-4">
               <Link href="/dashboard/withdraw" className="btn-primary py-3 px-8 flex items-center space-x-2">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>Withdraw</span>
               </Link>
               <Link href="/dashboard/wallet" className="btn-secondary py-3 px-8 flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Generate Wallet</span>
               </Link>
            </div>
         </motion.div>

         <div className="space-y-6">
            <div className="glass-card p-8 rounded-[2rem] flex items-center space-x-6">
                <div className="w-14 h-14 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-2xl flex items-center justify-center">
                   <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="font-bold">Security Level</h4>
                   <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">High (Encrypted)</p>
                </div>
            </div>
            <div className="glass-card p-8 rounded-[2rem] flex items-center space-x-6">
                <div className="w-14 h-14 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center">
                   <Zap className="w-8 h-8" />
                </div>
                <div>
                   <h4 className="font-bold">Network Status</h4>
                   <p className="text-xs text-[var(--secondary)] font-bold uppercase tracking-widest mt-1">Operational</p>
                </div>
            </div>
         </div>
      </div>

      {/* Assets Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Your Assets</h3>
          <Link href="/dashboard/wallet" className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {balances.length > 0 ? balances.map((bal, idx) => (
            <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className="glass-card p-6 rounded-[2rem] hover:scale-[1.02] transition-all"
            >
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                     <img src={bal.coin.icon_url} alt={bal.coin.name} className="w-10 h-10 rounded-full" />
                     <div>
                        <div className="font-bold">{bal.coin.name}</div>
                        <div className="text-xs text-gray-400 uppercase">{bal.coin.symbol}</div>
                     </div>
                  </div>
                  <div className="text-[var(--secondary)] bg-[var(--secondary)]/10 px-2 py-1 rounded-lg text-xs font-bold">
                     +2.4%
                  </div>
               </div>
               <div className="space-y-1">
                  <div className="text-2xl font-black">{parseFloat(bal.amount).toFixed(bal.coin.symbol === 'USDT' ? 2 : 6)} {bal.coin.symbol}</div>
                  <div className="text-sm text-gray-500 font-medium">≈ ${(parseFloat(bal.amount) * 65000).toLocaleString()}</div>
               </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
               <p className="text-gray-500">No assets found. Start by generating a wallet address.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Recent Activity</h3>
          <Link href="/dashboard/transactions" className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">Full History</Link>
        </div>
        <div className="glass-card rounded-[2rem] overflow-hidden">
          {transactions.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {transactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="font-bold capitalize">{tx.type} {tx.coin.symbol}</div>
                      <div className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                       {tx.type === 'deposit' ? '+' : '-'}{parseFloat(tx.amount).toFixed(4)} {tx.coin.symbol}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">No recent transactions.</div>
          )}
        </div>
      </div>
    </div>
  );
}
