"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { useLivePrices } from "@/hooks/useLivePrices";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Loader2,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Live price polling — updates every 60 seconds
  const { prices, lastUpdated } = useLivePrices();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balRes, txRes, statsRes] = await Promise.all([
          api.get("/api/user/balances"),
          api.get("/api/user/transactions"),
          api.get("/api/public/stats")
        ]);
        setBalances(balRes.data);
        setTransactions(txRes.data.slice(0, 5));
        setPlatformStats(statsRes.data);
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

  const getCoinPrice = (symbol: string): number => prices[symbol.toUpperCase()] ?? 0;

  const totalBalance = balances.reduce((sum, b: any) => {
    return sum + (parseFloat(b.amount) * getCoinPrice(b?.coin?.symbol || ""));
  }, 0);

  return (
    <div className="space-y-6 lg:space-y-10">
      {/* Portfolio Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="lg:col-span-2 glass-card p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)] opacity-[0.05] blur-[80px] rounded-full pointer-events-none"></div>
            
            {/* Live indicator */}
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex items-center space-x-1.5 bg-[var(--secondary)]/10 border border-[var(--secondary)]/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[var(--secondary)]">Live Prices</span>
              </div>
              {lastUpdated && (
                <span className="text-[9px] text-gray-600">
                  updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>

            <p className="text-gray-400 font-bold text-[10px] lg:text-xs uppercase tracking-widest mb-2">Total Portfolio Value</p>
            <h1 className="text-3xl lg:text-5xl font-black mb-6 lg:mb-8">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm font-bold text-gray-500 ml-2">USD</span>
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
               <Link href="/dashboard/withdraw" className="btn-primary py-3 px-8 flex items-center justify-center space-x-2 w-full sm:w-auto">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>Withdraw</span>
               </Link>
               <Link href="/dashboard/wallet" className="btn-secondary py-3 px-8 flex items-center justify-center space-x-2 w-full sm:w-auto">
                  <Plus className="w-5 h-5" />
                  <span>Generate Wallet</span>
               </Link>
            </div>
         </motion.div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
            <div className="glass-card p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] flex items-center space-x-4 lg:space-x-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
                   <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <div>
                   <h4 className="font-bold text-sm lg:text-base">Security Level</h4>
                   <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{platformStats?.encryption ? `High (${platformStats.encryption})` : 'High (Encrypted)'}</p>
                </div>
            </div>
            <div className="glass-card p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] flex items-center space-x-4 lg:space-x-6">
                <div className="w-10 h-10 lg:w-14 lg:h-14 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0">
                   <Zap className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <div>
                   <h4 className="font-bold text-sm lg:text-base">Network Status</h4>
                   <p className="text-[10px] text-[var(--secondary)] font-bold uppercase tracking-widest mt-1">{platformStats?.uptime === '99.99%' ? 'Operational' : platformStats?.uptime || 'Operational'}</p>
                </div>
            </div>
            {/* KYC Status Shortcut */}
            <Link href="/dashboard/profile" className="glass-card p-5 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] flex items-center space-x-4 lg:space-x-6 hover:bg-white/[0.03] transition-colors">
                <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center shrink-0 ${
                  user?.kyc_status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                  user?.kyc_status === 'pending' ? 'bg-orange-500/10 text-orange-500' : 
                  'bg-red-500/10 text-red-500'
                }`}>
                   <ShieldCheck className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <div>
                   <h4 className="font-bold text-sm lg:text-base">Identity Verification</h4>
                   <p className="text-[10px] font-bold uppercase tracking-widest mt-1">
                      Status: <span className={
                        user?.kyc_status === 'approved' ? 'text-green-500' : 
                        user?.kyc_status === 'pending' ? 'text-orange-500' : 
                        'text-red-500'
                      }>{user?.kyc_status?.replace('_', ' ') || 'Not Verified'}</span>
                   </p>
                </div>
            </Link>
         </div>
      </div>

      {/* Assets Grid */}
      <div>
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-xl lg:text-2xl font-bold">Your Assets</h3>
          <Link href="/dashboard/wallet" className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {balances.length > 0 ? balances.map((bal: any, idx) => {
            const price = getCoinPrice(bal.coin.symbol);
            const usdValue = parseFloat(bal.amount) * price;
            const isStable = bal.coin.symbol.toUpperCase() === 'USDT';
            return (
              <motion.div 
                 key={idx}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.1 }}
                 className="glass-card p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] hover:scale-[1.02] transition-all"
              >
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex items-center space-x-3 lg:space-x-4">
                        <img src={bal.coin?.icon_url || "/placeholder-coin.png"} alt={bal.coin?.name || "Coin"} className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
                        <div>
                           <div className="font-bold text-sm lg:text-base">{bal.coin?.name || "Unknown"}</div>
                           <div className="text-[10px] lg:text-xs text-gray-400 uppercase">{bal.coin?.symbol || "???"}</div>
                        </div>
                     </div>
                    {price > 0 && (
                      <div className="text-right">
                         <div className="text-[10px] font-black text-gray-400">
                          ${price >= 1 
                            ? price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                            : price.toFixed(6)}
                        </div>
                        <div className="text-[9px] text-gray-600 font-bold uppercase tracking-wider">per {bal.coin?.symbol || "asset"}</div>
                      </div>
                    )}
                 </div>
                 <div className="space-y-1">
                    <div className="text-xl lg:text-2xl font-black">
                      {parseFloat(bal.amount).toFixed(isStable ? 2 : 6)} {bal.coin.symbol}
                    </div>
                    <div className="text-xs lg:text-sm font-bold text-[var(--secondary)]">
                      ≈ ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                    </div>
                 </div>
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-12 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem]">
               <p className="text-gray-500 text-sm">No assets found. Start by generating a wallet address.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex justify-between items-center mb-6 px-1">
          <h3 className="text-xl lg:text-2xl font-bold">Recent Activity</h3>
          <Link href="/dashboard/transactions" className="text-[10px] font-bold text-[var(--primary)] uppercase tracking-widest hover:underline">Full History</Link>
        </div>
        <div className="glass-card rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden">
          {transactions.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {transactions.map((tx: any, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 lg:p-6 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center space-x-3 lg:space-x-4">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4 lg:w-5 lg:h-5" /> : <ArrowUpRight className="w-4 h-4 lg:w-5 lg:h-5" />}
                    </div>
                     <div>
                      <div className="font-bold text-sm lg:text-base capitalize">{tx.type} {tx.coin?.symbol || ""}</div>
                      <div className="text-[10px] lg:text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                     <div className={`font-bold text-sm lg:text-base ${tx.type === 'deposit' ? 'text-green-500' : 'text-red-500'}`}>
                       {tx.type === 'deposit' ? '+' : '-'}{parseFloat(tx.amount).toFixed(4)} {tx.coin?.symbol || ""}
                    </div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{tx.status}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-sm font-medium italic">No recent transactions.</div>
          )}
        </div>
      </div>
    </div>
  );
}
