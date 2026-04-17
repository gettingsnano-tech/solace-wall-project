"use client";

import React from "react";
import { ShieldAlert, ShieldCheck, Lock, EyeOff, Key, Fingerprint, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SecurityLearnPage() {
  const sections = [
    {
      title: "Simulated Cold Storage",
      desc: "Our platform simulates the security architecture of enterprise cold storage solutions. While assets are virtual, the logic mimics offline private key management to provide a realistic understanding of asset protection.",
      icon: <Lock className="w-8 h-8" />
    },
    {
      title: "Advanced Auth Protocols",
      desc: "We use enterprise-grade JWT (JSON Web Token) authentication with httpOnly secure cookies. This ensures that user sessions are protected against Cross-Site Scripting (XSS) and unauthorized access.",
      icon: <Fingerprint className="w-8 h-8" />
    },
    {
      title: "Database Encryption Layer",
      desc: "Every record in our system, from hashed passwords to simulated transaction logs, is stored using industry-standard AES-256 encryption, reflecting the high-security requirements of financial institutions.",
      icon: <EyeOff className="w-8 h-8" />
    },
    {
      title: "Role-Based Integrity",
      desc: "Strict Role-Based Access Control (RBAC) ensures that only verified administrators can authorize simulated liquidity injections and withdrawal approvals, maintaining a high-fidelity audit trail.",
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
            <div className="inline-flex items-center space-x-2 bg-[var(--secondary)]/10 text-[var(--secondary)] px-4 py-2 rounded-full mb-8">
               <Shield className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Security first</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Protective <br /><span className="text-gradient">Security Mesh</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Even in a simulation, integrity is our core priority. Our security framework mimics enterprise standards to ensure your demo experience is high-trust.
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

      {/* Trust Quote Section */}
      <section className="py-24 mt-24 bg-white/[0.02] border-y border-white/5 text-center">
         <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
               <Lock className="w-12 h-12 text-[var(--secondary)] mx-auto mb-8" />
               <h2 className="text-3xl font-black mb-6 italic">"Security is not a feature, it's the foundation."</h2>
               <p className="text-gray-500 text-sm mb-10">Our philosophy is to build toolsets that reflect the highest standards of the digital asset industry, ensuring that every simulated interaction builds confidence for stakeholders.</p>
               <Link href="/auth/register" className="btn-secondary inline-flex items-center space-x-3">
                  <span>Sign Up Securely</span>
                  <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
