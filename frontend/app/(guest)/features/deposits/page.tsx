import { Metadata } from "next";
import DepositsContent from "./DepositsContent";

export const metadata: Metadata = {
  title: "Instant Deposits | Core Capital Digital Currency — Fund Your Wallet Fast",
  description: "Fund your Core Capital digital wallet instantly with multi-method deposit support, real-time confirmation, and institutional-grade security at every step of the process.",
  keywords: ["instant crypto deposit", "digital wallet funding", "fast wallet deposit", "deposit digital currency", "Core Capital deposit", "fund digital wallet instantly"],
};

export default function Page() {
  return <DepositsContent />;
}
