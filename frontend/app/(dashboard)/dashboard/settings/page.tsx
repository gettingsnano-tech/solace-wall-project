"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  ShieldCheck, 
  Bell, 
  Smartphone, 
  Mail, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("security");
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // 2FA states
  const [qrUri, setQrUri] = useState<string | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [verifying2fa, setVerifying2fa] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, notifRes] = await Promise.all([
        api.get("/api/user/settings"),
        api.get("/api/user/notifications")
      ]);
      setSettings(settingsRes.data);
      setNotifications(notifRes.data);
    } catch (error) {
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async (key: string, value: boolean) => {
    try {
      setSettings((prev: any) => ({ ...prev, [key]: value }));
      await api.put("/api/user/settings", { [key]: value });
      toast.success("Preferences updated.");
    } catch (error) {
      toast.error("Failed to update preferences.");
      setSettings((prev: any) => ({ ...prev, [key]: !value })); // Revert
    }
  };

  const generate2FA = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/api/user/2fa/generate");
      setQrUri(data.qr_uri);
      setTwoFactorSecret(data.secret);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to generate 2FA.");
    } finally {
      setSaving(false);
    }
  };

  const verifyAndEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying2fa(true);
    try {
      await api.post("/api/user/2fa/verify", { token: tokenInput });
      toast.success("2FA enabled successfully.");
      setSettings((prev: any) => ({ ...prev, two_factor_enabled: true }));
      setQrUri(null);
      setTwoFactorSecret(null);
      setTokenInput("");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Invalid 2FA code.");
    } finally {
      setVerifying2fa(false);
    }
  };

  const disable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying2fa(true);
    try {
      await api.post("/api/user/2fa/disable", { token: tokenInput });
      toast.success("2FA disabled successfully.");
      setSettings((prev: any) => ({ ...prev, two_factor_enabled: false }));
      setTokenInput("");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Invalid 2FA code.");
    } finally {
      setVerifying2fa(false);
    }
  };

  const markNotificationRead = async (id: number) => {
    try {
      await api.put(`/api/user/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      // Silently fail
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 lg:space-y-10 pb-10">
      <div className="mb-6 lg:mb-8">
         <h1 className="text-3xl lg:text-4xl font-black mb-2">Account <span className="text-gradient">Settings</span></h1>
         <p className="text-gray-400 text-sm lg:text-base">Manage your security and notification preferences.</p>
      </div>

      <div className="flex space-x-3 lg:space-x-4 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
         <button 
           onClick={() => setActiveTab('security')}
           className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black transition-all whitespace-nowrap ${activeTab === 'security' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-white/[0.05] hover:bg-white/10 text-gray-400'}`}
         >
           <ShieldCheck className="w-4 h-4" />
           <span>Security & 2FA</span>
         </button>
         <button 
           onClick={() => setActiveTab('notifications')}
           className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black transition-all whitespace-nowrap ${activeTab === 'notifications' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-white/[0.05] hover:bg-white/10 text-gray-400'}`}
         >
           <Bell className="w-4 h-4" />
           <span>Notifications</span>
         </button>
         <button 
           onClick={() => setActiveTab('history')}
           className={`flex items-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 rounded-xl lg:rounded-2xl text-[10px] lg:text-sm font-black transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-white/[0.05] hover:bg-white/10 text-gray-400'}`}
         >
           <Smartphone className="w-4 h-4" />
           <span>History</span>
         </button>
      </div>

      {activeTab === 'security' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem]">
               <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="space-y-2">
                     <h3 className="text-xl lg:text-2xl font-black">Google Authenticator (2FA)</h3>
                     <p className="text-xs lg:text-sm text-gray-400 max-w-md">Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.</p>
                  </div>
                  {settings.two_factor_enabled ? (
                    <span className="flex items-center justify-center space-x-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest w-fit">
                       <CheckCircle2 className="w-4 h-4" />
                       <span>Enabled</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-[10px] lg:text-xs font-black uppercase tracking-widest w-fit">
                       <AlertTriangle className="w-4 h-4" />
                       <span>Disabled</span>
                    </span>
                  )}
               </div>

               <div className="mt-8 border-t border-white/10 pt-8">
                  {!settings.two_factor_enabled ? (
                    qrUri ? (
                       <div className="space-y-6">
                          <p className="text-sm font-bold text-gray-300">1. Scan the QR code with your Google Authenticator app.</p>
                          <div className="bg-white p-3 lg:p-4 inline-block rounded-xl lg:rounded-2xl">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUri)}`} alt="2FA QR Code" className="w-32 h-32 lg:w-40 lg:h-40" />
                          </div>
                          <p className="text-[10px] lg:text-xs text-gray-500 font-mono bg-black/30 p-3 rounded-xl max-w-sm break-all">Secret: {twoFactorSecret}</p>
                          
                          <p className="text-sm font-bold text-gray-300">2. Enter the 6-digit code from the app to verify.</p>
                          <form onSubmit={verifyAndEnable2FA} className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-sm">
                             <input 
                               type="text" 
                               required
                               placeholder="000000"
                               className="flex-1 bg-[#0A0E1A] border border-white/10 rounded-xl lg:rounded-2xl py-3 px-5 focus:outline-none focus:border-[var(--primary)] text-sm font-bold tracking-[0.3em] lg:tracking-[0.5em] text-center"
                               value={tokenInput}
                               onChange={(e) => setTokenInput(e.target.value)}
                             />
                             <button type="submit" disabled={verifying2fa} className="btn-primary py-3 px-6 w-full sm:w-auto">
                               {verifying2fa ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                             </button>
                          </form>
                       </div>
                    ) : (
                      <button onClick={generate2FA} disabled={saving} className="btn-primary py-3 px-8 w-full sm:w-auto">
                         {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enable 2FA"}
                      </button>
                    )
                  ) : (
                    <div className="space-y-4 max-w-sm">
                       <p className="text-sm font-bold text-gray-400 text-center lg:text-left">Enter your 6-digit code to disable 2FA.</p>
                       <form onSubmit={disable2FA} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                          <input 
                            type="text" 
                            required
                            placeholder="000000"
                            className="flex-1 bg-[#0A0E1A] border border-white/10 rounded-xl lg:rounded-2xl py-3 px-5 focus:outline-none focus:border-[var(--primary)] text-sm font-bold tracking-[0.3em] lg:tracking-[0.5em] text-center"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                          />
                          <button type="submit" disabled={verifying2fa} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl lg:rounded-2xl py-3 px-6 text-sm font-bold transition-all w-full sm:w-auto">
                            {verifying2fa ? <Loader2 className="w-4 h-4 animate-spin" /> : "Disable"}
                          </button>
                       </form>
                    </div>
                  )}
               </div>
            </div>
         </motion.div>
      )}

      {activeTab === 'notifications' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem]">
               <h3 className="text-xl font-black mb-6">Email Notifications</h3>
               <div className="space-y-6">
                  {[
                    { key: 'email_notif_login', label: 'Logins', desc: 'Get an email when a new login occurs.' },
                    { key: 'email_notif_deposit', label: 'Deposits', desc: 'Get an email when a deposit is credited.' },
                    { key: 'email_notif_withdrawal', label: 'Withdrawals', desc: 'Get an email when a withdrawal is processing or complete.' },
                  ].map((item, idx) => (
                    <div key={item.key} className={`flex items-center justify-between ${idx < 2 ? 'border-b border-white/5 pb-6' : ''}`}>
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-white/[0.05] rounded-xl flex items-center justify-center">
                             <Mail className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                             <p className="font-bold">{item.label}</p>
                             <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                       </div>
                       <button
                         onClick={() => handleUpdateSettings(item.key, !settings[item.key])}
                         className={`relative w-16 h-9 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/40 shrink-0 ml-4 cursor-pointer ${
                           settings[item.key]
                             ? 'bg-[var(--primary)]'
                             : 'bg-white/[0.1] hover:bg-white/[0.15]'
                         }`}
                         role="switch"
                         aria-checked={settings[item.key]}
                         aria-label={`Toggle ${item.label} notifications`}
                       >
                         <span
                           className={`absolute top-[3px] w-[30px] h-[30px] rounded-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                             settings[item.key] ? 'left-[31px]' : 'left-[3px]'
                           }`}
                         />
                         <span className={`absolute inset-0 flex items-center text-[9px] font-black uppercase tracking-wider select-none ${
                           settings[item.key] ? 'justify-start pl-2.5 text-[var(--background)]' : 'justify-end pr-2.5 text-gray-500'
                         }`}>
                           {settings[item.key] ? 'ON' : 'OFF'}
                         </span>
                       </button>
                    </div>
                  ))}
               </div>
            </div>
         </motion.div>
      )}

      {activeTab === 'history' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem]">
               <h3 className="text-xl font-black mb-6">Web Notifications</h3>
               <div className="space-y-4">
                 {notifications.length === 0 ? (
                   <p className="text-gray-500 text-sm">No notifications found.</p>
                 ) : (
                   notifications.map(n => (
                     <div 
                       key={n.id} 
                       className={`p-5 rounded-2xl border ${n.is_read ? 'border-white/5 bg-white/[0.02]' : 'border-[var(--primary)]/30 bg-[var(--primary)]/5'}`}
                       onMouseEnter={() => !n.is_read && markNotificationRead(n.id)}
                     >
                        <div className="flex justify-between items-start mb-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)]">{n.type}</span>
                           <span className="text-xs text-gray-500">{new Date(n.created_at).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-300">{n.message}</p>
                     </div>
                   ))
                 )}
               </div>
            </div>
         </motion.div>
      )}
    </div>
  );
}
