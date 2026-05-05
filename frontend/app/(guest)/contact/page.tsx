import { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us | Core Capital Digital Currency",
  description: "Get in touch with Core Capital Digital Currency for support, inquiries, and technical assistance. Our team is available 24/7 to help you manage your digital assets.",
};

export default function Page() {
  return <ContactContent />;
}
