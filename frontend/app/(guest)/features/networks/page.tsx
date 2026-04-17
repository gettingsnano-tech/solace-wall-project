"use client";

import React from "react";
import { Cpu, Share2, Zap, Rocket, ShieldCheck, Globe, ArrowRight, Network } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NetworksFeaturePage() {
  const sections = [
    {
      title: "Protocol Interoperability",
      desc: "Simulate complex cross-chain workflows across diverse protocols. Our platform supports the virtualization of ERC-20, TRC-20, BEP-20, and multiple Layer 2 networks to provide a comprehensive landscape.",
      icon: <Network className="w-8 h-8" />
    },
    {
      title: "Real-Time Confirmation Engine",
      desc: "Experience the mechanics of blockchain confirmations without the wait. Our simulation engine mimics network latency and confirmation logic, providing a realistic bridge between request and settlement.",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "Custom Network Topologies",
      desc: "Administrators can define custom network parameters, including simulated gas fees and confirmation requirements, allowing for perfectly tailored demo scenarios and training environments.",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      title: "Scalable Infrastructure Simulation",
      desc: "Built to handle thousands of concurrent simulated transactions, our network layer ensures that your presentation remains smooth and responsive, no matter the complexity of the asset flow.",
      icon: <Rocket className="w-8 h-8" />
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
               <Share2 className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Global connectivity</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Cross-Chain <br /><span className="text-gradient">Simulated Networks</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Navigate the complex world of blockchain protocols with our advanced network simulation layer. High-fidelity connectivity, zero-risk execution.
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
                  className="glass-card p-12 rounded-[3rem] group hover:border-[var(--secondary)]/20 transition-all"
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

      {/* Global Connectivity Section */}
      <section className="py-24 mt-24 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--secondary)] opacity-[0.03] blur-[100px] rounded-full"></div>
         <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-black mb-8">Seamless Integration <br />Across All Chains</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
               Our simulation technology allows you to showcase the unique advantages of different blockchain networks side-by-side, giving your audience a clear understanding of speed, fees, and compatibility.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
               {['Ethereum Mainnet', 'Tron Network', 'Binance Smart Chain', 'Solana Network', 'Polygon'].map(net => (
                 <div key={net} className="bg-white/[0.05] border border-white/10 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[var(--secondary)] transition-colors cursor-default">
                    {net}
                 </div>
               ))}
            </div>
            <div className="mt-16">
               <Link href="/auth/register" className="btn-secondary inline-flex items-center space-x-3">
                  <span>Explore Network Capabilities</span>
                  <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
