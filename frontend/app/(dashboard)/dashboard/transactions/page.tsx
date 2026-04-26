"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  ExternalLink,
  Loader2,
  Filter,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const { data } = await api.get("/api/user/transactions");
        setTransactions(data);
      } catch (error) {
        toast.error("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTx();
  }, []);

  const filteredTx = transactions.filter((tx: any) => {
    if (filter === "all") return true;
    return tx.type === filter;
  });

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
         <div>
            <h1 className="text-4xl font-black mb-2">Transaction <span className="text-gradient">History</span></h1>
            <p className="text-gray-400">Complete audit trail of all deposits and withdrawals.</p>
         </div>
         <div className="flex items-center space-x-4">
            <div className="bg-white/[0.05] border border-white/10 p-1.5 rounded-2xl flex">
               {['all', 'deposit', 'withdrawal'].map(type => (
                 <button 
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${filter === type ? 'bg-[var(--primary)] text-[var(--background)] shadow-lg' : 'text-gray-500 hover:text-white'}`}
                 >
                    {type}
                 </button>
               ))}
            </div>
         </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/[0.05]">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.05] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                     <th className="px-8 py-6">Transaction ID / Hash</th>
                     <th className="px-6 py-6">Type</th>
                     <th className="px-6 py-6">Asset</th>
                     <th className="px-6 py-6">Amount</th>
                     <th className="px-6 py-6">Status</th>
                     <th className="px-8 py-6 text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.05]">
                  {filteredTx.length > 0 ? filteredTx.map((tx: any, idx) => (
                    <motion.tr 
                       key={tx.id}
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.03 }}
                       className="group hover:bg-white/[0.02]"
                    >
                       <td className="px-8 py-6">
                          <div className="flex flex-col">
                             <span className="font-mono text-xs text-gray-400">#{tx.id}</span>
                             {tx.tx_hash && (
                                <span className="text-[10px] text-gray-600 font-mono truncate max-w-[150px]">{tx.tx_hash}</span>
                             )}
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-bold ${tx.type === 'deposit' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                             {tx.type === 'deposit' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                             <span className="capitalize">{tx.type}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                             <img src={tx.coin.icon_url} className="w-6 h-6 rounded-full" alt={tx.coin.symbol} />
                             <span className="font-bold">{tx.coin.symbol}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6 font-mono font-bold">
                          {parseFloat(tx.amount).toFixed(tx.coin.symbol === 'USDT' ? 2 : 6)}
                       </td>
                       <td className="px-6 py-6">
                          <div className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'approved' ? 'text-[var(--secondary)]' : tx.status === 'pending' ? 'text-orange-500' : 'text-red-500'}`}>
                             {tx.status}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right text-xs text-gray-500 font-medium">
                          {new Date(tx.timestamp).toLocaleString()}
                       </td>
                    </motion.tr>
                  )) : (
                    <tr>
                       <td colSpan={6} className="px-8 py-20 text-center text-gray-500 font-medium italic">
                          No transactions found in this category.
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
      
      <div className="flex justify-center pt-6">
         <p className="text-xs text-gray-600 flex items-center space-x-2">
            <span>Only showing data for the current simulation session.</span>
            <ArrowRight className="w-3 h-3" />
            <Link href="/support" className="hover:underline text-gray-400">Need help?</Link>
         </p>
      </div>
    </div>
  );
}
