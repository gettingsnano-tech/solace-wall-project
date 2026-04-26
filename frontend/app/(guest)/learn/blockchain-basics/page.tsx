import { Metadata } from "next";
import BlockchainBasicsContent from "./BlockchainBasicsContent";

export const metadata: Metadata = {
  title: "Blockchain Basics | Core Capital Digital Currency — How Blockchain Technology Works",
  description: "Learn how blockchain technology works — from distributed ledgers and consensus mechanisms to cryptographic security and transaction finality — explained for serious digital asset investors by Core Capital.",
  keywords: ["blockchain basics", "how blockchain works", "what is blockchain", "distributed ledger explained", "blockchain consensus mechanism", "blockchain for investors", "Core Capital learn"],
};

export default function Page() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Blockchain Basics | Core Capital Digital Currency",
    "description": "How blockchain technology works — from distributed ledgers to transaction finality — explained for serious digital asset investors.",
    "author": {
      "@type": "Organization",
      "name": "Core Capital Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Core Capital",
      "logo": {
        "@type": "ImageObject",
        "url": "https://corecapital.io/logo.png"
      }
    },
    "datePublished": "2026-04-26",
    "dateModified": "2026-04-26",
    "articleSection": "Education"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlockchainBasicsContent />
    </>
  );
}
