"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Shield, Mail, Lock, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, fetchMe } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [pinRequired, setPinRequired] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  React.useEffect(() => {
    const checkSession = async () => {
      const currentUser = await fetchMe();
      if (currentUser) {
        if (currentUser.role === "admin") router.push("/admin");
        else router.push("/dashboard");
      }
    };
    checkSession();
  }, [fetchMe, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", formData);
      
      if (data.otp_required) {
        setOtpRequired(true);
        toast.success("Verification code sent to your email.");
      } else {
        await finalizeLogin(data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-otp", {
        email: formData.email,
        code: otpCode
      });
      
      if (data.pin_required) {
        setOtpRequired(false);
        setPinRequired(true);
        toast.success("Identity confirmed. Please enter your PIN.");
      } else {
        await finalizeLogin(data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-pin", {
        email: formData.email,
        pin: pinCode
      });
      await finalizeLogin(data);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Invalid PIN code.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeLogin = async (data: any) => {
    toast.success("Welcome back!");
    // Fetch user profile after login
    const profileRes = await api.get("/api/auth/me");
    const userData = profileRes.data;
    setUser(userData);
    
    if (!userData.is_verified) {
      router.push("/auth/verify-required");
      return;
    }

    if (userData.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
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
            {otpRequired ? <Shield className="text-[var(--background)] w-8 h-8" /> : <Lock className="text-[var(--background)] w-8 h-8" />}
          </div>
          <h1 className="text-3xl font-bold mb-2">{otpRequired ? "Verify Account" : "Welcome Back"}</h1>
          <p className="text-gray-400">
            {otpRequired ? `We've sent a code to ${formData.email}` : "Securely access your digital assets."}
          </p>
        </div>

        {!otpRequired && !pinRequired ? (
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
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs font-bold text-[var(--primary)] hover:underline">Forgot?</Link>
               </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
        ) : otpRequired ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-center block">Verification Code</label>
              <input 
                type="text" 
                required
                maxLength={6}
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-5 px-6 text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
              <p className="text-[10px] text-gray-500 text-center pt-2">Enter the 6-digit code sent to your inbox.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Verify & Login</span>}
            </button>

            <button 
              type="button"
              onClick={() => setOtpRequired(false)}
              className="w-full text-xs font-bold text-gray-500 hover:text-white transition-colors"
            >
              Back to Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyPin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 text-center block">Security PIN</label>
              <input 
                type="password" 
                required
                maxLength={6}
                className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-5 px-6 text-center text-3xl font-black tracking-[0.5em] focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
                placeholder="••••••"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ""))}
              />
              <p className="text-[10px] text-gray-500 text-center pt-2">Enter your 6-digit security PIN to continue.</p>
            </div>

            <button 
              type="submit" 
              disabled={loading || pinCode.length !== 6}
              className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Confirm PIN</span>}
            </button>

            <button 
              type="button"
              onClick={() => {
                setPinRequired(false);
                setFormData({ email: "", password: "" });
              }}
              className="w-full text-xs font-bold text-gray-500 hover:text-white transition-colors"
            >
              Cancel Login
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-8 border-t border-white/[0.05]">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-[var(--primary)] font-bold hover:underline">Create one for free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
