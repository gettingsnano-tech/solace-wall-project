"use client";

import React, { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Mail, Loader2, Key } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setSubmitted(true);
      toast.success("If an account exists, a reset link has been sent.");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[var(--primary)] opacity-[0.03] blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 rounded-[2.5rem]"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[var(--primary)]/20">
            <Key className="text-[var(--background)] w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
          <p className="text-gray-400">Enter your email to receive a reset link.</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
              Check your inbox (and spam folder) for a password reset link. It will expire in 30 minutes.
            </div>
            <Link href="/auth/login" className="block w-full btn-primary py-4 rounded-2xl text-lg text-center">
              Return to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  required
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Send Reset Link</span>}
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-8 border-t border-white/[0.05]">
          <p className="text-gray-400 text-sm">
            Remember your password?{" "}
            <Link href="/auth/login" className="text-[var(--primary)] font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
