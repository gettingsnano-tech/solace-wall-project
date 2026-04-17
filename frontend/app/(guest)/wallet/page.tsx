"use client";

import React from "react";
import { Wallet, Shield, Zap, Globe, ArrowRight, Smartphone, Layout, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WalletLandingPage() {
  const sections = [
    {
      title: "Self-Custody Simulation",
      desc: "Experience the true meaning of 'your keys, your coins.' Our wallet simulation mimics the self-custodial architecture of leading hardware and software wallets.",
      icon: <Shield className="w-8 h-8" />
    },
    {
      title: "Instant Setup Logistics",
      desc: "No complex recovery phrases or verification queues. Generate a fully functional simulated wallet for any asset in a single click and start managing your demo portfolio.",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "Global Protocol Support",
      desc: "From Bitcoin Mainnet to Layer 2 Ethereum solutions, our wallet layer supports the simulation of diverse blockchain protocols and network standards.",
      icon: <Globe className="w-8 h-8" />
    },
    {
      title: "Multi-Device Experience",
      desc: "Designed to look and feel premium on any device. Monitor your simulated assets whether you're at your desk or presenting to investors on the go.",
      icon: <Smartphone className="w-8 h-8" />
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
               <Wallet className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Digital Asset storage</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">The Future of <br /><span className="text-gradient">Wallet Technology</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Secure, intuitive, and highly versatile. Our simulated wallet architecture provides a premium window into the world of digital asset storage.
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
                  className="glass-card p-12 rounded-[3.5rem] group hover:border-[var(--primary)]/20 transition-all border-white/5"
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

      {/* Wallet Preview Section */}
      <section className="container mx-auto px-6 mt-32">
         <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[4rem] p-16 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
               <div className="bg-[var(--primary)]/10 p-3 rounded-2xl inline-block mb-6">
                  <Layout className="w-8 h-8 text-[var(--primary)]" />
               </div>
               <h2 className="text-4xl font-black mb-6">Interactive Dashboard</h2>
               <p className="text-gray-400 leading-relaxed mb-10">Our wallet interface isn't just a list of numbers. It's a fully interactive suite where you can track history, manage networks, and visualize asset growth in real-time.</p>
               <Link href="/auth/register" className="btn-primary inline-flex items-center space-x-3">
                  <span>Open Your Wallet</span>
                  <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
            <div className="lg:w-1/2 relative bg-[#0A0E1A] p-1 rounded-[2.5rem] shadow-2xl border border-white/10">
               <div className="bg-white/[0.03] p-10 rounded-[2.2rem]">
                  <div className="flex justify-between items-center mb-10">
                     <div className="w-12 h-12 bg-white/5 rounded-full"></div>
                     <div className="flex space-x-2">
                        <div className="w-12 h-4 bg-white/5 rounded"></div>
                        <div className="w-8 h-4 bg-[var(--primary)]/20 rounded"></div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="h-4 bg-white/5 rounded w-full"></div>
                     <div className="h-4 bg-white/5 rounded w-3/4"></div>
                     <div className="h-4 bg-white/5 rounded w-1/2"></div>
                  </div>
                  <div className="mt-12 flex justify-center">
                     <div className="w-32 h-10 bg-[var(--primary)]/20 rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
