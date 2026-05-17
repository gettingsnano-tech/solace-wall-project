"use client";

import React from "react";
import { ShieldAlert, Mail, ArrowLeft, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BlockedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-red-500 opacity-[0.02] blur-[120px] rounded-full"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md p-10 rounded-[2.5rem] border border-red-500/20 text-center relative overflow-hidden"
      >
        {/* Decorative Top Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-20 bg-red-500/10 blur-xl rounded-full"></div>

        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/20 ring-4 ring-red-500/10 animate-pulse">
          <ShieldAlert className="text-white w-10 h-10" />
        </div>

        <h1 className="text-3xl font-black mb-4 tracking-tight text-white bg-clip-text">
          Account Suspended
        </h1>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          Your account has been administrative disabled due to a violation of our terms of service or security procedures. Access to your digital vault has been temporarily restricted.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Email</p>
              <p className="text-sm font-semibold text-gray-300">support@capitaltsx.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verification Required</p>
              <p className="text-sm font-semibold text-gray-300">Identity verification check failed</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <a
            href="mailto:support@capitaltsx.com?subject=Account%20Suspension%20Appeal"
            className="w-full btn-primary bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-none py-4 rounded-2xl text-md font-bold text-white shadow-xl shadow-red-600/10 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            Contact Support Agent
          </a>

          <button
            onClick={() => {
              // Clear session and go to login
              document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              router.push("/auth/login");
            }}
            className="w-full text-xs font-bold text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Login Screen
          </button>
        </div>
      </motion.div>
    </div>
  );
}
