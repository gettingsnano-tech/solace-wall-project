"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { TrendingUp, TrendingDown, Search, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function MarketPage() {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const response = await api.get("/api/public/market");
        setCoins(response.data);
      } catch (error) {
        console.error("Failed to fetch market data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 30000); // 30s update
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter((c: any) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold mb-2">Market <span className="text-gradient">Overview</span></h1>
            <p className="text-gray-400">Real-time cryptocurrency prices and market statistics.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search coins..." 
              className="w-full bg-white/[0.05] border border-white/10 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-12 h-12 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="glass-card rounded-[2rem] overflow-hidden border-white/[0.05]">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.05] text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <th className="px-8 py-6">Name</th>
                    <th className="px-6 py-6 text-right">Price</th>
                    <th className="px-6 py-6 text-right">24h Change</th>
                    <th className="px-6 py-6 text-right">Market Cap</th>
                    <th className="px-6 py-6 text-right">Volume (24h)</th>
                    <th className="px-8 py-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filteredCoins.map((coin: any, idx) => (
                    <motion.tr 
                      key={coin.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center space-x-4">
                          <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full" />
                          <div>
                            <div className="font-bold">{coin.name}</div>
                            <div className="text-xs text-gray-500 uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right font-mono font-medium">
                        ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-6 text-right font-medium ${coin.price_change_percentage_24h >= 0 ? "text-[var(--secondary)]" : "text-red-500"}`}>
                        <div className="flex items-center justify-end space-x-1">
                          {coin.price_change_percentage_24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right text-gray-400 font-medium">
                        ${(coin.market_cap / 1e9).toFixed(2)}B
                      </td>
                      <td className="px-6 py-6 text-right text-gray-400 font-medium">
                        ${(coin.total_volume / 1e6).toFixed(2)}M
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="text-[var(--primary)] hover:underline flex items-center justify-end space-x-1 ml-auto">
                            <span>Details</span>
                            <ArrowUpRight className="w-4 h-4" />
                         </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && filteredCoins.length === 0 && (
          <div className="text-center py-20 bg-white/[0.02] rounded-[2rem] border border-dashed border-white/10">
            <p className="text-gray-500">No coins found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
