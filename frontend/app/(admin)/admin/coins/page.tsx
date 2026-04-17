"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, 
  Settings, 
  Trash2, 
  Loader2, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminCoinsPage() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    icon: null
  });

  const fetchCoins = async () => {
    try {
      const { data } = await api.get("/api/admin/coins");
      setCoins(data);
    } catch (error) {
       // On first load, coins might not be initialized if seed failed or data is fresh
       setCoins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, icon: e.target.files[0] });
    }
  };

  const handleAddCoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("symbol", formData.symbol);
    if (formData.icon) {
      data.append("icon", formData.icon);
    }

    try {
      await api.post("/api/admin/coins", data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Coin added successfully!");
      setShowAdd(false);
      setFormData({ name: "", symbol: "", icon: null });
      fetchCoins();
    } catch (error) {
      toast.error("Failed to add coin.");
    } finally {
      setSubmitting(false);
    }
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
      <div className="flex justify-between items-center">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--primary)]">
               <Coins className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-black mb-1">Asset <span className="text-gradient">Portfolio</span></h1>
               <p className="text-gray-400 text-sm">Configure cryptocurrencies supported by the platform.</p>
            </div>
         </div>
         <button 
           onClick={() => setShowAdd(true)}
           className="btn-primary flex items-center space-x-2"
         >
            <Plus className="w-5 h-5" />
            <span>Add New Coin</span>
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {coins.map((coin, idx) => (
            <motion.div 
               key={coin.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="glass-card p-10 rounded-[2.5rem] relative group border-white/5"
            >
               <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-6">
                     <div className="w-16 h-16 bg-white/[0.05] rounded-2xl p-2.5">
                        <img src={coin.icon_url} alt={coin.name} className="w-full h-full object-contain" />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black">{coin.name}</h3>
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{coin.symbol}</p>
                     </div>
                  </div>
                  <div className={`p-1.5 rounded-lg ${coin.is_active ? 'bg-[var(--secondary)]/10 text-[var(--secondary)]' : 'bg-red-500/10 text-red-500'}`}>
                     {coin.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <button className="bg-white/[0.05] hover:bg-white/[0.1] py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2">
                     <Settings className="w-4 h-4" />
                     <span>Edit</span>
                  </button>
                  <button className="bg-red-500/5 hover:bg-red-500/10 text-red-500 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2">
                     <Trash2 className="w-4 h-4" />
                     <span>Disable</span>
                  </button>
               </div>
            </motion.div>
         ))}
      </div>

      {/* Add Coin Modal */}
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
                 <h3 className="text-2xl font-black mb-6">Add <span className="text-gradient">Asset</span></h3>
                 <form onSubmit={handleAddCoin} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coin Name</label>
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         placeholder="e.g. Cardano"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Symbol</label>
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold uppercase"
                         placeholder="e.g. ADA"
                         value={formData.symbol}
                         onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coin Icon</label>
                       <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-[var(--primary)]/50 transition-colors group">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleFileChange}
                          />
                          <div className="flex flex-col items-center justify-center text-center">
                             <ImageIcon className="w-8 h-8 text-gray-500 mb-2 group-hover:text-[var(--primary)] transition-colors" />
                             <p className="text-xs font-bold text-gray-500">{formData.icon ? (formData.icon as any).name : "Select Image File"}</p>
                          </div>
                       </div>
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
                          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Coin"}
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
