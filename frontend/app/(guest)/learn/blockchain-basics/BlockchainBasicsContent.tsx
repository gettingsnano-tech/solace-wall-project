"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Database,
  Link as LinkIcon,
  Cpu,
  Globe,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Layers,
  Zap,
  CheckCircle2,
  Lock,
  Key,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Activity,
  ChevronRight,
  Search,
  MessageSquare,
  Clock,
  Smartphone,
  Share2
} from "lucide-react";
import { motion, useInView, useScroll, useSpring } from "framer-motion";

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

// ─── Diagram Stage Component ──────────────────────────────────────────────────
function TransactionStage({ stage, index }: { stage: any; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-40%" });

  return (
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center min-h-[40vh] py-12">
      <div className={`order-2 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
        <motion.div
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0.3, x: index % 2 === 0 ? -20 : 20 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center space-x-3 text-[var(--color-primary)] font-black text-xs uppercase tracking-widest">
            <span>Stage {index + 1}</span>
            <div className="h-px w-8 bg-[var(--color-primary)]" />
            <span>{stage.id}</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white">{stage.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{stage.desc}</p>
        </motion.div>
      </div>
      <div className={`order-1 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'} flex justify-center`}>
        <div className={`w-48 h-48 rounded-[2rem] border-2 transition-all duration-500 flex items-center justify-center ${inView ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 scale-110' : 'border-white/10 bg-white/5 opacity-30'}`}>
           <stage.icon className={`w-16 h-16 transition-colors duration-500 ${inView ? 'text-[var(--color-primary)]' : 'text-gray-500'}`} />
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlockchainBasicsContent() {
  const [activeSection, setActiveSection] = useState("");

  const navItems = [
    { id: "what-is-blockchain", label: "What Is Blockchain" },
    { id: "how-transactions-work", label: "How Transactions Work" },
    { id: "consensus-mechanisms", label: "Consensus Mechanisms" },
    { id: "cryptographic-security", label: "Cryptographic Security" },
    { id: "blockchain-for-investors", label: "Why It Matters" },
    { id: "blockchain-glossary", label: "Glossary" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex flex-col w-full overflow-hidden pt-24 bg-[#0A0E1A]">
      
      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="bb-hero" className="relative py-24 md:py-40 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 opacity-[0.03]">
           <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, var(--color-primary) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="container mx-auto px-6">
          <div className="max-w-5xl">
            <Reveal>
              <Link href="/learn" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-12">
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Learn</span>
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-12 text-white uppercase italic">
                Blockchain, <br />
                <span className="text-[var(--color-primary)] not-italic">Explained.</span>
              </h1>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
               <div className="md:col-span-8">
                  <Reveal delay={0.2}>
                    <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed font-medium">
                      You do not need to be a software engineer to understand blockchain. You need to understand it like any other asset infrastructure — well enough to trust it.
                    </p>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <p className="text-gray-500 leading-relaxed max-w-2xl">
                      Blockchain is the infrastructure layer beneath the entire digital asset class. This guide explains how it works, why it matters, and what it means for your capital — without unnecessary technical abstraction.
                    </p>
                  </Reveal>
               </div>
               <div className="md:col-span-4 flex flex-col items-start md:items-end">
                  <Reveal delay={0.4}>
                     <div className="inline-flex items-center space-x-3 px-4 py-2 bg-white/[0.05] rounded-full mb-4">
                        <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">12 Minute Read</span>
                     </div>
                  </Reveal>
               </div>
            </div>
          </div>
        </div>

        {/* Anchor Nav Bar */}
        <div className="sticky top-[72px] z-40 w-full bg-[#0A0E1A]/80 backdrop-blur-xl border-y border-white/5 mt-20">
           <div className="container mx-auto px-6">
              <div className="flex items-center space-x-8 overflow-x-auto py-4 no-scrollbar">
                 {navItems.map((item) => (
                   <a 
                     key={item.id} 
                     href={`#${item.id}`}
                     className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors ${activeSection === item.id ? 'text-[var(--color-primary)]' : 'text-gray-500 hover:text-white'}`}
                   >
                     {item.label}
                   </a>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* ── SECTION 2: WHAT IS BLOCKCHAIN ────────────────────────────── */}
      <section id="what-is-blockchain" className="py-32">
         <div className="container mx-auto px-6">
            <Reveal className="mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">I. Fundamentals</h2>
               <div className="max-w-4xl border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight italic tracking-tighter">
                    "A blockchain is a ledger that no single party controls, that no single party can alter, and that every participant can verify."
                  </p>
               </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
               <Reveal className="space-y-8">
                  <p className="text-lg text-gray-400 leading-relaxed font-medium">
                    To understand blockchain, start with a ledger. A traditional ledger is a record controlled by a central authority. Blockchain replaces that authority with mathematics and distributed consensus.
                  </p>
                  <p className="text-gray-500 leading-relaxed">
                    The word "blockchain" is literal. Transactions are grouped into blocks. Each block is cryptographically sealed and linked to the block that came before it — forming a chain that stretches back to the genesis block.
                  </p>
               </Reveal>
               <Reveal delay={0.2} className="space-y-8">
                  <p className="text-gray-500 leading-relaxed">
                    This chain structure makes the ledger tamper-resistant. To alter a historical transaction, an attacker would need to re-seal every subsequent block across thousands of independent computers simultaneously.
                  </p>
                  <div className="p-8 bg-[#05070A] border border-white/5 rounded-[2rem]">
                     <div className="flex items-center space-x-4 mb-4">
                        <Key className="w-5 h-5 text-[var(--color-primary)]" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">Key Concept</span>
                     </div>
                     <p className="text-sm text-gray-400 leading-relaxed">
                        The hash of each block is calculated from the data inside it. Change one character and the hash changes entirely — breaking the chain link and making the alteration visible.
                     </p>
                  </div>
               </Reveal>
            </div>

            {/* Blockchain Diagram */}
            <Reveal className="relative p-12 glass-card rounded-[3rem] bg-black/40 overflow-hidden">
               <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                  <Database className="w-full h-full text-white" strokeWidth={0.1} />
               </div>
               
               <div className="flex flex-col md:flex-row items-center justify-between space-y-12 md:space-y-0 md:space-x-8">
                  {[
                    { n: "500", h: "0x8a2f...", p: "0x3e1d..." },
                    { n: "501", h: "0x4c9e...", p: "0x8a2f..." },
                    { n: "502", h: "0x7d1b...", p: "0x4c9e..." }
                  ].map((block, i) => (
                    <div key={i} className="flex-1 w-full max-w-sm">
                       <div className="p-8 rounded-3xl bg-[#0A0E1A] border-2 border-white/10 group hover:border-[var(--color-primary)]/40 transition-all">
                          <div className="flex justify-between items-center mb-6">
                             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Block #{block.n}</span>
                             <ShieldCheck className="w-4 h-4 text-[var(--color-secondary)]" />
                          </div>
                          <div className="space-y-4 font-mono">
                             <div className="p-3 bg-white/5 rounded-lg">
                                <p className="text-[8px] text-gray-500 uppercase mb-1">Previous Hash</p>
                                <p className="text-[10px] text-[var(--color-primary)] truncate">{block.p}</p>
                             </div>
                             <div className="p-3 bg-white/5 rounded-lg border-l-2 border-[var(--color-secondary)]">
                                <p className="text-[8px] text-gray-500 uppercase mb-1">Transaction Data</p>
                                <p className="text-[10px] text-white">842 Validated Txns</p>
                             </div>
                             <div className="p-3 bg-white/10 rounded-lg">
                                <p className="text-[8px] text-gray-500 uppercase mb-1">Block Hash</p>
                                <p className="text-[10px] text-white truncate">{block.h}</p>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 3: HOW TRANSACTIONS WORK ─────────────────────────── */}
      <section id="how-transactions-work" className="py-32 bg-black/40">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">II. Propagation</h2>
               <h2 className="text-3xl md:text-5xl font-black mb-6">How a Transaction Actually Works</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 From the moment you press Send to the moment the balance updates — here is every step your capital takes through the network.
               </p>
            </Reveal>

            <div className="max-w-6xl mx-auto">
               {[
                 { id: "Creation", title: "Transaction Creation", icon: Smartphone, desc: "You initiate the transaction. Core Capital constructs a transaction object with sender, recipient, amount, and network fees." },
                 { id: "Signing", title: "Digital Signing", icon: Key, desc: "Your private key generates a digital signature. This proves you authorized this specific transaction without ever exposing the key." },
                 { id: "Broadcast", title: "Network Broadcast", icon: Share2, desc: "The signed instruction propagates to nodes globally. It enters the mempool — the waiting room for unconfirmed transactions." },
                 { id: "Selection", title: "Validator Selection", icon: Cpu, desc: "Validators pull transactions from the mempool. They prioritize those offering competitive fees to build the next candidate block." },
                 { id: "Validation", title: "Block Validation", icon: ShieldCheck, desc: "The candidate block is verified by the network rules (PoW/PoS). Only valid blocks are accepted; fraudulent ones are rejected." },
                 { id: "Confirmation", title: "Block Confirmation", icon: CheckCircle2, desc: "The block is appended to the chain. Your transaction is now immutably recorded. Core Capital detects and updates your status." },
                 { id: "Finality", title: "Immutable Finality", icon: Database, desc: "As more blocks are added, reversal becomes computationally impossible. Your transaction achieves permanent finality." }
               ].map((stage, i) => (
                 <TransactionStage key={stage.id} stage={stage} index={i} />
               ))}
            </div>

            <Reveal className="mt-20 max-w-4xl mx-auto">
               <div className="p-10 bg-[#0A0E1A] border-l-4 border-red-600 rounded-[2rem] flex items-start space-x-8">
                  <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
                  <div>
                     <p className="text-xs font-black text-white uppercase tracking-widest mb-2">Investor Implication</p>
                     <p className="text-sm text-gray-400 leading-relaxed">
                        Transaction finality is irreversible. Once confirmed, it cannot be reversed by you or Core Capital. Always verify destination addresses before confirmation.
                     </p>
                  </div>
               </div>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 4: CONSENSUS MECHANISMS ──────────────────────────── */}
      <section id="consensus-mechanisms" className="py-32">
         <div className="container mx-auto px-6">
            <Reveal className="mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">III. Governance</h2>
               <div className="max-w-4xl border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight italic tracking-tighter">
                    "Consensus is the mechanism by which a decentralized network arrives at a single, agreed-upon version of truth."
                  </p>
               </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
               {[
                 { 
                   n: "①", t: "Proof of Work (PoW)", u: "Bitcoin", 
                   d: "Validators (miners) solve computational puzzles. Requires enormous energy, making attacks economically irrational.",
                   i: "Highest security and decentralization. Slowest confirmation times. High energy use."
                 },
                 { 
                   n: "②", t: "Proof of Stake (PoS)", u: "Ethereum, Solana", 
                   d: "Validators lock up capital (stake) as collateral. Fraudulent behavior results in capital destruction (slashing).",
                   i: "Fast confirmation. Low fees. Energy efficient. Security is economic rather than computational."
                 },
                 { 
                   n: "③", t: "Delegated PoS (DPoS)", u: "Tron, BNB Chain", 
                   d: "Token holders elect a set of delegates to validate blocks. Creates a representative democracy for speed.",
                   i: "Fastest throughput. Lowest fees. Slightly higher centralization risk due to smaller validator sets."
                 }
               ].map((c, i) => (
                 <Reveal key={i} delay={i * 0.1}>
                    <div className="glass-card p-10 rounded-[3rem] border border-white/5 h-full flex flex-col">
                       <div className="text-4xl font-black text-[var(--color-primary)] mb-8">{c.n}</div>
                       <h3 className="text-xl font-black text-white mb-2">{c.t}</h3>
                       <div className="inline-block px-3 py-1 bg-white/[0.05] rounded-full mb-6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                          Used by: {c.u}
                       </div>
                       <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">{c.d}</p>
                       <div className="pt-6 border-t border-white/5">
                          <p className="text-[10px] font-bold text-[var(--color-primary)] italic uppercase tracking-widest">Implication: {c.i}</p>
                       </div>
                    </div>
                 </Reveal>
               ))}
            </div>

            <Reveal>
               <div className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-white/[0.03]">
                           <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Mechanism</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Speed</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Energy Use</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Security Model</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        <tr><td className="p-8 text-sm font-black text-white">Proof of Work</td><td className="p-8 text-sm text-gray-400">Slow (Minutes)</td><td className="p-8 text-sm text-red-500">Very High</td><td className="p-8 text-sm text-gray-400">Computational</td></tr>
                        <tr><td className="p-8 text-sm font-black text-white">Proof of Stake</td><td className="p-8 text-sm text-gray-400">Fast (Seconds)</td><td className="p-8 text-sm text-[var(--color-secondary)]">Low</td><td className="p-8 text-sm text-gray-400">Economic</td></tr>
                        <tr><td className="p-8 text-sm font-black text-white">Delegated PoS</td><td className="p-8 text-sm text-gray-400">Very Fast (&lt;1s)</td><td className="p-8 text-sm text-[var(--color-secondary)]">Very Low</td><td className="p-8 text-sm text-gray-400">Representative</td></tr>
                     </tbody>
                  </table>
               </div>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 5: CRYPTOGRAPHIC SECURITY ────────────────────────── */}
      <section id="cryptographic-security" className="py-32 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">IV. Cryptography</h2>
               <div className="max-w-4xl border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight italic tracking-tighter">
                    "Cryptography does not ask you to trust the network. It gives you the mathematical proof that trust is unnecessary."
                  </p>
               </div>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
               <div className="space-y-20">
                  {[
                    { t: "Cryptographic Hashing", d: "A function that summarizes data into a unique fingerprint. Identical inputs produce identical hashes; any change breaks the link.", r: "Every transaction receipt is a unique, verifiable hash — permanent and immutable." },
                    { t: "Public & Private Keys", d: "Mathematical pairs. Public keys are safe-to-share addresses; private keys are secrets that authorize asset movement.", r: "Your recovery phrase is a human-readable private key. This is why it must remain offline." }
                  ].map((c, i) => (
                    <Reveal key={i} className="space-y-4">
                       <h3 className="text-2xl font-black text-white">{c.t}</h3>
                       <p className="text-gray-500 leading-relaxed text-sm">{c.d}</p>
                       <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">Relevance: {c.r}</p>
                    </Reveal>
                  ))}
               </div>
               <div className="space-y-20">
                  {[
                    { t: "Digital Signatures", d: "Proofs that authorize a message without revealing the key. Signatures are unique to the transaction and cannot be forged.", r: "Every outbound transfer is digitally signed. PINs and 2FA are the human layers of this math." },
                    { t: "Merkle Trees", d: "Efficient data structures that summarize large sets of transactions. Allows verification without downloading entire blocks.", r: "Enables Core Capital to verify your specific transaction status with extreme speed and efficiency." }
                  ].map((c, i) => (
                    <Reveal key={i} className="space-y-4">
                       <h3 className="text-2xl font-black text-white">{c.t}</h3>
                       <p className="text-gray-500 leading-relaxed text-sm">{c.d}</p>
                       <p className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-widest">Relevance: {c.r}</p>
                    </Reveal>
                  ))}
               </div>
            </div>

            {/* Key Relationship Diagram */}
            <Reveal className="mt-32 p-12 glass-card rounded-[3rem] bg-black/40">
               <div className="flex flex-col md:flex-row items-center justify-center space-y-12 md:space-y-0 md:space-x-12">
                  <div className="flex flex-col items-center">
                     <div className="w-24 h-24 rounded-3xl bg-[var(--color-primary)]/10 border-2 border-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary)] mb-4">
                        <Lock className="w-10 h-10" />
                     </div>
                     <p className="text-xs font-black text-white uppercase">Private Key</p>
                     <p className="text-[10px] text-gray-500">Known only to you</p>
                  </div>
                  <ChevronRight className="w-10 h-10 text-white/10 hidden md:block" />
                  <div className="flex flex-col items-center">
                     <div className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-white/10 flex items-center justify-center text-white mb-4">
                        <Globe className="w-10 h-10" />
                     </div>
                     <p className="text-xs font-black text-white uppercase">Public Key</p>
                     <p className="text-[10px] text-gray-500">Safe to share</p>
                  </div>
                  <ChevronRight className="w-10 h-10 text-white/10 hidden md:block" />
                  <div className="flex flex-col items-center">
                     <div className="w-24 h-24 rounded-3xl bg-[var(--color-secondary)]/10 border-2 border-[var(--color-secondary)] flex items-center justify-center text-[var(--color-secondary)] mb-4">
                        <ShieldCheck className="w-10 h-10" />
                     </div>
                     <p className="text-xs font-black text-white uppercase">Signature</p>
                     <p className="text-[10px] text-gray-500">Proves Authorization</p>
                  </div>
               </div>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 6: INVESTOR IMPLICATIONS ─────────────────────────── */}
      <section id="blockchain-for-investors" className="py-32">
         <div className="container mx-auto px-6">
            <Reveal className="mb-24">
               <h2 className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-[0.4em] mb-12">V. Implications</h2>
               <div className="max-w-4xl border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-5xl font-black text-white leading-tight italic tracking-tighter">
                    "Blockchain does not eliminate risk. It eliminates a specific category of risk — the risk of central mismanagement."
                  </p>
               </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { t: "Cryptographic Ownership", d: "Your assets are secured by a private key you control, not just a legal claim in a bank's database." },
                 { t: "Radical Transparency", d: "Every transaction is permanently recorded and publicly verifiable by anyone, at any time, without permission." },
                 { t: "Absolute Immutability", d: "Records cannot be reversed. This protects against fraud but makes error recovery impossible." },
                 { t: "Infrastructure Risk", d: "Network failures and 51% attacks are real. We only support vetted, institutional-grade networks." },
                 { t: "Regulatory Clarity", d: "Blockchain transparency is increasing regulatory tracking — a long-term positive for adoption." },
                 { t: "Interoperability", d: "The future is multi-chain. Core Capital provides a unified view across all major networks." }
               ].map((imp, i) => (
                 <Reveal key={i} delay={i * 0.08}>
                    <div className="glass-card p-10 rounded-[3rem] border border-white/5 h-full">
                       <div className="text-2xl font-black text-white/[0.03] mb-6">{i + 1}</div>
                       <h3 className="text-lg font-black text-white mb-4 tracking-tight">{imp.t}</h3>
                       <p className="text-gray-500 text-sm leading-relaxed">{imp.d}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 7: GLOSSARY + CTA ────────────────────────────────── */}
      <section id="blockchain-glossary" className="py-32 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="mb-20">
               <h2 className="text-3xl md:text-5xl font-black mb-6">Investor Reference Glossary</h2>
               <p className="text-gray-400 max-w-2xl leading-relaxed">
                 Every term used in this guide, defined precisely for the Core Capital investor.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mb-32">
               {[
                 { t: "Block", d: "A data container holding validated transactions and a cryptographic hash." },
                 { t: "Consensus Mechanism", d: "The ruleset nodes follow to agree on the valid version of the ledger." },
                 { t: "Cryptographic Hash", d: "A fixed-length fingerprint produced from any input data." },
                 { t: "Digital Signature", d: "Proof of authorization produced by signing with a private key." },
                 { t: "Finality", d: "The point at which a transaction is considered irreversible on the network." },
                 { t: "Gas Fee", d: "Fees paid to validators for processing transactions on Ethereum-style networks." },
                 { t: "Genesis Block", d: "The first block ever added to a blockchain — the point of origin." },
                 { t: "Merkle Root", d: "A summary hash of all transactions in a block derived from a Merkle Tree." },
                 { t: "Private Key", d: "The secret master key to your wallet. Must never be shared." },
                 { t: "Smart Contract", d: "Self-executing code stored on-chain that enforces predefined rules." }
               ].map((term, i) => (
                 <Reveal key={i} className="border-b border-white/5 pb-6 last:border-0">
                    <h4 className="text-base font-black text-white mb-2">{term.t}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed">{term.d}</p>
                 </Reveal>
               ))}
            </div>

            {/* Final CTA */}
            <Reveal>
               <div className="relative glass-card p-14 md:p-24 rounded-[4rem] text-center overflow-hidden border border-white/5 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-10 leading-tight uppercase tracking-tighter">
                    Infrastructure You <br />
                    <span className="text-[var(--color-primary)]">Can Understand.</span>
                  </h2>

                  <p className="text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed text-base md:text-lg">
                    Blockchain is the foundation. Core Capital is the institutional-grade structure built on top of it. Open your wallet and put that infrastructure to work.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                     <Link href="/auth/register" className="btn-primary px-12 py-4 text-base font-black shadow-[0_0_30px_rgba(240,180,41,0.2)]">
                        Open Your Core Capital Wallet
                     </Link>
                     <Link href="/learn/getting-started" className="btn-secondary px-10 py-4 text-base font-bold">
                        Back to Guide
                     </Link>
                  </div>

                  <div className="pt-10 border-t border-white/5">
                     <p className="text-xl md:text-3xl font-black text-white italic tracking-tighter">
                        "Understanding your assets is the first act of protecting them."
                     </p>
                  </div>
               </div>
            </Reveal>

            {/* Read Next Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
               {[
                 { t: "Getting Started", d: "Step-by-step guide to account setup.", href: "/learn/getting-started" },
                 { t: "Network Selection", d: "Explore your network options.", href: "/features/networks" },
                 { t: "Market Overview", d: "Live asset performance data.", href: "/market" }
               ].map((card, i) => (
                 <Link key={i} href={card.href} className="glass-card p-8 rounded-3xl hover:border-[var(--color-primary)]/40 transition-all group">
                    <h4 className="text-sm font-black text-white mb-2">{card.t}</h4>
                    <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">{card.d}</p>
                    <div className="flex items-center text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                       <span>Read Next</span>
                       <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                 </Link>
               ))}
            </div>
         </div>
      </section>

    </main>
  );
}
