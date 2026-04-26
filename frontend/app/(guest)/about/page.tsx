import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About Us | Core Capital Digital Currency",
  description: "Core Capital Digital Currency was built on one principle — your digital wealth deserves the same protection as the world's greatest financial institutions. Learn our story, mission, and values.",
};

export default function Page() {
  return <AboutContent />;
}
