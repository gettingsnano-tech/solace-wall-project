"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  Zap,
  Wallet,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  Banknote,
  Smartphone,
  Repeat,
  ShieldAlert,
  Search,
  Lock,
  Activity,
  UserCheck,
  ClipboardList
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
const depositMethods = [
  {
    icon: Wallet,
    title: "Crypto Wallet Transfer",
    bestFor: "Investors moving holdings from hardware wallets, software wallets, or self-custody storage.",
    desc: "Send digital currency directly from any external wallet to your Core Capital deposit address. Confirmations are tracked in real time and your balance updates the moment finality is reached on-chain."
  },
  {
    icon: RefreshCw,
    title: "Exchange Transfer",
    bestFor: "Investors consolidating holdings from Binance, Coinbase, Kraken, or similar platforms.",
    desc: "Withdraw directly from any major exchange to your Core Capital wallet address. We accept deposits from all major centralized exchanges — no whitelisting process, no pre-approval required."
  },
  {
    icon: Banknote,
    title: "Bank-Linked Fiat On-Ramp",
    bestFor: "Investors entering the digital asset space or adding fresh capital from traditional banking.",
    desc: "Convert fiat currency to digital assets and deposit directly in a single flow. Link your bank account and purchase supported digital currencies that arrive in your vault immediately upon settlement."
  },
  {
    icon: Smartphone,
    title: "Mobile Payment Rails",
    bestFor: "Investors operating in markets where mobile money is the primary financial infrastructure.",
    desc: "Deposit via supported mobile money platforms and payment networks. Core Capital's mobile deposit rails are fast, low-fee, and accessible without a traditional bank account requirement."
  },
  {
    icon: UserCheck,
    title: "Internal Core Capital Transfer",
    bestFor: "Business partners, investment groups, or family office structures operating multiple accounts.",
    desc: "Receive digital currency from another verified Core Capital wallet holder instantly — with zero network fees and zero confirmation delay. Transfers settle within the Core Capital ledger."
  },
  {
    icon: Repeat,
    title: "Recurring Deposit Schedules",
    bestFor: "Systematic investors who allocate capital on a regular schedule without manual intervention.",
    desc: "Set automated recurring deposits on a daily, weekly, or monthly cadence from any linked source. Core Capital's scheduling engine executes the deposit at your defined time automatically."
  }
];

const networkConfirmations = [
  { name: "Solana (SOL)", confs: "1 confirmation", time: "Under 5 seconds" },
  { name: "BNB Smart Chain", confs: "15 confirmations", time: "~45 seconds" },
  { name: "Polygon", confs: "128 confirmations", time: "~4 minutes" },
  { name: "Tron", confs: "19 confirmations", time: "~1 minute" },
  { name: "Avalanche", confs: "1 confirmation", time: "Under 3 seconds" },
  { name: "Arbitrum", confs: "1 confirmation", time: "~1 second" },
  { name: "Ethereum Mainnet", confs: "12 confirmations", time: "~2.5 minutes" },
  { name: "Bitcoin", confs: "3 confirmations", time: "~30 minutes" },
];

const securityPillars = [
  { title: "AML Transaction Screening", desc: "Every deposit is screened against Anti-Money Laundering databases and blockchain analytics in real time to prevent tainted asset exposure." },
  { title: "On-Chain Source Verification", desc: "We trace the origin chain of every inbound deposit and verify it against risk indicators. High-risk source clusters are flagged automatically." },
  { title: "Address Ownership Binding", desc: "Your deposit address is cryptographically tied to your account. No third party can redirect or intercept your transfer at the infrastructure level." },
  { title: "Deposit Limit Monitoring", desc: "Unusually large or rapid sequences trigger review flags consistent with regulatory obligations, with legitimate large deposits cleared quickly." },
  { title: "Real-Time Fraud Detection", desc: "Behavioral analytics monitors deposit patterns. Anomalous behavior — unexpected amounts or unusual timing — triggers a security review." },
  { title: "Full Deposit Audit Trail", desc: "Every deposit is logged immutably with amount, source, network, timestamps, and compliance status — accessible from your history at any time." },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function DepositsContent() {
  return (
    <main className="flex flex-col w-full overflow-hidden pt-24">
      
      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="deposits-hero" className="relative min-h-[90vh] flex items-center justify-center py-20 overflow-hidden">
        {/* Directional Motion Background */}
        <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
           {/* Moving light streams */}
           {[...Array(6)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ x: "-100%", opacity: 0 }}
               animate={{ 
                 x: ["-100%", "200%"], 
                 opacity: [0, 0.2, 0.2, 0] 
               }}
               transition={{ 
                 duration: 4 + i, 
                 repeat: Infinity, 
                 delay: i * 0.8,
                 ease: "linear" 
               }}
               className="absolute h-px w-[600px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
               style={{ top: `${15 + i * 15}%`, transform: "rotate(-5deg)" }}
             />
           ))}
           <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.05] blur-[140px] rounded-full" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--color-secondary)] opacity-[0.05] blur-[140px] rounded-full" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
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
            Your Capital, Inside <br />
            Your Vault. <span className="text-[var(--color-primary)] inline-block">Instantly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed font-medium"
          >
            Funding your Core Capital wallet is not a process — it is a moment. Deposits are processed in real time, confirmed on-chain, and reflected in your balance without delay.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Every second your capital spends outside your vault is a second it spends unprotected. Core Capital's deposit infrastructure minimizes that window to near-zero — so your assets move from origin to custody as fast as the network allows.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <Link href="/auth/register" className="btn-primary px-12 py-4 text-base font-black tracking-wide shadow-[0_0_30px_rgba(240,180,41,0.2)]">
              Fund Your Wallet Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 2: DEPOSIT METHODS ────────────────────────────────── */}
      <section id="deposit-methods" className="py-28 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Capital Ingress</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">Every Way to Fund Your Wallet</h2>
               <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
                 Whether you are moving coin from an external wallet, converting fiat, or transferring from another platform — Core Capital supports the deposit paths that serious investors actually use.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {depositMethods.map((m, i) => (
                 <Reveal key={i} delay={i * 0.08}>
                    <motion.div 
                      whileHover={{ y: -8 }}
                      className="glass-card p-10 rounded-[3rem] border-t-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/60 transition-all h-full flex flex-col"
                    >
                       <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-8">
                          <m.icon className="w-6 h-6" />
                       </div>
                       <h3 className="text-xl font-black text-white mb-4">{m.title}</h3>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                         {m.desc}
                       </p>
                       <div className="pt-6 border-t border-white/5">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest italic">
                            Best for: {m.bestFor}
                          </p>
                       </div>
                    </motion.div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 3: THE DEPOSIT FLOW ───────────────────────────────── */}
      <section id="deposit-flow" className="py-28">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-24">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">Transparency</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">From Initiation to Settled Balance</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 Transparency is not optional when it comes to moving capital. Core Capital shows you every stage of your deposit in real time.
               </p>
            </Reveal>

            <div className="relative max-w-5xl mx-auto px-4 md:px-0">
               {/* Desktop Horizontal Connecting Line */}
               <div className="absolute top-[32px] left-[60px] right-[60px] h-px bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)] opacity-20 hidden md:block overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-full w-[200px] bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
                  {[
                    { id: "01", title: "Generate Address", desc: "Select coin and network. We generate a unique, verified deposit address with a QR code." },
                    { id: "02", title: "Initiate Transfer", desc: "Broadcast your transfer from your source. Transaction enters the network mempool." },
                    { id: "03", title: "Instant Detection", desc: "We detect incoming transfers the moment they hit the network — before the first confirmation." },
                    { id: "04", title: "Track Confirmations", desc: "Track every block confirmation in real-time. We show you the threshold and current count live." },
                    { id: "05", title: "Balance Credited", desc: "Once finality is reached, your balance is credited instantly. Assets are secured and ready." }
                  ].map((step, i) => (
                    <Reveal key={step.id} delay={i * 0.1} className="text-center">
                       <div className="w-16 h-16 rounded-full bg-[#0A0E1A] border-2 border-[var(--color-primary)] flex items-center justify-center text-xl font-black text-[var(--color-primary)] mx-auto mb-8 shadow-[0_0_20px_rgba(240,180,41,0.2)] z-10 relative">
                          {step.id}
                       </div>
                       <h4 className="text-base font-black text-white mb-3 tracking-tight">{step.title}</h4>
                       <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                    </Reveal>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* ── SECTION 4: SPEED & CONFIRMATION STANDARDS ─────────────────── */}
      <section id="deposit-speed" className="py-28 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="mb-16 max-w-4xl">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Performance Metrics</p>
               <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">
                 How Fast Is Instant? <br />
                 <span className="text-gradient">No artificial holds. No internal clearing. Just the network.</span>
               </h2>
               <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                 The term "instant" in digital finance has been stretched beyond recognition by platforms that hold deposits for hours. Core Capital applies none of these. The moment your transaction achieves finality, your balance is credited.
               </p>
            </Reveal>

            <Reveal className="overflow-hidden">
               <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[var(--color-primary)]/10">
                           <th className="p-8 text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Blockchain Network</th>
                           <th className="p-8 text-xs font-black uppercase tracking-widest text-[var(--color-primary)]">Required Confirmations</th>
                           <th className="p-8 text-xs font-black uppercase tracking-widest text-[var(--color-primary)] text-right">Estimated Credit Time</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {networkConfirmations.map((n, i) => (
                          <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                             <td className="p-8 text-sm font-bold text-white tracking-tight">{n.name}</td>
                             <td className="p-8 text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">{n.confs}</td>
                             <td className="p-8 text-sm font-black text-[var(--color-secondary)] text-right tracking-tight">{n.time}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Reveal>

            <Reveal delay={0.3} className="mt-12 text-center text-gray-500 text-xs italic font-medium">
               Confirmation requirements are set by Core Capital's risk and compliance team based on network security standards. 
               Higher-value deposits may require additional confirmations as a standard security measure.
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 5: DEPOSIT SECURITY & COMPLIANCE ─────────────────── */}
      <section id="deposit-security" className="py-28 relative">
         {/* Subtle vault background schematic */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <Lock className="w-[800px] h-[800px] text-white" strokeWidth={0.2} />
         </div>

         <div className="container mx-auto px-6 relative">
            <Reveal className="text-center mb-20">
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">Security Layer</p>
               <h2 className="text-3xl md:text-5xl font-black mb-6">Every Deposit Is Screened & Verified</h2>
               <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
                 Speed without security is exposure. Core Capital's deposit infrastructure applies institutional-grade screening and compliance checks in the background, without slowing down your experience.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {securityPillars.map((p, i) => (
                 <Reveal key={i} delay={i * 0.08}>
                    <div className="glass-card p-10 rounded-[2.5rem] border-l-2 border-[var(--color-primary)]/30 hover:border-[var(--color-primary)]/80 transition-all bg-[#0A0E1A]/60 h-full">
                       <h3 className="text-lg font-black text-white mb-4 tracking-tight flex items-center space-x-2">
                          <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                          <span>{p.title}</span>
                       </h3>
                       <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 6: CLOSING CTA ────────────────────────────────────── */}
      <section id="deposits-cta" className="py-28">
         <div className="container mx-auto px-6">
            <Reveal>
               <div className="relative glass-card p-14 md:p-24 rounded-[4rem] text-center overflow-hidden">
                  {/* Flowing background lines */}
                  <div className="absolute inset-0 opacity-[0.1] -z-10">
                     <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-primary)]/20 to-transparent skew-x-12"
                     />
                  </div>
                  
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] mb-10">Consolidate Your Capital</p>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-10 leading-tight tracking-tighter uppercase">
                    Capital Waiting Outside Your Vault <br />
                    Is Capital <span className="text-[var(--color-primary)]">At Risk.</span>
                  </h2>

                  <p className="text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed text-base md:text-lg">
                    Every day your digital assets sit on an exchange or in fragmented storage is a day they spend outside institutional-grade protection. Core Capital's infrastructure makes the move fast, safe, and permanent.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                     <Link href="/auth/register" className="btn-primary px-12 py-4 text-base font-black relative group shadow-[0_0_30px_rgba(240,180,41,0.2)]">
                        <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                        Deposit Into Your Wallet Now
                     </Link>
                     <Link href="/wallet" className="btn-secondary px-10 py-4 text-base font-bold">
                        Explore More Features
                     </Link>
                  </div>

                  <div className="space-y-6">
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
                        🔒 Real-time deposit tracking · No artificial holds · AML-screened · Multi-method support · Instant credit
                     </p>
                     
                     <div className="pt-10 border-t border-white/5 inline-block">
                        <p className="text-2xl md:text-4xl font-black text-white italic tracking-tighter leading-tight">
                          "Your capital deserves to move at the <span className="text-gradient">speed of now.</span>"
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
