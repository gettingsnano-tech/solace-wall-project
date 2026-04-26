import { Metadata } from "next";
import MarketContent from "./MarketContent";

export const metadata: Metadata = {
  title: "Market Overview | Core Capital Digital Currency — Live Digital Asset Market Data",
  description: "Track live digital currency prices, market trends, volume data, and portfolio performance intelligence on the Core Capital Market Overview — built for serious digital asset investors.",
  keywords: ["digital currency market overview", "crypto market data", "live coin prices", "digital asset market trends", "Core Capital market", "cryptocurrency market intelligence"],
};

export default function Page() {
  return <MarketContent />;
}
