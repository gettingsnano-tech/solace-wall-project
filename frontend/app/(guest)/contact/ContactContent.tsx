"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, MessageSquare, ArrowRight, Shield, Clock, Globe } from "lucide-react";

export default function ContactContent() {
  const [contactInfo, setContactInfo] = useState({
    email: "support@capitaltsx.com",
    phone: "+1 (555) 000-0000",
    address: "123 Crypto Ave, Blockchain City",
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/public/contact-info`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.email) {
          setContactInfo(data);
        }
      })
      .catch((err) => console.error("Error fetching contact info:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-gray-500 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have questions about our platform or need technical assistance? Our team of experts is here to help you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Cards */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-blue-500/30 transition-all group">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Email Us</h3>
            <p className="text-gray-400 mb-6">For general inquiries, account support, and partnership requests.</p>
            <a href={`mailto:${contactInfo.email}`} className="text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center">
              {contactInfo.email} <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-purple-500/30 transition-all group">
            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-7 h-7 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Call Us</h3>
            <p className="text-gray-400 mb-6">Speak directly with our support team during business hours.</p>
            <a href={`tel:${contactInfo.phone}`} className="text-purple-400 font-medium hover:text-purple-300 transition-colors flex items-center">
              {contactInfo.phone} <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-emerald-500/30 transition-all group">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Visit Us</h3>
            <p className="text-gray-400 mb-6">Our global headquarters is open for scheduled institutional visits.</p>
            <p className="text-emerald-400 font-medium flex items-center">
              {contactInfo.address}
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Already a member?</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Log in to your dashboard to access our priority support system. Our ticketing system ensures your requests are handled with the highest priority.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-blue-400" />
                  <span>24/7 Priority Ticketing Support</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 mr-3 text-purple-400" />
                  <span>End-to-end Encrypted Messaging</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Globe className="w-5 h-5 mr-3 text-emerald-400" />
                  <span>Multilingual Support Team</span>
                </div>
              </div>

              <Link 
                href="/auth/login"
                className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-colors group"
              >
                Login to Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[80px] -z-10" />
              <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-3xl rotate-2">
                <div className="flex items-center mb-4 pb-4 border-base border-white/10">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Core Capital Support</div>
                    <div className="text-xs text-blue-400">Online</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-gray-300">
                    Hello! How can we assist you with your digital assets today?
                  </div>
                  <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none max-w-[80%] ml-auto text-sm">
                    I have a question about institutional custody.
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm text-gray-300">
                    Certainly. I'll connect you with our institutional desk immediately.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
