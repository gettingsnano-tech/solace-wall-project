"use client";

import React, { useState, useEffect } from "react";
import { 
  Repeat, 
  ArrowDown, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Loader2,
  RefreshCw,
  Wallet,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface Coin {
  id: number;
  name: string;
  symbol: string;
  icon_url: string;
}

interface Balance {
  coin: Coin;
  amount: number;
}

export default function SwapPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [swapping, setSwapping] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [fromCoinId, setFromCoinId] = useState<number | "">("");
  const [toCoinId, setToCoinId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinsRes, balancesRes] = await Promise.all([
          api.get("/api/user/coins"),
          api.get("/api/user/balances")
        ]);
        setCoins(coinsRes.data);
        setBalances(balancesRes.data);
        
        // Default selection
        if (coinsRes.data.length > 0) {
          const btc = coinsRes.data.find((c: any) => c.symbol === "BTC");
          const usdt = coinsRes.data.find((c: any) => c.symbol === "USDT");
          if (btc) setFromCoinId(btc.id);
          if (usdt) setToCoinId(usdt.id);
        }
      } catch (error) {
        toast.error("Failed to load swap data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (fromCoinId && toCoinId && amount && parseFloat(amount) > 0) {
      const delayDebounceFn = setTimeout(() => {
        fetchPreview();
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setPreview(null);
    }
  }, [fromCoinId, toCoinId, amount]);

  const fetchPreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await api.post("/api/user/swap/preview", {
        from_coin_id: fromCoinId,
        to_coin_id: toCoinId,
        amount: parseFloat(amount)
      });
      setPreview(res.data);
    } catch (error: any) {
      setPreview(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!fromCoinId || !toCoinId || !amount) return;
    setSwapping(true);
    try {
      await api.post("/api/user/swap", {
        from_coin_id: fromCoinId,
        to_coin_id: toCoinId,
        amount: parseFloat(amount)
      });
      toast.success("Swap completed successfully!");
      setAmount("");
      setPreview(null);
      // Refresh balances
      const balRes = await api.get("/api/user/balances");
      setBalances(balRes.data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Swap failed");
    } finally {
      setSwapping(false);
    }
  };

  const switchCoins = () => {
    const temp = fromCoinId;
    setFromCoinId(toCoinId);
    setToCoinId(temp);
    setAmount("");
    setPreview(null);
  };

  const currentFromCoin = coins.find(c => c.id === fromCoinId);
  const currentToCoin = coins.find(c => c.id === toCoinId);
  const fromBalance = balances.find(b => b.coin.id === fromCoinId)?.amount || 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const isInvalidSwap = () => {
    if (!currentFromCoin || !currentToCoin) return false;
    return currentFromCoin.symbol.toUpperCase() !== "USDT" && currentToCoin.symbol.toUpperCase() !== "USDT";
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 lg:space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Coin <span className="text-gradient">Swap</span></h1>
        <p className="text-gray-400 text-sm lg:text-base">Convert assets instantly with competitive rates.</p>
      </div>

      <div className="glass-card p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] border-white/5 space-y-6 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className="space-y-4">
          {/* From Section */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-1 gap-1">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">You Pay</label>
              <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-500">
                <Wallet className="w-3 h-3" />
                <span className="truncate max-w-[120px] sm:max-w-none">Balance: {fromBalance} {currentFromCoin?.symbol}</span>
                <button 
                   onClick={() => setAmount(fromBalance.toString())}
                   className="text-[var(--primary)] hover:underline ml-1 shrink-0"
                >
                  MAX
                </button>
              </div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 flex items-center space-x-3 lg:space-x-4">
              <input 
                type="number" 
                placeholder="0.00"
                className="bg-transparent border-none focus:outline-none text-xl lg:text-2xl font-bold flex-1 w-full"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <select 
                className="bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none cursor-pointer"
                value={fromCoinId}
                onChange={(e) => setFromCoinId(Number(e.target.value))}
              >
                {coins.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0A0E1A]">{c.symbol}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Switch Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button 
              onClick={switchCoins}
              className="w-12 h-12 bg-[#0A0E1A] border border-white/10 rounded-full flex items-center justify-center hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all transform hover:rotate-180 duration-500"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
          </div>

          {/* To Section */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">You Receive</label>
            <div className="bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl p-3 lg:p-4 flex items-center space-x-3 lg:space-x-4">
              <div className="flex-1">
                {previewLoading ? (
                  <Loader2 className="w-5 h-5 lg:w-6 lg:h-6 animate-spin text-gray-600" />
                ) : (
                  <span className={`text-xl lg:text-2xl font-bold ${preview ? 'text-white' : 'text-gray-600'}`}>
                    {preview ? preview.estimated_receive : "0.00"}
                  </span>
                )}
              </div>
              <select 
                className="bg-white/[0.05] border border-white/10 rounded-lg lg:rounded-xl px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-bold focus:outline-none cursor-pointer"
                value={toCoinId}
                onChange={(e) => setToCoinId(Number(e.target.value))}
              >
                {coins.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0A0E1A]">{c.symbol}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Validation Warning */}
        {isInvalidSwap() && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start space-x-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-xs text-red-400 font-medium leading-relaxed">
              Swaps must involve USDT. You can only swap any coin to USDT or USDT to any other coin.
            </p>
          </motion.div>
        )}

        {/* Preview Details */}
        <AnimatePresence>
          {preview && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-3 pt-4 border-t border-white/5"
            >
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Exchange Rate</span>
                <span>1 {currentFromCoin?.symbol} ≈ {preview.rate.toFixed(8)} {currentToCoin?.symbol}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-500">Service Fee</span>
                <span className="text-orange-500">$3.00 USD</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-white/5">
                <span>Total Received</span>
                <span className="text-[var(--primary)]">{preview.estimated_receive} {currentToCoin?.symbol}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleSwap}
          disabled={!preview || swapping || isInvalidSwap()}
          className="w-full btn-primary py-5 rounded-2xl font-black text-lg flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
        >
          {swapping ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Repeat className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
              <span>Confirm Swap</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
           <Info className="w-3 h-3" />
           <span>Instant processing • 256-bit encrypted</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-3xl border-white/5 flex items-start space-x-4">
          <div className="p-3 bg-[var(--primary)]/10 rounded-2xl text-[var(--primary)]">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Live Rates</h4>
            <p className="text-xs text-gray-500 leading-relaxed">Our swap rates are updated in real-time based on global market liquidity.</p>
          </div>
        </div>
        <div className="glass-card p-6 rounded-3xl border-white/5 flex items-start space-x-4">
          <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Flat Fee</h4>
            <p className="text-xs text-gray-500 leading-relaxed">A standard service fee of $3.00 USD is applied to all swap transactions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
