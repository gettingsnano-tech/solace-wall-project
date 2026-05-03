"use client";

import React from "react";
import { FileText, Scale, Gavel, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      title: "Digital Asset Sovereignty",
      desc: "CORE CAPITAL is an institutional-grade asset management platform. All digital assets and transaction hashes are processed with 256-bit encryption to ensure maximum security and platform integrity.",
      icon: <ShieldCheck className="w-8 h-8" />
    },
    {
      title: "User Responsibility",
      desc: "You are responsible for maintaining the confidentiality of your account credentials. Any activity performed under your account is deemed your responsibility within the platform's ecosystem.",
      icon: <Lock className="w-8 h-8" />
    },
    {
      title: "Platform Usage",
      desc: "The platform is provided for professional wealth management and digital asset control. Any attempt to exploit, reverse engineer, or use the platform for unauthorized activities is strictly prohibited.",
      icon: <Gavel className="w-8 h-8" />
    },
    {
      title: "Risk Disclosure",
      desc: "Content on this platform does not constitute financial, investment, or legal advice. Digital asset markets involve significant risk, and platform performance does not guarantee future results.",
      icon: <AlertTriangle className="w-8 h-8" />
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
            <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full mb-8">
               <ShieldAlert className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Legal Agreement</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Terms of <br /><span className="text-gradient">Service</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Please read our terms of use carefully. By accessing the Core Capital platform, you acknowledge and agree to our institutional guidelines and security protocols.
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
                  className="glass-card p-12 rounded-[3.5rem] group hover:border-red-500/30 transition-all border-white/5"
               >
                  <div className="w-16 h-16 bg-white/[0.05] text-red-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
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

      {/* Acceptance Checkbox Mockup */}
      <section className="container mx-auto px-6 mt-24">
         <div className="glass-card p-10 rounded-[3rem] bg-white/[0.01] border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
               <div className="w-12 h-12 bg-[var(--secondary)]/10 text-[var(--secondary)] rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
               </div>
               <div>
                  <h4 className="font-bold text-lg">Agreement Acknowledgement</h4>
                  <p className="text-xs text-gray-500">I confirm that I understand the terms of use and security protocols of this platform.</p>
               </div>
            </div>
            <Link href="/auth/register" className="btn-primary flex items-center space-x-3 px-10">
               <span>I Agree & Proceed</span>
               <ArrowRight className="w-5 h-5" />
            </Link>
         </div>
      </section>

      {/* Last Updated Footer */}
      <section className="mt-20 py-10 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">Last Updated: April 2026</p>
      </section>
    </div>
  );
}
