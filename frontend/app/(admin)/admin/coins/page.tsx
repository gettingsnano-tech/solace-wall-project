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
  Coins,
  Network,
  X,
  ToggleLeft,
  ToggleRight,
  Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

type CoinNetwork = {
  id: number;
  name: string;
  label: string;
  is_active: boolean;
};

export default function AdminCoinsPage() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Network modal state
  const [networkCoin, setNetworkCoin] = useState<any | null>(null);
  const [networks, setNetworks] = useState<CoinNetwork[]>([]);
  const [networksLoading, setNetworksLoading] = useState(false);
  const [networkForm, setNetworkForm] = useState({ name: "", label: "" });
  const [addingNetwork, setAddingNetwork] = useState(false);

  // Settings / Edit modal state
  const [editCoin, setEditCoin] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({ icon_url: "", is_active: true });

  const [formData, setFormData] = useState<{
    name: string;
    symbol: string;
    icon: File | null;
  }>({
    name: "",
    symbol: "",
    icon: null
  });

  const fetchCoins = async () => {
    try {
      const { data } = await api.get("/api/admin/coins");
      setCoins(data);
    } catch (error) {
       setCoins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  // ── Open edit/settings modal ──────────────────────────────────────────────
  const openEditModal = (coin: any) => {
    setEditCoin(coin);
    setEditForm({ icon_url: coin.icon_url || "", is_active: coin.is_active });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCoin) return;
    setEditLoading(true);
    try {
      await api.patch(`/api/admin/coins/${editCoin.id}`, editForm);
      toast.success("Coin updated successfully!");
      setEditCoin(null);
      fetchCoins();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update coin.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Fetch networks when modal opens ──────────────────────────────────────
  const openNetworkModal = async (coin: any) => {
    setNetworkCoin(coin);
    setNetworksLoading(true);
    try {
      const { data } = await api.get(`/api/admin/coins/${coin.id}/networks`);
      setNetworks(data);
    } catch {
      toast.error("Failed to load networks");
    } finally {
      setNetworksLoading(false);
    }
  };

  const handleAddNetwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!networkCoin) return;
    setAddingNetwork(true);
    try {
      await api.post(`/api/admin/coins/${networkCoin.id}/networks`, networkForm);
      toast.success("Network added!");
      setNetworkForm({ name: "", label: "" });
      const { data } = await api.get(`/api/admin/coins/${networkCoin.id}/networks`);
      setNetworks(data);
    } catch {
      toast.error("Failed to add network");
    } finally {
      setAddingNetwork(false);
    }
  };

  const handleDeleteNetwork = async (netId: number) => {
    if (!networkCoin) return;
    try {
      await api.delete(`/api/admin/networks/${netId}`);
      setNetworks((prev) => prev.filter((n) => n.id !== netId));
      toast.success("Network removed");
    } catch {
      toast.error("Failed to remove network");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
               
               <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => openNetworkModal(coin)}
                    className="col-span-2 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                     <Network className="w-4 h-4" />
                     <span>Manage Networks</span>
                  </button>
                  <button 
                    onClick={() => openEditModal(coin)}
                    title="Edit Coin Settings"
                    className="bg-white/[0.05] hover:bg-white/[0.1] py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                  >
                     <Settings className="w-4 h-4" />
                  </button>
               </div>
            </motion.div>
         ))}
      </div>

      {/* ── Add Coin Modal */}
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

      {/* ── Coin Settings / Edit Modal */}
      <AnimatePresence>
         {editCoin && (
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
                className="glass-card w-full max-w-md p-10 rounded-[3rem] space-y-8"
              >
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <img src={editCoin.icon_url} alt={editCoin.name} className="w-12 h-12 rounded-2xl" />
                       <div>
                          <h3 className="text-2xl font-black">{editCoin.name}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-black">{editCoin.symbol}</p>
                       </div>
                    </div>
                    <button
                      onClick={() => setEditCoin(null)}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                 </div>

                 <form onSubmit={handleSaveEdit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Icon URL</label>
                       <input
                         type="text"
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-mono"
                         placeholder="https://..."
                         value={editForm.icon_url}
                         onChange={(e) => setEditForm({ ...editForm, icon_url: e.target.value })}
                       />
                    </div>

                    <div className="flex items-center justify-between bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                       <div>
                          <p className="font-bold text-sm">Active Status</p>
                          <p className="text-xs text-gray-500 mt-0.5">Controls if this coin appears to users</p>
                       </div>
                       <button
                         type="button"
                         onClick={() => setEditForm({ ...editForm, is_active: !editForm.is_active })}
                         className={`transition-colors ${editForm.is_active ? 'text-[var(--secondary)]' : 'text-gray-600'}`}
                       >
                          {editForm.is_active 
                            ? <ToggleRight className="w-10 h-10" /> 
                            : <ToggleLeft className="w-10 h-10" />}
                       </button>
                    </div>

                    <div className="flex space-x-4">
                       <button
                         type="button"
                         onClick={() => setEditCoin(null)}
                         className="flex-1 bg-white/[0.05] py-4 rounded-2xl text-sm font-bold hover:bg-white/[0.1] transition-all"
                       >
                          Cancel
                       </button>
                       <button
                         type="submit"
                         disabled={editLoading}
                         className="flex-1 btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2"
                       >
                          {editLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /><span>Save Changes</span></>}
                       </button>
                    </div>
                 </form>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* ── Network Management Modal */}
      <AnimatePresence>
         {networkCoin && (
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
                className="glass-card w-full max-w-lg p-10 rounded-[3rem] space-y-8"
              >
                 {/* Header */}
                 <div className="flex items-center justify-between">
                    <div>
                       <h3 className="text-2xl font-black">
                          {networkCoin.name} <span className="text-gradient">Networks</span>
                       </h3>
                       <p className="text-xs text-gray-500 mt-1">Define deposit networks available for this coin.</p>
                    </div>
                    <button
                      onClick={() => setNetworkCoin(null)}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                 </div>

                 {/* Existing networks */}
                 <div className="space-y-3">
                    {networksLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                      </div>
                    ) : networks.length === 0 ? (
                      <div className="text-center py-8 text-gray-600 text-sm font-bold">No networks yet.</div>
                    ) : (
                      networks.map((net) => (
                        <div
                          key={net.id}
                          className="flex items-center justify-between bg-white/[0.03] rounded-2xl px-5 py-4 border border-white/[0.05]"
                        >
                          <div>
                            <p className="font-black text-sm">{net.name}</p>
                            <p className="text-xs text-gray-500">{net.label}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteNetwork(net.id)}
                            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                 </div>

                 {/* Add new network form */}
                 <form onSubmit={handleAddNetwork} className="space-y-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Add New Network</p>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder="Name (e.g. ERC-20)"
                        className="bg-[#0A0E1A] border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                        value={networkForm.name}
                        onChange={(e) => setNetworkForm({ ...networkForm, name: e.target.value })}
                      />
                      <input
                        type="text"
                        required
                        placeholder="Label (e.g. Ethereum)"
                        className="bg-[#0A0E1A] border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                        value={networkForm.label}
                        onChange={(e) => setNetworkForm({ ...networkForm, label: e.target.value })}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addingNetwork}
                      className="w-full btn-primary py-3 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2"
                    >
                      {addingNetwork ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /><span>Add Network</span></>}
                    </button>
                 </form>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
