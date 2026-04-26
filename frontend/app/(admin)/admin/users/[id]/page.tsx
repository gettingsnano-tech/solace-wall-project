"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  ArrowLeft, 
  Wallet, 
  History, 
  Plus, 
  Loader2, 
  ShieldCheck,
  CreditCard,
  DollarSign,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [balances, setBalances] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpData, setTopUpData] = useState({
    coin_id: "",
    amount: "",
    notes: ""
  });
  const [topUpLoading, setTopUpLoading] = useState(false);

  const fetchData = async () => {
    try {
      // In a real app, I'd have a specific admin endpoint for full user detail
      // Here I'll improvise with multiple calls or assume a detailed endpoint exists
      const [coinsRes, usersRes] = await Promise.all([
        api.get("/api/admin/coins"),
        api.get("/api/admin/users")
      ]);
      
      const foundUser = usersRes.data.find((u: any) => u.id === parseInt(id as string));
      if (!foundUser) {
        toast.error("User not found");
        router.push("/admin/users");
        return;
      }
      
      setUser(foundUser);
      setCoins(coinsRes.data);
      
      // For demo purposes, we'll fetch balances and wallets if available
      // Note: Backend might need specific admin routes for these or I'll use the user ones with auth mock
      // But for this simulation, we'll just show the UI for now or mock the response
      setBalances([]); 
      setWallets([]);
      setTransactions([]);
    } catch (error) {
      toast.error("Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopUpLoading(true);
    try {
      await api.post("/api/admin/topup", {
        user_id: parseInt(id as string),
        coin_id: parseInt(topUpData.coin_id),
        amount: parseFloat(topUpData.amount),
        notes: topUpData.notes
      });
      toast.success("Balance topped up successfully!");
      setShowTopUp(false);
      setTopUpData({ coin_id: "", amount: "", notes: "" });
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Top-up failed.");
    } finally {
      setTopUpLoading(false);
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
    <div className="space-y-12">
      <div className="flex items-center space-x-4">
         <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
         </button>
         <div>
            <h1 className="text-3xl font-black">{user.full_name}</h1>
            <p className="text-gray-400 text-sm font-medium">{user.email}</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Balances Card */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-[var(--secondary)]" />
                    <span>User Balances</span>
                 </h3>
                 <button 
                  onClick={() => setShowTopUp(true)}
                  className="bg-[var(--primary)] text-[var(--background)] p-2 rounded-xl flex items-center space-x-2 font-bold px-4 hover:scale-105 transition-transform"
                 >
                    <Plus className="w-4 h-4" />
                    <span className="text-xs">Top Up</span>
                 </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {coins.map((coin: any, idx) => (
                    <div key={idx} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex justify-between items-center group hover:border-[var(--primary)]/20 transition-all">
                       <div className="flex items-center space-x-4">
                          <img src={coin.icon_url} alt={coin.symbol} className="w-8 h-8 rounded-full" />
                          <div>
                             <div className="font-bold text-sm tracking-tight">{coin.name}</div>
                             <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{coin.symbol}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="font-mono text-sm font-bold">0.00</div>
                          <div className="text-[10px] text-gray-600 font-bold">$0.00</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="glass-card p-10 rounded-[2.5rem]">
              <h3 className="text-xl font-bold flex items-center space-x-3 mb-10">
                 <Wallet className="w-5 h-5 text-[var(--primary)]" />
                 <span>Assigned Wallets</span>
              </h3>
              <div className="text-center py-12 text-gray-500 italic font-medium bg-black/10 rounded-[1.5rem] border border-dashed border-white/5">
                 No wallet addresses generated by this user yet.
              </div>
           </div>
        </div>

        {/* Sidebar Status/Actions */}
        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[2.5rem]">
              <h4 className="font-bold mb-6 flex items-center space-x-2">
                 <ShieldCheck className="w-5 h-5 text-[var(--secondary)]" />
                 <span>Account Control</span>
              </h4>
              <div className="space-y-4">
                 <button className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-sm font-bold py-4 rounded-2xl transition-all">Disable Account</button>
                 <button className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-sm font-bold py-4 rounded-2xl transition-all">Reset Password</button>
                 <button className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 text-sm font-bold py-4 rounded-2xl hover:text-white transition-all">Delete User</button>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[2.5rem]">
              <h4 className="font-bold mb-6 flex items-center space-x-2">
                 <History className="w-5 h-5 text-gray-400" />
                 <span>Audit Trail</span>
              </h4>
              <div className="space-y-4">
                 <p className="text-xs text-gray-500 leading-relaxed">
                    Account created on {new Date(user.created_at).toLocaleString()}
                 </p>
                 <p className="text-xs text-gray-500 leading-relaxed italic">No recent admin activity for this user.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Top Up Modal */}
      <AnimatePresence>
         {showTopUp && (
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
                 <h3 className="text-2xl font-black mb-6">Top Up <span className="text-gradient">Balance</span></h3>
                 <form onSubmit={handleTopUp} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Asset</label>
                       <div className="relative">
                          <select 
                            required
                            className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                            value={topUpData.coin_id}
                            onChange={(e) => setTopUpData({...topUpData, coin_id: e.target.value})}
                          >
                             <option value="">Choose coin</option>
                             {coins.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Credit Amount</label>
                       <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input 
                            type="number" 
                            required
                            step="0.000001"
                            className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                            placeholder="0.00"
                            value={topUpData.amount}
                            onChange={(e) => setTopUpData({...topUpData, amount: e.target.value})}
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Internal Notes</label>
                       <textarea 
                          className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-medium h-24 resize-none"
                          placeholder="e.g. Investor Demo Funding"
                          value={topUpData.notes}
                          onChange={(e) => setTopUpData({...topUpData, notes: e.target.value})}
                       />
                    </div>

                    <div className="flex space-x-4">
                       <button 
                        type="button"
                        onClick={() => setShowTopUp(false)}
                        className="flex-1 bg-white/[0.05] py-4 rounded-2xl text-sm font-bold hover:bg-white/[0.1] transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                        type="submit"
                        disabled={topUpLoading}
                        className="flex-1 btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center"
                       >
                          {topUpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Credit"}
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
