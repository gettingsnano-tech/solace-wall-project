"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Filter,
  ArrowRight,
  Clock,
  User,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminWithdrawalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processing, setProcessing] = useState<number | string | null>(null);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/api/admin/withdrawals");
      setRequests(data);
    } catch (error) {
      toast.error("Failed to load withdrawals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: number | string, action: string) => {
    setProcessing(id);
    try {
      await api.put(`/api/admin/withdrawals/${id}/${action}`);
      toast.success(`Withdrawal ${action}ed successfully.`);
      fetchRequests();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || `Failed to ${action} withdrawal.`);
    } finally {
      setProcessing(null);
    }
  };

  const filteredRequests = requests.filter((r: any) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-orange-500">
               <Clock className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-black mb-1">Withdrawal <span className="text-gradient">Queue</span></h1>
               <p className="text-gray-400 text-sm">Review and authorize pending withdrawal requests.</p>
            </div>
         </div>
         <div className="bg-white/[0.05] border border-white/10 p-1.5 rounded-2xl flex">
            {['pending', 'approved', 'rejected', 'all'].map(s => (
              <button 
                key={s} 
                onClick={() => setFilter(s)}
                className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filter === s ? 'bg-white/10 text-[var(--primary)] shadow-xl' : 'text-gray-500 hover:text-white'}`}
              >
                 {s}
              </button>
            ))}
         </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.05] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                     <th className="px-8 py-6">User Info</th>
                     <th className="px-6 py-6">Asset & Network</th>
                     <th className="px-6 py-6">Amount</th>
                     <th className="px-8 py-6">Destination Address</th>
                     <th className="px-6 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.05]">
                  {filteredRequests.length > 0 ? filteredRequests.map((req: any, idx) => (
                    <motion.tr 
                       key={req.id}
                       initial={{ opacity: 0, scale: 0.98 }}
                       animate={{ opacity: 1, scale: 1 }}
                       transition={{ delay: idx * 0.05 }}
                       className="group hover:bg-white/[0.01]"
                    >
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center font-bold text-xs uppercase">U{req.id}</div>
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-300">User ID: #{req.user_id}</span>
                                <span className="text-[10px] text-gray-600 font-medium">{new Date(req.created_at).toLocaleString()}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center space-x-3">
                             <img src={req.coin.icon_url} alt={req.coin.symbol} className="w-6 h-6 rounded-full" />
                             <div className="flex flex-col">
                                <span className="text-xs font-bold text-white tracking-widest uppercase">{req.coin.symbol}</span>
                                <span className="text-[9px] font-black uppercase text-[var(--secondary)] tracking-widest">{req.network}</span>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-white">{parseFloat(req.amount).toFixed(4)} {req.coin.symbol}</span>
                             <span className="text-[10px] text-gray-500 font-bold tracking-tighter">≈ $0.00 Demo</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-2 bg-black/20 p-2.5 rounded-xl border border-white/5 max-w-[200px]">
                             <span className="font-mono text-[10px] text-gray-400 truncate tracking-tight">{req.to_address}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end space-x-3">
                               <button 
                                 onClick={() => handleAction(req.id, "reject")}
                                 disabled={processing === req.id}
                                 className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                               >
                                  <XCircle className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleAction(req.id, "approve")}
                                 disabled={processing === req.id}
                                 className="p-2.5 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-xl hover:bg-[var(--secondary)] hover:text-[var(--background)] transition-all shadow-lg shadow-[var(--secondary)]/10"
                               >
                                  <CheckCircle2 className="w-4 h-4" />
                               </button>
                            </div>
                          ) : (
                            <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${req.status === 'approved' ? 'text-[var(--secondary)]' : 'text-red-500'}`}>
                               {req.status}
                            </div>
                          )}
                       </td>
                    </motion.tr>
                  )) : (
                    <tr>
                       <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-medium italic">
                          Everything is clear! No withdrawal requests in this status.
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div className="flex items-center justify-between p-10 glass-card rounded-[2.5rem]">
         <div className="flex items-center space-x-4 text-[var(--secondary)]">
            <ShieldCheck className="w-8 h-8" />
            <div>
               <h4 className="font-bold">Security Enforcement</h4>
               <p className="text-xs text-gray-500">Every approval triggers an internal transaction broadcast simulator.</p>
            </div>
         </div>
         <div className="hidden md:block">
            <p className="text-xs font-black text-gray-700 uppercase tracking-[0.3em]">CORE CAPITAL SELECTION PANEL</p>
         </div>
      </div>
    </div>
  );
}
