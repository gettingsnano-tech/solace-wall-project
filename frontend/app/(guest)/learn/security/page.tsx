import { Metadata } from "next";
import SecurityContent from "./SecurityContent";

export const metadata: Metadata = {
  title: "Digital Wallet Security Guide | Core Capital Digital Currency",
  description: "The Core Capital Security Guide covers everything a digital asset investor needs to know to protect their wallet — from private key management and phishing defense to device security and recovery planning.",
  keywords: ["digital wallet security", "crypto security guide", "protect digital assets", "private key security", "phishing crypto", "wallet security best practices", "Core Capital security"],
};

export default function Page() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Digital Wallet Security Guide | Core Capital Digital Currency",
    "description": "Comprehensive security habits and protocols for the serious digital asset investor.",
    "author": {
      "@type": "Organization",
      "name": "Core Capital Security Team"
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
    "articleSection": "Security"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <SecurityContent />
    </>
  );
}
