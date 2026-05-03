"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { Lock, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ new_password: "", confirm_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid token.");
      return;
    }
    
    if (formData.new_password !== formData.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/auth/reset-password", { 
        token, 
        new_password: formData.new_password 
      });
      setSuccess(true);
      toast.success("Password reset successfully.");
      
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-6">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          No reset token found in the URL. Please request a new password reset link.
        </div>
        <Link href="/auth/forgot-password" className="block w-full btn-primary py-4 rounded-2xl text-lg text-center">
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
          Your password has been reset successfully. Redirecting to login...
        </div>
        <Link href="/auth/login" className="block w-full btn-primary py-4 rounded-2xl text-lg text-center">
          Go to Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type={showPassword ? "text" : "password"} 
            required
            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
            placeholder="••••••••"
            value={formData.new_password}
            onChange={(e) => setFormData({...formData, new_password: e.target.value})}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type={showConfirmPassword ? "text" : "password"} 
            required
            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
            placeholder="••••••••"
            value={formData.confirm_password}
            onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center space-x-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Reset Password</span>}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
            <ShieldCheck className="text-[var(--background)] w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-gray-400">Enter your new secure password.</p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" /></div>}>
          <ResetPasswordForm />
        </Suspense>

      </motion.div>
    </div>
  );
}
