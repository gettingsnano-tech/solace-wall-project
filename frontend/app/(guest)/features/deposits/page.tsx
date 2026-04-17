"use client";

import React from "react";
import { Zap, Wallet, CreditCard, ShieldCheck, ArrowRight, BarChart3, Database, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DepositsFeaturePage() {
  const sections = [
    {
      title: "Admin-Triggered Liquidity",
      desc: "Simulate incoming asset flows instantly. Administrators have the power to 'top-up' any user balance for demo scenarios, providing immediate liquidity for a seamless presentation experience.",
      icon: <Database className="w-8 h-8" />
    },
    {
      title: "High-Veracity Transaction Hashes",
      desc: "Every simulated deposit generates a synthetically generated transaction hash, allowing you to showcase the auditability and transparency of the digital asset lifecycle in a demo environment.",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "Real-Time Portfolio Reflected",
      desc: "Deposit simulations reflect instantly in the user's dashboard and recent transaction lists. Watch balances update in real-time as admin-powered funding is authorized and processed.",
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      title: "Cross-Asset Funding Support",
      desc: "Credit users with any supported coin—from BTC and ETH to stablecoins like USDT. Test complex portfolio strategies by funding multiple assets simultaneously in a high-fidelity sandbox.",
      icon: <Globe className="w-8 h-8" />
    }
  ];

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center max-w-4xl mx-auto"
         >
            <div className="inline-flex items-center space-x-2 bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full mb-8">
               <Zap className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Instant funding</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Simulated <br /><span className="text-gradient">Liquidity Injection</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Experience the power of admin-controlled asset management. Simulate deposits and test your liquidity strategies with zero financial risk.
            </p>
         </motion.div>
      </section>

      {/* Main Content Sections */}
      <section className="container mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {sections.map((section, idx) => (
               <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-12 rounded-[3rem] group hover:border-[var(--primary)]/20 transition-all"
               >
                  <div className="w-16 h-16 bg-white/[0.05] text-[var(--primary)] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                     {section.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4">{section.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     {section.desc}
                  </p>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Demo Flow Section */}
      <section className="py-24 mt-24 bg-white/[0.02] border-y border-white/5 relative">
         <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
               <h2 className="text-4xl font-black mb-8">The Perfect Demo Tool</h2>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                  {[
                    { step: "01", title: "Select User", desc: "Choose the target wallet for simulation." },
                    { step: "02", title: "Apply Funds", desc: "Admin authorizes the credit amount." },
                    { step: "03", title: "Live Credit", desc: "User balance updates instantly." }
                  ].map((s, i) => (
                    <div key={i} className="space-y-4">
                       <div className="text-5xl font-black text-white/5">{s.step}</div>
                       <h4 className="font-bold text-[var(--primary)] uppercase tracking-widest text-xs">{s.title}</h4>
                       <p className="text-xs text-gray-400">{s.desc}</p>
                    </div>
                  ))}
               </div>
               <Link href="/auth/register" className="btn-primary inline-flex items-center space-x-3">
                  <span>Start Simulating Today</span>
                  <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
