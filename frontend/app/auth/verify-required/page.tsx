"use client";

import React, { useState } from "react";
import { Mail, RefreshCw, LogOut, Loader2, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function VerifyRequiredPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post("/api/auth/resend-verification");
      setSent(true);
      toast.success("Verification email sent!");
      // Reset sent status after 30 seconds to allow resending again if needed
      setTimeout(() => setSent(false), 30000);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[var(--secondary)] opacity-[0.03] blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 rounded-[2.5rem] text-center"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[var(--primary)]/20 rotate-3">
          <Mail className="text-[var(--background)] w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Verify Your Email</h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          We've sent a verification link to <span className="text-white font-semibold">{user?.email || "your email"}</span>. 
          Please check your inbox and click the link to activate your account.
        </p>

        <div className="space-y-4">
          <button 
            onClick={handleResend}
            disabled={loading || sent}
            className={`w-full py-4 rounded-2xl flex items-center justify-center space-x-2 font-bold transition-all ${
              sent 
                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                : "bg-[var(--primary)] text-[var(--background)] hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-[var(--primary)]/10"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : sent ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Email Sent</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Resend Verification Email</span>
              </>
            )}
          </button>

          <button 
            onClick={handleLogout}
            className="w-full py-4 rounded-2xl flex items-center justify-center space-x-2 font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign out and use another account</span>
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          Can't find the email? Check your spam folder or try resending.
        </p>
      </motion.div>
    </div>
  );
}
