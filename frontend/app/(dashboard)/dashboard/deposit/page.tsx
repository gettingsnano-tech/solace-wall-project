"use client";

import React, { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import {
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Coins,
  Network,
  QrCode,
  Wallet,
  Plus,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import QRCode from "qrcode";

type Coin = {
  id: number;
  name: string;
  symbol: string;
  icon_url: string | null;
  is_active: boolean;
};

type Network = {
  id: number;
  name: string;
  label: string;
  is_active: boolean;
};

type DepositAddress = {
  address: string;
  network: string;
  coin: Coin;
};

const STEP_LABELS = ["Select Coin", "Verification", "Deposit Address"];

export default function DepositPage() {
  const [step, setStep] = useState(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [depositInfo, setDepositInfo] = useState<DepositAddress | null>(null);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [loading, setLoading] = useState(false);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qrRef = useRef<HTMLCanvasElement>(null);

  // ── Step 0: load coins
  useEffect(() => {
    api
      .get("/api/user/coins")
      .then((r) => setCoins(r.data))
      .catch(() => toast.error("Failed to load coins"))
      .finally(() => setCoinsLoading(false));
  }, []);

  // ── Step 1: Check for existing wallet assignment
  const checkExistingWallet = async (coin: Coin) => {
    setLoading(true);
    setError(null);
    try {
      const { data: wallets } = await api.get("/api/user/wallets");
      const existing = wallets.find((w: any) => w.coin_id === coin.id);

      if (existing) {
        setDepositInfo({
          address: existing.address.address,
          network: existing.network || existing.address.network,
          coin: coin
        });
        setStep(2);
      } else {
        setStep(1); // Show "No Wallet" step
      }
    } catch (err: any) {
      toast.error("Failed to check wallet status");
    } finally {
      setLoading(false);
    }
  };

  // ── QR code generation
  useEffect(() => {
    if (step !== 2 || !depositInfo?.address) return;
    
    QRCode.toDataURL(depositInfo.address, {
      width: 400,
      margin: 2,
      color: { dark: "#FFFFFF", light: "#00000000" },
    }).then(url => {
        setQrCodeUrl(url);
    }).catch(() => {
        toast.error("Failed to generate QR code");
    });
  }, [depositInfo, step]);

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${selectedCoin?.symbol || 'coin'}_deposit_qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code downloaded!");
  };

  const handleCopy = () => {
    if (!depositInfo?.address) return;
    navigator.clipboard.writeText(depositInfo.address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const goBack = () => {
    setError(null);
    setDepositInfo(null);
    if (step === 1 || step === 2) {
       setSelectedCoin(null);
       setStep(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 lg:space-y-10 pb-10">
      {/* Page header */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/[0.05] rounded-xl lg:rounded-2xl flex items-center justify-center text-[var(--primary)] shrink-0">
          <Coins className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
        <div>
          <h1 className="text-2xl lg:text-3xl font-black mb-0.5">
            Deposit <span className="text-gradient">Crypto</span>
          </h1>
          <p className="text-gray-400 text-xs lg:text-sm">Receive funds to your Core Capital account.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center px-2">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-[10px] lg:text-xs font-black transition-all duration-300 ${i < step
                    ? "bg-[var(--secondary)] text-black"
                    : i === step
                      ? "bg-[var(--primary)] text-black ring-4 ring-[var(--primary)]/20"
                      : "bg-white/[0.05] text-gray-500"
                  }`}
              >
                {i < step ? <Check className="w-3 h-3 lg:w-4 lg:h-4" /> : i + 1}
              </div>
              <span
                className={`mt-2 text-[8px] lg:text-[10px] font-black uppercase tracking-wider hidden sm:block ${i === step ? "text-white" : "text-gray-600"
                  }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 lg:mx-2 mb-0 sm:mb-5 rounded-full transition-all duration-300 ${i < step ? "bg-[var(--secondary)]" : "bg-white/[0.05]"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step panels */}
      <AnimatePresence mode="wait">
        {/* ── STEP 0: Select Coin */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {coinsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {coins.map((coin, idx) => (
                  <motion.button
                    key={coin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => {
                      setSelectedCoin(coin);
                      checkExistingWallet(coin);
                    }}
                    disabled={loading}
                    className="glass-card rounded-[2rem] p-6 flex flex-col items-center space-y-3 hover:border-[var(--primary)]/40 hover:bg-white/[0.07] transition-all group disabled:opacity-50"
                  >
                    {loading && selectedCoin?.id === coin.id ? (
                        <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
                    ) : (
                        <>
                        {coin.icon_url ? (
                          <img
                            src={coin.icon_url}
                            alt={coin.name}
                            className="w-12 h-12 object-contain rounded-xl"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center text-[var(--primary)]">
                            <Coins className="w-6 h-6" />
                          </div>
                        )}
                        <div className="text-center">
                          <p className="font-black text-sm">{coin.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                            {coin.symbol}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-[var(--primary)] transition-colors" />
                        </>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 1: No Wallet Found (Redirect) */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-[2rem] p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto text-[var(--primary)]">
                    <Wallet className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black">Address Required</h3>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                        You haven't generated a deposit address for <span className="text-white font-bold">{selectedCoin?.name}</span> yet. Please generate one to continue.
                    </p>
                </div>
                <Link 
                    href="/dashboard/wallet"
                    className="btn-primary py-4 px-10 rounded-2xl inline-flex items-center space-x-3 group"
                >
                    <span>Generate Wallet Now</span>
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </Link>
            </div>

            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm font-bold mx-auto"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Coins</span>
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: Deposit Address Display */}
        {step === 2 && depositInfo && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-6">
                {/* Coin + Network info row */}
                <div className="flex items-center space-x-4">
                  {depositInfo.coin.icon_url ? (
                    <img
                      src={depositInfo.coin.icon_url}
                      alt={depositInfo.coin.name}
                      className="w-12 h-12 object-contain rounded-xl"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center">
                      <Coins className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                  )}
                  <div>
                    <p className="text-xl font-black">{depositInfo.coin.name}</p>
                    <span className="inline-block bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg mt-1">
                      {depositInfo.network} Network
                    </span>
                  </div>
                </div>

                {/* QR + Address card */}
                <div className="glass-card rounded-[2rem] p-8 flex flex-col items-center space-y-6">
                  {/* QR Code */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10 w-48 h-48 flex items-center justify-center">
                    {qrCodeUrl ? (
                      <div className="relative group/qr w-full h-full">
                        <img src={qrCodeUrl} alt="Deposit QR Code" className="w-full h-full rounded-xl" />
                        <button 
                          onClick={handleDownload}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/qr:opacity-100 transition-opacity rounded-xl backdrop-blur-[2px]"
                        >
                          <div className="bg-[var(--primary)] text-[var(--background)] p-3 rounded-full scale-90 group-hover/qr:scale-100 transition-transform">
                            <Download className="w-5 h-5" />
                          </div>
                        </button>
                      </div>
                    ) : (
                      <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
                    )}
                  </div>
                  
                  {qrCodeUrl && (
                    <button 
                      onClick={handleDownload}
                      className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[var(--primary)] transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download QR Image</span>
                    </button>
                  )}

                  {/* Address */}
                  <div className="w-full space-y-2">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      Your Deposit Address
                    </p>
                    <div className="flex items-center space-x-3 bg-black/30 rounded-2xl px-5 py-4 border border-white/10">
                      <p className="font-mono text-sm text-gray-300 flex-1 break-all">
                        {depositInfo.address}
                      </p>
                      <button
                        onClick={handleCopy}
                        className={`shrink-0 transition-all duration-200 p-2 rounded-xl ${copied
                            ? "bg-[var(--secondary)]/20 text-[var(--secondary)]"
                            : "bg-white/[0.05] text-gray-400 hover:text-white hover:bg-white/[0.1]"
                          }`}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="flex items-start space-x-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-amber-300/80 text-xs font-semibold leading-relaxed">
                    Only send{" "}
                    <span className="font-black text-amber-300">
                      {depositInfo.coin.symbol}
                    </span>{" "}
                    via the{" "}
                    <span className="font-black text-amber-300">
                      {depositInfo.network}
                    </span>{" "}
                    network to this address. Sending any other asset or using the wrong network will result in <strong>permanent loss of funds</strong>.
                  </p>
                </div>
            </div>

            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Coins</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
