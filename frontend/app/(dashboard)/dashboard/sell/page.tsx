"use client";

import React from "react";
import { ShoppingCart, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SellCryptoPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-8 max-w-2xl mx-auto">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-[var(--secondary)] blur-[60px] opacity-20 rounded-full"></div>
        <div className="w-32 h-32 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center relative z-10">
          <ShoppingCart className="w-16 h-16 text-[var(--secondary)]" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#0A0E1A] rounded-full flex items-center justify-center border border-white/10">
           <Clock className="w-6 h-6 text-orange-500" />
        </div>
      </motion.div>
      
      <div className="space-y-4">
        <h1 className="text-5xl font-black">Coming <span className="text-gradient">Soon</span></h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          We are building a robust and secure liquidity engine to process crypto-to-fiat transactions. 
          Soon you will be able to sell your assets directly to your bank account with competitive rates.
        </p>
      </div>
      
      <div className="pt-8 flex space-x-4">
         <Link href="/dashboard" className="btn-secondary py-3 px-8">
            Back to Dashboard
         </Link>
         <Link href="/dashboard/withdraw" className="btn-primary py-3 px-8">
            Withdraw Crypto
         </Link>
      </div>
    </div>
  );
}
