"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  Coins,
  TrendingUp,
  Globe,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Zap,
  Layers,
  PieChart,
  Shield,
  Activity,
  AlertCircle
} from "lucide-react";
import { motion, useInView } from "framer-motion";

// ─── Scroll Reveal Wrapper ────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const supportedCoins = [
  { name: "Bitcoin", ticker: "BTC", desc: "The foundational digital store of value. Core Capital treats BTC holdings with the same custody weight as institutional gold reserves." },
  { name: "Ethereum", ticker: "ETH", desc: "The programmable asset layer. Full ETH support including ERC-20 token compatibility within the wallet ecosystem." },
  { name: "Tether", ticker: "USDT", desc: "The stable anchor. USDT allows you to hold dollar-denominated value within your vault without exiting the digital asset ecosystem." },
  { name: "USD Coin", ticker: "USDC", desc: "Fully regulated, fully backed stable coin with real-time attestation. The compliance investor's dollar equivalent." },
  { name: "BNB", ticker: "BNB", desc: "Binance's native network asset — high utility, high liquidity, and deep cross-chain compatibility within the environment." },
  { name: "Solana", ticker: "SOL", desc: "High-throughput, low-latency — SOL represents the next generation of settlement infrastructure. Full SOL custody." },
  { name: "Ripple", ticker: "XRP", desc: "Cross-border settlement at institutional speed. XRP support is built for users who move capital across markets." },
  { name: "Litecoin", ticker: "LTC", desc: "Digital silver. Fast, reliable, and widely accepted — LTC remains a core holding for diversified digital portfolios." },
];

const intelligenceFeatures = [
  {
    icon: PieChart,
    title: "Asset Allocation View",
    desc: "A real-time visual breakdown of your portfolio by coin. Know exactly how diversified you actually are with dynamic charting."
  },
  {
    icon: Activity,
    title: "24-Hour Performance Delta",
    desc: "See which assets are driving growth and which are pulling weight — in your base currency, not just percentages."
  },
  {
    icon: BarChart3,
    title: "Historical Holding Timeline",
    desc: "A timeline view showing when each coin entered your portfolio and how it has grown or contracted since your first deposit."
  },
  {
    icon: AlertCircle,
    title: "Concentration Alerts",
    desc: "Set thresholds for maximum exposure to any single coin. If one asset grows beyond your limit, we flag it for rebalancing."
  }
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function CoinsContent() {
  return (
    <main className="flex flex-col w-full overflow-hidden pt-24">
      
      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="coins-hero" className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.05] blur-[140px] rounded-full animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-secondary)] opacity-[0.05] blur-[140px] rounded-full animate-pulse-slow" />
          
          {/* Floating tokens background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none">
            <div className="relative w-full h-full max-w-7xl">
              {["BTC", "ETH", "USDT", "SOL", "BNB", "XRP", "USDC", "LTC"].map((token, i) => (
                <motion.div
                  key={token}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: 1,
                    x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                    y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  }}
                  transition={{ 
                    duration: 20 + i * 5, 
                    repeat: Infinity, 
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="absolute font-black text-6xl md:text-8xl tracking-tighter text-white"
                  style={{
                    left: `${(i % 4) * 25 + 10}%`,
                    top: `${Math.floor(i / 4) * 50 + 20}%`,
                    filter: "blur(2px)"
                  }}
                >
                  {token}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/[0.05] border border-white/10 px-5 py-2 rounded-full mb-10"
          >
            <Link href="/wallet" className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Features</span>
            </Link>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
          >
            Every Major Coin.{" "}
            <span className="block text-gradient">One Sovereign Wallet.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed"
          >
            Diversification is the first principle of serious wealth management. Core Capital gives you full multi-coin support — so your digital portfolio is never limited by your wallet's infrastructure.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-base text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed"
          >
            The era of managing five wallets for five currencies is over. Core Capital's multi-coin architecture unifies your entire digital asset portfolio under one encrypted vault.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <Link
              href="/auth/register"
              className="btn-primary px-10 py-4 text-base font-black tracking-wide"
            >
              Start Managing All Your Coins
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: SUPPORTED COINS GRID ────────────────────────────── */}
      <section id="supported-coins" className="py-28 bg-black/20">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Curated Assets</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">Supported Digital Currencies</h2>
            <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Our supported coin roster is curated, not exhaustive by accident. Every currency on the Core Capital platform has passed infrastructure, liquidity, and compliance vetting.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportedCoins.map((coin, i) => (
              <Reveal key={coin.ticker} delay={i * 0.05}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-card p-8 rounded-[2.5rem] h-full border-t border-white/[0.05] relative overflow-hidden group"
                >
                  <div className="absolute top-[-20%] right-[-10%] font-black text-6xl text-white/[0.03] group-hover:text-white/[0.08] transition-colors pointer-events-none select-none">
                    {coin.ticker}
                  </div>
                  <div className="text-3xl font-black text-[var(--color-primary)] mb-4 tracking-tighter">
                    {coin.ticker}
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">{coin.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{coin.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4} className="text-center mt-16">
            <div className="inline-flex items-center space-x-3 bg-white/[0.02] border border-white/5 px-6 py-3 rounded-2xl">
              <RefreshCw className="w-4 h-4 text-[var(--color-secondary)] animate-spin-slow" />
              <p className="text-xs font-bold text-gray-500 tracking-wide">
                More currencies added regularly. Evaluation occurs on a quarterly basis.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 3: UNIFIED BALANCE ─────────────────────────────────── */}
      <section id="unified-balance" className="py-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="flex items-start space-x-4 mb-8">
                <div className="w-1 h-16 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full shrink-0 mt-1" />
                <h2 className="text-3xl md:text-5xl font-black leading-tight">
                  All Your Coins.{" "}
                  <span className="text-gradient">One Number That Matters.</span>
                </h2>
              </div>
              <div className="space-y-6 text-gray-400 leading-relaxed mb-12">
                <p>
                  Managing a diversified digital portfolio shouldn't require a spreadsheet and five browser tabs. Core Capital's unified balance engine does the heavy lifting.
                </p>
                <p>
                  You choose your display currency — USD, EUR, GBP, NGN, or your primary coin denomination. Core Capital normalizes everything else to match. No manual calculations. No approximations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: Activity, title: "Live Rate Engine", desc: "Institutional data feeds averaged for accuracy. Updates every 30s." },
                  { icon: Layers, title: "Per-Coin Breakdown", desc: "Formats individual holdings like a professional asset ledger." },
                  { icon: RefreshCw, title: "Base Currency Flexibility", desc: "Recalculates your entire portfolio view instantly." }
                ].map((p, i) => (
                  <div key={i} className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                      <p.icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-sm text-white">{p.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 blur-[100px] -z-10 rounded-full" />
                <div className="glass-card p-1 rounded-[2.5rem]">
                  <div className="bg-[#0A0E1A] rounded-[2.3rem] p-8 overflow-hidden">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mb-2">Total Net Balance</p>
                        <p className="text-3xl font-black text-white">$142,509.<span className="text-[var(--color-primary)]">82</span></p>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-[var(--color-secondary)]" />
                      </div>
                    </div>

                    {/* Mock asset distribution chart */}
                    <div className="h-4 w-full bg-white/[0.05] rounded-full overflow-hidden flex mb-10">
                      <div className="h-full bg-[var(--color-primary)] w-[45%]" />
                      <div className="h-full bg-[var(--color-secondary)] w-[25%]" />
                      <div className="h-full bg-blue-500 w-[15%]" />
                      <div className="h-full bg-purple-500 w-[15%]" />
                    </div>

                    <div className="space-y-4">
                      {[
                        { sym: "BTC", val: "$64,129", p: "45%" },
                        { sym: "ETH", val: "$35,627", p: "25%" },
                        { sym: "USDT", val: "$21,376", p: "15%" },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                          <span className="text-xs font-bold text-white uppercase">{row.sym}</span>
                          <div className="text-right">
                            <span className="text-xs font-black text-white block">{row.val}</span>
                            <span className="text-[10px] text-gray-500 uppercase font-bold">{row.p} allocation</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: IN-WALLET CONVERSION ────────────────────────────── */}
      <section id="coin-conversion" className="py-28 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal className="order-2 lg:order-1">
              {/* Conversion diagram */}
              <div className="relative p-10 glass-card rounded-[3rem] overflow-hidden bg-white/[0.01]">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center mx-auto">
                        <span className="text-2xl font-black text-[var(--color-primary)]">BTC</span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Source Asset</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                       <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent mb-4" />
                       <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)] animate-pulse">
                          <RefreshCw className="w-6 h-6" />
                       </div>
                       <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent mt-4" />
                    </div>

                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/20 flex items-center justify-center mx-auto">
                        <span className="text-2xl font-black text-[var(--color-secondary)]">USDT</span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 uppercase">Destination Asset</p>
                    </div>
                 </div>
                 <div className="mt-12 p-5 bg-[#0A0E1A] rounded-2xl border border-white/5">
                    <div className="flex justify-between text-[10px] font-bold text-gray-600 uppercase mb-2">
                      <span>Current Rate</span>
                      <span>Fee: 0.05%</span>
                    </div>
                    <p className="text-sm font-black text-white text-center">1 BTC ≈ 64,129.42 USDT</p>
                 </div>
              </div>
            </Reveal>

            <Reveal className="order-1 lg:order-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">Sovereign Swaps</p>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                Convert Between Coins <br />
                <span className="text-gradient">Without Leaving Your Vault</span>
              </h2>
              <div className="space-y-6 text-gray-400 mb-10">
                <p>
                  Most wallet users convert coins by withdrawing to an exchange, swapping, and re-depositing — exposing their assets to multiple transfer points. Core Capital eliminates that risk.
                </p>
                <p>
                  Our in-wallet conversion executes the swap inside your custody umbrella. Your coins never leave Core Capital's encrypted infrastructure during conversion.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { t: "Rate Transparency", d: "See exact exchange rates and receive amounts before confirming. No hidden spreads." },
                  { t: "No Withdrawal Required", d: "Conversion happens entirely within your account. No external exchanges." },
                  { t: "Full Audit Trail", d: "Every swap is recorded with rate, timestamp, and asset deltas in your audit log." }
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-secondary)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-black text-white mb-1">{item.t}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: PORTFOLIO INTELLIGENCE ──────────────────────────── */}
      <section id="portfolio-intelligence" className="py-28">
        <div className="container mx-auto px-6">
          <Reveal className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Analytics & Intelligence</p>
            <h2 className="text-3xl md:text-5xl font-black mb-6">More Than a Balance Sheet</h2>
            <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Holding multiple coins is only half the strategy. Understanding how they interact and perform relative to each other is where serious portfolio management begins.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {intelligenceFeatures.map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="glass-card p-10 rounded-[2.5rem] h-full border border-white/[0.04] bg-gradient-to-b from-white/[0.02] to-transparent">
                  <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--color-primary)] mb-8">
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-white mb-4 leading-tight">{f.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CLOSING CTA ────────────────────────────────────── */}
      <section id="coins-cta" className="py-28">
        <div className="container mx-auto px-6">
          <Reveal>
            <div className="relative glass-card p-14 md:p-24 rounded-[4rem] text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 opacity-[0.2] pointer-events-none" />
              
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-8">Consolidate Your Wealth</p>
              
              <div className="space-y-4 mb-14">
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">One Vault.</h2>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">Every Coin.</h2>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gradient uppercase tracking-tighter">Full Control.</h2>
              </div>

              <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
                Stop fragmenting your wealth across multiple wallets, exchanges, and platforms. Core Capital's multi-coin architecture was built specifically for investors who hold more than one asset.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  href="/auth/register"
                  className="btn-primary px-12 py-4 text-base font-black relative group"
                >
                  <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                  Open Your Multi-Coin Wallet
                </Link>
                <Link
                  href="/wallet"
                  className="btn-secondary px-10 py-4 text-base font-bold"
                >
                  Explore More Features
                </Link>
              </div>

              <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.25em]">
                🔒 All coins held under 256-bit encryption · Instant conversion · Real-time portfolio analytics · No fragmented custody
              </p>
            </div>
          </Reveal>
        </div>
      </section>

    </main>
  );
}
