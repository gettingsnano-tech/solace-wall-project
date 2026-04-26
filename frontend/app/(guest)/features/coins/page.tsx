import { Metadata } from "next";
import CoinsContent from "./CoinsContent";

export const metadata: Metadata = {
  title: "Multi-Coin Support | Core Capital Digital Currency Wallet",
  description: "Core Capital supports multiple digital currencies in one unified wallet. Manage, convert, and grow a diversified digital asset portfolio with institutional-grade infrastructure.",
  keywords: ["multi-coin wallet", "digital currency support", "crypto wallet multi-currency", "coin management", "digital asset portfolio", "Core Capital coins"],
};

export default function Page() {
  return <CoinsContent />;
}
