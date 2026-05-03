"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Shield,
  Wallet,
  BarChart3,
  GraduationCap,
  Users,
  TrendingUp,
  Cpu,
  Globe,
  Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Desktop Dropdown Item ────────────────────────────────────────────────────
const NavItem = ({
  title,
  items,
  isActive,
  onClick,
}: {
  title: string;
  items: any[];
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div className="relative" onMouseLeave={() => isActive && onClick()}>
      <button
        className={`flex items-center space-x-1 px-4 py-2 text-sm font-semibold transition-colors rounded-lg hover:bg-white/[0.05] ${
          isActive ? "text-[var(--color-primary)]" : "text-gray-300 hover:text-white"
        }`}
        onMouseEnter={onClick}
        onClick={onClick}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isActive ? "rotate-180 text-[var(--color-primary)]" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full pt-3 w-[540px] z-50"
          >
            <div className="glass-card p-5 grid grid-cols-2 gap-3 rounded-2xl shadow-2xl border border-white/[0.08]"
              style={{ background: "rgba(10,14,26,0.95)", backdropFilter: "blur(24px)" }}
            >
              {items.map((item: any, idx: number) => (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={onClick}
                  className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/[0.06] transition-all group"
                >
                  <div className="bg-[var(--color-primary)]/10 p-2 rounded-lg text-[var(--color-primary)] shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white group-hover:text-[var(--color-primary)] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {item.description}
                    </p>
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

// ─── Main Nav ─────────────────────────────────────────────────────────────────
export default function MegaNav() {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveItem(null);
  }, [pathname]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Hide MegaNav on dashboard and admin routes (they have their own layouts)
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  if (isDashboard) return null;

  const navData = {
    Products: [
      { title: "Crypto Wallet", description: "Store, send, and receive crypto securely", href: "/wallet", icon: <Wallet className="w-4 h-4" /> },
      { title: "Virtual Addresses", description: "Generate coin-specific wallet addresses", href: "/addresses", icon: <Cpu className="w-4 h-4" /> },
      { title: "Portfolio Tracker", description: "Monitor all your assets in one place", href: "/portfolio", icon: <BarChart3 className="w-4 h-4" /> },
      { title: "Transaction History", description: "Full audit trail of all activity", href: "/transactions", icon: <ArrowRight className="w-4 h-4" /> },
    ],
    Features: [
      { title: "Multi-Coin Support", description: "BTC, ETH, USDT and more", href: "/features/coins", icon: <Globe className="w-4 h-4" /> },
      { title: "Network Selection", description: "ERC-20, TRC-20, BEP-20", href: "/features/networks", icon: <Cpu className="w-4 h-4" /> },
      { title: "Instant Deposits", description: "Admin-powered balance top-ups", href: "/features/deposits", icon: <Rocket className="w-4 h-4" /> },
      { title: "Security Guide", description: "Keep your assets safe", href: "/learn/security", icon: <Shield className="w-4 h-4" /> },
    ],
    Learn: [
      { title: "Getting Started", description: "Your first steps into crypto", href: "/learn/getting-started", icon: <GraduationCap className="w-4 h-4" /> },
      { title: "Blockchain Basics", description: "Networks, gas, confirmations", href: "/learn/blockchain-basics", icon: <Cpu className="w-4 h-4" /> },
      { title: "Glossary", description: "Crypto terms explained", href: "/about/glossary", icon: <ArrowRight className="w-4 h-4" /> },
    ],
    About: [
      { title: "About Us", description: "Our mission and vision", href: "/about", icon: <Users className="w-4 h-4" /> },
      { title: "Careers", description: "Join the team", href: "/about/careers", icon: <Users className="w-4 h-4" /> },
      { title: "Privacy Policy", description: "Our commitment to data", href: "/about/privacy", icon: <Shield className="w-4 h-4" /> },
      { title: "Terms of Service", description: "User agreement and rules", href: "/about/terms", icon: <ArrowRight className="w-4 h-4" /> },
    ],
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? "bg-[#0A0E1A] border-b border-white/[0.06] py-3 shadow-2xl shadow-black/40"
            : "bg-[#0A0E1A]/90 backdrop-blur-xl py-4 border-b border-white/[0.04]"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="Core Capital Digital Currency" className="h-24 md:h-28 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {Object.entries(navData).map(([key, items]) => (
              <NavItem
                key={key}
                title={key}
                items={items}
                isActive={activeItem === key}
                onClick={() => setActiveItem(activeItem === key ? null : key)}
              />
            ))}
            <Link
              href="/market"
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              Market
            </Link>
            <Link
              href="/support"
              className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              Support
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="text-sm font-bold text-gray-300 hover:text-white transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link href="/auth/register" className="btn-primary text-sm py-2.5 px-5">
              Get Started
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-white/[0.05] transition-colors text-white"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-[110] flex flex-col lg:hidden"
            style={{ background: "#0A0E1A" }}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] shrink-0">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <img src="/logo.png" alt="Core Capital Digital Currency" className="h-20 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors text-gray-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Scrollable Content */}
            <div className="flex-1 overflow-y-auto py-4 px-5 space-y-1">
              {/* Nav Groups */}
              {Object.entries(navData).map(([key, items]) => (
                <div key={key} className="border-b border-white/[0.05] pb-1 mb-1">
                  <button
                    className="w-full flex items-center justify-between py-3.5 px-2 text-left"
                    onClick={() =>
                      setMobileExpanded(mobileExpanded === key ? null : key)
                    }
                  >
                    <span className="font-black text-sm uppercase tracking-widest text-gray-300">
                      {key}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        mobileExpanded === key ? "rotate-180 text-[var(--color-primary)]" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileExpanded === key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-3 space-y-1 pl-2">
                          {items.map((item: any, idx: number) => (
                            <Link
                              key={idx}
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center space-x-3 py-2.5 px-3 rounded-xl hover:bg-white/[0.05] transition-all group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shrink-0">
                                {item.icon}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-200 group-hover:text-white">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-gray-600">{item.description}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Flat links */}
              <Link
                href="/market"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center py-3.5 px-2 text-sm font-black uppercase tracking-widest text-gray-300 hover:text-white border-b border-white/[0.05]"
              >
                Market
              </Link>
              <Link
                href="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center py-3.5 px-2 text-sm font-black uppercase tracking-widest text-gray-300 hover:text-white"
              >
                Support
              </Link>
            </div>

            {/* Mobile Footer CTAs */}
            <div className="shrink-0 px-5 py-5 border-t border-white/[0.07] space-y-3">
              <Link
                href="/auth/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary w-full text-center py-3.5 text-sm font-black block"
              >
                Get Started — It's Free
              </Link>
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors block"
              >
                Sign in to your account
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
