import { Metadata } from "next";
import SupportContent from "./SupportContent";

export const metadata: Metadata = {
  title: "Support Center | Core Capital Digital Currency",
  description: "Explore Core Capital's full feature set — wallet management, institutional security, global transfers, and account controls. Everything you need to manage your digital assets with confidence.",
};

export default function Page() {
  return <SupportContent />;
}
