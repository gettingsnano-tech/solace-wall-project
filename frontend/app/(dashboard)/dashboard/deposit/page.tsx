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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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

const STEP_LABELS = ["Select Coin", "Select Network", "Deposit Address"];

export default function DepositPage() {
  const [step, setStep] = useState(0);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [depositInfo, setDepositInfo] = useState<DepositAddress | null>(null);

  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);

  const [loading, setLoading] = useState(false);
  const [coinsLoading, setCoinsLoading] = useState(true);
  const [networksLoading, setNetworksLoading] = useState(false);
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

  // ── Step 1: load networks when coin is selected
  useEffect(() => {
    if (!selectedCoin) return;
    setNetworksLoading(true);
    setNetworks([]);
    api
      .get(`/api/user/coins/${selectedCoin.id}/networks`)
      .then((r) => setNetworks(r.data))
      .catch(() => toast.error("Failed to load networks"))
      .finally(() => setNetworksLoading(false));
  }, [selectedCoin]);

  // ── Step 2: fetch / generate deposit address
  const fetchDepositAddress = async () => {
    if (!selectedCoin || !selectedNetwork) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<DepositAddress>("/api/user/deposit/address", {
        params: { coin_id: selectedCoin.id, network: selectedNetwork.name },
      });
      setDepositInfo(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        "No deposit address available. Contact support.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2) {
      fetchDepositAddress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ── QR code generation (client-side, canvas)
  useEffect(() => {
    if (step !== 2 || !depositInfo?.address || !qrRef.current) return;
    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(qrRef.current!, depositInfo.address, {
        width: 200,
        margin: 2,
        color: { dark: "#FFFFFF", light: "#00000000" },
      });
    });
  }, [depositInfo, step]);

  const handleCopy = () => {
    if (!depositInfo?.address) return;
    navigator.clipboard.writeText(depositInfo.address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2500);
  };

  const goBack = () => {
    setError(null);
    if (step === 1) setSelectedCoin(null);
    if (step === 2) setSelectedNetwork(null);
    setStep((s) => Math.max(0, s - 1));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Page header */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--primary)]">
          <Coins className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black mb-0.5">
            Deposit <span className="text-gradient">Crypto</span>
          </h1>
          <p className="text-gray-400 text-sm">Receive funds to your Solace account.</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                  i < step
                    ? "bg-[var(--secondary)] text-black"
                    : i === step
                    ? "bg-[var(--primary)] text-black ring-4 ring-[var(--primary)]/20"
                    : "bg-white/[0.05] text-gray-500"
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`mt-2 text-[10px] font-black uppercase tracking-wider ${
                  i === step ? "text-white" : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-all duration-300 ${
                  i < step ? "bg-[var(--secondary)]" : "bg-white/[0.05]"
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
            ) : coins.length === 0 ? (
              <div className="glass-card rounded-[2rem] p-12 text-center text-gray-500">
                No coins available. Ask an admin to add coins.
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
                      setStep(1);
                    }}
                    className="glass-card rounded-[2rem] p-6 flex flex-col items-center space-y-3 hover:border-[var(--primary)]/40 hover:bg-white/[0.07] transition-all group"
                  >
                    {coin.icon_url ? (
                      <img
                        src={`http://localhost:8000${coin.icon_url}`}
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
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 1: Select Network */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Coin badge */}
            <div className="flex items-center space-x-3 p-4 glass-card rounded-2xl">
              {selectedCoin?.icon_url ? (
                <img
                  src={`http://localhost:8000${selectedCoin.icon_url}`}
                  alt={selectedCoin.name}
                  className="w-10 h-10 object-contain rounded-xl"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
                  <Coins className="w-5 h-5 text-[var(--primary)]" />
                </div>
              )}
              <div>
                <p className="font-black text-sm">{selectedCoin?.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">
                  {selectedCoin?.symbol}
                </p>
              </div>
            </div>

            {networksLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
              </div>
            ) : networks.length === 0 ? (
              <div className="glass-card rounded-[2rem] p-12 text-center text-gray-500">
                No networks configured for this coin yet. Contact an admin.
              </div>
            ) : (
              <div className="space-y-3">
                {networks.map((net, idx) => (
                  <motion.button
                    key={net.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => {
                      setSelectedNetwork(net);
                      setStep(2);
                    }}
                    className="w-full glass-card rounded-[1.5rem] p-5 flex items-center justify-between hover:border-[var(--primary)]/40 hover:bg-white/[0.07] transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                        <Network className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-sm">{net.name}</p>
                        <p className="text-xs text-gray-500">{net.label}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-[var(--primary)] transition-colors" />
                  </motion.button>
                ))}
              </div>
            )}

            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Coins</span>
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: Deposit Address */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
                <p className="text-gray-500 text-sm font-bold">Assigning your address…</p>
              </div>
            ) : error ? (
              <div className="glass-card rounded-[2rem] p-10 text-center space-y-4">
                <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-red-400 font-bold">{error}</p>
                <button
                  onClick={fetchDepositAddress}
                  className="flex items-center space-x-2 mx-auto text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              </div>
            ) : depositInfo ? (
              <div className="space-y-6">
                {/* Coin + Network info row */}
                <div className="flex items-center space-x-4">
                  {depositInfo.coin.icon_url ? (
                    <img
                      src={`http://localhost:8000${depositInfo.coin.icon_url}`}
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
                      {depositInfo.network}
                    </span>
                  </div>
                </div>

                {/* QR + Address card */}
                <div className="glass-card rounded-[2rem] p-8 flex flex-col items-center space-y-6">
                  {/* QR Code */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/10">
                    <canvas ref={qrRef} className="rounded-xl" />
                  </div>

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
                        className={`shrink-0 transition-all duration-200 p-2 rounded-xl ${
                          copied
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
            ) : null}

            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors text-sm font-bold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Networks</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
