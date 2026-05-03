"use client";

import React from "react";
import { History, Shield, Zap, Globe, ArrowRight, BarChart3, Search, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TransactionsLandingPage() {
  const sections = [
    {
      title: "Immutable History Logs",
      desc: "Experience a permanent record of every move. Our transaction logs provide the immutability of the blockchain, offering a reliable audit trail for all your financial activities.",
      icon: <History className="w-8 h-8" />
    },
    {
      title: "Real-Time Status Synchronization",
      desc: "Watch as transactions move through states of pending, approved, or rejected. Our synchronizer ensures that your dashboard reflects the absolute latest status of every request.",
      icon: <Clock className="w-8 h-8" />
    },
    {
      title: "Detailed Metadata Verification",
      desc: "Every transaction includes detailed metadata: from network hashes and gas estimates to timestamped confirmation logs, providing professional-grade data integrity.",
      icon: <Search className="w-8 h-8" />
    },
    {
      title: "Verified Settlement Simulation",
      desc: "Learn about the settlement process. We manage the confirmation cycles required by different networks, giving you a clear window into how assets are finalized on the ledger.",
      icon: <CheckCircle2 className="w-8 h-8" />
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
               <History className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Transaction Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Auditable <br /><span className="text-gradient">Transaction History</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Transparency at every step. Monitor, verify, and analyze every asset movement with our enterprise-grade history engine.
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

      {/* Transaction List Mockup */}
      <section className="container mx-auto px-6 mt-32">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-widest">Activity <span className="text-[var(--primary)]">Preview</span></h2>
            <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
               <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex justify-between items-center">
                     <div className="w-32 h-2 bg-white/10 rounded"></div>
                     <div className="w-20 h-6 bg-[var(--primary)]/10 rounded-full"></div>
                  </div>
               </div>
               <div className="divide-y divide-white/5">
                  {[1, 2, 3].map(i => (
                     <div key={i} className="p-6 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                              <Zap className="w-4 h-4 text-gray-500" />
                           </div>
                           <div className="space-y-2">
                              <div className="w-24 h-2 bg-white/10 rounded"></div>
                              <div className="w-40 h-1.5 bg-white/5 rounded"></div>
                           </div>
                        </div>
                        <div className="text-right space-y-2">
                           <div className="w-16 h-2 bg-white/10 rounded ml-auto"></div>
                           <div className="w-12 h-1.5 bg-white/5 rounded ml-auto"></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="mt-12 text-center">
               <Link href="/auth/register" className="btn-primary inline-flex items-center space-x-3">
                  <span>View Your Full History</span>
                  <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
