"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  Cpu,
  Share2,
  Zap,
  ShieldCheck,
  Globe,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Network,
  Activity,
  Clock,
  DollarSign,
  Lock,
  BarChart3,
  Server,
  Terminal,
  Search,
  Database
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
const networks = [
  {
    name: "Ethereum Mainnet (ETH)",
    ticker: "ETH",
    spec: "Type: Proof of Stake | Avg. Confirmation: ~12 seconds | Fee Level: Variable (medium–high)",
    desc: "The most battle-tested smart contract network in existence. Ethereum Mainnet is the default choice for high-value transactions where absolute security and network maturity outweigh gas cost considerations."
  },
  {
    name: "BNB Smart Chain (BSC)",
    ticker: "BSC",
    spec: "Type: Proof of Staked Authority | Avg. Confirmation: ~3 seconds | Fee Level: Low",
    desc: "High-throughput and low-cost — BNB Smart Chain is the network of choice when speed and fee efficiency are the priority without sacrificing meaningful security. EVM-compatible and widely supported."
  },
  {
    name: "Solana (SOL)",
    ticker: "SOL",
    spec: "Type: Proof of History + PoS | Avg. Confirmation: <1 second | Fee Level: Very Low",
    desc: "The fastest settlement network on the platform. Solana's architecture processes thousands of transactions per second with sub-cent fees — built for investors who move capital frequently and at scale."
  },
  {
    name: "Polygon (MATIC)",
    ticker: "MATIC",
    spec: "Type: Proof of Stake | Avg. Confirmation: ~2 seconds | Fee Level: Very Low",
    desc: "Ethereum's institutional scaling companion. Polygon inherits Ethereum's security model while dramatically reducing fees and confirmation times — ideal for high-frequency transfers."
  },
  {
    name: "Tron (TRX)",
    ticker: "TRX",
    spec: "Type: Delegated Proof of Stake | Avg. Confirmation: ~3 seconds | Fee Level: Very Low",
    desc: "Dominant in stablecoin transfers — particularly USDT. If you are moving dollar-denominated digital value at scale, Tron's network is frequently the most cost-efficient path available."
  },
  {
    name: "Avalanche (AVAX)",
    ticker: "AVAX",
    spec: "Type: Avalanche Consensus | Avg. Confirmation: ~2 seconds | Fee Level: Low",
    desc: "Institutional-grade throughput with sub-2-second finality. Avalanche's unique consensus mechanism delivers both speed and true finality — a rare combination for time-sensitive capital movements."
  },
  {
    name: "Arbitrum (ARB)",
    ticker: "ARB",
    spec: "Type: Optimistic Rollup (L2) | Avg. Confirmation: ~1 second | Fee Level: Low",
    desc: "Ethereum security. Fraction of the cost. Arbitrum inherits Ethereum's validator network while settling transactions on Layer 2 — delivering near-instant finality at dramatically lower fees."
  },
  {
    name: "Bitcoin Network (BTC)",
    ticker: "BTC",
    spec: "Type: Proof of Work | Avg. Confirmation: ~10 minutes | Fee Level: Variable (medium–high)",
    desc: "The most secure and most decentralized settlement network ever created. Bitcoin's network is not chosen for speed — it is chosen for permanence and the most proven consensus mechanism in history."
  }
];

const intelligenceFeatures = [
  { id: "01", title: "Live Fee Estimation", desc: "Before you confirm, Core Capital pulls real-time fee data from the selected network and displays the current cost in your base currency." },
  { id: "02", title: "Network Congestion Indicator", desc: "A live congestion status for each supported network — displayed as a simple low / medium / high indicator at the moment of transaction." },
  { id: "03", title: "Estimated Confirmation Timer", desc: "Based on current block production rates and mempool depth, we estimate how long your transaction will take to receive its first confirmation." },
  { id: "04", title: "Historical Fee Trends", desc: "View a 7-day fee trend chart for each network — so you can identify whether current fees are anomalously high or within normal range." },
  { id: "05", title: "Network Health Status", desc: "We monitor operational health continuously. If a network is experiencing issues, a status flag appears in the panel before you select it." },
  { id: "06", title: "Smart Network Suggestions", desc: "Based on the coin, amount, and history, our engine surfaces a recommended network with a brief rationale. Overridable at any time." },
];

const vettingCriteria = [
  { title: "Security Track Record", desc: "Minimum operational history and a clean security record required. We evaluate live duration and resolution of past consensus challenges." },
  { title: "Decentralization Score", desc: "We evaluate validator/miner distribution across each network and maintain minimum thresholds to avoid single-point-of-failure risks." },
  { title: "Liquidity Depth", desc: "A network must have sufficient on-chain liquidity to support institutional transaction volumes without slippage or fee instability." },
  { title: "Regulatory Compatibility", desc: "Review for compatibility with AML screening, traceability, and jurisdictional posture. We avoid networks in regulatory grey zones." },
  { title: "Active Development & Governance", desc: "Requires evidence of ongoing protocol development, active governance, and a credible roadmap to ensure long-term viability." },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function NetworksContent() {
  return (
    <main className="flex flex-col w-full overflow-hidden pt-24">
      
      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="networks-hero" className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Node Map Background */}
        <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
          <div className="absolute inset-0 opacity-[0.1] pointer-events-none select-none">
             {/* Node SVG Grid */}
             <svg className="w-full h-full" viewBox="0 0 1000 1000">
               {[...Array(12)].map((_, i) => (
                 <g key={i}>
                   {[...Array(12)].map((_, j) => {
                     const x = i * 100 + 50;
                     const y = j * 100 + 50;
                     return (
                       <g key={`${i}-${j}`}>
                          <circle cx={x} cy={y} r="1.5" fill="var(--color-primary)" />
                          {i < 11 && (
                            <motion.line 
                              x1={x} y1={y} x2={x+100} y2={y} 
                              stroke="var(--color-primary)" strokeWidth="0.5" 
                              initial={{ pathLength: 0 }} 
                              animate={{ pathLength: [0, 1, 0] }}
                              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                          {j < 11 && (
                            <motion.line 
                              x1={x} y1={y} x2={x} y2={y+100} 
                              stroke="var(--color-primary)" strokeWidth="0.5" 
                              initial={{ pathLength: 0 }} 
                              animate={{ pathLength: [0, 1, 0] }}
                              transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                       </g>
                     );
                   })}
                 </g>
               ))}
             </svg>
          </div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.03] blur-[140px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-secondary)] opacity-[0.03] blur-[140px] rounded-full" />
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
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
          >
            <span className="text-[var(--color-primary)]">Choose</span> Your Network. <br />
            <span className="text-[var(--color-secondary)]">Control</span> Your Transaction.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed font-medium"
          >
            Not all blockchains are equal. Speed, cost, and security vary dramatically across networks — and Core Capital puts that choice directly in your hands.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Most wallets pick a network for you and hide the decision behind the interface. Core Capital does the opposite. We surface network selection as a first-class feature — because serious investors don't leave infrastructure to chance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/auth/register" className="btn-primary px-10 py-4 text-base font-black tracking-wide">
              Open Your Core Capital Wallet
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: WHY NETWORK SELECTION MATTERS ─────────────────── */}
      <section id="why-networks" className="py-28 bg-black/20 relative">
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
         <div className="container mx-auto px-6 relative">
            <Reveal className="max-w-4xl mx-auto text-center mb-20">
               <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                 The Network Is Not a Background Detail. <br />
                 <span className="text-gradient">It Is the Decision.</span>
               </h2>
               <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                 Every blockchain network has a different architecture, different validators, different fee structures, and different confirmation times. Choosing the right one is how sophisticated investors manage execution quality.
               </p>
               <p className="text-sm text-gray-500 leading-relaxed max-w-3xl mx-auto">
                 When you send digital currency, your transaction doesn't just move from point A to point B. It is broadcast to a network of nodes, validated, and confirmed. That entire process — its speed, its cost, and its finality — is determined by which network you use. Core Capital gives you the infrastructure to make that call correctly.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                 { icon: Clock, title: "Speed Varies by Network", desc: "Confirmation times range from under 1 second on the fastest networks to several minutes on proof-of-work chains." },
                 { icon: DollarSign, title: "Fees Are Network-Determined", desc: "Gas fees and validator fees are set by the network. We surface the real cost before you transact." },
                 { icon: Lock, title: "Finality Is Not Uniform", desc: "Transaction finality differs across chains. Some achieve it in seconds; others require multiple block confirmations." }
               ].map((c, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                    <div className="glass-card p-10 rounded-[2.5rem] border-t-2 border-[var(--color-primary)]/30 h-full">
                       <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6">
                          <c.icon className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-black text-white mb-4">{c.title}</h3>
                       <p className="text-gray-400 text-sm leading-relaxed">{c.desc}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 3: SUPPORTED NETWORKS ─────────────────────────────── */}
      <section id="supported-networks" className="py-28">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">Infrastructure Coverage</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">The Networks Core Capital Supports</h2>
               <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
                 Every network on the platform was selected against the same criteria: security track record, decentralization, institutional liquidity, and active development. We don't add networks for novelty.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {networks.map((net, i) => (
                 <Reveal key={net.ticker} delay={i * 0.05}>
                    <motion.div 
                      whileHover={{ y: -6 }}
                      className="glass-card p-10 rounded-[3rem] border-l-4 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/60 transition-all group"
                    >
                       <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-black text-white">{net.name}</h3>
                          <div className="px-3 py-1 bg-white/[0.05] rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">{net.ticker}</div>
                       </div>
                       <div className="font-mono text-[10px] text-[var(--color-secondary)] uppercase tracking-[0.1em] mb-6 font-bold">
                         {net.spec}
                       </div>
                       <p className="text-gray-400 text-sm leading-relaxed">
                         {net.desc}
                       </p>
                    </motion.div>
                 </Reveal>
               ))}
            </div>

            <Reveal delay={0.4} className="text-center mt-16 italic text-gray-600 text-sm">
               This roster reads like a professional asset class prospectus — informative, precise, and trustworthy.
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 4: HOW NETWORK SELECTION WORKS ────────────────────── */}
      <section id="how-network-selection-works" className="py-28 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-24">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">The Workflow</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">How Selection Works Inside Core Capital</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 We built network selection to be powerful for the technically sophisticated — and completely non-intimidating for everyone else.
               </p>
            </Reveal>

            <div className="relative max-w-4xl mx-auto">
               {/* Connecting Line (Vertical for all screens here for consistency) */}
               <div className="absolute left-[24px] top-4 bottom-4 w-px bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] opacity-20 hidden md:block" />
               
               <div className="space-y-16">
                  {[
                    { id: "01", title: "Initiate Your Transaction", desc: "Begin a send or conversion. Enter destination and amount. At this point, no network has been committed." },
                    { id: "02", title: "Compatible Network Detection", desc: "Based on coin and address, our routing engine surfaces all valid compatible networks automatically." },
                    { id: "03", title: "Review Network Comparison", desc: "A side-by-side comparison displays confirmation time, current fee, and finality rating for each option." },
                    { id: "04", title: "Select Your Network", desc: "Choose the network that matches your priority — fastest settlement, lowest cost, or highest security." },
                    { id: "05", title: "Confirm and Execute", desc: "Review the final summary and confirm with biometric auth. We broadcast to the selected network immediately." },
                    { id: "06", title: "Real-Time Status Tracking", desc: "Once submitted, your transaction appears with real-time updates — pending, confirmed, and fully settled." }
                  ].map((step, i) => (
                    <Reveal key={step.id} delay={i * 0.1}>
                       <div className="flex items-start space-x-10 relative">
                          <div className="w-12 h-12 rounded-2xl bg-[#0A0E1A] border-2 border-[var(--color-primary)] flex items-center justify-center text-lg font-black text-[var(--color-primary)] shrink-0 z-10 shadow-[0_0_20px_rgba(240,180,41,0.2)]">
                             {step.id}
                          </div>
                          <div>
                             <h4 className="text-xl font-black text-white mb-2">{step.title}</h4>
                             <p className="text-gray-400 text-sm leading-relaxed max-w-xl">{step.desc}</p>
                          </div>
                       </div>
                    </Reveal>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ── SECTION 5: NETWORK INTELLIGENCE ───────────────────────────── */}
      <section id="network-intelligence" className="py-28 relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(240,180,41,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,41,0.2) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
         <div className="container mx-auto px-6 relative">
            <Reveal className="text-center mb-20">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">Data Environment</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">Built-In Network Intelligence</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 Choosing a network is only the beginning. Core Capital's intelligence layer gives you live data so your selection is based on current reality, not assumptions.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {intelligenceFeatures.map((f, i) => (
                 <Reveal key={f.id} delay={i * 0.08}>
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/[0.04] bg-[#0A0E1A]/80 hover:bg-[#0A0E1A] transition-all group">
                       <span className="text-3xl font-black text-white/[0.05] group-hover:text-[var(--color-secondary)]/20 transition-colors mb-4 block leading-none">{f.id}</span>
                       <h4 className="text-lg font-black text-white mb-3 flex items-center space-x-2">
                          <Activity className="w-4 h-4 text-[var(--color-secondary)]" />
                          <span>{f.title}</span>
                       </h4>
                       <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 6: SECURITY & TRUST ───────────────────────────────── */}
      <section id="network-trust" className="py-28 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="mb-20">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Vetting & Compliance</p>
               <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight max-w-4xl">
                 We Only Connect You to Networks We Trust With <span className="text-gradient">Institutional Capital</span>
               </h2>
               <p className="text-lg text-gray-400 max-w-3xl leading-relaxed">
                 Adding a network to Core Capital is an infrastructure decision — evaluated against the same standards we apply to our own custody architecture. Every network goes through a formal review.
               </p>
            </Reveal>

            <div className="max-w-4xl space-y-12">
               {vettingCriteria.map((c, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                    <div className="border-t border-white/10 pt-8 group">
                       <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16">
                          <h3 className="text-xl font-black text-white md:w-1/3 shrink-0 group-hover:text-[var(--color-primary)] transition-colors tracking-tight">
                            {c.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed md:w-2/3">
                            {c.desc}
                          </p>
                       </div>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 7: CLOSING CTA ────────────────────────────────────── */}
      <section id="networks-cta" className="py-28">
         <div className="container mx-auto px-6">
            <Reveal>
               <div className="relative glass-card p-14 md:p-24 rounded-[4rem] text-center overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
                  <div className="absolute inset-0 bg-black/40 -z-10" />
                  
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-10">Infrastructure Excellence</p>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-10 leading-tight uppercase tracking-tighter">
                    The Network Is Your Decision. <br />
                    Make It with the Right Infrastructure.
                  </h2>

                  <p className="text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed text-base md:text-lg">
                    Core Capital is the only digital wallet that treats network selection as a first-class feature. Every transaction can be optimized for speed, cost, or permanence — on your terms.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                     <Link href="/auth/register" className="btn-primary px-12 py-4 text-base font-black relative group">
                        <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                        Open Your Core Capital Wallet
                     </Link>
                     <Link href="/wallet" className="btn-secondary px-10 py-4 text-base font-bold">
                        Explore More Features
                     </Link>
                  </div>

                  <div className="space-y-4">
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
                        🔐 Multi-network support · Live fee data · Real-time confirmation tracking · Institutional network vetting
                     </p>
                     
                     <div className="pt-8 border-t border-white/5 inline-block">
                        <p className="text-2xl md:text-4xl font-black text-white italic tracking-tight leading-tight">
                          "Your capital moves on your network. <br className="hidden md:block" />
                          On your terms. <span className="text-[var(--color-primary)]">Always.</span>"
                        </p>
                     </div>
                  </div>
               </div>
            </Reveal>
         </div>
      </section>

    </main>
  );
}
