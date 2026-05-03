"use client";

import React from "react";
import { Hash, QrCode, ShieldCheck, Zap, Globe, ArrowRight, Laptop, Layout, Link as LinkIcon, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AddressesLandingPage() {
  const sections = [
    {
      title: "Cryptographic Address Generation",
      desc: "Our platform manages the cryptographic generation of public wallet addresses. Every address in our pool follows the checksum and character standards of its respective blockchain network.",
      icon: <Hash className="w-8 h-8" />
    },
    {
      title: "Network-Specific Mapping",
      desc: "Experience how addresses are mapped to specific protocols. From the '0x' prefix of EVM-compatible networks to the 'T' prefix of Tron, our platform handles the technical nuances of blockchain addressing.",
      icon: <Cpu className="w-8 h-8" />
    },
    {
      title: "Liquidity Network Sources",
      desc: "Utilize incoming asset flows from high-repute pooled addresses. Our system manages a vast pool of sender addresses to provide a secure transaction environment for your capital.",
      icon: <Layout className="w-8 h-8" />
    },
    {
      title: "Privacy and Obfuscation",
      desc: "Utilize the pseudo-anonymous nature of blockchain addresses. We demonstrate how public keys protect identity while ensuring the transparency of the transaction ledger.",
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
               <QrCode className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Smart Addressing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Cryptographic <br /><span className="text-gradient">Address Generation</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Understand the identity layer of the blockchain. Secure address generation for the next generation of digital asset management.
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

      {/* Code Snippet / Technical Preview Section */}
      <section className="container mx-auto px-6 mt-32">
         <div className="glass-card p-16 rounded-[4rem] flex flex-col lg:flex-row items-center gap-16 bg-white/[0.01]">
            <div className="lg:w-1/2">
               <h2 className="text-4xl font-black mb-6">Deterministic <br />Logic Engine</h2>
               <p className="text-gray-400 leading-relaxed mb-10">Our back-end uses cryptographically secure random number generators (CSPRNG) to generate addresses that are secure and compliant with blockchain standards.</p>
               <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-xs font-bold text-gray-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)]"></div>
                     <span>Compliant with BIP-39 Standards</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-bold text-gray-500">
                     <div className="w-1.5 h-1.5 rounded-full bg-[var(--secondary)]"></div>
                     <span>Auto-Checksum Verification Logic</span>
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 w-full">
               <div className="bg-[#0A0E1A] p-8 rounded-[2rem] border border-white/5 font-mono text-xs space-y-3 shadow-inner">
                  <div className="text-[var(--secondary)]">// Initializing address pool</div>
                  <div className="text-white">const chain = "ERC-20";</div>
                  <div className="text-white">const address = generateAddress(chain);</div>
                  <div className="text-gray-600 mt-4"># Resulting Address:</div>
                  <div className="text-[var(--primary)]">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="mt-24 py-20 text-center">
         <h2 className="text-3xl font-black mb-8">Ready to generate your first address?</h2>
         <Link href="/auth/register" className="btn-primary inline-flex items-center space-x-3">
            <span>Get Started for Free</span>
            <ArrowRight className="w-5 h-5" />
         </Link>
      </section>
    </div>
  );
}
