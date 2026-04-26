"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  ArrowUpRight, 
  ChevronDown, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const router = useRouter();
  const [coins, setCoins] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    coin_id: "",
    network: "",
    to_address: "",
    amount: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinsRes, balRes] = await Promise.all([
          api.get("/api/user/coins"),
          api.get("/api/user/balances")
        ]);
        setCoins(coinsRes.data);
        setBalances(balRes.data);
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedCoin = coins.find((c: any) => c.id === parseInt(formData.coin_id));
  const selectedBalance = balances.find((b: any) => b.coin.id === parseInt(formData.coin_id))?.amount || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(formData.amount) > parseFloat(selectedBalance)) {
      toast.error("Insufficient balance");
      return;
    }
    
    setSubmitting(true);
    try {
      await api.post("/api/user/withdraw", {
        coin_id: parseInt(formData.coin_id),
        network: formData.network,
        to_address: formData.to_address,
        amount: parseFloat(formData.amount)
      });
      setSuccess(true);
      toast.success("Withdrawal request submitted!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Withdrawal failed.");
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

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
        <div className="w-24 h-24 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-full flex items-center justify-center shadow-2xl shadow-[var(--secondary)]/20">
           <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black">Request Submitted</h2>
        <p className="text-gray-400 max-w-md">Your withdrawal request has been received and is pending admin approval. You can track its status in the Transactions tab.</p>
        <div className="flex space-x-4 pt-4">
           <button onClick={() => setSuccess(false)} className="btn-secondary">New Withdrawal</button>
           <button onClick={() => router.push("/dashboard/transactions")} className="btn-primary">View Transactions</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
         <h1 className="text-4xl font-black mb-2">Withdraw <span className="text-gradient">Assets</span></h1>
         <p className="text-gray-400">Securely move your simulated assets to an external address.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10 rounded-[2.5rem]"
        >
           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Coin</label>
                 <div className="relative">
                    <select 
                       required
                       className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-[var(--primary)]/50 text-sm font-bold"
                       value={formData.coin_id}
                       onChange={(e) => setFormData({...formData, coin_id: e.target.value})}
                    >
                       <option value="">Select a coin</option>
                       {coins.map((coin: any) => (
                         <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Network</label>
                 <input 
                    type="text" 
                    required
                    placeholder="e.g. ERC-20, TRC-20"
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)]/50 text-sm font-bold"
                    value={formData.network}
                    onChange={(e) => setFormData({...formData, network: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Destination Address</label>
                 <input 
                    type="text" 
                    required
                    placeholder="Enter external address"
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)]/50 text-sm font-bold font-mono"
                    value={formData.to_address}
                    onChange={(e) => setFormData({...formData, to_address: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <div className="flex justify-between">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Amount</label>
                    <span className="text-[10px] font-bold text-gray-400">Available: {parseFloat(selectedBalance).toFixed(4)}</span>
                 </div>
                 <div className="relative">
                    <input 
                       type="number" 
                       required
                       step="0.000001"
                       min="0.000001"
                       placeholder="0.00"
                       className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)]/50 text-sm font-bold"
                       value={formData.amount}
                       onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, amount: selectedBalance.toString()})}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-[var(--primary)] uppercase tracking-widest hover:underline"
                    >
                       Max
                    </button>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={submitting || !formData.coin_id}
                className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Withdrawal</span>}
              </button>
           </form>
        </motion.div>

        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[2.5rem] border-[var(--secondary)]/10">
              <h4 className="font-bold flex items-center space-x-2 text-[var(--secondary)] mb-6">
                 <AlertCircle className="w-5 h-5" />
                 <span>Important Information</span>
              </h4>
              <ul className="space-y-4 text-sm text-gray-400">
                 <li className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] mt-1.5 shrink-0"></div>
                    <span>All withdrawals require manual approval from the CORE CAPITAL administration team.</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] mt-1.5 shrink-0"></div>
                    <span>Verification usually takes 5-30 minutes during business hours.</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)] mt-1.5 shrink-0"></div>
                    <span>Double-check the destination address. Simulated assets cannot be recovered if sent to the wrong address.</span>
                 </li>
              </ul>
           </div>

           {selectedCoin && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5"
              >
                 <div className="flex items-center space-x-4 mb-6">
                    <img src={selectedCoin.icon_url} alt={selectedCoin.name} className="w-12 h-12" />
                    <div>
                       <h4 className="font-bold">Withdrawal Summary</h4>
                       <p className="text-xs text-gray-500">{selectedCoin.name} ({selectedCoin.symbol})</p>
                    </div>
                 </div>
                 <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs font-medium">
                       <span className="text-gray-500">Amount</span>
                       <span>{formData.amount || "0.00"} {selectedCoin.symbol}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                       <span className="text-gray-500">Transaction Fee</span>
                       <span className="text-[var(--secondary)]">0.00 {selectedCoin.symbol} (Demo)</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-4">
                       <span>Total</span>
                       <span>{formData.amount || "0.00"} {selectedCoin.symbol}</span>
                    </div>
                 </div>
              </motion.div>
           )}
        </div>
      </div>
    </div>
  );
}
