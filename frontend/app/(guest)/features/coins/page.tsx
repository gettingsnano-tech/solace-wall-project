"use client";

import React from "react";
import { Coins, TrendingUp, ShieldCheck, Zap, Globe, BarChart3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CoinsFeaturePage() {
  const sections = [
    {
      title: "Extensive Asset Coverage",
      desc: "Simulate a portfolio with over 100+ digital assets. From market leaders like Bitcoin and Ethereum to trending altcoins and stablecoins, our platform provides a comprehensive sandbox for every type of investor.",
      icon: <Globe className="w-8 h-8" />
    },
    {
      title: "High-Fidelity Price Feeds",
      desc: "Experience real-world volatility without the risk. We integrate with industry-leading price APIs to provide accurate, real-time data for all simulated balances, ensuring your demo reflects current market conditions.",
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      title: "Advanced Wallet Logistics",
      desc: "Generate and manage unique virtual addresses for every supported coin. Test incoming and outgoing flow simulations across multiple networks to understand the lifecycle of a digital transaction.",
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      title: "Enterprise-Level Security",
      desc: "Even in a simulation, security is paramount. All coin data and user balances are protected by the same encryption standards used in real-world financial applications, providing a high-trust environment for stakeholders.",
      icon: <ShieldCheck className="w-8 h-8" />
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
               <Coins className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Platform Features</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Multi-Coin <br /><span className="text-gradient">Asset Management</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Explore the vast landscape of digital finance with our comprehensive multi-coin simulation engine. Designed for precision, built for scale.
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

      {/* Deep Dive Section */}
      <section className="py-24 mt-24 bg-white/[0.02] border-y border-white/5">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
               <div className="lg:w-1/2">
                  <h2 className="text-4xl font-black mb-8">Real-Time Data <br />Simulated Intelligence</h2>
                  <div className="space-y-6">
                     <p className="text-gray-400">Our engine doesn't just display static numbers. It simulates the actual logic of a multi-asset wallet, including fee estimations and network confirmation times.</p>
                     <p className="text-gray-400">By using real market data mapped to a simulated environment, we provide investors with a clear picture of how a portfolio behaves in various market regimes.</p>
                  </div>
                  <div className="mt-10">
                     <Link href="/auth/register" className="btn-primary inline-flex items-center space-x-3">
                        <span>Get Started with Assets</span>
                        <ArrowRight className="w-5 h-5" />
                     </Link>
                  </div>
               </div>
               <div className="lg:w-1/2 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-10 blur-3xl -z-10"></div>
                  <div className="glass-card p-8 rounded-[2.5rem]">
                     <div className="space-y-4">
                        {[1, 2, 3, 4].map(i => (
                           <div key={i} className="bg-[#0A0E1A] p-4 rounded-xl flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                 <div className="w-8 h-8 rounded-full bg-white/5"></div>
                                 <div className="w-20 h-2 bg-white/10 rounded"></div>
                              </div>
                              <div className="w-16 h-2 bg-[var(--secondary)]/20 rounded"></div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
