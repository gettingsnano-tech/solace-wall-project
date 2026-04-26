"use client";

import React from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  CheckCircle2, 
  Target, 
  Shield, 
  Globe, 
  ArrowRight,
  TrendingUp,
  History,
  Briefcase,
  Building2,
  Users
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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

const Reveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
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
};

// ─── Main Content ─────────────────────────────────────────────────────────────
export default function AboutContent() {
  return (
    <main className="flex flex-col w-full overflow-hidden bg-[#05070A]">
      
      {/* ── HERO HEADER ──────────────────────────────────────────────── */}
      <section id="about-hero" className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(240,180,41,0.05),transparent_70%)]" />
        
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center max-w-4xl mx-auto">
            <Reveal>
              <div className="flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8">
                 <Link href="/" className="hover:text-white transition-colors">Home</Link>
                 <ChevronRight className="w-3 h-3" />
                 <span className="text-[var(--color-primary)]">About Us</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8">
                About <span className="text-[var(--color-primary)]">Core Capital</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-medium">
                We didn't build just another wallet. We built a fortress.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── SECTION 01: OUR STORY ────────────────────────────────────── */}
      <section id="our-story" className="py-24 md:py-[100px]">
         <div className="container mx-auto px-6">
            <SectionLabel num="01">Our Story</SectionLabel>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-24">
               <Reveal className="border-l-8 border-[var(--color-primary)] pl-12 py-4">
                  <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight italic tracking-tighter">
                    "We built Core Capital because your digital wealth deserves better."
                  </p>
               </Reveal>
               <Reveal delay={0.2} className="space-y-8">
                  <p className="text-gray-400 text-lg leading-relaxed font-medium">
                    Core Capital Digital Currency was founded by a team of financial technologists, security engineers, and former institutional bankers who saw the same problem from different angles — digital assets were growing in value faster than the infrastructure protecting them.
                  </p>
                  <p className="text-gray-500 leading-relaxed">
                    We built Core Capital to give individuals and institutions access to the kind of digital asset protection previously only available to the world's largest financial players. Precision-engineered, regulation-ready, and built without compromise from day one.
                  </p>
                  <p className="text-gray-500 leading-relaxed">
                    Today, Core Capital secures billions in digital assets across 190+ countries — and we are just getting started.
                  </p>
               </Reveal>
            </div>

            {/* Stats Banner */}
            <Reveal className="p-12 glass-card rounded-[3rem] border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 bg-[var(--color-primary)]/5 -z-10" />
               <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                  <div className="space-y-2">
                     <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">2019</p>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Founded</p>
                  </div>
                  <div className="hidden md:block w-px h-full bg-white/10 mx-auto" />
                  <div className="space-y-2">
                     <p className="text-4xl md:text-5xl font-black text-[var(--color-primary)] tracking-tighter">$4.2B+</p>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Assets Secured</p>
                  </div>
                  <div className="hidden md:block w-px h-full bg-white/10 mx-auto" />
                  <div className="space-y-2">
                     <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">190+</p>
                     <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Countries Served</p>
                  </div>
               </div>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 02: MISSION & VALUES ─────────────────────────────── */}
      <section id="mission-values" className="py-24 md:py-[100px] bg-white/[0.02] border-y border-white/5">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-20">
               <SectionLabel num="02">Mission & Values</SectionLabel>
               <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">What We Stand For</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 Every decision we make — every feature we build, every policy we set, every partnership we form — is measured against four core values that define who Core Capital is.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {[
                 { n: "I", t: "Security Without Compromise", d: "We will never trade your security for convenience, speed, or profit. Every system we build assumes the worst-case threat and engineers beyond it." },
                 { n: "II", t: "Radical Transparency", d: "We believe you deserve to know exactly how your assets are stored and how our platform operates. No fine print. No corporate ambiguity." },
                 { n: "III", t: "Access for the Serious Investor", d: "Institutional-grade infrastructure should not be exclusive to institutions. Core Capital exists to give every serious investor the tools once reserved for the few." },
                 { n: "IV", t: "Long-Term Thinking", d: "We are not building for the next funding round. We are building for the next decade. Every decision is made with permanence and durability in mind." }
               ].map((v, i) => (
                 <Reveal key={i} delay={i * 0.1} className="glass-card p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group hover:border-[var(--color-primary)]/20 transition-all">
                    <div className="absolute -top-4 -right-4 text-9xl font-black text-white/[0.02] select-none group-hover:text-[var(--color-primary)]/5 transition-colors">
                       {v.n}
                    </div>
                    <h3 className="text-2xl font-black text-white mb-6 relative z-10">{v.t}</h3>
                    <p className="text-gray-500 text-base leading-relaxed relative z-10">{v.d}</p>
                 </Reveal>
               ))}
            </div>
         </div>
      </section>

      {/* ── SECTION 03: WHO WE SERVE ─────────────────────────────────── */}
      <section id="who-we-serve" className="py-24 md:py-[100px]">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-20">
               <SectionLabel num="03">Who We Serve</SectionLabel>
               <h2 className="text-3xl md:text-5xl font-black mb-8">Built for Those Who Take Wealth Seriously</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 Core Capital is designed for those who understand that protecting wealth is just as important as building it. Our platform serves three distinct groups.
               </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
               {[
                 { 
                   t: "Private Investors", 
                   b: "STANDARD & PREMIUM", 
                   d: "High-net-worth individuals who require a secure, reliable vault. Institutional tools with a personal touch — full control and real-time monitoring.",
                   f: false
                 },
                 { 
                   t: "Asset Managers & Advisors", 
                   b: "PREMIUM & INSTITUTIONAL", 
                   d: "Wealth managers overseeing digital asset allocations on behalf of clients. Multi-portfolio management, audit logs, and compliance tools.",
                   f: false
                 },
                 { 
                   t: "Institutions & Enterprises", 
                   b: "INSTITUTIONAL", 
                   d: "Corporate treasuries and family offices requiring enterprise custody, regulatory compliance, and security that meets institutional fiduciary responsibility.",
                   f: true
                 }
               ].map((p, i) => (
                 <Reveal key={i} delay={i * 0.1} className={`p-12 rounded-[3rem] border transition-all h-full flex flex-col ${p.f ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/40 shadow-[0_0_40px_rgba(240,180,41,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                    <div className="inline-flex items-center px-3 py-1 bg-white/5 rounded-full text-[8px] font-black tracking-widest text-gray-500 mb-8 border border-white/10">
                       {p.b}
                    </div>
                    <h3 className="text-xl font-black text-white mb-6 tracking-tight">{p.t}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow">{p.d}</p>
                    <div className={`h-1 w-12 rounded-full ${p.f ? 'bg-[var(--color-primary)]' : 'bg-gray-800'}`} />
                 </Reveal>
               ))}
            </div>

            <Reveal className="text-center">
               <Link href="/support" className="inline-flex items-center space-x-2 text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest hover:text-white transition-colors">
                  <span>Find Your Account Tier</span>
                  <ArrowRight className="w-4 h-4" />
               </Link>
            </Reveal>
         </div>
      </section>

      {/* ── SECTION 04: WHY CORE CAPITAL ─────────────────────────────── */}
      <section id="why-us" className="py-24 md:py-[100px] border-t border-white/5">
         <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-20">
               <SectionLabel num="04">Why Us</SectionLabel>
               <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">The Difference Is in the Detail</h2>
               <p className="text-gray-400 text-lg leading-relaxed">
                 There are other wallets. There is only one Core Capital. Here is what sets us apart from every alternative in the market.
               </p>
            </div>

            <div className="max-w-5xl mx-auto mb-24">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative">
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2" />
                  
                  {[
                    { l: "Standard wallets store your keys on internet-connected servers.", r: "Core Capital holds the majority of assets in offline, air-gapped cold storage vaults — unreachable by any online threat." },
                    { l: "Most platforms treat security as a feature.", r: "At Core Capital, security is the architecture — embedded into every layer of the platform from the ground up." },
                    { l: "Generic support teams with 48-hour response windows.", r: "Dedicated relationship managers for Premium and Institutional members, available 24 hours a day, 365 days a year." },
                    { l: "Opaque fee structures and hidden charges.", r: "Full fee transparency on every transaction before you confirm — no surprises, no small print." },
                    { l: "One-size-fits-all account structures.", r: "Tiered accounts built around how you actually invest — each with features matched to your level." }
                  ].map((p, i) => (
                    <React.Fragment key={i}>
                       <Reveal delay={i * 0.05} className="md:pr-12 py-6">
                          <p className="text-sm text-gray-500 leading-relaxed">{p.l}</p>
                       </Reveal>
                       <Reveal delay={i * 0.05 + 0.1} className="md:pl-12 py-6 flex items-start space-x-4">
                          <div className="w-5 h-5 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0 mt-0.5">
                             <CheckCircle2 className="w-3 h-3 text-[var(--color-primary)]" />
                          </div>
                          <p className="text-sm text-white font-medium leading-relaxed">{p.r}</p>
                       </Reveal>
                    </React.Fragment>
                  ))}
               </div>
            </div>

            {/* Final CTA Banner */}
            <div className="bg-[var(--color-primary)] rounded-[3rem] p-12 md:p-20 relative overflow-hidden group">
               <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                  <div className="max-w-2xl text-black">
                     <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to Secure Your Digital Wealth?</h2>
                     <p className="text-black/70 text-lg font-medium leading-relaxed">
                        Join Core Capital today and experience the standard that serious investors demand.
                     </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                     <Link href="/auth/register" className="bg-black text-white px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center">
                        Open Your Vault
                     </Link>
                     <Link href="/support" className="bg-white/20 backdrop-blur-md text-black border border-black/10 px-10 py-5 rounded-full text-sm font-black uppercase tracking-widest hover:bg-white/30 transition-all flex items-center justify-center">
                        Talk to Our Team
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </main>
  );
}
