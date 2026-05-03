"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  Globe,
  BarChart3,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Activity,
  PieChart,
  Shield,
  Search,
  Bell,
  Clock,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  LayoutGrid
} from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

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
const tickerData = [
  { s: "BTC", p: "$67,240.18", c: "2.41%", d: "up" },
  { s: "ETH", p: "$3,512.74", c: "1.87%", d: "up" },
  { s: "SOL", p: "$152.33", c: "0.62%", d: "down" },
  { s: "BNB", p: "$412.90", c: "3.15%", d: "up" },
  { s: "USDT", p: "$1.00", c: "0.00%", d: "neutral" },
  { s: "XRP", p: "$0.5821", c: "4.22%", d: "up" },
  { s: "MATIC", p: "$0.8834", c: "1.03%", d: "down" },
  { s: "AVAX", p: "$38.12", c: "2.78%", d: "up" },
  { s: "LTC", p: "$84.50", c: "0.44%", d: "down" },
  { s: "USDC", p: "$1.00", c: "0.00%", d: "neutral" },
];

const marketSnapshot = [
  { a: "Bitcoin (BTC)", p: "$67,240.18", c24: "+2.41%", c7d: "+5.88%", mc: "$1.32T", v: "$38.4B", s: "Live" },
  { a: "Ethereum (ETH)", p: "$3,512.74", c24: "+1.87%", c7d: "+4.21%", mc: "$421.6B", v: "$19.7B", s: "Live" },
  { a: "BNB (BNB)", p: "$412.90", c24: "+3.15%", c7d: "+6.44%", mc: "$63.8B", v: "$2.1B", s: "Live" },
  { a: "Solana (SOL)", p: "$152.33", c24: "-0.62%", c7d: "+3.10%", mc: "$70.2B", v: "$4.8B", s: "Live" },
  { a: "Tether (USDT)", p: "$1.00", c24: "0.00%", c7d: "0.00%", mc: "$112.3B", v: "$92.1B", s: "Live" },
  { a: "USD Coin (USDC)", p: "$1.00", c24: "0.00%", c7d: "0.00%", mc: "$43.7B", v: "$8.4B", s: "Live" },
  { a: "XRP (XRP)", p: "$0.5821", c24: "+4.22%", c7d: "+8.77%", mc: "$31.4B", v: "$1.9B", s: "Live" },
  { a: "Avalanche (AVAX)", p: "$38.12", c24: "+2.78%", c7d: "+5.33%", mc: "$15.6B", v: "$0.9B", s: "Live" },
  { a: "Polygon (MATIC)", p: "$0.8834", c24: "-1.03%", c7d: "-2.14%", mc: "$8.2B", v: "$0.6B", s: "Live" },
  { a: "Litecoin (LTC)", p: "$84.50", c24: "-0.44%", c7d: "+1.92%", mc: "$6.3B", v: "$0.5B", s: "Live" },
];

const macroIndicators = [
  { t: "Total Digital Asset Market Cap", v: "$2.41 Trillion", d: "The combined market capitalization of all tracked digital assets — a macro health indicator for the entire asset class." },
  { t: "Bitcoin Dominance Index", v: "54.7%", d: "Bitcoin's percentage of total digital asset market capitalization. High dominance suggests risk-off sentiment." },
  { t: "Total 24H Market Volume", v: "$187.4 Billion", d: "Aggregate trading volume across all digital assets in the past 24 hours — an indicator of market participation intensity." },
  { t: "Fear & Greed Index", v: "72 — Greed", d: "A composite sentiment index built from volatility, market momentum, social signals, and trading volume." },
  { t: "Global Crypto Market Trend", v: "Bullish — 68%", d: "The percentage of Core Capital supported assets currently trading above their 24-hour open." },
  { t: "Stablecoin Dominance", v: "8.3%", d: "The proportion of the total market held in stablecoins — a proxy for how much capital is sitting on the sidelines." },
];

const trendingAssets = [
  { r: "#1", n: "Bitcoin (BTC)", d: "24H Volume: $38.4B · Price Change: ▲ 2.41% · Wallet Deposits: ▲ 18% vs. 7-day avg", p: "BTC continues to lead inbound deposit volume across the platform — consistent with broad market confidence in the flagship digital asset." },
  { r: "#2", n: "Solana (SOL)", d: "24H Volume: $4.8B · Price Change: ▼ 0.62% · Wallet Deposits: ▲ 34% vs. 7-day avg", p: "Despite minor price softness, SOL is seeing the largest relative deposit increase, suggesting accumulation into the dip." },
  { r: "#3", n: "XRP (XRP)", d: "24H Volume: $1.9B · Price Change: ▲ 4.22% · Wallet Deposits: ▲ 27% vs. 7-day avg", p: "XRP is the strongest 24-hour performer, fueled by renewed institutional interest following recent regulatory clarity." },
  { r: "#4", n: "Ethereum (ETH)", d: "24H Volume: $19.7B · Price Change: ▲ 1.87% · Wallet Deposits: ▲ 11% vs. 7-day avg", p: "ETH deposit growth is steady, consistent with its role as a core portfolio holding. Smart contract activity remains elevated." },
  { r: "#5", n: "Avalanche (AVAX)", d: "24H Volume: $0.9B · Price Change: ▲ 2.78% · Wallet Deposits: ▲ 22% vs. 7-day avg", p: "AVAX is attracting growing interest seeking high-throughput network exposure outside of Ethereum." },
];

const alerts = [
  { t: "Price Threshold Alerts", d: "Set a target price for any supported asset. We send immediate notifications via push, email, or SMS when your level is hit." },
  { t: "Portfolio Value Alerts", d: "Define a total portfolio value floor or ceiling. Useful for systematic rebalancing triggers and risk management thresholds." },
  { t: "Large Market Move Alerts", d: "Receive automatic notifications when any supported asset moves more than a defined percentage within 24 hours." },
  { t: "Volume Spike Detection", d: "We monitor volume patterns across all assets and alert you when activity exceeds a threshold — before the price reacts." },
  { t: "Network Fee Alerts", d: "Notify you when network fees on your preferred chain drop below a defined threshold — so you can execute at the optimal moment." },
  { t: "Weekly Market Digest", d: "Institutional quality market briefing delivered to your email summarizing performance, trends, and macro indicators." },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MarketContent() {
  const [activeTab, setActiveTab] = useState(0);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await fetch("/api/public/market");
        if (response.ok) {
          const data = await response.json();
          setMarketData(data);
        }
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = marketData.length > 0 
    ? marketData.filter((c: any) => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : marketSnapshot; // Fallback to static if API fails or is empty

  // Map API data for ticker if available
  const displayTicker = marketData.length > 0
    ? marketData.slice(0, 10).map(c => ({
        s: c.symbol.toUpperCase(),
        p: `$${c.current_price.toLocaleString()}`,
        c: `${Math.abs(c.price_change_percentage_24h).toFixed(2)}%`,
        d: c.price_change_percentage_24h > 0 ? "up" : c.price_change_percentage_24h < 0 ? "down" : "neutral"
      }))
    : tickerData;

  return (
    <main className="flex flex-col w-full overflow-hidden pt-24 bg-[#05070A]">
      
      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="market-hero" className="relative pt-20 pb-0 overflow-hidden">
        {/* Terminal Grid Background */}
        <div className="absolute inset-0 -z-10 opacity-[0.1]">
           <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(240,180,41,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,41,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="container mx-auto px-6 text-center mb-16">
          <motion.h1
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
          >
            { "The Market, Unfiltered. Intelligence That Moves With the Money.".split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="inline-block mr-[0.2em]"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <Reveal delay={0.4}>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
              Core Capital's Market Overview gives every wallet holder access to the same caliber of digital asset market intelligence used by institutional traders.
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register" className="btn-primary px-10 py-4 text-base font-black tracking-wide">
                Open Your Wallet to Trade
              </Link>
              <Link href="/" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">
                ← Back to Home
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Scrolling Ticker */}
        <div className="w-full bg-black/40 border-y border-white/5 py-4 overflow-hidden relative">
          <div className="flex whitespace-nowrap animate-marquee">
             {[...displayTicker, ...displayTicker].map((coin, i) => (
               <div key={i} className="inline-flex items-center space-x-3 px-8 font-mono text-[13px]">
                  <span className="font-black text-white">{coin.s}</span>
                  <span className="text-gray-400">{coin.p}</span>
                  <span className={`flex items-center ${coin.d === 'up' ? 'text-[var(--color-primary)]' : coin.d === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                    {coin.d === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : coin.d === 'down' ? <ArrowDownRight className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                    {coin.c}
                  </span>
                  <span className="text-white/10 mx-4">•</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: LIVE MARKET SNAPSHOT ──────────────────────────── */}
      <section id="market-snapshot" className="py-28">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black mb-6">Live Market Snapshot</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 A real-time price table across every digital asset supported on the platform — updated continuously.
               </p>
            </Reveal>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
               <div className="flex items-center space-x-2 bg-white/[0.05] p-1 rounded-full border border-white/5">
                  {['Price', '24H Change', 'Market Cap', 'Volume'].map((f) => (
                    <button key={f} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${f === 'Price' ? 'bg-[var(--color-primary)] text-black' : 'text-gray-500 hover:text-white'}`}>
                      {f}
                    </button>
                  ))}
               </div>
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search asset..." 
                    className="bg-white/[0.05] border border-white/10 rounded-full py-2.5 pl-11 pr-6 text-sm text-white focus:outline-none focus:border-[var(--color-primary)] transition-all w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
            </div>

            <Reveal>
               <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                       <thead>
                          <tr className="bg-white/[0.03]">
                             <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Asset</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Price (USD)</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">24H Change</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">7D Change</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Market Cap</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">24H Volume</th>
                             <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {marketData.length > 0 ? (
                            filteredCoins.map((coin: any, i: number) => (
                              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                 <td className="p-6 text-sm font-black text-white">
                                    <div className="flex items-center space-x-3">
                                       <img src={coin.image} alt="" className="w-6 h-6 rounded-full" />
                                       <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                                    </div>
                                 </td>
                                 <td className="p-6 text-sm font-mono font-bold text-white tracking-tight">
                                    ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                 </td>
                                 <td className={`p-6 text-sm font-mono font-bold ${coin.price_change_percentage_24h >= 0 ? 'text-[var(--color-primary)]' : 'text-red-500'}`}>
                                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                                 </td>
                                 <td className="p-6 text-sm font-mono text-gray-400">
                                    {/* API might not have 7d change in simple fetch, fallback to placeholder logic or hide */}
                                    <span className="opacity-50">--</span>
                                 </td>
                                 <td className="p-6 text-sm font-mono text-gray-400">${(coin.market_cap / 1e9).toFixed(2)}B</td>
                                 <td className="p-6 text-sm font-mono text-gray-400">${(coin.total_volume / 1e6).toFixed(2)}M</td>
                                 <td className="p-6">
                                    <div className="flex items-center space-x-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse shadow-[0_0_8px_rgba(0,212,170,0.5)]" />
                                       <span className="text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-widest">Live</span>
                                    </div>
                                 </td>
                              </tr>
                            ))
                          ) : (
                            marketSnapshot.map((row, i) => (
                              <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                 <td className="p-6 text-sm font-black text-white">{row.a}</td>
                                 <td className="p-6 text-sm font-mono font-bold text-white tracking-tight">{row.p}</td>
                                 <td className={`p-6 text-sm font-mono font-bold ${row.c24.startsWith('+') ? 'text-[var(--color-primary)]' : row.c24 === '0.00%' ? 'text-gray-500' : 'text-red-500'}`}>
                                   {row.c24}
                                 </td>
                                 <td className={`p-6 text-sm font-mono font-bold ${row.c7d.startsWith('+') ? 'text-[var(--color-primary)]' : row.c7d === '0.00%' ? 'text-gray-500' : 'text-red-500'}`}>
                                   {row.c7d}
                                 </td>
                                 <td className="p-6 text-sm font-mono text-gray-400">{row.mc}</td>
                                 <td className="p-6 text-sm font-mono text-gray-400">{row.v}</td>
                                 <td className="p-6">
                                    <div className="flex items-center space-x-2">
                                       <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse shadow-[0_0_8px_rgba(0,212,170,0.5)]" />
                                       <span className="text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-widest">{row.s}</span>
                                    </div>
                                 </td>
                              </tr>
                            ))
                          )}
                       </tbody>
                    </table>
                  </div>
               </div>
            </Reveal>

            <div className="mt-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
               Market data refreshes every 30 seconds • Sourced from institutional feed providers
            </div>
         </div>
      </section>

      {/* ── SECTION 3: MARKET SENTIMENT & MACRO ──────────────────────── */}
      <section id="market-sentiment" className="py-28 bg-black/40">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
               <h2 className="text-3xl md:text-5xl font-black mb-6">Macro Intelligence</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 Price is what you pay. Context is what you need. Core Capital surfaces the macro signals that point toward market momentum.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {macroIndicators.map((m, i) => (
                 <Reveal key={i} delay={i * 0.08}>
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/[0.04] bg-[#0A0E1A]/80 hover:bg-[#0A0E1A] transition-all relative overflow-hidden group">
                       <div className="absolute top-4 right-6 w-2 h-2 rounded-full bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 animate-pulse transition-opacity" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">{m.t}</p>
                       <h3 className="text-3xl font-black text-white mb-6 font-mono tracking-tighter">{m.v}</h3>
                       <p className="text-gray-500 text-xs leading-relaxed">{m.d}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 4: TRENDING ASSETS ───────────────────────────────── */}
      <section id="trending-assets" className="py-28">
         <div className="container mx-auto px-6">
            <Reveal className="mb-20 max-w-4xl">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Market Momentum</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">Trending on Core Capital</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 Based on transaction volume, deposits, and momentum across our platform — these assets are attracting the most serious attention today.
               </p>
            </Reveal>

            <div className="space-y-4">
               {trendingAssets.map((t, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                    <div className="flex items-start border-b border-white/5 pb-10 group hover:bg-white/[0.01] transition-colors p-4 rounded-3xl">
                       <div className="text-4xl md:text-6xl font-black text-white/[0.03] group-hover:text-[var(--color-primary)]/20 transition-colors mr-8 md:mr-16 pt-2 select-none">
                         {t.r}
                       </div>
                       <div className="flex-1">
                          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-[var(--color-primary)] transition-colors">{t.n}</h3>
                          <div className="bg-white/[0.05] border border-white/5 inline-block px-4 py-1.5 rounded-lg mb-6">
                             <p className="text-[10px] font-mono font-bold text-[var(--color-secondary)] uppercase tracking-widest">
                               {t.d}
                             </p>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
                            {t.p}
                          </p>
                       </div>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 5: MARKET CHARTS ─────────────────────────────────── */}
      <section id="market-charts" className="py-28 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black mb-6">Visual Market Intelligence</h2>
               <p className="text-gray-400 max-w-2xl mx-auto">
                 Data in a chart tells you where things are going. Core Capital gives you the visual context your portfolio decisions deserve.
               </p>
            </Reveal>

            <div className="max-w-6xl mx-auto">
               <div className="flex justify-center space-x-4 mb-10">
                  {['30D Market Cap', 'BTC vs ETH 90D', '24H Volume Distribution'].map((tab, idx) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(idx)}
                      className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === idx ? 'bg-[var(--color-primary)] text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
               </div>

               <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-card p-10 rounded-[3rem] border border-white/5 min-h-[500px] flex flex-col"
                  >
                     <div className="flex items-center space-x-2 mb-10">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Visual Intelligence Window</span>
                     </div>
                     
                     <div className="flex-1 flex items-center justify-center relative">
                        {/* Mock Chart Content */}
                        <div className="w-full h-full max-h-[350px] relative">
                           {activeTab === 0 && (
                             <div className="w-full h-full flex items-end space-x-1">
                                {[...Array(40)].map((_, i) => (
                                  <motion.div 
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${20 + Math.sin(i * 0.2) * 10 + Math.random() * 60}%` }}
                                    transition={{ duration: 1, delay: i * 0.02 }}
                                    className="flex-1 bg-gradient-to-t from-[var(--color-primary)]/40 to-[var(--color-primary)] rounded-t-sm"
                                  />
                                ))}
                             </div>
                           )}
                           {activeTab === 1 && (
                             <div className="w-full h-full relative">
                                <svg className="w-full h-full" viewBox="0 0 1000 400">
                                   <motion.path 
                                     d="M0,350 Q250,300 500,200 T1000,100" 
                                     fill="none" stroke="var(--color-primary)" strokeWidth="4"
                                     initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }}
                                   />
                                   <motion.path 
                                     d="M0,380 Q250,350 500,300 T1000,250" 
                                     fill="none" stroke="var(--color-secondary)" strokeWidth="3" strokeDasharray="8,8"
                                     initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: 0.5 }}
                                   />
                                </svg>
                             </div>
                           )}
                           {activeTab === 2 && (
                             <div className="w-full h-full flex flex-col justify-center space-y-6">
                                {[
                                  { s: "BTC", v: 90, c: "var(--color-primary)" },
                                  { s: "ETH", v: 75, c: "var(--color-secondary)" },
                                  { s: "USDT", v: 60, c: "#3B82F6" },
                                  { s: "SOL", v: 45, c: "#A855F7" }
                                ].map((bar, i) => (
                                  <div key={i} className="flex items-center space-x-4">
                                     <span className="w-12 text-[10px] font-black text-gray-500">{bar.s}</span>
                                     <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                          initial={{ width: 0 }} animate={{ width: `${bar.v}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                                          className="h-full" style={{ backgroundColor: bar.c }}
                                        />
                                     </div>
                                  </div>
                                ))}
                             </div>
                           )}
                        </div>
                     </div>

                     <div className="mt-10 pt-10 border-t border-white/5">
                        <h4 className="text-sm font-black text-white mb-2">
                          {activeTab === 0 ? '30-Day Market Cap Trend' : activeTab === 1 ? 'Bitcoin vs. Ethereum 90-Day Comparison' : '24H Volume Distribution by Asset'}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-3xl">
                          {activeTab === 0 
                            ? 'Visualize the macro trajectory of the entire digital asset class. A rising trend confirms broad capital accumulation.' 
                            : activeTab === 1 
                            ? 'The relationship between BTC and ETH is one of the most watched signals. Risk appetite is elevated when ETH outperforms.' 
                            : 'See where the trading volume is concentrated. Volume concentration in BTC and ETH signals directional positioning.'}
                        </p>
                     </div>
                  </motion.div>
               </AnimatePresence>
            </div>
         </div>
      </section>

      {/* ── SECTION 6: MARKET ALERTS ─────────────────────────────────── */}
      <section id="market-alerts" className="py-28 relative">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <div className="w-[800px] h-[800px] rounded-full border border-white animate-pulse-slow" />
            <div className="absolute w-[600px] h-[600px] rounded-full border border-white opacity-50" />
            <div className="absolute w-[400px] h-[400px] rounded-full border border-white opacity-25" />
         </div>

         <div className="container mx-auto px-6 relative">
            <Reveal className="text-center mb-20">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Intelligent Monitoring</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">Never Miss a Market Move</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 The market moves when you are not watching. Our alert infrastructure ensures that the moments that matter are never missed.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {alerts.map((a, i) => (
                 <Reveal key={i} delay={i * 0.08}>
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/[0.04] bg-[#0A0E1A]/60 h-full group">
                       <div className="flex justify-between items-start mb-8">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-[var(--color-primary)]">
                             <Bell className="w-5 h-5" />
                          </div>
                          <div className="w-10 h-5 bg-white/[0.05] rounded-full relative p-1 cursor-not-allowed">
                             <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                          </div>
                       </div>
                       <h3 className="text-lg font-black text-white mb-4 tracking-tight">{a.t}</h3>
                       <p className="text-gray-500 text-xs leading-relaxed">{a.d}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 7: CLOSING CTA ────────────────────────────────────── */}
      <section id="market-cta" className="py-28">
         <div className="container mx-auto px-6">
            <Reveal>
               <div className="relative glass-card p-14 md:p-24 rounded-[4rem] text-center overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
                  <div className="absolute inset-0 bg-black/40 -z-10" />
                  
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-10 leading-tight uppercase tracking-tighter">
                    The Market Is Moving <br className="hidden md:block" />
                    <span className="text-[var(--color-primary)]">Right Now.</span> Are You Positioned?
                  </h2>

                  <p className="text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed text-base md:text-lg">
                    Market intelligence without a wallet to act on it is just information. Core Capital gives you both — institutional-grade data and the sovereign infrastructure to move capital.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                     <Link href="/auth/register" className="btn-primary px-12 py-4 text-base font-black relative group shadow-[0_0_30px_rgba(240,180,41,0.2)]">
                        <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                        Open Your Wallet & Access Market Data
                     </Link>
                     <Link href="/wallet" className="btn-secondary px-10 py-4 text-base font-bold">
                        Explore All Features
                     </Link>
                  </div>

                  <div className="space-y-10">
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
                        📊 Live market data · Real-time alerts · Multi-asset tracking · Institutional feeds · Zero delays
                     </p>
                     
                     <div className="pt-10 border-t border-white/5 inline-block">
                        <p className="text-xl md:text-3xl font-black text-white tracking-tighter leading-tight">
                          The investors who win are the ones who see the market clearly. <br />
                          <span className="text-3xl md:text-5xl text-[var(--color-primary)]">Core Capital gives you the lens.</span>
                        </p>
                     </div>
                  </div>
               </div>
            </Reveal>
         </div>

         {/* Market Stats Footer Strip */}
         <div className="mt-12 bg-black border-y border-white/5 py-10">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
                  {[
                    { v: "$2.41T", l: "Total Market Cap" },
                    { v: "$187.4B", l: "24H Global Volume" },
                    { v: "180,000+", l: "Wallet Holders" },
                    { v: "99.99%", l: "Platform Uptime" }
                  ].map((s, i) => (
                    <div key={i} className="space-y-1">
                       <p className="text-2xl md:text-4xl font-black text-white tracking-tighter font-mono">{s.v}</p>
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{s.l}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

    </main>
  );
}
