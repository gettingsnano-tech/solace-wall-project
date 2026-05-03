"use client";

import Head from "next/head";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Wallet, Shield, Zap, Globe, FileText, Key, BarChart3,
  ArrowLeft, ArrowRight, Lock, Eye, Cpu, Activity, CheckCircle2,
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

const capabilities = [
  { n: "01", icon: Globe, title: "Multi-Currency Unified Balance", desc: "Hold multiple digital currencies simultaneously under one wallet address ecosystem. Your total portfolio value is aggregated and displayed in your chosen base currency — always updated in real time." },
  { n: "02", icon: Zap, title: "Instant Send & Receive", desc: "Initiate transfers to any verified wallet address with near-instant confirmation. Core Capital's settlement engine processes transactions with enterprise-grade throughput — no queues, no arbitrary holds." },
  { n: "03", icon: ArrowRight, title: "Built-In Currency Conversion", desc: "Convert between supported digital currencies directly within your wallet at live market rates. No third-party exchange needed. Conversion executes inside your vault — funds never leave your custody umbrella." },
  { n: "04", icon: FileText, title: "Transaction History & Audit Trail", desc: "Every movement of capital is logged with full timestamp, destination, amount, and status. Export your complete transaction history in CSV or PDF format for accounting or compliance — anytime." },
  { n: "05", icon: Key, title: "Wallet Address Management", desc: "Generate and manage multiple wallet sub-addresses from one master account. Segment funds by purpose or counterparty without opening separate accounts — ideal for managing multiple income streams." },
  { n: "06", icon: Shield, title: "Two-Factor & Biometric Access Control", desc: "Your wallet opens only for you. Pair your account with biometric authentication alongside OTP verification. Every login, transaction, and settings change requires layered confirmation." },
];

const dashboardTabs = [
  { id: "overview", label: "Portfolio Overview", icon: BarChart3, content: "See your total holdings, asset allocation breakdown, and 24-hour performance delta at a glance. A dynamic donut chart shows your distribution across currencies. Balance displayed in real time with automatic refresh every 30 seconds." },
  { id: "feed", label: "Live Transaction Feed", icon: Activity, content: "A running feed of every transaction across your wallet — incoming, outgoing, pending, and completed — updated in real time. Filter by currency, date range, transaction type, or amount threshold." },
  { id: "analytics", label: "Performance Analytics", icon: BarChart3, content: "Track your wallet's growth over 7-day, 30-day, 90-day, and custom date ranges. Line charts show capital movement over time. Percentage gain or loss since deposit is calculated automatically per currency." },
  { id: "actions", label: "Quick Action Panel", icon: Zap, content: "Send, receive, convert, and export — all accessible from the top of your dashboard without navigating away. Designed to reduce clicks and eliminate friction for investors who move fast." },
  { id: "security", label: "Security Status Panel", icon: Shield, content: "A live readout of your account security health — active sessions, last login location, 2FA status, and any flagged activity. Dismiss or escalate alerts directly from the dashboard." },
];

const securityLayers = [
  { n: "01", title: "Perimeter Defense", desc: "Enterprise firewall infrastructure with DDoS mitigation and IP reputation filtering. All traffic is routed through hardened network perimeters that block threats before they reach your data." },
  { n: "02", title: "Data Encryption", desc: "256-bit AES encryption on all stored data. TLS 1.3 on all data in transit. Your wallet balance, transaction records, and personal data are unreadable to any unauthorized party." },
  { n: "03", title: "Identity Verification", desc: "Multi-factor authentication with biometric support, device fingerprinting, and behavioral anomaly detection. Unusual access patterns trigger automatic step-up verification." },
  { n: "04", title: "Asset Custody", desc: "The majority of digital assets are maintained in cold storage — offline, air-gapped, and inaccessible to network-level threats. Hot wallet balances are minimized and insured." },
  { n: "05", title: "Continuous Monitoring", desc: "AI-powered threat detection runs 24/7. Suspicious behavior triggers instant alerts, session termination, and automatic escalation to the security operations team — with no manual intervention required from you." },
];

// Coins to track in the mockup
const COINS = [
  { id: "bitcoin",  sym: "BTC", name: "Bitcoin",  alloc: 0.50 },
  { id: "ethereum", sym: "ETH", name: "Ethereum", alloc: 0.31 },
  { id: "tether",   sym: "USDT",name: "Tether",   alloc: 0.12 },
  { id: "binancecoin", sym: "BNB", name: "BNB",   alloc: 0.07 },
];

type CoinPrice = {
  id: string; sym: string; name: string;
  price: number; change24h: number; value: number;
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const activeContent = dashboardTabs.find(t => t.id === activeTab);
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const INITIAL_PORTFOLIO: Record<string, number> = { bitcoin: 1.84, ethereum: 22.5, tether: 52471, binancecoin: 148 };

  const fetchPrices = async () => {
    try {
      const ids = COINS.map(c => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
        { next: { revalidate: 30 } }
      );
      if (!res.ok) return;
      const data = await res.json();
      const updated: CoinPrice[] = COINS.map(c => ({
        ...c,
        price: data[c.id]?.usd ?? 0,
        change24h: data[c.id]?.usd_24h_change ?? 0,
        value: (data[c.id]?.usd ?? 0) * (INITIAL_PORTFOLIO[c.id] ?? 0),
      }));
      setPrices(updated);
      setTotalBalance(updated.reduce((s, c) => s + c.value, 0));
      setPriceLoading(false);
    } catch { /* silently fail — keep showing previous */ }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Core Capital Wallet | Institutional-Grade Digital Wallet Features</title>
        <meta name="description" content="Explore the full feature set of the Core Capital Digital Currency wallet — built for serious investors who demand security, real-time analytics, multi-currency control, and sovereign asset management." />
        <meta name="keywords" content="digital wallet, crypto wallet features, secure digital currency storage, institutional wallet, multi-currency wallet, Core Capital" />
        <meta property="og:title" content="Core Capital Wallet | Institutional-Grade Digital Wallet Features" />
        <meta property="og:description" content="The Core Capital Wallet — active financial instrument for serious investors." />
        <meta property="og:type" content="website" />
      </Head>

      <main className="flex flex-col w-full overflow-hidden pt-24">

        {/* ── SECTION 1: HERO ─────────────────────────────────────────── */}
        <section id="wallet-hero" aria-labelledby="wallet-hero-heading" className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
            <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-[var(--color-primary)] opacity-[0.05] blur-[130px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-0 left-[-5%] w-[400px] h-[400px] bg-[var(--color-secondary)] opacity-[0.05] blur-[130px] rounded-full animate-pulse-slow" />
            <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
          </div>

          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Copy */}
              <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Link href="/" className="inline-flex items-center space-x-2 text-gray-500 hover:text-gray-300 text-sm font-semibold mb-8 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </Link>
                <div className="inline-flex items-center space-x-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-6">
                  <Wallet className="w-4 h-4" aria-hidden="true" />
                  <span className="text-xs font-black uppercase tracking-widest">Digital Asset Wallet</span>
                </div>
                <h1 id="wallet-hero-heading" className="text-4xl md:text-6xl font-black leading-[1.05] mb-6">
                  One Wallet.{" "}
                  <span className="text-gradient">Total Control Over Every Coin You Own.</span>
                </h1>
                <p className="text-lg text-gray-400 leading-relaxed mb-5">
                  The Core Capital Wallet isn't a storage box — it's an active financial instrument. Engineered for speed, secured like a vault, and designed for investors who treat their digital assets like the serious capital they are.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-10">
                  Most wallets hold your coins and do nothing else. Core Capital's wallet architecture is different — it monitors, responds, converts, and reports in real time, giving you institutional-level visibility and command over every unit of digital currency you hold.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/register" className="btn-primary px-8 py-3.5 text-sm font-black">
                    Open Your Wallet Now
                  </Link>
                  <Link href="/features/coins" className="btn-secondary px-8 py-3.5 text-sm font-bold flex items-center justify-center space-x-2">
                    <span>Explore Features</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>

              {/* Right: Dashboard Mockup */}
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 blur-3xl -z-10 rounded-full" />
                <div className="glass-card rounded-[2.5rem] p-1 shadow-2xl" style={{ background: "rgba(10,14,26,0.9)" }}>
                  <div className="bg-[#0D1120] rounded-[2.3rem] p-7">
                    {/* Live header */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Portfolio Performance</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                        </div>
                        {priceLoading ? (
                          <div className="h-8 w-40 bg-white/[0.06] rounded-lg animate-pulse" />
                        ) : (
                          <p className={`text-2xl font-black ${
                            (prices.reduce((acc, c) => acc + (c.value * c.change24h), 0) / (totalBalance || 1)) >= 0 
                              ? "text-[var(--color-secondary)]" 
                              : "text-red-400"
                          }`}>
                            {(prices.reduce((acc, c) => acc + (c.value * c.change24h), 0) / (totalBalance || 1)).toFixed(2)}%
                            <span className="text-[10px] text-gray-500 uppercase ml-2 tracking-widest font-bold">24h Change</span>
                          </p>
                        )}
                      </div>
                    </div>
                    {/* Bar chart (visual only) */}
                    <div className="flex items-end gap-1.5 h-16 mb-6">
                      {[38, 55, 42, 70, 52, 85, 63, 90, 58, 82, 68, 100].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: i === 11 ? "var(--color-primary)" : `rgba(240,180,41,${0.08 + i * 0.018})` }} />
                      ))}
                    </div>
                    {/* Live coin rows */}
                    {priceLoading ? (
                      <div className="space-y-3">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="h-10 bg-white/[0.04] rounded-xl animate-pulse" />
                        ))}
                      </div>
                    ) : (
                      prices.map((c, i) => (
                        <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[10px] font-black text-[var(--color-primary)]">
                              {c.sym[0]}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{c.name}</p>
                              <p className="text-[10px] text-gray-600 uppercase">{c.sym} · ${c.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-black ${c.change24h >= 0 ? "text-[var(--color-secondary)]" : "text-red-400"}`}>
                              {c.change24h >= 0 ? "+" : ""}{c.change24h.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: CAPABILITIES ─────────────────────────────────── */}
        <section id="wallet-capabilities" aria-labelledby="cap-heading" className="py-28 bg-black/20">
          <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Core Capabilities</p>
              <h2 id="cap-heading" className="text-3xl md:text-5xl font-black mb-5">What Your Wallet <span className="text-gradient">Can Actually Do</span></h2>
              <p className="text-gray-400 max-w-xl mx-auto">Every capability inside the Core Capital Wallet was built around a single standard — what would a serious investor actually need?</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((c, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <motion.article whileHover={{ y: -4 }}
                    className="glass-card p-8 rounded-[2rem] flex items-start space-x-6 group hover:border-[var(--color-primary)]/20 transition-all duration-300"
                    style={{ borderLeft: "2px solid rgba(240,180,41,0.15)" }}
                  >
                    <div className="shrink-0">
                      <span className="text-4xl font-black text-[var(--color-primary)]/20 group-hover:text-[var(--color-primary)]/40 transition-colors leading-none">{c.n}</span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <c.icon className="w-4 h-4 text-[var(--color-primary)]" aria-hidden="true" />
                        <h3 className="font-black text-base">{c.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
                    </div>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: DASHBOARD TABS ───────────────────────────────── */}
        <section id="wallet-dashboard" aria-labelledby="dash-heading" className="py-28">
          <div className="container mx-auto px-6">
            <Reveal className="text-center mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">Dashboard</p>
              <h2 id="dash-heading" className="text-3xl md:text-5xl font-black mb-5">Your Dashboard Is Your <span className="text-gradient">Command Center</span></h2>
              <p className="text-gray-400 max-w-xl mx-auto">The Core Capital Wallet dashboard puts everything you need in one view — no digging, no switching, no guessing.</p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tab list */}
              <div className="space-y-2">
                {dashboardTabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left transition-all duration-200 ${activeTab === tab.id ? "bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-white" : "hover:bg-white/[0.04] text-gray-400 border border-transparent"}`}
                  >
                    <tab.icon className={`w-5 h-5 shrink-0 ${activeTab === tab.id ? "text-[var(--color-primary)]" : "text-gray-600"}`} aria-hidden="true" />
                    <span className={`text-sm font-bold ${activeTab === tab.id ? "text-white" : ""}`}>{tab.label}</span>
                    {activeTab === tab.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />}
                  </button>
                ))}
              </div>

              {/* Tab panel */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}
                    className="glass-card rounded-[2rem] p-10 h-full" style={{ background: "rgba(10,14,26,0.6)", minHeight: "320px" }}>
                    {activeContent && (
                      <>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                            <activeContent.icon className="w-5 h-5 text-[var(--color-primary)]" aria-hidden="true" />
                          </div>
                          <h3 className="text-xl font-black">{activeContent.label}</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{activeContent.content}</p>
                        {/* Mock content for each tab */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                          {["Real-Time Data", "Auto-Refresh", "Export Ready"].map((f, i) => (
                            <div key={i} className="flex items-center space-x-2 bg-white/[0.03] rounded-xl px-4 py-3">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-secondary)] shrink-0" aria-hidden="true" />
                              <span className="text-xs font-bold text-gray-400">{f}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: SECURITY LAYERS ──────────────────────────────── */}
        <section id="wallet-security" aria-labelledby="sec-heading" className="py-28 bg-black/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(0,212,170,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,170,0.8) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="container mx-auto px-6 relative">
            <Reveal className="text-center mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">Zero-Trust Architecture</p>
              <h2 id="sec-heading" className="text-3xl md:text-5xl font-black mb-5">The Architecture Behind <span className="text-gradient">Your Peace of Mind</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Security is not a setting you turn on. It is the structure your wallet is built on. The Core Capital Wallet operates on a zero-trust security model — every action, every session, and every transaction is verified independently.</p>
            </Reveal>

            <div className="max-w-3xl mx-auto space-y-4">
              {securityLayers.map((layer, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <article className="flex items-start space-x-6 p-6 rounded-2xl bg-white/[0.02] border-l-2 border-[var(--color-secondary)]/30 hover:border-[var(--color-secondary)]/70 hover:bg-white/[0.04] transition-all duration-300">
                    <span className="text-2xl font-black text-[var(--color-secondary)]/25 leading-none pt-1 shrink-0 w-10">{layer.n}</span>
                    <div>
                      <h3 className="font-black text-base mb-2 flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-[var(--color-secondary)]" aria-hidden="true" />
                        <span>{`Layer ${layer.n} — ${layer.title}`}</span>
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{layer.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: CTA ──────────────────────────────────────────── */}
        <section id="wallet-cta" aria-labelledby="wallet-cta-heading" className="py-28">
          <div className="container mx-auto px-6">
            <Reveal>
              <div className="relative glass-card p-14 md:p-24 rounded-[3rem] text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[var(--color-primary)] opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-6">Ready When You Are</p>
                <h2 id="wallet-cta-heading" className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                  You've Seen What It Does.{" "}<span className="text-gradient">Now Put It to Work.</span>
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-5 leading-relaxed">
                  The Core Capital Wallet is ready the moment you are. Sign up takes under two minutes. Your vault is provisioned instantly. And your assets are under institutional-grade protection from the first deposit.
                </p>
                <p className="text-gray-500 text-sm mb-12 italic">This is the infrastructure your digital wealth has been waiting for.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                  <Link href="/auth/register" className="btn-primary px-12 py-4 text-base font-black relative group">
                    <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                    Create Your Wallet — Free
                  </Link>
                  <Link href="/support" className="btn-secondary px-10 py-4 text-base font-bold">
                    Contact Our Team for Enterprise Inquiries
                  </Link>
                </div>
                <p className="text-gray-600 text-xs font-bold tracking-widest uppercase">
                  🔒 256-bit encrypted · No hidden fees · Withdraw anytime · KYC-compliant
                </p>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
    </>
  );
}
