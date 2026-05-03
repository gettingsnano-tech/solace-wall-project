"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  RefreshCcw, 
  Loader2, 
  Search,
  ArrowRight,
  User,
  Calendar,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";

interface SwapRecord {
  id: number;
  user: {
    email: string;
    full_name: string;
  };
  from_coin: {
    name: string;
    symbol: string;
    icon_url: string;
  };
  to_coin: {
    name: string;
    symbol: string;
    icon_url: string;
  };
  from_amount: number;
  to_amount: number;
  fee_usd: number;
  status: string;
  created_at: string;
}

export default function AdminSwapsPage() {
  const [swaps, setSwaps] = useState<SwapRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchSwaps = async () => {
    try {
      const { data } = await api.get("/api/admin/swaps");
      setSwaps(data);
    } catch (error) {
       setSwaps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const filteredSwaps = swaps.filter(s => 
    s.user.email.toLowerCase().includes(search.toLowerCase()) ||
    s.user.full_name.toLowerCase().includes(search.toLowerCase()) ||
    s.from_coin.symbol.toLowerCase().includes(search.toLowerCase()) ||
    s.to_coin.symbol.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--primary)]">
               <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-black mb-1">Swap <span className="text-gradient">History</span></h1>
               <p className="text-gray-400 text-sm">Monitor all asset conversions across the platform.</p>
            </div>
         </div>
         
         <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[var(--primary)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search by user or coin..." 
              className="bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-6 w-80 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden">
         <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-white/[0.02] border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">User / Time</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Conversion</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount Pairs</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Fee (USD)</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {filteredSwaps.map((swap, idx) => (
                  <motion.tr 
                     key={swap.id}
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ delay: idx * 0.02 }}
                     className="hover:bg-white/[0.01] transition-colors"
                  >
                     <td className="px-8 py-6">
                        <div className="flex items-center space-x-3 mb-1">
                           <User className="w-3.5 h-3.5 text-gray-500" />
                           <span className="font-bold text-sm">{swap.user.full_name}</span>
                        </div>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                           <Calendar className="w-3.5 h-3.5" />
                           <span>{new Date(swap.created_at).toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-gray-600 mt-1 font-mono">{swap.user.email}</div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center space-x-3">
                           <div className="flex items-center space-x-2 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
                              <img src={swap.from_coin.icon_url} alt={swap.from_coin.symbol} className="w-4 h-4 object-contain" />
                              <span className="text-xs font-black uppercase">{swap.from_coin.symbol}</span>
                           </div>
                           <ArrowRight className="w-4 h-4 text-gray-600" />
                           <div className="flex items-center space-x-2 bg-[var(--primary)]/10 px-3 py-1.5 rounded-xl border border-[var(--primary)]/10">
                              <img src={swap.to_coin.icon_url} alt={swap.to_coin.symbol} className="w-4 h-4 object-contain" />
                              <span className="text-xs font-black uppercase text-[var(--primary)]">{swap.to_coin.symbol}</span>
                           </div>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="space-y-1">
                           <p className="text-sm font-black">-{swap.from_amount} <span className="text-gray-500">{swap.from_coin.symbol}</span></p>
                           <p className="text-sm font-black text-[var(--secondary)]">+{swap.to_amount} <span className="text-gray-500">{swap.to_coin.symbol}</span></p>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <div className="flex items-center space-x-1 text-[var(--primary)] font-black">
                           <DollarSign className="w-4 h-4" />
                           <span>{swap.fee_usd.toFixed(2)}</span>
                        </div>
                     </td>
                     <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                           swap.status === 'completed' 
                              ? 'bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/20' 
                              : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                           {swap.status}
                        </span>
                     </td>
                  </motion.tr>
               ))}
            </tbody>
         </table>
         {filteredSwaps.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <RefreshCcw className="w-12 h-12 text-gray-700 mx-auto" />
               <p className="text-gray-500 font-bold">No swap records found</p>
            </div>
         )}
      </div>
    </div>
  );
}
