"use client";

import React from "react";
import { Users, Target, Shield, Rocket, ArrowRight, Heart, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const stats = [
    { label: "Active Users", value: "2M+" },
    { label: "Total Volume", value: "$45B+" },
    { label: "Supported Coins", value: "100+" },
    { label: "Team Members", value: "250+" },
  ];

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center max-w-3xl mx-auto"
         >
            <h1 className="text-5xl md:text-7xl font-black mb-8">Pioneering the <br /><span className="text-gradient">Financial Frontier</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               CORE CAPITAL COLLECTION is more than just a simulator. We are a team of visionary developers and financial experts dedicated to demystifying the world of digital assets.
            </p>
         </motion.div>
      </section>

      {/* Stats Grid */}
      <section className="bg-white/[0.02] border-y border-white/[0.05] py-20 mb-24">
         <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
               {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                     <div className="text-3xl md:text-5xl font-black mb-2 text-[var(--primary)]">{stat.value}</div>
                     <div className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-6 mb-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
               <h2 className="text-4xl font-black">Our Mission</h2>
               <p className="text-gray-400 leading-relaxed">
                  We believe that financial freedom should be accessible to everyone. Our platform aims to provide a safe, high-fidelity environment where investors can test their strategies and understand the nuances of blockchain technology without the risk of real asset loss.
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Shield, title: "Trust First", desc: "Security is baked into our core." },
                    { icon: Heart, title: "Client Focused", desc: "Your success is our metric." },
                    { icon: Globe, title: "Borderless", desc: "Connecting the global economy." },
                    { icon: Rocket, title: "Innovative", desc: "Pushing the limits of scale." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex space-x-4">
                       <item.icon className="w-6 h-6 text-[var(--secondary)] shrink-0" />
                       <div>
                          <h4 className="font-bold text-sm tracking-tight">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-[var(--secondary)] opacity-10 blur-3xl -z-10"></div>
               <div className="glass-card rounded-[3rem] p-12 aspect-square flex flex-col justify-center items-center text-center">
                  <Target className="w-20 h-20 text-[var(--primary)] mb-8" />
                  <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Precision Engineering</h3>
                  <p className="text-sm text-gray-500 max-w-xs">Building tools that empower the next generation of digital asset managers.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
