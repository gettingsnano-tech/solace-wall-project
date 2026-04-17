"use client";

import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe, Cpu, ChevronRight, CheckCircle2, Star, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    { icon: <Shield className="w-6 h-6" />, title: "Bank-Grade Security", desc: "Your simulated assets are protected by industry-leading encryption and JWT-based authentication." },
    { icon: <Zap className="w-6 h-6" />, title: "Instant Settlements", desc: "Experience real-time transaction processing with admin-powered simulated deposits." },
    { icon: <Globe className="w-6 h-6" />, title: "Global Connectivity", desc: "Simulate transfers across multiple networks including ERC-20, TRC-20, and Mainnet." },
    { icon: <Cpu className="w-6 h-6" />, title: "Smart Addresses", desc: "Generate unique virtual addresses for every major cryptocurrency instantly." },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Live Market Data", desc: "Stay informed with real-time price feeds and market statistics powered by CoinGecko." },
    { icon: <Star className="w-6 h-6" />, title: "VIP Experience", desc: "Custom-tailored dashboard for high-net-worth simulation and investor presentations." },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
          <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.05] blur-[120px] rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-[var(--secondary)] opacity-[0.05] blur-[120px] rounded-full animate-pulse-slow"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        <div className="container mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/[0.05] border border-white/10 px-4 py-1.5 rounded-full mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--secondary)] animate-pulse"></div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--secondary)]">All Systems Operational</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]"
          >
            Your Gateway to the <br />
            <span className="text-gradient">Future of Digital Assets</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Simulate, explore, and understand crypto wallets — all in one secure platform designed for the most demanding investors.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link href="/auth/register" className="btn-primary w-full sm:w-auto px-10 py-4 text-lg">
              Get Started Free
            </Link>
            <Link href="/market" className="btn-secondary w-full sm:w-auto px-10 py-4 text-lg flex items-center justify-center space-x-2">
              <span>Explore Features</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Supported Coins Marquee (Static Preview) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-24 pt-12 border-t border-white/[0.05]"
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-8">Trusted by simulator enthusiasts across the globe</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               {['Bitcoin', 'Ethereum', 'Tether', 'Solana', 'BNB', 'Cardano'].map(coin => (
                 <span key={coin} className="text-xl font-bold tracking-tighter">{coin}</span>
               ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Enterprise-Ready Features</h2>
            <p className="text-gray-400">Everything you need to build and present a high-conviction crypto strategy.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl"
              >
                <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">Built for Trust. <br />Designed for Scale.</h2>
              <div className="space-y-6">
                {[
                  "No real blockchain risk involved.",
                  "Full admin transparency and control.",
                  "Simulated transaction hashes for audit trails.",
                  "Instant response times across all modules."
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="mt-1 bg-[var(--secondary)]/20 p-1 rounded-full text-[var(--secondary)]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <p className="text-gray-300 font-medium">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link href="/about" className="text-[var(--secondary)] font-bold flex items-center space-x-2 group">
                  <span>Learn more about our methodology</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] opacity-10 blur-3xl -z-10"></div>
              <div className="glass-card p-2 rounded-[2rem] overflow-hidden shadow-2xl">
                 <div className="bg-[#0A0E1A] rounded-[1.8rem] p-8 aspect-square flex flex-col justify-center items-center text-center">
                    <div className="w-32 h-32 bg-white/[0.03] border border-white/5 rounded-full flex items-center justify-center mb-8 relative">
                       <Shield className="w-16 h-16 text-[var(--secondary)]" />
                       <div className="absolute inset-x-0 bottom-0 top-0 border-4 border-dashed border-[var(--secondary)]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    </div>
                    <h4 className="text-2xl font-bold mb-2">Secure Simulation</h4>
                    <p className="text-gray-400 text-sm max-w-xs">Our environment mimics cold-storage logic without ever exposing private keys to the open web.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
           <div className="relative glass-card p-12 md:p-20 rounded-[3rem] overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--primary)] opacity-[0.05] blur-[100px] rounded-full"></div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to step into the future?</h2>
              <p className="text-gray-400 mb-10 max-w-xl mx-auto">Join thousands of demo users exploring the core of digital asset management with CORE CAPITAL COLLECTION.</p>
              <Link href="/auth/register" className="btn-primary px-12 py-4 text-lg inline-block">
                Start Your Journey
              </Link>
           </div>
        </div>
      </section>

    </div>
  );
}
