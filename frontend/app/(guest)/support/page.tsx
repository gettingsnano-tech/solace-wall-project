"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Minus, 
  Search, 
  MessageSquare, 
  Mail, 
  Phone, 
  LifeBuoy,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "Is this a real cryptocurrency wallet?", a: "No, CORE CAPITAL COLLECTION is a high-fidelity simulator designed for educational and investor presentation purposes. No real blockchain transactions occur." },
  { q: "How do I add funds to my wallet?", a: "Funds are credited via the Admin panel. In a real demo scenario, an administrator would 'Top Up' your balance to simulate a deposit." },
  { q: "Can I withdraw my funds to a real wallet?", a: "Withdrawals are simulated. When you request a withdrawal, it appears in the admin queue for approval, but no real assets are transferred out of the system." },
  { q: "Which networks are supported?", a: "We currently simulate ERC-20, TRC-20, BEP-20, and various Mainnet protocols for comprehensive training." },
  { q: "Is my personal data secure?", a: "We use enterprise-grade JWT authentication and hashed password storage to ensure your simulation account remains private and secure." },
  { q: "How do I generate a new wallet address?", a: "Simply navigate to the 'My Wallets' section in your dashboard and click 'Generate Address' for your desired asset." },
  { q: "Can I add custom coins to the platform?", a: "Yes, users with Administrative privileges can add, edit, and manage the entire asset portfolio through the Admin Panel." },
  { q: "What happens when a withdrawal is rejected?", a: "If an admin rejects a withdrawal request, the status is updated in your transaction history. No balance is deducted." },
];

const FAQItem = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-card mb-4 rounded-2xl overflow-hidden transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
      >
         <span className="font-bold">{q}</span>
         {isOpen ? <Minus className="w-4 h-4 text-[var(--primary)]" /> : <Plus className="w-4 h-4 text-gray-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-sm text-gray-400 leading-relaxed border-t border-white/[0.05]">
               {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="pt-32 pb-20">
      {/* Hero Header */}
      <section className="container mx-auto px-6 mb-20">
         <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl font-black mb-6">How can we <span className="text-gradient">help?</span></h1>
            <p className="text-gray-400 mb-10">Search our knowledge base or get in touch with our specialist support team.</p>
            <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
               <input 
                  type="text" 
                  placeholder="Ask a question..." 
                  className="w-full bg-white/[0.05] border border-white/10 rounded-full py-5 pl-16 pr-8 text-lg focus:outline-none focus:border-[var(--primary)]/50 transition-all shadow-2xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
      </section>

      {/* Support Channels */}
      <section className="container mx-auto px-6 mb-24">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: MessageSquare, title: "Live Chat", desc: "Speak with our team 24/7.", action: "Start Chat" },
              { icon: Mail, title: "Email Support", desc: "We usually respond in < 2 hours.", action: "Send Email" },
              { icon: LifeBuoy, title: "Help Center", desc: "Read our detailed documentation.", action: "Explore Docs" }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center text-center">
                 <div className="w-14 h-14 bg-white/[0.05] rounded-2xl flex items-center justify-center text-[var(--primary)] mb-6">
                    <item.icon className="w-6 h-6" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                 <p className="text-gray-500 text-sm mb-6">{item.desc}</p>
                 <button className="text-[var(--primary)] font-bold flex items-center space-x-2 text-xs uppercase tracking-widest group">
                    <span>{item.action}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            ))}
         </div>
      </section>

      {/* FAQs */}
      <section className="container mx-auto px-6">
         <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-black mb-10 text-center uppercase tracking-widest">Frequently Asked <span className="text-[var(--primary)]">Questions</span></h2>
            <div>
               {faqs.filter(f => f.q.toLowerCase().includes(searchTerm.toLowerCase())).map((f, idx) => (
                 <FAQItem key={idx} {...f} />
               ))}
            </div>
         </div>
      </section>
    </div>
  );
}
