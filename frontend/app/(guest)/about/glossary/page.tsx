"use client";

import React, { useState } from "react";
import { Search, Book, Hash, Zap, Globe, MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const terms = [
  { term: "HODL", category: "Community", def: "A misspelling of 'hold' that has come to mean holding onto a digital asset despite market volatility." },
  { term: "Gas Fee", category: "Technical", def: "The fee required to successfully conduct a transaction or execute a contract on the Ethereum blockchain." },
  { term: "Whale", category: "Market", def: "An individual or entity that holds a large amount of a particular digital asset, capable of influencing market prices." },
  { term: "FUD", category: "Community", def: "Stands for 'Fear, Uncertainty, and Doubt'—spread to cause panic selling or skepticism about an asset." },
  { term: "Cold Wallet", category: "Technical", def: "An offline wallet used for storing digital assets, providing the highest level of security against hacks." },
  { term: "Bull Market", category: "Market", def: "A period where market prices are rising or are expected to rise, typically accompanied by investor optimism." },
  { term: "Hash Rate", category: "Technical", def: "The measure of the computational power being used to mine and process transactions on a blockchain." },
  { term: "Fiat", category: "Market", def: "Traditional government-issued currency, such as the US Dollar or Euro, that isn't backed by a physical commodity." },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filteredTerms = terms.filter(t => 
    t.term.toLowerCase().includes(search.toLowerCase()) || 
    t.def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-20 text-center">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-3xl mx-auto"
         >
            <div className="inline-flex items-center space-x-2 bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2 rounded-full mb-8">
               <Book className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Terminology Hub</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">The Asset <br /><span className="text-gradient">Glossary</span></h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-12">
               Master the language of the future. From HODLing to Hashrates, our comprehensive glossary covers everything you need to know.
            </p>
            <div className="relative max-w-xl mx-auto">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
               <input 
                  type="text" 
                  placeholder="Search for a term..." 
                  className="w-full bg-white/[0.05] border border-white/10 rounded-full py-5 pl-16 pr-8 text-white focus:outline-none focus:border-[var(--primary)]/50 transition-all shadow-2xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  // Fixed typo in original thought, it should be setSearch(e.target.value)
               />
            </div>
         </motion.div>
      </section>

      {/* Glossary Categories Section */}
      <section className="container mx-auto px-6 mb-24">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { icon: MessageCircle, title: "Community Slang", desc: "Understand the cultural lexicon of digital asset enthusiasts." },
              { icon: Zap, title: "Technical Jargon", desc: "Deep dive into the protocols and engineering behind the ledger." },
              { icon: Globe, title: "Market Concepts", desc: "Master the economic principles of the digital frontier." }
            ].map((cat, i) => (
              <div key={i} className="glass-card p-10 rounded-[2.5rem] border-white/5">
                 <cat.icon className="w-8 h-8 text-[var(--primary)] mb-6" />
                 <h3 className="text-xl font-bold mb-2">{cat.title}</h3>
                 <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTerms.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-8 rounded-3xl border-white/5 group hover:bg-white/[0.05] transition-all"
              >
                 <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black text-[var(--primary)]">{t.term}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white/5 px-3 py-1 rounded-full">{t.category}</span>
                 </div>
                 <p className="text-sm text-gray-400 leading-relaxed">{t.def}</p>
              </motion.div>
            ))}
         </div>
      </section>

      {/* Call to Action Section */}
      <section className="container mx-auto px-6 text-center">
         <div className="glass-card p-16 rounded-[4rem] border-[var(--primary)]/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/5 to-transparent"></div>
            <h2 className="text-3xl font-black mb-6">Want to dive deeper?</h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10">Our learning portal is updated weekly with new deep dives into specific assets and network protocols.</p>
            <button className="btn-primary inline-flex items-center space-x-3">
               <span>Explore Learning Center</span>
               <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </section>
    </div>
  );
}
