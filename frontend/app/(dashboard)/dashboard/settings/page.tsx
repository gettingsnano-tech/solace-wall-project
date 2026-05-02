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

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="mb-8">
         <h1 className="text-4xl font-black mb-2">Account <span className="text-gradient">Settings</span></h1>
         <p className="text-gray-400">Manage your security and notification preferences.</p>
      </div>

      <div className="flex space-x-4 border-b border-white/10 pb-4">
         <button 
           onClick={() => setActiveTab('security')}
           className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'security' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-white/[0.05] hover:bg-white/10 text-gray-400'}`}
         >
           <ShieldCheck className="w-4 h-4" />
           <span>Security & 2FA</span>
         </button>
         <button 
           onClick={() => setActiveTab('notifications')}
           className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'notifications' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-white/[0.05] hover:bg-white/10 text-gray-400'}`}
         >
           <Bell className="w-4 h-4" />
           <span>Notifications</span>
         </button>
         <button 
           onClick={() => setActiveTab('history')}
           className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'history' ? 'bg-[var(--primary)] text-[var(--background)]' : 'bg-white/[0.05] hover:bg-white/10 text-gray-400'}`}
         >
           <Smartphone className="w-4 h-4" />
           <span>Notification History</span>
         </button>
      </div>

      {activeTab === 'security' && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="glass-card p-8 rounded-[2.5rem]">
               <div className="flex items-start justify-between">
                  <div className="space-y-2">
                     <h3 className="text-xl font-black">Google Authenticator (2FA)</h3>
                     <p className="text-sm text-gray-400 max-w-md">Protect your account with an extra layer of security. Once configured, you'll be required to enter both your password and an authentication code from your mobile phone in order to sign in.</p>
                  </div>
                  {settings.two_factor_enabled ? (
                    <span className="flex items-center space-x-2 bg-green-500/10 text-green-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                       <CheckCircle2 className="w-4 h-4" />
                       <span>Enabled</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
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
                          <div className="bg-white p-4 inline-block rounded-2xl">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUri)}`} alt="2FA QR Code" />
                          </div>
                          <p className="text-xs text-gray-500 font-mono bg-black/30 p-3 rounded-xl max-w-sm">Secret: {twoFactorSecret}</p>
                          
                          <p className="text-sm font-bold text-gray-300">2. Enter the 6-digit code from the app to verify.</p>
                          <form onSubmit={verifyAndEnable2FA} className="flex space-x-4 max-w-sm">
                             <input 
                               type="text" 
                               required
                               placeholder="000000"
                               className="flex-1 bg-[#0A0E1A] border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-[var(--primary)] text-sm font-bold tracking-[0.5em] text-center"
                               value={tokenInput}
                               onChange={(e) => setTokenInput(e.target.value)}
                             />
                             <button type="submit" disabled={verifying2fa} className="btn-primary py-3 px-6">
                               {verifying2fa ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                             </button>
                          </form>
                       </div>
                    ) : (
                      <button onClick={generate2FA} disabled={saving} className="btn-primary py-3 px-8">
                         {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enable 2FA"}
                      </button>
                    )
                  ) : (
                    <div className="space-y-4 max-w-sm">
                       <p className="text-sm font-bold text-gray-400">Enter your 6-digit code to disable 2FA.</p>
                       <form onSubmit={disable2FA} className="flex space-x-4">
                          <input 
                            type="text" 
                            required
                            placeholder="000000"
                            className="flex-1 bg-[#0A0E1A] border border-white/10 rounded-2xl py-3 px-5 focus:outline-none focus:border-[var(--primary)] text-sm font-bold tracking-[0.5em] text-center"
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                          />
                          <button type="submit" disabled={verifying2fa} className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl py-3 px-6 text-sm font-bold transition-all">
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
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/[0.05] rounded-xl flex items-center justify-center">
                           <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                           <p className="font-bold">Logins</p>
                           <p className="text-xs text-gray-500">Get an email when a new login occurs.</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="sr-only peer" 
                         checked={settings.email_notif_login}
                         onChange={(e) => handleUpdateSettings('email_notif_login', e.target.checked)}
                       />
                       <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/[0.05] rounded-xl flex items-center justify-center">
                           <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                           <p className="font-bold">Deposits</p>
                           <p className="text-xs text-gray-500">Get an email when a deposit is credited.</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="sr-only peer" 
                         checked={settings.email_notif_deposit}
                         onChange={(e) => handleUpdateSettings('email_notif_deposit', e.target.checked)}
                       />
                       <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                     </label>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/[0.05] rounded-xl flex items-center justify-center">
                           <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                           <p className="font-bold">Withdrawals</p>
                           <p className="text-xs text-gray-500">Get an email when a withdrawal is processing or complete.</p>
                        </div>
                     </div>
                     <label className="relative inline-flex items-center cursor-pointer">
                       <input 
                         type="checkbox" 
                         className="sr-only peer" 
                         checked={settings.email_notif_withdrawal}
                         onChange={(e) => handleUpdateSettings('email_notif_withdrawal', e.target.checked)}
                       />
                       <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                     </label>
                  </div>
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
