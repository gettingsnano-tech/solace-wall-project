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
  ArrowRight,
  Repeat
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Link from "next/link";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedTx, setExpandedTx] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, swapRes] = await Promise.all([
          api.get("/api/user/transactions"),
          api.get("/api/user/swaps")
        ]);
        setTransactions(txRes.data);
        setSwaps(swapRes.data);
      } catch (error) {
        toast.error("Failed to load transaction history.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const merged = [
    ...transactions.map(tx => ({ ...tx, isSwap: false })),
    ...swaps.map(s => ({ 
      ...s, 
      type: 'swap', 
      isSwap: true, 
      timestamp: s.created_at,
      coin: s.from_coin // Primary coin for the icon in list
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredTx = merged.filter((tx: any) => {
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
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
         <div>
            <h1 className="text-3xl lg:text-4xl font-black mb-2">Transaction <span className="text-gradient">History</span></h1>
            <p className="text-gray-400 text-sm lg:text-base">Complete audit trail of all deposits, withdrawals, and swaps.</p>
         </div>
         <div className="flex items-center w-full lg:w-auto">
            <div className="bg-white/[0.05] border border-white/10 p-1 lg:p-1.5 rounded-xl lg:rounded-2xl flex overflow-x-auto w-full no-scrollbar">
               {['all', 'deposit', 'withdrawal', 'swap'].map(type => (
                 <button 
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-3 lg:px-4 py-2 text-[10px] lg:text-xs font-bold uppercase tracking-widest rounded-lg lg:rounded-xl transition-all whitespace-nowrap flex-1 lg:flex-none ${filter === type ? 'bg-[var(--primary)] text-[var(--background)] shadow-lg' : 'text-gray-500 hover:text-white'}`}
                 >
                    {type}
                 </button>
               ))}
            </div>
         </div>
      </div>

      <div className="glass-card rounded-[1.5rem] lg:rounded-[2.5rem] overflow-hidden border-white/[0.05]">
         <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left min-w-[700px] lg:min-w-0">
               <thead>
                  <tr className="border-b border-white/[0.05] text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                     <th className="px-6 lg:px-8 py-4 lg:py-6">Transaction ID</th>
                     <th className="px-4 lg:px-6 py-4 lg:py-6">Type</th>
                     <th className="px-4 lg:px-6 py-4 lg:py-6">Asset / Conversion</th>
                     <th className="px-4 lg:px-6 py-4 lg:py-6">Amount / Detail</th>
                     <th className="px-4 lg:px-6 py-4 lg:py-6">Status</th>
                     <th className="px-6 lg:px-8 py-4 lg:py-6 text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.05]">
                  {filteredTx.length > 0 ? filteredTx.map((tx: any, idx) => {
                    const txKey = tx.isSwap ? `swap-${tx.id}` : `tx-${tx.id}`;
                    return (
                     <React.Fragment key={txKey}>
                      <motion.tr 
                         initial={{ opacity: 0, y: 5 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: idx * 0.03 }}
                         className="group hover:bg-white/[0.02] cursor-pointer"
                         onClick={() => setExpandedTx(expandedTx === txKey ? null : txKey)}
                      >
                         <td className="px-6 lg:px-8 py-4 lg:py-6">
                            <div className="flex flex-col">
                               <span className="font-mono text-[10px] lg:text-xs text-gray-400">#{tx.id}</span>
                               {tx.tx_hash && (
                                  <span className="text-[9px] lg:text-[10px] text-gray-600 font-mono truncate max-w-[100px] lg:max-w-[150px]">{tx.tx_hash}</span>
                               )}
                            </div>
                         </td>
                         <td className="px-4 lg:px-6 py-4 lg:py-6">
                            <div className={`inline-flex items-center space-x-1.5 lg:space-x-2 px-2 lg:px-3 py-1 rounded-lg text-[10px] lg:text-xs font-bold ${
                              tx.type === 'deposit' ? 'text-green-500 bg-green-500/10' : 
                              tx.type === 'withdrawal' ? 'text-red-500 bg-red-500/10' : 
                              'text-[var(--primary)] bg-[var(--primary)]/10'
                            }`}>
                               {tx.type === 'deposit' ? <ArrowDownLeft className="w-3 h-3" /> : 
                                tx.type === 'withdrawal' ? <ArrowUpRight className="w-3 h-3" /> : 
                                <Repeat className="w-3 h-3" />}
                               <span className="capitalize">{tx.type}</span>
                            </div>
                         </td>
                         <td className="px-4 lg:px-6 py-4 lg:py-6">
                            {tx.isSwap ? (
                              <div className="flex items-center space-x-2">
                                 <span className="font-bold text-xs lg:text-sm">{tx.from_coin?.symbol || "???"}</span>
                                 <ArrowRight className="w-3 h-3 text-gray-600" />
                                 <span className="font-bold text-xs lg:text-sm text-[var(--primary)]">{tx.to_coin?.symbol || "???"}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 lg:space-x-3">
                                 <img src={tx.coin?.icon_url || "/placeholder-coin.png"} className="w-5 h-5 lg:w-6 lg:h-6 rounded-full" alt={tx.coin?.symbol || "Coin"} />
                                 <span className="font-bold text-xs lg:text-sm">{tx.coin?.symbol || "???"}</span>
                              </div>
                            )}
                         </td>
                         <td className="px-4 lg:px-6 py-4 lg:py-6 font-mono font-bold text-xs lg:text-sm">
                             {tx.isSwap ? (
                              <div className="space-y-0.5">
                                 <div className="text-red-500 text-[10px] lg:text-xs">-{parseFloat(tx.from_amount).toFixed(8)} {tx.from_coin?.symbol || ""}</div>
                                 <div className="text-green-500 text-[10px] lg:text-xs">+{parseFloat(tx.to_amount).toFixed(8)} {tx.to_coin?.symbol || ""}</div>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                 <div className="font-mono">{parseFloat(tx.amount).toFixed(tx.coin?.symbol === 'USDT' ? 2 : 6)}</div>
                                 {tx.type === 'withdrawal' && tx.to_address && (
                                    <div className="text-[9px] lg:text-[10px] text-gray-500 font-mono break-all max-w-[150px] lg:max-w-[200px] leading-tight">
                                       To: {tx.to_address}
                                    </div>
                                 )}
                              </div>
                            )}
                         </td>
                         <td className="px-4 lg:px-6 py-4 lg:py-6">
                            <div className={`text-[9px] lg:text-[10px] font-black uppercase tracking-widest ${
                              tx.status === 'approved' || tx.status === 'completed' ? 'text-[var(--secondary)]' : 
                              tx.status === 'pending' ? 'text-orange-500' : 
                              'text-red-500'
                            }`}>
                               {tx.status}
                            </div>
                         </td>
                         <td className="px-6 lg:px-8 py-4 lg:py-6 text-right text-[10px] lg:text-xs text-gray-500 font-medium">
                            <div className="flex flex-col lg:items-end">
                              <span>{new Date(tx.timestamp).toLocaleDateString()}</span>
                              <span className="text-[9px] opacity-60">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                         </td>
                      </motion.tr>
                      <AnimatePresence>
                        {expandedTx === txKey && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-white/[0.01]"
                          >
                            <td colSpan={6} className="px-6 lg:px-8 py-4 lg:py-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <div className="space-y-2">
                                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Transaction Details</p>
                                  <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                    <span className="text-gray-400">Transaction ID</span>
                                    <span className="font-mono">{tx.id}</span>
                                  </div>
                                  {tx.tx_hash && (
                                    <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                      <span className="text-gray-400">Tx Hash / Explorer</span>
                                      <span className="font-mono text-[var(--primary)] truncate ml-4 break-all">{tx.tx_hash}</span>
                                    </div>
                                  )}
                                  {tx.isSwap ? (
                                    <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                      <span className="text-gray-400">Conversion Rate</span>
                                      <span className="font-mono">1 {tx.from_coin?.symbol} &approx; {tx.from_amount && tx.to_amount ? (tx.to_amount / tx.from_amount).toFixed(4) : "0"} {tx.to_coin?.symbol}</span>
                                    </div>
                                  ) : (
                                    tx.network && (
                                      <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                        <span className="text-gray-400">Network</span>
                                        <span className="font-mono uppercase text-[var(--secondary)]">{tx.network}</span>
                                      </div>
                                    )
                                  )}
                                </div>
                                <div className="space-y-2">
                                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Financial Breakdown</p>
                                  {tx.isSwap ? (
                                    <>
                                      <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                        <span className="text-gray-400">Fee (USD)</span>
                                        <span className="font-mono text-red-500">-${Number(tx.fee_usd || 0).toFixed(2)}</span>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                        <span className="text-gray-400">Amount</span>
                                        <span className="font-mono">{parseFloat(tx.amount).toFixed(8)} {tx.coin?.symbol}</span>
                                      </div>
                                      {tx.type === 'withdrawal' && tx.to_address && (
                                        <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                          <span className="text-gray-400">Destination</span>
                                          <span className="font-mono text-gray-300 break-all ml-4 text-right">{tx.to_address}</span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                  <div className="flex justify-between bg-[#0A0E1A] p-3 rounded-xl border border-white/5">
                                    <span className="text-gray-400">Timestamp</span>
                                    <span className="font-mono">{new Date(tx.timestamp).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                     </React.Fragment>
                    );
                  }) : (
                    <tr>
                       <td colSpan={6} className="px-8 py-20 text-center text-gray-500 text-sm font-medium italic">
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
            <span>Verified by Core Capital Secure Ledger.</span>
            <ArrowRight className="w-3 h-3" />
            <Link href="/support" className="hover:underline text-gray-400">Need help?</Link>
         </p>
      </div>
    </div>
  );
}
