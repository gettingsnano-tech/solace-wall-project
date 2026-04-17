"use client";

import React from "react";
import { Shield, Eye, Lock, FileText, ArrowRight, ShieldCheck, Mail, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Data We Collect",
      desc: "We collect only essential information required for your simulation experience, including your email address and basic session data. No real financial information is ever requested or stored.",
      icon: <Database className="w-8 h-8" />
    },
    {
      title: "How We Use Data",
      desc: "Your data is used to maintain your simulation progress, personalize your experience, and improve the platform's core algorithmic logic. We never sell your data to third parties.",
      icon: <Eye className="w-8 h-8" />
    },
    {
      title: "Security Standards",
      desc: "We employ enterprise-grade encryption and JWT authentication to protect your account. While this is a simulated environment, we treat your privacy with real-world seriousness.",
      icon: <Lock className="w-8 h-8" />
    },
    {
      title: "Your Privacy Rights",
      desc: "You have the right to access, modify, or delete your simulation data at any time. Our platform is designed to put you in full control of your digital presence.",
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
               <Shield className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Privacy Commitment</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Your Data <br /><span className="text-gradient">Is Private</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               We believe in radical transparency. Even in a simulated environment, your privacy remains our top priority and a fundamental aspect of the Core Capital experience.
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
                  className="glass-card p-12 rounded-[3rem] group hover:border-[var(--primary)]/20 transition-all border-white/5"
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

      {/* Legal Text Section */}
      <section className="container mx-auto px-6 mt-24">
         <div className="glass-card p-12 rounded-[3.5rem] bg-white/[0.01] border-white/5 text-xs text-gray-500 max-h-[400px] overflow-y-auto space-y-6">
            <h4 className="font-bold text-white uppercase tracking-widest text-sm underline underline-offset-8 decoration-[var(--primary)]">Full Privacy Policy Disclosure</h4>
            <p>1. Introduction: This Privacy Policy explains how CORE CAPITAL ("we", "us", or "our") collects, uses, and shares your information when you use our simulated wallet platform. By using the platform, you agree to the collection and use of information in accordance with this policy.</p>
            <p>2. Information Collection: For the purpose of providing a realistic simulation experience, we require certain non-financial personally identifiable information, including but not limited to your email address and a self-generated password.</p>
            <p>3. Use of Data: We use the collected data for various purposes: to provide and maintain the Service, to notify you about changes to our Service, and to monitor the usage of the Service for performance optimization.</p>
            <p>4. Cookies and Tracking: We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.</p>
            <p>5. Security of Data: The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
            <p>6. Changes to This Privacy Policy: We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
         </div>
      </section>

      {/* Contact Section */}
      <section className="mt-24 py-20 bg-white/[0.02] border-t border-white/5">
         <div className="container mx-auto px-6 text-center">
            <Mail className="w-12 h-12 text-[var(--primary)] mx-auto mb-6" />
            <h3 className="text-2xl font-black mb-4">Have questions?</h3>
            <p className="text-gray-400 text-sm mb-8">Our privacy team is available to answer any questions you may have regarding your data.</p>
            <button className="px-8 py-3 rounded-full border border-[var(--primary)]/30 text-[var(--primary)] font-bold hover:bg-[var(--primary)]/10 transition-all">
               Email Privacy Office
            </button>
         </div>
      </section>
    </div>
  );
}
