"use client";

import React from "react";
import { UserPlus, Wallet, ArrowRight, Zap, Coffee, CheckCircle2, Navigation, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GettingStartedPage() {
  const steps = [
    {
      title: "Initialize Your Account",
      desc: "Create your secure simulation account in seconds. Use a valid email and a strong password to gain access to the Core Capital ecosystem.",
      icon: <UserPlus className="w-8 h-8" />,
      step: "01"
    },
    {
      title: "Seed Your Wallet Pair",
      desc: "Navigate to the Wallet tab to generate unique addresses for any supported coin. Choose from ERC-20, TRC-20, or native blockchain networks.",
      icon: <Wallet className="w-8 h-8" />,
      step: "02"
    },
    {
      title: "Authorize Deposit Flow",
      desc: "As an administrator, you can credit your balance with simulated assets. Watch your portfolio value update instantly in your overview dashboard.",
      icon: <Zap className="w-8 h-8" />,
      step: "03"
    },
    {
      title: "Execute Withdrawals",
      desc: "Practice moving assets by submitting withdrawal requests. Every request is reviewed and authorized by our simulated administrative team.",
      icon: <CheckCircle2 className="w-8 h-8" />,
      step: "04"
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
               <PlayCircle className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Quick Start Guide</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Your Journey <br /><span className="text-gradient">Starts Here</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               Master the fundamentals of digital asset management. Follow our streamlined guide to become a pro simulator user in minutes.
            </p>
         </motion.div>
      </section>

      {/* Steps Section */}
      <section className="container mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((step, idx) => (
               <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-10 rounded-[2.5rem] relative group"
               >
                  <div className="absolute top-8 right-10 text-6xl font-black text-white/5 group-hover:text-[var(--primary)]/10 transition-colors">
                     {step.step}
                  </div>
                  <div className="w-16 h-16 bg-white/[0.05] text-[var(--primary)] rounded-2xl flex items-center justify-center mb-8">
                     {step.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                     {step.desc}
                  </p>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Success CTA Section */}
      <section className="py-24 mt-24 bg-gradient-to-t from-[var(--primary)]/5 to-transparent border-t border-white/5">
         <div className="container mx-auto px-6 text-center">
            <Coffee className="w-12 h-12 text-[var(--primary)] mx-auto mb-8" />
            <h2 className="text-4xl font-black mb-8">Ready to initiate?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
               Our dedicated support team is available 24/7 if you have any questions during your onboarding process. Experience the future of finance today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link href="/auth/register" className="btn-primary flex items-center justify-center space-x-2">
                  <span>Create Account</span>
                  <Navigation className="w-4 h-4" />
               </Link>
               <Link href="/support" className="px-8 py-3 rounded-full border border-white/10 font-bold hover:bg-white/5 transition-all">
                  Contact Support
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}
