"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Settings, 
  Save, 
  Loader2, 
  Users, 
  DollarSign, 
  Shield, 
  Clock,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    users_offset: 0,
    assets_offset: 0,
    withdrawals_offset: 0,
    deposits_offset: 0,
    uptime_display: "99.99%",
    encryption_display: "256-bit"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await api.get("/api/admin/settings");
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load platform settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/admin/settings", settings);
      toast.success("Platform settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-center space-x-4">
         <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--primary)]">
            <Settings className="w-6 h-6" />
         </div>
         <div>
            <h1 className="text-3xl font-black mb-1">Platform <span className="text-gradient">Settings</span></h1>
            <p className="text-gray-400 text-sm">Configure social proof offsets and public display statistics.</p>
         </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] flex items-start space-x-4">
         <Info className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
         <div>
            <h4 className="font-bold text-amber-500 mb-1">Social Proof Configuration</h4>
            <p className="text-sm text-amber-200/70 leading-relaxed">
               The offsets defined below will be added to the actual database metrics when displayed on the landing page and user dashboards. 
               This allows you to simulate higher platform activity while maintaining real transaction integrity in the admin core.
            </p>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Offset */}
            <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                     <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">User Statistics</h3>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Registered Users Offset</label>
                  <input 
                    type="number"
                    name="users_offset"
                    value={settings.users_offset}
                    onChange={handleChange}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                    placeholder="e.g. 150000"
                  />
               </div>
            </div>

            {/* Assets Offset */}
            <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl flex items-center justify-center">
                     <DollarSign className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">Asset Statistics</h3>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Assets Secured ($)</label>
                  <input 
                    type="number"
                    name="assets_offset"
                    value={settings.assets_offset}
                    onChange={handleChange}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                    placeholder="e.g. 2400000000"
                  />
               </div>
            </div>

            {/* Withdrawal Offset */}
            <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                     <Clock className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">Withdrawal Statistics</h3>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending Withdrawals Offset</label>
                  <input 
                    type="number"
                    name="withdrawals_offset"
                    value={settings.withdrawals_offset}
                    onChange={handleChange}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                    placeholder="e.g. 45"
                  />
               </div>
            </div>

            {/* Deposits Offset */}
            <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-xl flex items-center justify-center">
                     <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">Volume Statistics</h3>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Platform Volume ($)</label>
                  <input 
                    type="number"
                    name="deposits_offset"
                    value={settings.deposits_offset}
                    onChange={handleChange}
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                    placeholder="e.g. 1250000"
                  />
               </div>
            </div>

            {/* Display Strings */}
            <div className="glass-card p-8 rounded-[2.5rem] space-y-6 md:col-span-2">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/5 text-gray-400 rounded-xl flex items-center justify-center">
                     <Settings className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold">Public Display Labels</h3>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Uptime Label</label>
                     <input 
                        type="text"
                        name="uptime_display"
                        value={settings.uptime_display}
                        onChange={handleChange}
                        className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                        placeholder="e.g. 99.99%"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encryption Label</label>
                     <input 
                        type="text"
                        name="encryption_display"
                        value={settings.encryption_display}
                        onChange={handleChange}
                        className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                        placeholder="e.g. 256-bit"
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className="flex justify-end">
            <button 
               type="submit"
               disabled={saving}
               className="btn-primary px-10 py-4 flex items-center space-x-3"
            >
               {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
               <span className="font-black tracking-widest uppercase text-xs">Save Settings</span>
            </button>
         </div>
      </form>
    </div>
  );
}
