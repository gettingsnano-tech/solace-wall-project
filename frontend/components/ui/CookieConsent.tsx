"use client";

import React, { useState, useEffect } from "react";
import { Shield, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:w-96 z-[200]"
        >
          <div className="glass-card p-6 rounded-[2rem] border-[var(--primary)]/20 shadow-2xl">
             <div className="flex items-start space-x-4">
                <div className="bg-[var(--primary)]/10 p-2 rounded-xl text-[var(--primary)] shrink-0">
                   <Shield className="w-6 h-6" />
                </div>
                <div className="flex-1">
                   <h4 className="font-bold text-sm mb-2">Cookie Privacy</h4>
                   <p className="text-xs text-gray-400 leading-relaxed mb-4">
                      We use cookies to enhance your simulation experience and analyze platform traffic. By continuing, you agree to our use of essential cookies.
                   </p>
                   <div className="flex space-x-3">
                      <button 
                        onClick={accept}
                        className="bg-[var(--primary)] text-[var(--background)] text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl hover:scale-105 transition-all"
                      >
                         Accept All
                      </button>
                      <button 
                        onClick={() => setIsVisible(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                      >
                         Decline
                      </button>
                   </div>
                </div>
                <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-white">
                   <X className="w-4 h-4" />
                </button>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
