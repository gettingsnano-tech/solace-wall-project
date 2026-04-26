"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  UserPlus,
  Wallet,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Lightbulb,
  Clock,
  Camera,
  FileCheck,
  ShieldCheck,
  Smartphone,
  Lock,
  Key,
  Database,
  ArrowUpRight,
  Coins,
  Share2,
  ChevronDown,
  ChevronUp
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

// ─── Accordion Item ───────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex justify-between items-center text-left hover:text-[var(--color-primary)] transition-colors group"
      >
        <h4 className="text-base font-black text-white group-hover:text-[var(--color-primary)] transition-colors">{question}</h4>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[var(--color-primary)]" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-gray-400 text-sm leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function GettingStartedContent() {
  return (
    <main className="flex flex-col w-full overflow-hidden pt-24 bg-[#0A0E1A]">
      
      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="gs-hero" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.03] blur-[140px] rounded-full" />
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <Reveal>
              <Link href="/learn" className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-10">
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Learn</span>
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-white">
                Welcome to Core Capital. <br />
                <span className="text-gradient">Let's Get Your Vault Open.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed font-medium">
                Everything you need to go from registration to your first secured deposit — explained clearly, sequenced correctly, and designed to take you less than ten minutes.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-sm md:text-base text-gray-500 mb-12 leading-relaxed max-w-3xl">
                You have made the right decision. Core Capital was built for investors who take their digital assets seriously — and this guide exists to make sure your first experience matches the standard of the infrastructure behind it.
              </p>
            </Reveal>

            {/* Progress Overview Strip */}
            <Reveal delay={0.4}>
              <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 md:p-12 mb-12 overflow-x-auto">
                 <div className="flex items-center justify-between min-w-[800px] relative">
                    {/* Connecting line */}
                    <div className="absolute top-[20px] left-[40px] right-[40px] h-px bg-white/10 -z-10" />
                    {[
                      "Create Account", "Verify Identity", "Secure Wallet", "Fund Wallet", "First Move", "Set Preferences"
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center space-y-4 text-center">
                         <div className="w-10 h-10 rounded-full bg-[#0A0E1A] border-2 border-[var(--color-primary)] flex items-center justify-center text-xs font-black text-[var(--color-primary)] shadow-[0_0_15px_rgba(240,180,41,0.2)]">
                            {i + 1}
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 whitespace-nowrap">{step}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <Link href="/auth/register" className="btn-primary px-10 py-4 text-base font-black tracking-wide">
                Create Your Account Now
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: STEP 01 ────────────────────────────────────────── */}
      <section id="step-create-account" className="py-24 border-t border-white/5 bg-black/10">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
               <div>
                  <Reveal className="flex items-start space-x-6 mb-12">
                     <div className="text-7xl md:text-8xl font-black text-white/[0.03] leading-none select-none">01</div>
                     <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
                           <Clock className="w-3 h-3 text-[var(--color-primary)]" />
                           <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">2 Minutes</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white">Create Your Account</h2>
                     </div>
                  </Reveal>

                  <Reveal className="space-y-12">
                     <p className="text-gray-400 text-lg leading-relaxed">
                       Your Core Capital account is the master credential that governs access to your wallet, your settings, and your market intelligence tools.
                     </p>

                     <div className="space-y-10">
                        {[
                          { id: "1.1", t: "Go to Registration", d: "Navigate to the registration page. You will be presented with a clean, single-page registration interface." },
                          { id: "1.2", t: "Enter Your Details", d: "Provide your legal name, email, country, and phone number. Use the name that matches your ID." },
                          { id: "1.3", t: "Set Master Password", d: "Create a strong password (min 12 chars). Write it down and store it offline. We do not store recoverable passwords." },
                          { id: "1.4", t: "Verify Your Email", d: "Enter the six-digit code sent to your registered email within 10 minutes to activate your account." }
                        ].map((sub, i) => (
                          <div key={i} className="flex items-start space-x-6 group">
                             <span className="text-xs font-black text-[var(--color-primary)] pt-1">{sub.id}</span>
                             <div>
                                <h4 className="text-base font-black text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">{sub.t}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{sub.d}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="p-8 bg-[#0A0E1A] border-l-4 border-yellow-500 rounded-2xl flex items-start space-x-6">
                        <ShieldAlert className="w-6 h-6 text-yellow-500 shrink-0" />
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Security Note</p>
                           <p className="text-xs text-gray-400 leading-relaxed">
                             Core Capital will never ask for your password via email, SMS, or support chat. Treat such requests as phishing and report them immediately.
                           </p>
                        </div>
                     </div>
                  </Reveal>
               </div>
               
               <Reveal className="hidden lg:block sticky top-32">
                  <div className="glass-card p-1 rounded-[3rem] rotate-2 overflow-hidden bg-gradient-to-br from-white/10 to-transparent">
                     <div className="bg-[#05070A] p-10 rounded-[2.8rem]">
                        {/* Mock Registration Form UI */}
                        <div className="space-y-6 opacity-40">
                           <div className="h-4 w-1/3 bg-white/10 rounded-full" />
                           <div className="h-12 w-full bg-white/[0.05] rounded-xl" />
                           <div className="h-12 w-full bg-white/[0.05] rounded-xl" />
                           <div className="h-12 w-full bg-white/[0.05] rounded-xl" />
                           <div className="h-12 w-full bg-[var(--color-primary)]/20 rounded-xl" />
                        </div>
                     </div>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* ── SECTION 3: STEP 02 (KYC) ──────────────────────────────────── */}
      <section id="step-kyc" className="py-24">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
               <Reveal className="order-2 lg:order-1">
                  <div className="glass-card p-12 rounded-[3rem] bg-gradient-to-br from-white/5 to-transparent">
                     <h4 className="text-sm font-black text-white mb-8 uppercase tracking-widest">Verification Checklist</h4>
                     <div className="space-y-6">
                        {[
                          "Government-issued photo ID",
                          "Working front-facing camera",
                          "Clear, well-lit environment",
                          "Valid and unexpired document"
                        ].map((item, i) => (
                          <div key={i} className="flex items-center space-x-4">
                             <CheckCircle2 className="w-5 h-5 text-[var(--color-secondary)]" />
                             <span className="text-sm font-bold text-gray-400">{item}</span>
                          </div>
                        ))}
                     </div>

                     <div className="mt-12 overflow-hidden rounded-2xl border border-white/5">
                        <table className="w-full text-left text-[10px]">
                           <thead className="bg-white/[0.05]">
                              <tr>
                                 <th className="p-4 font-black uppercase tracking-widest text-gray-500">Tier</th>
                                 <th className="p-4 font-black uppercase tracking-widest text-gray-500">Limits</th>
                                 <th className="p-4 font-black uppercase tracking-widest text-gray-500">Unlocked</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5 bg-black/20">
                              <tr><td className="p-4 font-bold text-white">L1 (Basic)</td><td className="p-4 text-gray-400">$2,000/day</td><td className="p-4 text-gray-400">Deposits</td></tr>
                              <tr><td className="p-4 font-bold text-white">L2 (Enhanced)</td><td className="p-4 text-gray-400">$50,000/day</td><td className="p-4 text-gray-400">Conversion</td></tr>
                              <tr><td className="p-4 font-bold text-white">L3 (Inst.)</td><td className="p-4 text-gray-400">Unlimited</td><td className="p-4 text-gray-400">Priority</td></tr>
                           </tbody>
                        </table>
                     </div>
                  </div>
               </Reveal>

               <div className="order-1 lg:order-2">
                  <Reveal className="flex items-start space-x-6 mb-12">
                     <div className="text-7xl md:text-8xl font-black text-white/[0.03] leading-none select-none">02</div>
                     <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-secondary)]/10 rounded-full mb-4">
                           <Clock className="w-3 h-3 text-[var(--color-secondary)]" />
                           <span className="text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-widest">3–5 Minutes</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white">Identity Verification</h2>
                     </div>
                  </Reveal>

                  <Reveal className="space-y-8">
                     <p className="text-gray-400 text-lg leading-relaxed">
                       Core Capital operates under full regulatory compliance. KYC is the mechanism that protects you, your assets, and the platform from fraud.
                     </p>

                     <div className="space-y-10">
                        {[
                          { id: "2.1", t: "Upload Document", d: "Photograph front and back of your ID. Ensure corners are visible and there is no glare." },
                          { id: "2.2", t: "Liveness Check", d: "Follow on-screen prompts (head turn/blink). Confirms you match the ID physically." },
                          { id: "2.3", t: "Automated Review", d: "Our engine processes verifications in real-time. Most are approved within 60 seconds." },
                          { id: "2.4", t: "Wallet Activation", d: "Receive confirmation via email. Verified status unlocks all platform functionality." }
                        ].map((sub, i) => (
                          <div key={i} className="flex items-start space-x-6 group">
                             <span className="text-xs font-black text-[var(--color-secondary)] pt-1">{sub.id}</span>
                             <div>
                                <h4 className="text-base font-black text-white mb-2 group-hover:text-[var(--color-secondary)] transition-colors">{sub.t}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{sub.d}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="p-8 bg-[#0A0E1A] border-l-4 border-blue-500 rounded-2xl flex items-start space-x-6">
                        <Lock className="w-6 h-6 text-blue-500 shrink-0" />
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Privacy Note</p>
                           <p className="text-xs text-gray-400 leading-relaxed">
                             Documents are encrypted, processed under strict agreements, and never sold. Storage complies with jurisdictional data regulations.
                           </p>
                        </div>
                     </div>
                  </Reveal>
               </div>
            </div>
         </div>
      </section>

      {/* ── SECTION 4: STEP 03 (SECURITY) ─────────────────────────────── */}
      <section id="step-security-setup" className="py-24 bg-black/20">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
               <Reveal className="flex items-start space-x-6 mb-12">
                  <div className="text-7xl md:text-8xl font-black text-white/[0.03] leading-none select-none">03</div>
                  <div>
                     <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-500/10 rounded-full mb-4">
                        <Clock className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">3 Minutes</span>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-black text-white">Secure Your Wallet</h2>
                  </div>
               </Reveal>

               <Reveal className="space-y-12">
                  <p className="text-gray-400 text-lg leading-relaxed">
                    This step is mandatory. Core Capital requires all wallet holders to configure security before funding is unlocked. A wallet without security is a wallet at risk.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {[
                       { id: "3.1", t: "Enable 2FA", d: "Enable authenticator (Authy/Google). Scan the QR and link your account. Every login will now require this code." },
                       { id: "3.2", t: "Biometric Access", d: "On mobile, enable Face ID or fingerprint. Adds a physical identity layer that cannot be replicated." },
                       { id: "3.3", t: "Recovery Phrase", d: "Generate and write down your 12-word phrase. This is the master key if you lose access. Store it offline." },
                       { id: "3.4", t: "Transaction PIN", d: "Set a separate 6-digit PIN to authorize every outbound transfer. An independent layer on all capital movements." }
                     ].map((sub, i) => (
                       <div key={i} className="flex items-start space-x-6 group">
                          <span className="text-xs font-black text-red-500 pt-1">{sub.id}</span>
                          <div>
                             <h4 className="text-base font-black text-white mb-2 group-hover:text-red-500 transition-colors">{sub.t}</h4>
                             <p className="text-sm text-gray-500 leading-relaxed">{sub.d}</p>
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="p-10 bg-[#0A0E1A] border-l-8 border-red-600 rounded-[2rem] shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                        <ShieldAlert className="w-32 h-32 text-red-600" />
                     </div>
                     <div className="relative z-10">
                        <p className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">Critical Master Recovery Key</p>
                        <p className="text-2xl font-black text-red-600 mb-6 italic tracking-tight">"Write it down. Store it offline. Never share it."</p>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          Core Capital cannot restore your wallet if you lose both your credentials and recovery phrase. This phrase is the final recovery mechanism. Treat it with the same security as a physical vault key.
                        </p>
                     </div>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

      {/* ── SECTION 5: STEP 04 & 05 (FUNDING & TRANSACT) ──────────────── */}
      <section id="step-fund-transact" className="py-24">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-32 items-start">
               {/* Step 4: Fund */}
               <div>
                  <Reveal className="flex items-start space-x-6 mb-12">
                     <div className="text-7xl md:text-8xl font-black text-white/[0.03] leading-none select-none">04</div>
                     <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-primary)]/10 rounded-full mb-4">
                           <Clock className="w-3 h-3 text-[var(--color-primary)]" />
                           <span className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">3 Minutes</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white">Fund Your Wallet</h2>
                     </div>
                  </Reveal>

                  <Reveal className="space-y-8">
                     <div className="space-y-10">
                        {[
                          { id: "4.1", t: "Navigate to Deposit", d: "Select Deposit from your dashboard. Choose your preferred coin (BTC/USDT recommended)." },
                          { id: "4.2", t: "Select Network", d: "Match the network of your sending wallet. A mismatch can result in unrecoverable funds." },
                          { id: "4.3", t: "Copy Address", d: "Copy the unique text string or scan the QR code. Never manually type a wallet address." },
                          { id: "4.4", t: "Initiate Transfer", d: "Paste address into your source. Double-check first/last 4 characters before confirming." },
                          { id: "4.5", t: "Track Real-Time", d: "Watch incoming transfers in your feed. Balance updates once network finality is reached." }
                        ].map((sub, i) => (
                          <div key={i} className="flex items-start space-x-6 group">
                             <span className="text-xs font-black text-[var(--color-primary)] pt-1">{sub.id}</span>
                             <div>
                                <h4 className="text-base font-black text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">{sub.t}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{sub.d}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </Reveal>
               </div>

               {/* Step 5: Transact */}
               <div>
                  <Reveal className="flex items-start space-x-6 mb-12">
                     <div className="text-7xl md:text-8xl font-black text-white/[0.03] leading-none select-none">05</div>
                     <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[var(--color-secondary)]/10 rounded-full mb-4">
                           <Clock className="w-3 h-3 text-[var(--color-secondary)]" />
                           <span className="text-[10px] font-black text-[var(--color-secondary)] uppercase tracking-widest">2 Minutes</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white">First Transaction</h2>
                     </div>
                  </Reveal>

                  <Reveal className="space-y-8">
                     <div className="space-y-10">
                        {[
                          { id: "5.1", t: "Navigate to Send", d: "Enter a verified destination address. Send a small test amount first for unverified destinations." },
                          { id: "5.2", t: "Amount & Network", d: "Review estimated fee and confirmation time. Core Capital displays exact fees before confirmation." },
                          { id: "5.3", t: "Dual-Auth Security", d: "Enter your 6-digit transaction PIN and 2FA code. Required for every outbound transfer." },
                          { id: "5.4", t: "Confirm and Track", d: "Review summary and confirm. Transaction is broadcast immediately with real-time status." }
                        ].map((sub, i) => (
                          <div key={i} className="flex items-start space-x-6 group">
                             <span className="text-xs font-black text-[var(--color-secondary)] pt-1">{sub.id}</span>
                             <div>
                                <h4 className="text-base font-black text-white mb-2 group-hover:text-[var(--color-secondary)] transition-colors">{sub.t}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{sub.d}</p>
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="p-8 bg-[#0A0E1A] border-l-4 border-[var(--color-secondary)] rounded-2xl flex items-start space-x-6 mt-8">
                        <Lightbulb className="w-6 h-6 text-[var(--color-secondary)] shrink-0" />
                        <div>
                           <p className="text-xs font-black text-white uppercase tracking-widest mb-1">Best Practice</p>
                           <p className="text-xs text-gray-400 leading-relaxed">
                             Always send a small test transaction first to new addresses. The cost is trivial; the security is permanent.
                           </p>
                        </div>
                     </div>
                  </Reveal>
               </div>
            </div>
         </div>
      </section>

      {/* ── SECTION 6: STEP 06 (PREFERENCES) ──────────────────────────── */}
      <section id="step-preferences" className="py-24 bg-black/20">
         <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
               <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full mb-4">
                  <Clock className="w-3 h-3 text-gray-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">2 Minutes</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-black mb-6">Step 06 — Configure Preferences</h2>
               <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                 Your vault is open. Now spend two minutes configuring the settings that determine how Core Capital works for you.
               </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {[
                 { t: "Base Currency Display", d: "Set USD, EUR, or NGN. Affects every display across your dashboard without changing asset holdings." },
                 { t: "Notification Matrix", d: "Configure push, email, or SMS. Silence what you do not need; never miss what you do." },
                 { t: "Price Alert Thresholds", d: "Set a threshold above or below current market. A configured alert can be your best tactical tool." },
                 { t: "Dashboard Layout", d: "Choose Expanded View for deep analytics or Compact View for total balance and quick-actions." },
                 { t: "Default Network Settings", d: "Set preferred networks for each coin to remove friction from your most common transaction flows." },
                 { t: "Privacy & Data Export", d: "Review session timeouts and trusted devices. Short timeouts are a critical security habit." }
               ].map((p, i) => (
                 <Reveal key={i} delay={i * 0.08}>
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/[0.04] bg-[#0A0E1A]/60 h-full group">
                       <h3 className="text-lg font-black text-white mb-4 tracking-tight group-hover:text-[var(--color-primary)] transition-colors">{p.t}</h3>
                       <p className="text-gray-500 text-xs leading-relaxed">{p.d}</p>
                    </div>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 7: COMPLETE + FAQ ─────────────────────────────────── */}
      <section id="gs-complete" className="py-28">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
               <Reveal className="mb-20">
                  <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                    You Are Now a Core Capital Wallet Holder. <br />
                    <span className="text-gradient">Here Is What Comes Next.</span>
                  </h2>
                  <p className="text-lg text-gray-400 mb-12 leading-relaxed">
                    You have done in ten minutes what takes most platforms a week. Core Capital was built for this speed — because your capital should not spend a moment unprotected.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                     {[
                       { t: "Market Overview", d: "Track live prices and trends.", href: "/market" },
                       { t: "Coin Support", d: "Explore diversified assets.", href: "/features/coins" },
                       { t: "Network Control", d: "Optimize speed and cost.", href: "/features/networks" }
                     ].map((link, i) => (
                       <Link key={i} href={link.href} className="glass-card p-8 rounded-3xl hover:border-[var(--color-primary)]/40 transition-all group">
                          <h4 className="text-sm font-black text-white mb-2">{link.t}</h4>
                          <p className="text-[10px] text-gray-500 mb-4">{link.d}</p>
                          <div className="flex items-center text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">
                             <span>Explore</span>
                             <ArrowUpRight className="w-3 h-3 ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </div>
                       </Link>
                     ))}
                  </div>
               </Reveal>

               {/* FAQ Accordion */}
               <Reveal className="mb-28">
                  <h3 className="text-2xl font-black mb-10 text-white flex items-center space-x-4">
                    <HelpCircle className="w-6 h-6 text-[var(--color-primary)]" />
                    <span>Common Questions From New Holders</span>
                  </h3>
                  <div className="glass-card rounded-[2.5rem] p-10 border border-white/5">
                     {[
                       { q: "How long does KYC verification take?", a: "Most are approved automatically within 60 seconds. Manual reviews are resolved within 24 hours." },
                       { q: "What happens if I lose my recovery phrase?", a: "Core Capital cannot restore your wallet without it. Store it offline, physically, immediately after setup." },
                       { q: "Can I use Core Capital without KYC?", a: "No wallet functionality (deposit/send) is available until KYC Level 1 is completed. It is a regulatory requirement." },
                       { q: "Is there a minimum deposit amount?", a: "Varies by coin/network to ensure value exceeds fees. Displayed in your Deposit panel." },
                       { q: "What do I do if my deposit does not arrive?", a: "Verify network match and check blockchain explorer. Contact support if not credited after 60 minutes." },
                       { q: "Can I hold multiple currencies simultaneously?", a: "Yes. Core Capital is a multi-coin wallet. Hold as many supported assets as you choose under one account." },
                       { q: "How do I contact support?", a: "Email support@corecapital.io, use in-app chat, or visit help.corecapital.io. We are available 24/7." }
                     ].map((item, i) => (
                       <FAQItem key={i} question={item.q} answer={item.a} />
                     ))}
                  </div>
               </Reveal>

               {/* Final CTA */}
               <Reveal className="text-center">
                  <div className="relative glass-card p-14 md:p-24 rounded-[4rem] overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10">
                     <h2 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase">Your Vault Is Ready.</h2>
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <Link href="/auth/register" className="btn-primary px-12 py-4 text-base font-black shadow-[0_0_30px_rgba(240,180,41,0.2)]">
                           Open Your Core Capital Wallet
                        </Link>
                        <Link href="/support" className="btn-secondary px-10 py-4 text-base font-bold">
                           Visit Help Centre
                        </Link>
                     </div>
                     <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.25em]">
                        🔒 Bank-grade security · KYC-compliant · 24/7 support · Protected deposits
                     </p>
                  </div>
               </Reveal>
            </div>
         </div>
      </section>

    </main>
  );
}
