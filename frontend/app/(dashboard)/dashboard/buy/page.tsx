"use client";

import React, { useEffect, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import Image from "next/image";

interface Exchange {
  id: number;
  name: string;
  url: string;
  icon_url: string;
}

export default function BuyCryptoPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await api.get("/api/public/exchanges");
        setExchanges(response.data);
      } catch (error) {
        console.error("Failed to fetch exchanges:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExchanges();
  }, []);

  const filteredExchanges = exchanges.filter(ex => 
    ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 lg:space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Buy <span className="text-gradient">Crypto</span></h1>
          <p className="text-gray-400 text-sm lg:text-base max-w-xl">
            Choose from our trusted partner exchanges to securely purchase cryptocurrency. 
            You will be redirected to their platform to complete your purchase.
          </p>
        </div>
        
        <div className="relative group w-full lg:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-500 group-focus-within:text-[var(--primary)] transition-colors" />
          <input 
            type="text" 
            placeholder="Search exchanges..." 
            className="bg-white/[0.03] border border-white/10 rounded-xl lg:rounded-2xl py-2.5 lg:py-3 pl-10 lg:pl-12 pr-6 w-full lg:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 lg:h-48 rounded-2xl lg:rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))}
        </div>
      ) : filteredExchanges.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExchanges.map((exchange, index) => (
            <motion.div
              key={exchange.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <a 
                href={exchange.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative block h-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-[var(--primary)]/50 rounded-2xl lg:rounded-3xl p-5 lg:p-6 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]"
              >
                <div className="flex items-start justify-between mb-4 lg:mb-6">
                  <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white/[0.05] p-2 flex items-center justify-center border border-white/5 overflow-hidden shrink-0">
                    {exchange.icon_url ? (
                      <img 
                        src={exchange.icon_url} 
                        alt={exchange.name} 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xl lg:text-2xl font-bold text-[var(--primary)]">{exchange.name[0]}</div>
                    )}
                  </div>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/[0.05] flex items-center justify-center border border-white/5 group-hover:bg-[var(--primary)] group-hover:border-[var(--primary)] transition-all duration-300 shrink-0">
                    <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
                
                <div className="space-y-1 lg:space-y-2">
                  <h3 className="text-lg lg:text-xl font-bold group-hover:text-[var(--primary)] transition-colors">{exchange.name}</h3>
                  <p className="text-[10px] lg:text-sm text-gray-500 line-clamp-1">{exchange.url.replace('https://', '').replace('www.', '')}</p>
                </div>

                <div className="mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] lg:text-xs font-medium text-gray-500 tracking-wider uppercase">Trusted Exchange</span>
                  <span className="text-[9px] lg:text-xs text-[var(--primary)] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Buy Now →</span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/10">
            <Search className="w-10 h-10 text-gray-600" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">No exchanges found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        </div>
      )}
    </div>
  );
}

