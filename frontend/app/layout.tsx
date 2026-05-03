import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MegaNav from "@/components/nav/MegaNav";
import Footer from "@/components/nav/Footer";
import { Toaster } from "react-hot-toast";
import CookieConsent from "@/components/ui/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CORE CAPITAL DIGITAL CURRENCY | Institutional Crypto Wallet Platform",
  description: "Secure, Scalable, Sovereign. The future of digital assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MegaNav />
        <main>{children}</main>
        <Footer />
        <Toaster position="bottom-right" />
        <CookieConsent />
      </body>
    </html>
  );
}
