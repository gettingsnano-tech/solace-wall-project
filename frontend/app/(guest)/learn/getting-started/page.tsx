import { Metadata } from "next";
import GettingStartedContent from "./GettingStartedContent";

export const metadata: Metadata = {
  title: "Getting Started with Core Capital | Digital Wallet Setup Guide",
  description: "New to Core Capital Digital Currency? Follow our step-by-step getting started guide to create your account, verify your identity, fund your wallet, and make your first transaction in minutes.",
  keywords: ["Core Capital getting started", "digital wallet setup guide", "how to create digital wallet", "crypto wallet onboarding", "Core Capital account setup", "digital currency beginner guide"],
};

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How long does KYC verification take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most KYC verifications are approved automatically within 60 seconds of submission. A small percentage are escalated to manual review and resolved within 24 hours."
        }
      },
      {
        "@type": "Question",
        "name": "What happens if I lose my recovery phrase?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you lose your recovery phrase and subsequently lose access to your account, Core Capital cannot restore your wallet. Store your recovery phrase offline in a secure physical location."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use Core Capital without completing KYC?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can create an account without KYC, but no wallet functionality (deposit, send, receive, conversion) is available until KYC Level 1 is completed."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a minimum deposit amount?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Minimum deposit amounts vary by coin and network. They are set to ensure the transaction value exceeds the network fee."
        }
      },
      {
        "@type": "Question",
        "name": "What do I do if my deposit does not arrive?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Verify that the network you sent from matches the network you selected in Core Capital. Check the status on a blockchain explorer using your transaction hash."
        }
      },
      {
        "@type": "Question",
        "name": "Can I hold multiple currencies simultaneously?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Core Capital is a multi-coin wallet by design. You can hold as many supported digital currencies as you choose under one account."
        }
      },
      {
        "@type": "Question",
        "name": "How do I contact Core Capital support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Contact us via email at support@corecapital.io, in-app support chat, or our Help Centre at help.corecapital.io. Support is available 24/7."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GettingStartedContent />
    </>
  );
}
