"use client";

import React from "react";
import { Users, Rocket, Heart, Globe, ArrowRight, Laptop, Zap, Star, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CareersPage() {
  const openings = [
    { title: "Senior Blockchain Engineer", type: "Full-Time", location: "Remote (Global)", dept: "Engineering" },
    { title: "Lead UI/UX Designer", type: "Full-Time", location: "Remote", dept: "Product" },
    { title: "Growth Marketing Manager", type: "Full-Time", location: "New York / Remote", dept: "Marketing" },
    { title: "Customer Success Lead", type: "Full-Time", location: "London / Remote", dept: "Support" },
  ];

  const perks = [
    { icon: Globe, title: "Remote First", desc: "Work from anywhere in the world." },
    { icon: Zap, title: "Equity & Tokens", desc: "Participat in the growth of our ecosystem." },
    { icon: Heart, title: "Full Health Coverage", desc: "We take care of you and your family." },
    { icon: Laptop, title: "Tech Stipend", desc: "Get the best tools for your home office." }
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
            <div className="inline-flex items-center space-x-2 bg-[var(--secondary)]/10 text-[var(--secondary)] px-4 py-2 rounded-full mb-8">
               <Users className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Join our mission</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8">Build the Future <br /><span className="text-gradient">of Finance</span></h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
               We're a team of visionaries, engineers, and designers on a mission to demystify digital assets and empower the next generation of global investors.
            </p>
         </motion.div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-6 mb-32">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {perks.map((perk, idx) => (
               <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center group"
               >
                  <div className="w-16 h-16 bg-white/[0.05] text-[var(--secondary)] rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 group-hover:bg-[var(--secondary)] group-hover:text-[var(--background)] transition-all">
                     <perk.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{perk.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Current Openings Section */}
      <section className="container mx-auto px-6 mb-32">
         <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-black mb-4">Current Openings</h2>
               <p className="text-gray-400">Join a team of talented individuals and help us build something extraordinary.</p>
            </div>
            <div className="bg-white/[0.05] px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500">
               {openings.length} Total Positions
            </div>
         </div>

         <div className="space-y-4">
            {openings.map((job, idx) => (
               <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center group hover:border-[var(--secondary)]/30 transition-all cursor-pointer"
               >
                  <div className="flex flex-col md:flex-row items-center md:space-x-12 space-y-4 md:space-y-0 text-center md:text-left">
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--secondary)] mb-1">{job.dept}</div>
                        <h4 className="text-xl font-black">{job.title}</h4>
                     </div>
                     <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold">
                           <Globe className="w-4 h-4" />
                           <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-400 text-xs font-bold">
                           <Briefcase className="w-4 h-4" />
                           <span>{job.type}</span>
                        </div>
                     </div>
                  </div>
                  <div className="mt-6 md:mt-0 p-3 bg-white/[0.05] rounded-xl group-hover:bg-[var(--secondary)] group-hover:text-[var(--background)] transition-all">
                     <ArrowRight className="w-5 h-5" />
                  </div>
               </motion.div>
            ))}
         </div>
      </section>

      {/* Culture Image Section */}
      <section className="container mx-auto px-6 mb-24 rounded-[4rem] overflow-hidden relative">
         <div className="glass-card min-h-[400px] flex items-center justify-center text-center p-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)]/10 to-transparent"></div>
            <div className="relative z-10 max-w-2xl">
               <Star className="w-12 h-12 text-[var(--secondary)] mx-auto mb-8" />
               <h2 className="text-4xl font-black mb-8 italic">"We are building more than a product. We are building a movement."</h2>
               <p className="text-gray-400 text-lg">Our culture is defined by radical transparency, continuous learning, and a relentless focus on excellence.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
