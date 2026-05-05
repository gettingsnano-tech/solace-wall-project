"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";

interface PriceMap {
  [symbol: string]: number; // symbol (uppercase) -> USD price
}

/**
 * useLivePrices
 * Polls the backend market endpoint every 60 seconds and returns
 * a symbol → USD price map (e.g. { BTC: 67000, ETH: 3200, USDT: 1 })
 */
export function useLivePrices(): { prices: PriceMap; lastUpdated: Date | null } {
  const [prices, setPrices] = useState<PriceMap>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchPrices = async () => {
    try {
      const { data } = await api.get("/api/public/market");
      const map: PriceMap = {};
      for (const coin of data) {
        // CoinGecko returns symbol in lowercase; normalise to uppercase
        map[coin.symbol.toUpperCase()] = coin.current_price;
      }
      // Ensure USDT is always 1.0 as a baseline
      if (!map["USDT"]) map["USDT"] = 1.0;
      setPrices(map);
      setLastUpdated(new Date());
    } catch {
      // silently fail — keep showing last known prices
    }
  };

  useEffect(() => {
    fetchPrices(); // immediate first fetch
    intervalRef.current = setInterval(fetchPrices, 60_000); // every 60 seconds
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { prices, lastUpdated };
}
