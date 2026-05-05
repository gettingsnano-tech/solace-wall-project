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
import { X, Lock } from "lucide-react";

export default function WithdrawPage() {
  const router = useRouter();
  const [coins, setCoins] = useState<any[]>([]);
  const [balances, setBalances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [networks, setNetworks] = useState<any[]>([]);
  const [loadingNetworks, setLoadingNetworks] = useState(false);
  
  const [hasPin, setHasPin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");

  const [formData, setFormData] = useState({
    coin_id: "",
    network: "",
    to_address: "",
    amount: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinsRes, balRes, pinRes] = await Promise.all([
          api.get("/api/user/coins"),
          api.get("/api/user/balances"),
          api.get("/api/user/withdrawal-pin/status")
        ]);
        setCoins(coinsRes.data);
        setBalances(balRes.data);
        setHasPin(pinRes.data.has_pin);
      } catch (error) {
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (formData.coin_id) {
      const fetchNetworks = async () => {
        setLoadingNetworks(true);
        try {
          const { data } = await api.get(`/api/user/coins/${formData.coin_id}/networks`);
          setNetworks(data);
          // Auto-select first network if available
          setFormData(prev => ({ ...prev, network: data.length > 0 ? data[0].name : "" }));
        } catch (error) {
          console.error("Failed to fetch networks", error);
          setNetworks([]);
        } finally {
          setLoadingNetworks(false);
        }
      };
      fetchNetworks();
    } else {
      setNetworks([]);
      setFormData(prev => ({ ...prev, network: "" }));
    }
  }, [formData.coin_id]);

  const selectedCoin = coins.find((c: any) => c.id === parseInt(formData.coin_id));
  const selectedBalance = balances.find((b: any) => b.coin?.id === parseInt(formData.coin_id))?.amount || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseFloat(formData.amount) > parseFloat(selectedBalance)) {
      toast.error("Insufficient balance");
      return;
    }
    
    if (hasPin) {
      setShowPinModal(true);
    } else {
      executeWithdrawal();
    }
  };

  const executeWithdrawal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/api/user/withdraw", {
        coin_id: parseInt(formData.coin_id),
        network: formData.network,
        to_address: formData.to_address,
        amount: parseFloat(formData.amount),
        withdrawal_pin: hasPin ? pinInput : undefined
      });
      setSuccess(true);
      setShowPinModal(false);
      setPinInput("");
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
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-6 lg:mb-10 text-center">
         <h1 className="text-3xl lg:text-4xl font-black mb-2">Withdraw <span className="text-gradient">Assets</span></h1>
         <p className="text-gray-400 text-sm lg:text-base">Securely move your assets to an external address.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem]"
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
                 <div className="relative">
                    <select 
                       required
                       disabled={loadingNetworks || !formData.coin_id}
                       className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-[var(--primary)]/50 text-sm font-bold disabled:opacity-50"
                       value={formData.network}
                       onChange={(e) => setFormData({...formData, network: e.target.value})}
                    >
                       {!formData.coin_id ? (
                          <option value="">Select a coin first</option>
                       ) : loadingNetworks ? (
                          <option value="">Loading networks...</option>
                       ) : networks.length === 0 ? (
                          <option value="">No networks available</option>
                       ) : (
                          networks.map((net: any) => (
                            <option key={net.id} value={net.name}>{net.label} ({net.name})</option>
                          ))
                       )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Destination Address</label>
                 <input 
                    type="text" 
                    required
                    placeholder="Enter external address"
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl lg:rounded-2xl py-3 lg:py-4 px-5 lg:px-6 focus:outline-none focus:border-[var(--primary)]/50 text-sm font-bold font-mono"
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
                       className="w-full bg-[#0A0E1A] border border-white/10 rounded-xl lg:rounded-2xl py-3 lg:py-4 px-5 lg:px-6 focus:outline-none focus:border-[var(--primary)]/50 text-sm font-bold"
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

        <div className="space-y-6 lg:space-y-8">
           <div className="glass-card p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] border-[var(--secondary)]/10">
              <h4 className="font-bold flex items-center space-x-2 text-[var(--secondary)] mb-4 lg:mb-6 text-sm lg:text-base">
                 <AlertCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                 <span>Important Information</span>
              </h4>
              <ul className="space-y-3 lg:space-y-4 text-xs lg:text-sm text-gray-400">
                 <li className="flex items-start space-x-3">
                    <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-[var(--secondary)] mt-1.5 shrink-0"></div>
                    <span>All withdrawals require manual approval from the CORE CAPITAL administration team.</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-[var(--secondary)] mt-1.5 shrink-0"></div>
                    <span>Verification usually takes 5-30 minutes during business hours.</span>
                 </li>
                 <li className="flex items-start space-x-3">
                    <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-[var(--secondary)] mt-1.5 shrink-0"></div>
                    <span>Double-check the destination address. Assets cannot be recovered if sent to the wrong address.</span>
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
                    <img src={selectedCoin?.icon_url || "/placeholder-coin.png"} alt={selectedCoin?.name || "Coin"} className="w-12 h-12" />
                    <div>
                       <h4 className="font-bold">Withdrawal Summary</h4>
                       <p className="text-xs text-gray-500">{selectedCoin?.name || "Unknown"} ({selectedCoin?.symbol || "???"})</p>
                    </div>
                 </div>
                 <div className="space-y-3 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs font-medium">
                       <span className="text-gray-500">Amount</span>
                       <span>{formData.amount || "0.00"} {selectedCoin?.symbol || ""}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium">
                       <span className="text-gray-500">Transaction Fee</span>
                       <span className="text-[var(--secondary)]">0.00 {selectedCoin?.symbol || ""} (Included)</span>
                    </div>
                    <div className="flex justify-between text-lg font-black pt-4">
                       <span>Total</span>
                       <span>{formData.amount || "0.00"} {selectedCoin?.symbol || ""}</span>
                    </div>
                 </div>
              </motion.div>
           )}
        </div>
      </div>

      {/* PIN Verification Modal */}
      <AnimatePresence>
        {showPinModal && (
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
              className="glass-card w-full max-w-sm p-8 lg:p-10 rounded-[2.5rem] relative text-center"
            >
              <button 
                onClick={() => setShowPinModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8" />
              </div>

              <h3 className="text-2xl font-black mb-2">Security Verification</h3>
              <p className="text-gray-400 text-sm mb-8">Enter your 6-digit withdrawal PIN to authorize this transaction.</p>

              <form onSubmit={executeWithdrawal} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Withdrawal PIN</label>
                  <input 
                    type="password" 
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    autoFocus
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm tracking-[0.5em] font-mono text-center"
                    placeholder="••••••"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || pinInput.length !== 6}
                  className="w-full btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center space-x-2"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Authorize Transfer</span>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
