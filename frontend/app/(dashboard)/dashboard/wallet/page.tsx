"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import {
  Plus,
  Copy,
  Check,
  ExternalLink,
  Wallet,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function WalletPage() {
  const [coins, setCoins] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<any | null>(null);
  const [copied, setCopied] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coinsRes, walletsRes] = await Promise.all([
          api.get("/api/user/coins"),
          api.get("/api/user/wallets")
        ]);
        setCoins(coinsRes.data);
        setWallets(walletsRes.data);
      } catch (error) {
        toast.error("Failed to fetch wallet data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateWallet = async (coinId: any) => {
    setGenerating(coinId);
    try {
      const { data } = await api.post(`/api/user/wallets/generate?coin_id=${coinId}`);
      setWallets([...wallets, data]);
      toast.success("Wallet address generated!");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "No addresses available for this coin.");
    } finally {
      setGenerating(null);
    }
  };

  const copyToClipboard = (text: string, id: any) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Address copied!");
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black mb-2">My <span className="text-gradient">Wallets</span></h1>
          <p className="text-gray-400 text-sm lg:text-base">Manage your virtual wallet addresses and networks.</p>
        </div>
        <div className="bg-white/[0.05] border border-white/10 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-[10px] lg:text-xs font-bold uppercase tracking-widest">Secured Environment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {coins.map((coin: any, idx: number) => {
          const wallet = wallets.find((w: any) => w.coin_id === coin.id);

          return (
            <motion.div
              key={coin.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card p-6 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] relative group"
            >
              <div className="flex justify-between items-start mb-6 lg:mb-10">
                <div className="flex items-center space-x-4 lg:space-x-6">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/[0.05] rounded-xl lg:rounded-2xl p-2 shrink-0">
                    <img src={coin.icon_url} alt={coin.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-black">{coin.name}</h3>
                    <p className="text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-widest">{coin.symbol}</p>
                  </div>
                </div>
                {wallet && (
                  <div className="bg-[var(--secondary)]/10 text-[var(--secondary)] px-2 lg:px-3 py-1 rounded-full text-[9px] lg:text-[10px] font-bold uppercase tracking-widest">
                    Active
                  </div>
                )}
              </div>

              {wallet ? (
                <div className="space-y-6 lg:space-y-8">
                  <div className="space-y-2 lg:space-y-3">
                    <label className="text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Network</label>
                    <div className="bg-[#0A0E1A] border border-white/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center justify-between">
                      <span className="font-bold text-xs lg:text-sm text-[var(--secondary)]">{wallet.network}</span>
                      <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[var(--secondary)] animate-pulse"></div>
                    </div>
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <label className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Wallet Address</label>
                    <div className="bg-[#0A0E1A] border border-white/10 p-3 lg:p-4 rounded-xl lg:rounded-2xl flex items-center justify-between">
                      <span className="font-mono text-[10px] lg:text-sm text-gray-400 truncate mr-4">
                        {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(wallet.address, wallet.id)}
                        className="p-2 lg:p-2.5 bg-white/[0.05] rounded-xl hover:bg-[var(--primary)] hover:text-[var(--background)] transition-all shrink-0"
                      >
                        {copied === wallet.id ? <Check className="w-3 h-3 lg:w-4 lg:h-4" /> : <Copy className="w-3 h-3 lg:w-4 lg:h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[9px] lg:text-[10px] text-gray-500 italic text-center">Use this address to simulate deposits from the admin panel.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 lg:py-12 text-center border-2 border-dashed border-white/5 rounded-[1.5rem] lg:rounded-[2rem]">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-white/[0.05] rounded-full flex items-center justify-center mb-4 lg:mb-6">
                    <Wallet className="w-6 h-6 lg:w-8 lg:h-8 text-gray-600" />
                  </div>
                  <h4 className="font-bold text-sm lg:text-base mb-4">No address assigned</h4>
                  <button
                    onClick={() => generateWallet(coin.id)}
                    disabled={generating === coin.id}
                    className="btn-primary py-2 px-6 text-sm"
                  >
                    {generating === coin.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Address"}
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
