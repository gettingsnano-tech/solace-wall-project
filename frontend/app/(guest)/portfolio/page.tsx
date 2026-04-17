"use client";

import React from "react";
import { BarChart3, TrendingUp, PieChart, Layers, ArrowRight, ShieldCheck, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PortfolioLandingPage() {
  const sections = [
    {
      title: "Holistic Asset Overview",
      desc: "Simulate a bird's-eye view of your entire digital asset portfolio. Track total value, asset allocation, and performance metrics across multiple coins in a single, high-fidelity interface.",
      icon: <PieChart className="w-8 h-8" />
    },
    {
      title: "Real-Time Equity Tracking",
      desc: "Watch your simulated net worth fluctuate based on live market pricing. Our portfolio engine uses high-frequency data feeds to ensure your equity reflection is as accurate as the real market.",
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      title: "Advanced Diversity Metrics",
      desc: "Analyze your holdings by network, asset type, and risk profile. Our simulation tools provide the same advanced analytics used by professional portfolio managers to optimize asset distribution.",
      icon: <Layers className="w-8 h-8" />
    },
    {
      title: "Strategic Simulation",
      desc: "Test 'what-if' scenarios by adjusting your holdings. See how different market movements would affect your simulated portfolio before making any real-world financial decisions.",
      icon: <Zap className="w-8 h-8" />
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
            <div className="inline-flex items-center space-x-2 bg-[var(--secondary)]/10 text-[var(--secondary)] px-4 py-2 rounded-full mb-8">
               <BarChart3 className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Portfolio Analytics</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Master Your <br /><span className="text-gradient">Simulated Equity</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Comprehensive tracking, real-time analytics, and high-fidelity visualization. Take control of your digital asset intelligence with Core Capital.
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
                  className="glass-card p-12 rounded-[3.5rem] group hover:border-[var(--secondary)]/20 transition-all border-white/5"
               >
                  <div className="w-16 h-16 bg-white/[0.05] text-[var(--secondary)] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
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

      {/* Analytics Visualization Mockup */}
      <section className="container mx-auto px-6 mt-32 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[var(--secondary)]/5 blur-[120px] -z-10 rounded-full"></div>
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-12">Visual Wealth Intelligence</h2>
            <div className="glass-card p-12 rounded-[4rem] flex flex-col items-center">
               <div className="flex items-end justify-center gap-4 h-64 w-full mb-12">
                  {[30, 60, 45, 90, 70, 85, 55].map((h, i) => (
                     <motion.div 
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className="w-full bg-gradient-to-t from-[var(--secondary)]/10 to-[var(--secondary)]/40 rounded-t-xl"
                     />
                  ))}
               </div>
               <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <div className="flex items-center space-x-3 text-sm font-bold text-gray-400">
                     <div className="w-3 h-3 rounded-full bg-[var(--primary)]"></div>
                     <span>Asset Growth</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm font-bold text-gray-400">
                     <div className="w-3 h-3 rounded-full bg-[var(--secondary)]"></div>
                     <span>Market Volatility</span>
                  </div>
               </div>
               <div className="mt-12">
                  <Link href="/auth/register" className="btn-secondary inline-flex items-center space-x-3">
                     <span>Design Your Portfolio</span>
                     <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
