"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Lock, 
  ArrowRight, 
  ChevronDown, 
  ChevronRight,
  Database,
  Globe,
  Zap,
  Fingerprint,
  ShieldCheck,
  AlertCircle,
  Bell,
  Users,
  ShieldAlert,
  Download,
  CreditCard,
  Clock,
  History,
  Settings,
  Layout,
  Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─── Component Helpers ────────────────────────────────────────────────────────
const SectionLabel = ({ children, num }: { children: React.ReactNode, num: string }) => (
  <div className="flex items-center space-x-3 mb-8">
     <span className="text-[10px] font-black tracking-[0.3em] text-[var(--color-primary)] uppercase bg-[var(--color-primary)]/10 px-3 py-1 rounded-full">
        {num}
     </span>
     <span className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase">
        {children}
     </span>
  </div>
);

const FeatureRow = ({ title, desc }: { title: string, desc: string }) => (
  <div className="border-l-2 border-[var(--color-primary)] pl-8 py-2 hover:bg-white/[0.02] transition-colors group">
     <h3 className="text-xl font-black text-white mb-3 group-hover:text-[var(--color-primary)] transition-colors">{title}</h3>
     <p className="text-gray-400 text-sm leading-relaxed max-w-lg">{desc}</p>
  </div>
);

const SecurityCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 hover:border-[var(--color-primary)]/20 hover:-translate-y-1 transition-all group">
     <div className="w-12 h-12 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--color-primary)] mb-8 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
     </div>
     <h3 className="text-lg font-black text-white mb-4">{title}</h3>
     <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
  </div>
);

const AccordionItem = ({ num, title, body, isOpen, onToggle }: { num: string, title: string, body: string, isOpen: boolean, onToggle: () => void }) => (
  <div className="border-b border-white/5 last:border-0">
     <button 
       onClick={onToggle}
       className="w-full py-8 flex items-center justify-between text-left group"
     >
        <div className="flex items-center space-x-8">
           <span className="text-sm font-black text-[var(--color-primary)] font-mono">{num}</span>
           <span className="text-xl font-black text-white group-hover:text-[var(--color-primary)] transition-colors">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-gray-500"
        >
           <ChevronDown className="w-6 h-6" />
        </motion.div>
     </button>
     <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
             <div className="pb-8 pl-16 max-w-3xl">
                <p className="text-gray-400 leading-relaxed text-base">{body}</p>
             </div>
          </motion.div>
        )}
     </AnimatePresence>
  </div>
);

// ─── Main Content ─────────────────────────────────────────────────────────────
export default function SupportContent() {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  return (
    <main className="flex flex-col w-full overflow-hidden bg-[#05070A]">
      
      {/* ── HERO HEADER ──────────────────────────────────────────────── */}
      <section id="support-hero" className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(240,180,41,0.05),transparent_70%)]" />
        
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">
               <Link href="/" className="hover:text-white transition-colors">Home</Link>
               <ChevronRight className="w-3 h-3" />
               <span className="text-[var(--color-primary)]">Support Center</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8"
            >
              Support <span className="text-[var(--color-primary)]">Center</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium"
            >
              Everything you need to understand, navigate, and maximise your Core Capital experience — all in one place.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── SECTION 01: WALLET ───────────────────────────────────────── */}
      <section id="wallet" className="py-24 md:py-[100px]">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-20">
               <div>
                  <SectionLabel num="01">Wallet</SectionLabel>
                  <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">Your Vault, Fully in Your Control</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">
                    Core Capital gives you complete, sovereign control over your digital wallet. Every feature in the wallet management suite is designed to give you clarity, precision, and total ownership over your digital assets.
                  </p>
               </div>
               <div className="relative">
                  <div className="absolute inset-0 bg-[var(--color-primary)]/5 blur-[100px] rounded-full" />
                  <div className="glass-card p-4 rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl">
                     <div className="bg-[#0A0E1A] rounded-2xl p-8 h-80 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                           <div className="space-y-2">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Vault Balance</p>
                              <h4 className="text-3xl font-black text-white tracking-tighter">$1,284,902.42</h4>
                           </div>
                           <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                              <Database className="w-6 h-6 text-[var(--color-primary)]" />
                           </div>
                        </div>
                        <div className="space-y-4">
                           {[
                             { s: "BTC", p: "65%", c: "var(--color-primary)" },
                             { s: "ETH", p: "25%", c: "var(--color-secondary)" },
                             { s: "USDT", p: "10%", c: "white" }
                           ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.c }} />
                                   <span className="text-xs font-bold text-gray-300">{item.s} Portfolio</span>
                                </div>
                                <span className="text-xs font-mono text-gray-500">{item.p}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
               <FeatureRow 
                 title="Multi-Currency Support" 
                 desc="Your Core Capital wallet supports all major cryptocurrencies and stablecoins. Manage every asset from a single, unified dashboard without needing multiple wallets." 
               />
               <FeatureRow 
                 title="Wallet Address Management" 
                 desc="Generate, label, and manage multiple wallet addresses under one account. Assign addresses to specific purposes and monitor each one independently." 
               />
               <FeatureRow 
                 title="Transaction History & Export" 
                 desc="Access a complete, tamper-proof log of every transaction. Filter by date, asset, or amount, and export reports in CSV or PDF format." 
               />
               <FeatureRow 
                 title="Spending Limits & Controls" 
                 desc="Set daily, weekly, or per-transaction spending limits directly from your dashboard. Customise thresholds for an extra layer of control." 
               />
            </div>
         </div>
      </section>

      {/* ── SECTION 02: SECURITY ─────────────────────────────────────── */}
      <section id="security" className="py-24 md:py-[100px] bg-white/[0.02] border-y border-white/5">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-20">
               <SectionLabel num="02">Security</SectionLabel>
               <h2 className="text-3xl md:text-5xl font-black mb-8">Layers of Protection Built Into Every Action</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 Security at Core Capital is not an afterthought — it is the foundation. Every feature you use, every transaction you make, every login you perform passes through a security infrastructure designed for global finance.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <SecurityCard 
                 icon={Lock} 
                 title="Two-Factor Authentication (2FA)" 
                 desc="Secure every login and transaction approval with time-based one-time passwords via an authenticator app. SMS backup is also available."
               />
               <SecurityCard 
                 icon={Fingerprint} 
                 title="Biometric Login" 
                 desc="Authenticate using fingerprint or facial recognition on supported mobile devices. Fast, frictionless, and far more secure than passwords alone."
               />
               <SecurityCard 
                 icon={ShieldCheck} 
                 title="Withdrawal Whitelist" 
                 desc="Lock your withdrawals to a pre-approved list of wallet addresses. No transfer can leave your vault unless the destination is verified by you."
               />
               <SecurityCard 
                 icon={Layout} 
                 title="Session Management" 
                 desc="Monitor and terminate active sessions across all your devices in real time. If anything looks unusual, revoke access instantly."
               />
               <SecurityCard 
                 icon={Bell} 
                 title="Login Anomaly Alerts" 
                 desc="Receive instant notifications for any login attempt from an unrecognised device, location, or IP address. You are always the first to know."
               />
               <SecurityCard 
                 icon={ShieldAlert} 
                 title="Vault Lock Mode" 
                 desc="Activate a full platform lockdown in one tap. All withdrawals, transfers, and account changes are frozen until you personally authorise the unlock."
               />
            </div>
         </div>
      </section>

      {/* ── SECTION 03: TRANSFERS ────────────────────────────────────── */}
      <section id="transfers" className="py-24 md:py-[100px]">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-20">
               <SectionLabel num="03">Transfers</SectionLabel>
               <h2 className="text-3xl md:text-5xl font-black mb-8">Move Your Wealth. Instantly. Securely.</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 Core Capital's transfer infrastructure is built for speed without sacrificing security. Whether you are sending funds across the street or across the globe, every transaction is processed with institutional-grade verification.
               </p>
            </div>

            <div className="max-w-4xl mx-auto border-t border-white/5">
               {[
                 { 
                   t: "Instant Peer-to-Peer Transfers", 
                   b: "Send digital currency directly to any wallet address worldwide with no intermediary and no processing delay. Transactions are broadcast to the network immediately upon your approval and confirmed in real time." 
                 },
                 { 
                   t: "Scheduled & Recurring Transfers", 
                   b: "Set up automated transfers on a schedule — daily, weekly, or monthly. Ideal for recurring payments, DCA strategies, or regular portfolio rebalancing." 
                 },
                 { 
                   t: "Internal Vault Transfers", 
                   b: "Move assets between your own Core Capital wallet addresses instantly and fee-free. Organise your holdings across multiple internal vaults without touching the blockchain." 
                 },
                 { 
                   t: "Transaction Confirmation & Receipts", 
                   b: "Every completed transaction generates a digitally signed receipt with a unique transaction ID, timestamp, network confirmation hash, and asset details." 
                 },
                 { 
                   t: "Fee Transparency", 
                   b: "Core Capital displays the full estimated network fee before you confirm any transaction. Choose between standard and priority processing speeds to match your urgency." 
                 }
               ].map((item, i) => (
                 <AccordionItem 
                   key={i} 
                   num={`0${i + 1}`} 
                   title={item.t} 
                   body={item.b} 
                   isOpen={openAccordion === i} 
                   onToggle={() => setOpenAccordion(openAccordion === i ? null : i)}
                 />
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 04: ACCOUNT ──────────────────────────────────────── */}
      <section id="account" className="py-24 md:py-[100px] border-t border-white/5">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-20">
               <SectionLabel num="04">Account</SectionLabel>
               <h2 className="text-3xl md:text-5xl font-black mb-8">Your Account, Your Identity, Your Rules</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 Your Core Capital account is more than a login — it is your financial identity on the platform. Manage your profile, verify your credentials, and configure your experience to match your standards.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 mb-24">
               <FeatureRow 
                 title="KYC Verification & Compliance" 
                 desc="Complete your KYC verification securely within the platform. Identity documents are encrypted and never stored beyond regulatory requirements." 
               />
               <FeatureRow 
                 title="Tier-Based Account Levels" 
                 desc="Upgrade to Premium or Institutional to unlock higher transaction limits, additional wallet addresses, and exclusive platform features." 
               />
               <FeatureRow 
                 title="Notification Preferences" 
                 desc="Customise exactly what you are notified about and how — push notifications, email alerts, or SMS for price thresholds and security events." 
               />
               <FeatureRow 
                 title="Referral Programme" 
                 desc="Invite trusted contacts and earn platform rewards for every verified account. Track your referrals and payout history from your dashboard." 
               />
               <FeatureRow 
                 title="Data Privacy & Account Deletion" 
                 desc="You own your data. We provide full GDPR-compliant data export and the ability to permanently delete your account at any time." 
               />
               <FeatureRow 
                 title="24/7 Premium Support Access" 
                 desc="Premium and Institutional account holders receive direct access to a dedicated support team via live chat, email, and phone, available 24/7." 
               />
            </div>

            {/* Final CTA Banner */}
            <div className="bg-[var(--color-primary)] rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="max-w-2xl text-black">
                     <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Still Have Questions?</h2>
                     <p className="text-black/70 text-lg font-medium leading-relaxed">
                        Our support team is available 24/7 for Premium and Institutional members. For all other enquiries, browse our knowledge base or submit a support ticket.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                     <Link href="/auth/register" className="bg-black text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center">
                        Open a Ticket
                     </Link>
                     <Link href="/wallet" className="bg-white/20 backdrop-blur-md text-black border border-black/10 px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-white/30 transition-all flex items-center justify-center">
                        Upgrade to Premium
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </main>
  );
}
