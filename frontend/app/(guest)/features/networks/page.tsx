import { Metadata } from "next";
import NetworksContent from "./NetworksContent";

export const metadata: Metadata = {
  title: "Network Selection | Core Capital Digital Currency — Choose Your Blockchain Network",
  description: "Core Capital lets you choose your blockchain network for every transaction — optimizing for speed, cost, and security. Multi-network support built for serious digital asset investors.",
  keywords: ["blockchain network selection", "multi-network crypto wallet", "choose blockchain network", "transaction network optimization", "Core Capital networks", "digital currency network support"],
};

export default function Page() {
  return <NetworksContent />;
}
