"use client";

import Head from "next/head";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Shield,
  Zap,
  Globe,
  BarChart3,
  RefreshCw,
  Lock,
  Eye,
  FileText,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  Quote,
} from "lucide-react";
import { motion, useInView } from "framer-motion";

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "", decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const steps = 80;
    const increment = target / steps;
    const interval = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(parseFloat(start.toFixed(decimals)));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [inView, target, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Scroll Reveal Wrapper ────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Lock,
    title: "Military-Grade Vault Security",
    desc: "Multi-layer 256-bit AES encryption with biometric authentication and cold storage architecture. Your coin is held to institutional custody standards.",
  },
  {
    icon: Zap,
    title: "Instant Settlement Engine",
    desc: "Execute transfers and conversions with near-zero latency. Core Capital Digital Currency's processing infrastructure operates 24/7 with no downtime, no delays.",
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    desc: "Hold, convert, and manage multiple digital currencies in a single unified wallet interface. Cross-chain compatibility built in.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Portfolio Analytics",
    desc: "Track your asset performance with live dashboards, growth graphs, and capital flow intelligence — all in one view.",
  },
  {
    icon: Shield,
    title: "Regulatory Compliance Layer",
    desc: "Built with AML, KYC, and FATF compliance protocols baked into the platform — not bolted on. Operate with confidence in regulated environments.",
  },
  {
    icon: RefreshCw,
    title: "Smart Wallet Automation",
    desc: "Set rules, triggers, and thresholds to automate your capital allocation. Your wealth works even when you're not watching.",
  },
];

const steps = [
  {
    n: "01",
    title: "Create Your Account",
    desc: "Register in under 2 minutes. Provide basic KYC information and verify your identity securely. No paper forms. No branch visits.",
  },
  {
    n: "02",
    title: "Fund Your Wallet",
    desc: "Deposit your digital coin directly into your Core Capital Digital Currency vault. Transfers are processed instantly with full encryption from point of origin.",
  },
  {
    n: "03",
    title: "Manage & Grow",
    desc: "Monitor your portfolio in real time, set automation rules, convert between currencies, and track your wealth performance — all from your dashboard.",
  },
  {
    n: "04",
    title: "Withdraw Anytime",
    desc: "Your capital is never locked. Withdraw to any verified destination with full audit trails and transaction records always accessible.",
  },
];

const securityPillars = [
  { icon: Lock, title: "End-to-End Encryption", desc: "All data in transit and at rest is encrypted with 256-bit AES. No exceptions." },
  { icon: Shield, title: "Multi-Factor Authentication", desc: "Layer your protection with biometric verification, OTP, and device-based authentication." },
  { icon: Eye, title: "Cold Storage Reserves", desc: "The majority of assets are held in offline cold storage, isolated from network attack vectors." },
  { icon: Zap, title: "Real-Time Threat Monitoring", desc: "24/7 anomaly detection and AI-powered threat response prevents unauthorized access before it happens." },
  { icon: CheckCircle2, title: "Insurance-Backed Custody", desc: "Digital assets on the platform are covered by institutional-grade insurance policies." },
  { icon: FileText, title: "Full Audit Trail", desc: "Every transaction, login, and change is logged immutably. Total transparency. Total accountability." },
];

const testimonials = [
  {
    quote: "Core Capital Digital Currency gave me the confidence to consolidate my entire digital holdings in one place. The security architecture is unlike anything I've seen in the retail wallet space.",
    name: "Adebayo O.",
    role: "Private Investor, Lagos",
  },
  {
    quote: "The dashboard analytics alone are worth it. I can see exactly where my portfolio stands at any moment. This is what a serious digital wallet should look like.",
    name: "Mira K.",
    role: "Asset Manager, Nairobi",
  },
  {
    quote: "I've used five different wallets. None of them felt like they were built for people who actually have assets to protect. Core Capital Digital Currency does.",
    name: "James F.",
    role: "Fintech Entrepreneur, London",
  },
];

import api from "@/lib/api";

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [stats, setStats] = useState({
    users: 180000,
    assets: 2.4,
    uptime: "99.99%",
    encryption: "256-bit"
  });

  useEffect(() => {
    api.get("/api/public/stats").then(res => {
      setStats({
        users: res.data.users,
        assets: res.data.assets / 1e9, // Billion display
        uptime: res.data.uptime,
        encryption: res.data.encryption
      });
    }).catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Core Capital Digital Currency | Secure Digital Wallet for Serious Investors</title>
        <meta
          name="description"
          content="Core Capital Digital Currency is the institutional-grade digital wallet designed for investors who demand security, speed, and sovereignty over their digital assets."
        />
        <meta name="keywords" content="digital wallet, crypto wallet, institutional crypto, secure digital assets, Core Capital Digital Currency, digital currency, multi-currency wallet" />
        <meta property="og:title" content="Core Capital Digital Currency | Secure Digital Wallet for Serious Investors" />
        <meta property="og:description" content="Institutional-grade digital wallet for investors who demand security, speed, and sovereignty." />
        <meta property="og:type" content="website" />
      </Head>

      <main className="flex flex-col w-full overflow-hidden">

        {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
        <section id="hero" aria-labelledby="hero-heading" className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
            <div className="absolute top-[-5%] right-[-10%] w-[600px] h-[600px] bg-[var(--color-primary)] opacity-[0.06] blur-[140px] rounded-full animate-pulse-slow" />
            <div className="absolute bottom-[5%] left-[-8%] w-[500px] h-[500px] bg-[var(--color-secondary)] opacity-[0.06] blur-[140px] rounded-full animate-pulse-slow" />
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          <div className="container mx-auto px-6 text-center">
            {/* Status pill */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center space-x-2 bg-white/[0.05] border border-white/10 px-5 py-2 rounded-full mb-10"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-secondary)]">
                All Systems Operational
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-8"
            >
              Your Wealth.{" "}
              <span className="block text-gradient">
                Fortified in the Digital Age.
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 leading-relaxed"
            >
              Core Capital Digital Currency is the sovereign-grade digital wallet built for those who don't compromise on security, control, or capital growth.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-base text-gray-500 max-w-xl mx-auto mb-12 leading-relaxed"
            >
              In a world where financial borders are dissolving, your digital assets deserve institutional-level protection. Store, manage, and grow your coin with a platform engineered for the elite.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <Link
                href="/auth/register"
                className="btn-primary w-full sm:w-auto px-10 py-4 text-base font-black tracking-wide"
              >
                Get Started — It's Free
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors font-semibold text-sm"
              >
                <span>See How It Works</span>
                <ChevronDown className="w-4 h-4" />
              </a>
            </motion.div>

            {/* Supported coins ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-24 pt-12 border-t border-white/[0.05]"
            >
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-8">
                Trusted by serious investors across the globe
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 hover:opacity-70 transition-all duration-700">
                {["Bitcoin", "Ethereum", "Tether", "Solana", "BNB", "Cardano"].map((coin) => (
                  <span key={coin} className="text-lg font-black tracking-tighter text-white">
                    {coin}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── SECTION 2: TRUST STATS ────────────────────────────────────── */}
        <section id="trust-bar" aria-labelledby="stats-heading" className="py-16 border-y border-white/[0.05] bg-white/[0.015]">
          <div className="container mx-auto px-6">
            <h2 id="stats-heading" className="sr-only">Core Capital Digital Currency by the Numbers</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: stats.assets, suffix: "B+", prefix: "$", label: "Assets Secured", decimals: 1 },
                { value: stats.users, suffix: "+", prefix: "", label: "Active Wallet Holders", decimals: 0 },
                { value: parseFloat(stats.uptime), suffix: "%", prefix: "", label: "Platform Uptime", decimals: 2 },
                { value: parseFloat(stats.encryption), suffix: "-bit", prefix: "", label: "Military-Grade Encryption", decimals: 0 },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 0.1} className="text-center">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                    {stat.prefix}
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      decimals={(stat as any).decimals ?? 0}
                    />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
                    {stat.label}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: VALUE PROPOSITION ─────────────────────────────── */}
        <section id="about" aria-labelledby="about-heading" className="py-28">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <Reveal>
                <div className="flex items-start space-x-4 mb-8">
                  <div className="w-1 h-16 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full shrink-0 mt-1" />
                  <h2 id="about-heading" className="text-3xl md:text-5xl font-black leading-tight">
                    Not Just a Wallet.{" "}
                    <span className="text-gradient">A Financial Command Center.</span>
                  </h2>
                </div>
                <div className="space-y-5 text-gray-400 leading-relaxed pl-5">
                  <p>
                    Core Capital Digital Currency was built on one conviction: that serious investors deserve serious infrastructure. We don't cut corners on compliance, custody, or security architecture.
                  </p>
                  <p>
                    Whether you're storing a growing portfolio or consolidating digital assets across currencies, Core Capital Digital Currency gives you a single, sovereign interface — built with the precision of institutional banking and the agility of next-generation fintech.
                  </p>
                  <p className="text-white font-bold text-lg">
                    This is where capital meets conviction.
                  </p>
                </div>
                <div className="mt-10 pl-5">
                  <Link
                    href="/about"
                    className="inline-flex items-center space-x-2 text-[var(--color-secondary)] font-bold hover:underline"
                  >
                    <span>Learn More About Us</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 blur-3xl -z-10 rounded-full" />
                  <div className="glass-card p-8 rounded-[2.5rem] space-y-4">
                    {["Institutional Custody Standards", "Multi-Chain Compatibility", "Full Regulatory Compliance", "24/7 Anomaly Detection", "Zero-Trust Architecture"].map((item, i) => (
                      <div key={i} className="flex items-center space-x-4 py-3 border-b border-white/[0.05] last:border-0">
                        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-secondary)]" />
                        </div>
                        <span className="font-semibold text-sm text-gray-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FEATURES ───────────────────────────────────────── */}
        <section id="features" aria-labelledby="features-heading" className="py-28 bg-black/20">
          <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
                Platform Capabilities
              </p>
              <h2 id="features-heading" className="text-3xl md:text-5xl font-black mb-5 leading-tight">
                Built for Security.{" "}
                <span className="text-gradient">Designed for Performance.</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Every feature inside Core Capital Digital Currency is engineered around one principle — your assets are yours, always.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <motion.article
                    whileHover={{ y: -6 }}
                    className="glass-card p-8 rounded-[2rem] h-full border-t-2 border-t-[var(--color-primary)]/30 hover:border-t-[var(--color-primary)] transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6">
                      <f.icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-black mb-3">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 5: HOW IT WORKS ───────────────────────────────────── */}
        <section id="how-it-works" aria-labelledby="how-heading" className="py-28">
          <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">
                Simple Onboarding
              </p>
              <h2 id="how-heading" className="text-3xl md:text-5xl font-black mb-5">
                From Sign-Up to Sovereign{" "}
                <span className="text-gradient">in Minutes</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Getting started with Core Capital Digital Currency is frictionless. Security doesn't have to mean complexity.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="relative text-center px-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-white/10 bg-white/[0.03] mb-8 mx-auto relative">
                      <span className="text-2xl font-black text-gradient">{step.n}</span>
                    </div>
                    <h3 className="text-lg font-black mb-3">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4} className="text-center mt-14">
              <Link href="/auth/register" className="btn-primary px-10 py-4 text-base">
                Open Your Wallet Now
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ── SECTION 6: SECURITY DEEP DIVE ────────────────────────────── */}
        <section id="security" aria-labelledby="security-heading" className="py-28 bg-black/20 relative overflow-hidden">
          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(0,212,170,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.8) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="container mx-auto px-6 relative">
            <Reveal className="text-center mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-secondary)] mb-4">
                Zero-Trust Architecture
              </p>
              <h2 id="security-heading" className="text-3xl md:text-5xl font-black mb-5 leading-tight">
                Your Security Is Not a Feature.{" "}
                <br />
                <span className="text-gradient">It's the Foundation.</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Core Capital Digital Currency was engineered from the ground up with a zero-trust security architecture. We apply the same custody standards used by institutional asset managers — because your digital wealth deserves nothing less.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityPillars.map((pillar, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <article className="flex items-start space-x-4 p-6 rounded-2xl border-l-2 border-[var(--color-secondary)]/40 hover:border-[var(--color-secondary)] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300">
                    <div className="w-9 h-9 shrink-0 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center mt-0.5">
                      <pillar.icon className="w-4 h-4 text-[var(--color-secondary)]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-black text-sm mb-1">{pillar.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{pillar.desc}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 7: TESTIMONIALS ───────────────────────────────────── */}
        <section id="testimonials" aria-labelledby="testimonials-heading" className="py-28">
          <div className="container mx-auto px-6">
            <Reveal className="text-center mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-4">
                Investor Voices
              </p>
              <h2 id="testimonials-heading" className="text-3xl md:text-5xl font-black mb-5">
                Trusted by Investors Who{" "}
                <span className="text-gradient">Move Capital Seriously</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                From individual holders to portfolio managers — Core Capital Digital Currency is where disciplined investors secure their digital future.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <article className="glass-card p-8 rounded-[2rem] flex flex-col h-full">
                    <Quote
                      className="w-8 h-8 text-[var(--color-primary)] mb-6 opacity-60"
                      aria-hidden="true"
                    />
                    <p className="text-gray-300 text-sm leading-relaxed flex-1 mb-8 italic">
                      "{t.quote}"
                    </p>
                    <div className="border-t border-white/[0.06] pt-5">
                      <p className="font-black text-white text-sm">— {t.name}</p>
                      <p className="text-gray-500 text-xs mt-1">{t.role}</p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 8: CTA / CLOSING ──────────────────────────────────── */}
        <section id="cta-final" aria-labelledby="cta-heading" className="py-28">
          <div className="container mx-auto px-6">
            <Reveal>
              <div className="relative glass-card p-14 md:p-24 rounded-[3rem] text-center overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[var(--color-primary)] opacity-[0.06] blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[var(--color-secondary)] opacity-[0.04] blur-[100px] rounded-full pointer-events-none" />

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-primary)] mb-6">
                  Sovereign Wealth Infrastructure
                </p>
                <h2 id="cta-heading" className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                  The Vault Is Open.{" "}
                  <span className="text-gradient">Your Capital Deserves Better.</span>
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-6 leading-relaxed">
                  Stop leaving your digital assets in infrastructure built for the average user. Core Capital Digital Currency is for those who understand that true wealth protection begins with the right foundation.
                </p>
                <p className="text-gray-500 text-sm mb-12">
                  Join over 180,000 holders who chose institutional-grade security for their digital future.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/auth/register"
                    className="btn-primary px-12 py-4 text-base font-black tracking-wide relative group"
                  >
                    <span className="absolute inset-0 rounded-full bg-[var(--color-primary)] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                    Open Your Core Capital Digital Currency Wallet
                  </Link>
                  <Link
                    href="/support"
                    className="btn-secondary px-10 py-4 text-base font-black"
                  >
                    Talk to Our Team
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

      </main>
    </>
  );
}
