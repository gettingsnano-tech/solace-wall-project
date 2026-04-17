"use client";

import React from "react";
import { Database, Link as LinkIcon, Cpu, Globe, ArrowRight, BookOpen, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BlockchainBasicsPage() {
  const sections = [
    {
      title: "The Immutable Ledger",
      desc: "At its core, blockchain is a distributed record-keeping system. Every simulated transaction in Core Capital mimics the immutability of a real ledger, ensuring data integrity across the system.",
      icon: <Database className="w-8 h-8" />
    },
    {
      title: "Decentralized Consensus",
      desc: "Understand how networks agree on the truth. We simulate consensus mechanisms like Proof of Work and Proof of Stake to demonstrate how transactions are verified and secured by global participants.",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      title: "Smart Contract Logic",
      desc: "Explore the power of programmable money. Our platform demonstrates how smart contracts execute predefined rules without intermediaries, bringing transparency and automation to finance.",
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: "The Global Asset Mesh",
      desc: "Blockchain tech connects the world. Learn how digital assets enable borderless value transfer and financial inclusion, all within our high-fidelity, zero-risk simulation environment.",
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
            <div className="inline-flex items-center space-x-2 bg-[var(--secondary)]/10 text-[var(--secondary)] px-4 py-2 rounded-full mb-8">
               <BookOpen className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Education portal</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Blockchain <br /><span className="text-gradient">Core Fundamentals</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Demystifying the technology behind the transformation. Learn how ledgers, nodes, and networks combine to create the future of global finance.
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
                  className="glass-card p-12 rounded-[3rem] group hover:border-[var(--secondary)]/20 transition-all border-white/5"
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

      {/* Layer Section */}
      <section className="py-24 mt-24 bg-white/[0.02] border-y border-white/5">
         <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="lg:w-1/2 relative">
                  <div className="absolute inset-0 bg-[var(--secondary)]/10 blur-[120px] rounded-full"></div>
                  <Layers className="w-64 h-64 text-white/[0.03] animate-pulse" />
               </div>
               <div className="lg:w-1/2">
                  <h2 className="text-4xl font-black mb-8">Why it Matters.</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                     Digital assets represent a fundamental shift in how we handle trust. By removing central points of failure, blockchain technology creates more resilient and efficient financial systems.
                  </p>
                  <ul className="space-y-4 mb-10">
                     {['24/7 Global Availability', 'Immutable Audit Trails', 'Reduced Settlement Times', 'Programmable Compliance'].map(item => (
                        <li key={item} className="flex items-center space-x-3 text-sm font-bold text-gray-300">
                           <div className="w-2 h-2 rounded-full bg-[var(--secondary)]"></div>
                           <span>{item}</span>
                        </li>
                     ))}
                  </ul>
                  <Link href="/auth/register" className="btn-secondary inline-flex items-center space-x-3">
                     <span>Start Your Simulation</span>
                     <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
