"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, 
  Search, 
  Trash2, 
  Loader2, 
  Hash,
  CheckCircle2,
  XCircle,
  BarChart3,
  X,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type PoolStat = {
  coin_id: number;
  coin_name: string;
  coin_symbol: string;
  network: string;
  total: number;
  used: number;
  available: number;
};

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [poolStats, setPoolStats] = useState<PoolStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filters
  const [filterCoinId, setFilterCoinId] = useState("");
  const [filterNetwork, setFilterNetwork] = useState("");

  // Bulk add form
  const [bulkForm, setBulkForm] = useState({
    coin_id: "",
    network: "",
    addresses: ""
  });

  const fetchData = async () => {
    try {
      const params: Record<string, any> = {};
      if (filterCoinId) params.coin_id = filterCoinId;
      if (filterNetwork) params.network = filterNetwork;

      const [walletsRes, coinsRes, statsRes] = await Promise.all([
        api.get("/api/admin/wallets", { params }),
        api.get("/api/admin/coins"),
        api.get("/api/admin/wallets/stats"),
      ]);
      setWallets(walletsRes.data);
      setCoins(coinsRes.data);
      setPoolStats(statsRes.data);
    } catch (error) {
      toast.error("Failed to fetch address pool.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCoinId, filterNetwork]);

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const lines = bulkForm.addresses
      .split("\n")
      .map((a) => a.trim())
      .filter(Boolean);
    if (lines.length === 0) {
      toast.error("No addresses entered.");
      setSubmitting(false);
      return;
    }
    try {
      const { data } = await api.post("/api/admin/wallets/bulk", {
        coin_id: parseInt(bulkForm.coin_id),
        network: bulkForm.network,
        addresses: lines,
      });
      toast.success(`${data.length} address(es) added to pool!`);
      setShowBulkAdd(false);
      setBulkForm({ coin_id: "", network: "", addresses: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add addresses.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWallets = wallets.filter((w: any) =>
    w.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.network.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const healthColor = (available: number, total: number) => {
    if (total === 0) return "text-gray-500 bg-gray-500/10";
    const pct = available / total;
    if (pct > 0.4) return "text-[var(--secondary)] bg-[var(--secondary)]/10";
    if (pct > 0.15) return "text-amber-400 bg-amber-400/10";
    return "text-red-400 bg-red-400/10";
  };

  const healthLabel = (available: number, total: number) => {
    if (total === 0) return "Empty";
    const pct = available / total;
    if (pct > 0.4) return "Healthy";
    if (pct > 0.15) return "Low";
    return "Critical";
  };

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--secondary)]">
               <Hash className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-black mb-1">Address <span className="text-gradient">Pool</span></h1>
               <p className="text-gray-400 text-sm">Pre-seeded wallet addresses available for user assignment.</p>
            </div>
         </div>
         <button 
            onClick={() => setShowBulkAdd(true)}
            className="btn-primary flex items-center space-x-2 py-2.5 px-6"
         >
            <Upload className="w-4 h-4" />
            <span className="text-xs">Bulk Import</span>
         </button>
      </div>

      {/* Pool Stats Cards */}
      {poolStats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {poolStats.map((stat, idx) => (
            <motion.div
              key={`${stat.coin_id}-${stat.network}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="glass-card rounded-[1.75rem] p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black text-sm">{stat.coin_name}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{stat.coin_symbol}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${healthColor(stat.available, stat.total)}`}>
                  {healthLabel(stat.available, stat.total)}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                  <span>{stat.network}</span>
                  <span>{stat.available} / {stat.total} free</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stat.total === 0
                        ? "w-0"
                        : stat.available / stat.total > 0.4
                        ? "bg-[var(--secondary)]"
                        : stat.available / stat.total > 0.15
                        ? "bg-amber-400"
                        : "bg-red-400"
                    }`}
                    style={{ width: stat.total > 0 ? `${(stat.available / stat.total) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <select
          className="bg-white/[0.05] border border-white/10 rounded-xl py-2.5 px-5 text-xs font-bold focus:outline-none focus:border-[var(--primary)]/50 appearance-none"
          value={filterCoinId}
          onChange={(e) => setFilterCoinId(e.target.value)}
        >
          <option value="">All Coins</option>
          {coins.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by network (e.g. ERC-20)"
          className="bg-white/[0.05] border border-white/10 rounded-xl py-2.5 px-5 text-xs font-bold focus:outline-none focus:border-[var(--primary)]/50 w-64"
          value={filterNetwork}
          onChange={(e) => setFilterNetwork(e.target.value)}
        />
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
             type="text" 
             placeholder="Search addresses..." 
             className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Address table */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.05] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                     <th className="px-8 py-6">Coin</th>
                     <th className="px-6 py-6">Network</th>
                     <th className="px-6 py-6 font-mono">Wallet Address</th>
                     <th className="px-6 py-6">Status</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.05]">
                  {filteredWallets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-12 text-center text-gray-600 font-bold text-sm">
                        No addresses found.
                      </td>
                    </tr>
                  ) : filteredWallets.map((wallet: any, idx) => (
                    <motion.tr 
                       key={wallet.id}
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.02 }}
                       className="group hover:bg-white/[0.01]"
                    >
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                             {wallet.coin?.icon_url ? (
                               <img src={`http://localhost:8000${wallet.coin.icon_url}`} alt={wallet.coin?.name} className="w-8 h-8 rounded-full object-contain bg-white/5 p-1" />
                             ) : (
                               <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--primary)] text-xs font-bold">#{wallet.coin_id}</div>
                             )}
                             <span className="font-bold text-sm">{wallet.coin?.name || `Asset #${wallet.coin_id}`}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <span className="bg-white/[0.05] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-[var(--secondary)] tracking-widest">{wallet.network}</span>
                       </td>
                       <td className="px-6 py-6">
                          <span className="font-mono text-xs text-gray-500 tracking-tighter">{wallet.address}</span>
                       </td>
                       <td className="px-6 py-6">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${wallet.is_used ? 'bg-red-500/10 text-red-500' : 'bg-[var(--secondary)]/10 text-[var(--secondary)]'}`}>
                             <div className={`w-1.5 h-1.5 rounded-full ${wallet.is_used ? 'bg-red-500' : 'bg-[var(--secondary)]'}`}></div>
                             <span>{wallet.is_used ? 'Used' : 'Available'}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button className="text-gray-600 hover:text-red-500 transition-colors">
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </td>
                    </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* ── Bulk Import Modal */}
      <AnimatePresence>
         {showBulkAdd && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-lg p-10 rounded-[3rem] space-y-6"
              >
                 <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black">Bulk <span className="text-gradient">Import</span></h3>
                    <button onClick={() => setShowBulkAdd(false)} className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1]">
                      <X className="w-5 h-5" />
                    </button>
                 </div>

                 <form onSubmit={handleBulkAdd} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Coin</label>
                       <select 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         value={bulkForm.coin_id}
                         onChange={(e) => setBulkForm({...bulkForm, coin_id: e.target.value})}
                       >
                          <option value="">Choose asset</option>
                          {coins.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network</label>
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         placeholder="e.g. TRC-20"
                         value={bulkForm.network}
                         onChange={(e) => setBulkForm({...bulkForm, network: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                         Addresses <span className="text-gray-600 normal-case font-normal">(one per line)</span>
                       </label>
                       <textarea 
                         required
                         rows={8}
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-mono resize-none"
                         placeholder={"0xABC123...\n0xDEF456...\n0xGHI789..."}
                         value={bulkForm.addresses}
                         onChange={(e) => setBulkForm({...bulkForm, addresses: e.target.value})}
                       />
                       <p className="text-[10px] text-gray-600 font-bold">
                         {bulkForm.addresses.split("\n").filter(l => l.trim()).length} address(es) detected
                       </p>
                    </div>

                    <div className="flex space-x-4">
                       <button 
                        type="button"
                        onClick={() => setShowBulkAdd(false)}
                        className="flex-1 bg-white/[0.05] py-4 rounded-2xl text-sm font-bold hover:bg-white/[0.1] transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                        type="submit"
                        disabled={submitting}
                        className="flex-1 btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2"
                       >
                          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-4 h-4" /><span>Import</span></>}
                       </button>
                    </div>
                 </form>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
