"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, 
  Search, 
  Trash2, 
  Loader2, 
  Wallet,
  Cpu,
  CheckCircle2,
  XCircle,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState([]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    coin_id: "",
    network: "",
    address: ""
  });

  const fetchData = async () => {
    try {
      const [walletsRes, coinsRes] = await Promise.all([
        api.get("/api/admin/wallets"),
        api.get("/api/admin/coins")
      ]);
      setWallets(walletsRes.data);
      setCoins(coinsRes.data);
    } catch (error) {
      toast.error("Failed to fetch address pool.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/admin/wallets", {
        coin_id: parseInt(formData.coin_id),
        network: formData.network,
        address: formData.address
      });
      toast.success("Wallet address added to pool!");
      setShowAdd(false);
      setFormData({ coin_id: "", network: "", address: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add address.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredWallets = wallets.filter(w => 
    w.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.network.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  return (
    <div className="space-y-10">
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
         <div className="flex items-center space-x-4">
            <div className="relative w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
               <input 
                  type="text" 
                  placeholder="Search addresses..." 
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <button 
               onClick={() => setShowAdd(true)}
               className="btn-primary flex items-center space-x-2 py-2.5 px-6"
            >
               <Plus className="w-4 h-4" />
               <span className="text-xs">Add Address</span>
            </button>
         </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.05] text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                     <th className="px-8 py-6">Coin</th>
                     <th className="px-6 py-6">Network</th>
                     <th className="px-6 py-6 font-mono">Wallet Address</th>
                     <th className="px-6 py-6">Assignment Status</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.05]">
                  {filteredWallets.map((wallet, idx) => (
                    <motion.tr 
                       key={wallet.id}
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.02 }}
                       className="group hover:bg-white/[0.01]"
                    >
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[var(--primary)] text-xs font-bold">#{wallet.coin_id}</div>
                             <span className="font-bold text-sm">Asset ID #{wallet.coin_id}</span>
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

      {/* Add Address Modal */}
      <AnimatePresence>
         {showAdd && (
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
                className="glass-card w-full max-w-md p-10 rounded-[3rem]"
              >
                 <h3 className="text-2xl font-black mb-6">Seed <span className="text-gradient">Address</span></h3>
                 <form onSubmit={handleAddAddress} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Coin</label>
                       <select 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         value={formData.coin_id}
                         onChange={(e) => setFormData({...formData, coin_id: e.target.value})}
                       >
                          <option value="">Choose asset</option>
                          {coins.map(c => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
                       </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Compatible Network</label>
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         placeholder="e.g. TRC-20"
                         value={formData.network}
                         onChange={(e) => setFormData({...formData, network: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Public Address (Hex)</label>
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold font-mono"
                         placeholder="0x..."
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                       />
                    </div>

                    <div className="flex space-x-4">
                       <button 
                        type="button"
                        onClick={() => setShowAdd(false)}
                        className="flex-1 bg-white/[0.05] py-4 rounded-2xl text-sm font-bold hover:bg-white/[0.1] transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                        type="submit"
                        disabled={submitting}
                        className="flex-1 btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center"
                       >
                          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Add to Pool"}
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
