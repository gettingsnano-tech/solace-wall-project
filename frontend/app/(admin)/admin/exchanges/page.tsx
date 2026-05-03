"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, 
  Trash2, 
  Loader2, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Globe,
  X,
  ToggleLeft,
  ToggleRight,
  Save,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Exchange {
  id: number;
  name: string;
  url: string;
  icon_url: string;
  is_active: boolean;
}

export default function AdminExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [editExchange, setEditExchange] = useState<Exchange | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", url: "", icon_url: "", is_active: true });

  const [formData, setFormData] = useState({
    name: "",
    url: "",
    icon_url: ""
  });

  const fetchExchanges = async () => {
    try {
      const { data } = await api.get("/api/admin/exchanges");
      setExchanges(data);
    } catch (error) {
       setExchanges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchanges();
  }, []);

  const openEditModal = (exchange: Exchange) => {
    setEditExchange(exchange);
    setEditForm({ 
      name: exchange.name,
      url: exchange.url,
      icon_url: exchange.icon_url || "", 
      is_active: exchange.is_active 
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editExchange) return;
    setEditLoading(true);
    try {
      await api.patch(`/api/admin/exchanges/${editExchange.id}`, editForm);
      toast.success("Exchange updated successfully!");
      setEditExchange(null);
      fetchExchanges();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update exchange.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/admin/exchanges", formData);
      toast.success("Exchange added successfully!");
      setShowAdd(false);
      setFormData({ name: "", url: "", icon_url: "" });
      fetchExchanges();
    } catch (error) {
      toast.error("Failed to add exchange.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExchange = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exchange?")) return;
    try {
      await api.delete(`/api/admin/exchanges/${id}`);
      toast.success("Exchange deleted");
      fetchExchanges();
    } catch (error) {
      toast.error("Failed to delete exchange");
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
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
         <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--primary)]">
               <Globe className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-3xl font-black mb-1">External <span className="text-gradient">Exchanges</span></h1>
               <p className="text-gray-400 text-sm">Manage platforms where users can buy cryptocurrency.</p>
            </div>
         </div>
         <button 
           onClick={() => setShowAdd(true)}
           className="btn-primary flex items-center space-x-2"
         >
            <Plus className="w-5 h-5" />
            <span>Add New Exchange</span>
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {exchanges.map((exchange, idx) => (
            <motion.div 
               key={exchange.id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.05 }}
               className="glass-card p-8 rounded-[2.5rem] relative group border-white/5"
            >
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                     <div className="w-14 h-14 bg-white/[0.05] rounded-2xl p-2.5 overflow-hidden border border-white/5">
                        <img src={exchange.icon_url} alt={exchange.name} className="w-full h-full object-contain" />
                     </div>
                     <div>
                        <h3 className="text-xl font-black">{exchange.name}</h3>
                        <p className="text-xs text-gray-500 font-medium truncate max-w-[150px]">{exchange.url}</p>
                     </div>
                  </div>
                  <div className={`p-1.5 rounded-lg ${exchange.is_active ? 'bg-[var(--secondary)]/10 text-[var(--secondary)]' : 'bg-red-500/10 text-red-500'}`}>
                     {exchange.is_active ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
               </div>
               
               <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => openEditModal(exchange)}
                    className="flex-1 bg-white/[0.05] hover:bg-white/[0.1] text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                     <Edit2 className="w-4 h-4" />
                     <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteExchange(exchange.id)}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all"
                  >
                     <Trash2 className="w-4 h-4" />
                  </button>
                  <a 
                    href={exchange.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] rounded-xl transition-all"
                  >
                     <ExternalLink className="w-4 h-4" />
                  </a>
               </div>
            </motion.div>
         ))}
      </div>

      {/* Add Modal */}
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
                 <h3 className="text-2xl font-black mb-6">Add <span className="text-gradient">Exchange</span></h3>
                 <form onSubmit={handleAddExchange} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exchange Name</label>
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         placeholder="e.g. Binance"
                         value={formData.name}
                         onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Website URL</label>
                       <input 
                         type="url" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         placeholder="https://..."
                         value={formData.url}
                         onChange={(e) => setFormData({...formData, url: e.target.value})}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Icon URL</label>
                       <input 
                         type="text" 
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         placeholder="https://.../logo.png"
                         value={formData.icon_url}
                         onChange={(e) => setFormData({...formData, icon_url: e.target.value})}
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
                          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Exchange"}
                       </button>
                    </div>
                 </form>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
         {editExchange && (
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
                    <h3 className="text-2xl font-black">Edit <span className="text-gradient">Exchange</span></h3>
                    <button
                      onClick={() => setEditExchange(null)}
                      className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                 </div>

                 <form onSubmit={handleSaveEdit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exchange Name</label>
                       <input
                         type="text"
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         value={editForm.name}
                         onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Website URL</label>
                       <input
                         type="url"
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         value={editForm.url}
                         onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Icon URL</label>
                       <input
                         type="text"
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-mono"
                         value={editForm.icon_url}
                         onChange={(e) => setEditForm({ ...editForm, icon_url: e.target.value })}
                       />
                    </div>

                    <div className="flex items-center justify-between bg-white/[0.03] p-5 rounded-2xl border border-white/[0.05]">
                       <div>
                          <p className="font-bold text-sm">Active Status</p>
                          <p className="text-xs text-gray-500 mt-0.5">Visible to users on Buy Crypto page</p>
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
                         onClick={() => setEditExchange(null)}
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
    </div>
  );
}
