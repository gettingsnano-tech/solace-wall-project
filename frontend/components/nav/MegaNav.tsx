"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowRight, Shield, Wallet, BarChart3, GraduationCap, Users, LifeBuoy, TrendingUp, Cpu, Globe, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NavItem = ({ title, items, isActive, onClick }: { title: string, items: any[], isActive: boolean, onClick: () => void }) => {
  return (
    <div className="relative group">
      <button 
        className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--primary)] ${isActive ? "text-[var(--primary)]" : "text-gray-300"}`}
        onMouseEnter={onClick}
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-4 w-[600px] z-50"
            onMouseLeave={() => onClick()}
          >
            <div className="glass-card p-6 grid grid-cols-2 gap-6 rounded-2xl">
              {items.map((item, idx) => (
                <Link key={idx} href={item.href} className="group/item flex items-start space-x-4 p-3 rounded-xl hover:bg-white/[0.05] transition-all">
                  <div className="bg-[var(--primary)]/10 p-2.5 rounded-lg text-[var(--primary)]">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm group-hover/item:text-[var(--primary)] transition-colors">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function MegaNav() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navData = {
    Products: [
      { title: "Crypto Wallet", description: "Store, send, and receive crypto securely", href: "/wallet", icon: <Wallet className="w-5 h-5" /> },
      { title: "Virtual Addresses", description: "Generate coin-specific wallet addresses", href: "/addresses", icon: <Cpu className="w-5 h-5" /> },
      { title: "Portfolio Tracker", description: "Monitor all your assets in one place", href: "/portfolio", icon: <BarChart3 className="w-5 h-5" /> },
      { title: "Transaction History", description: "Full audit trail of all activity", href: "/transactions", icon: <ArrowRight className="w-5 h-5" /> },
    ],
    Features: [
      { title: "Multi-Coin Support", description: "BTC, ETH, USDT and more", href: "/features/coins", icon: <Globe className="w-5 h-5" /> },
      { title: "Network Selection", description: "ERC-20, TRC-20, BEP-20", href: "/features/networks", icon: <Cpu className="w-5 h-5" /> },
      { title: "Instant Deposits", description: "Admin-powered balance top-ups", href: "/features/deposits", icon: <Rocket className="w-5 h-5" /> },
      { title: "Security Guide", description: "Keep your assets safe", href: "/learn/security", icon: <Shield className="w-5 h-5" /> },
    ],
    Learn: [
      { title: "Getting Started", description: "Your first steps into crypto", href: "/learn/getting-started", icon: <GraduationCap className="w-5 h-5" /> },
      { title: "Blockchain Basics", description: "Networks, gas, confirmations", href: "/learn/blockchain-basics", icon: <Cpu className="w-5 h-5" /> },
      { title: "Glossary", description: "Crypto terms explained", href: "/about/glossary", icon: <ArrowRight className="w-5 h-5" /> },
    ],
    About: [
      { title: "About Us", description: "Our mission and vision", href: "/about", icon: <Users className="w-5 h-5" /> },
      { title: "Careers", description: "Join the team", href: "/about/careers", icon: <Users className="w-5 h-5" /> },
      { title: "Privacy Policy", description: "Our commitment to data", href: "/about/privacy", icon: <Shield className="w-5 h-5" /> },
      { title: "Terms of Service", description: "User agreement and simulation rules", href: "/about/terms", icon: <ArrowRight className="w-5 h-5" /> },
    ],
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "nav-blur py-3" : "py-6"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-xl flex items-center justify-center">
            <TrendingUp className="text-[var(--background)] w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">CORE CAPITAL <span className="text-[var(--primary)]">COLLECTION</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-2">
          {Object.entries(navData).map(([key, items]) => (
            <NavItem 
              key={key} 
              title={key} 
              items={items} 
              isActive={activeItem === key} 
              onClick={() => setActiveItem(activeItem === key ? null : key)}
            />
          ))}
          <Link href="/market" className="px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--primary)]">Market</Link>
          <Link href="/support" className="px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--primary)]">Support</Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link href="/auth/login" className="text-sm font-semibold hover:text-[var(--primary)] transition-colors">Sign in</Link>
          <Link href="/auth/register" className="btn-primary">Get Started</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-[var(--background)] z-[110] lg:hidden flex flex-col"
          >
            <div className="p-6 flex justify-between items-center bg-[var(--background)]/80 backdrop-blur-lg">
              <span className="text-xl font-bold">CORE CAPITAL</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {Object.entries(navData).map(([key, items]) => (
                <div key={key}>
                  <h3 className="text-[var(--primary)] font-bold mb-4 flex items-center space-x-2">
                    <span>{key}</span>
                  </h3>
                  <div className="grid gap-4">
                    {items.map((item, idx) => (
                      <Link key={idx} href={item.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 text-sm text-gray-300">
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-6 border-t border-white/10 flex flex-col space-y-4">
                <Link href="/auth/login" className="text-center py-3 font-semibold">Sign in</Link>
                <Link href="/auth/register" className="btn-primary text-center">Get Started</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
