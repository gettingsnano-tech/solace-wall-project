"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, Globe, Shield, Zap, Mail, MessageSquare, Code, Layout } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0E1A] border-t border-white/[0.05] pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[var(--primary)] rounded-xl flex items-center justify-center">
                <TrendingUp className="text-[var(--background)] w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight uppercase">Core Capital</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The world's leading high-fidelity crypto wallet simulator for professional investors and enterprise demos.
            </p>
            <div className="flex space-x-4">
               {[MessageSquare, Code, Globe].map((Icon, i) => (
                 <a key={i} href="#" className="w-10 h-10 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-[var(--primary)] transition-all">
                    <Icon className="w-5 h-5" />
                 </a>
               ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-widest text-gray-500">Products</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/wallet" className="text-gray-400 hover:text-[var(--primary)] transition-colors">Crypto Wallet</Link></li>
              <li><Link href="/addresses" className="text-gray-400 hover:text-[var(--primary)] transition-colors">Virtual Addresses</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-[var(--primary)] transition-colors">Portfolio Tracker</Link></li>
              <li><Link href="/transactions" className="text-gray-400 hover:text-[var(--primary)] transition-colors">History Log</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-widest text-gray-500">Resources</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/learn/security" className="text-gray-400 hover:text-[var(--primary)] transition-colors">Security Guide</Link></li>
              <li><Link href="/learn/getting-started" className="text-gray-400 hover:text-[var(--primary)] transition-colors">Education</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-[var(--primary)] transition-colors">Methodology</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-[var(--primary)] transition-colors">Support Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-sm uppercase tracking-widest text-gray-500">Subscribe</h4>
            <p className="text-gray-500 text-sm mb-6">Receive simulation updates and network reports weekly.</p>
            <div className="relative">
               <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--primary)] text-[var(--background)] p-1.5 rounded-lg">
                  <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
            <Link href="/about/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/about/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/about/glossary" className="hover:text-white transition-colors">Glossary</Link>
          </div>
          <p className="text-xs text-gray-700 font-bold">© 2026 CORE CAPITAL COLLECTION. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}

const ArrowRight = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
