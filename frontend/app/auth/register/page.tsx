"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { User, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    full_name: "", 
    email: "", 
    password: "",
    confirm_password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/api/auth/register", {
        email: formData.email,
        full_name: formData.full_name,
        password: formData.password
      });
      toast.success("Account created! Please log in.");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-[var(--secondary)] opacity-[0.03] blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-lg p-10 rounded-[2.5rem]"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Join CORE CAPITAL COLLECTION today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                    type="text" 
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[var(--secondary)]/50 transition-colors"
                    placeholder="John Doe"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                    type="email" 
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[var(--secondary)]/50 transition-colors"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                    type="password" 
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[var(--secondary)]/50 transition-colors"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                    type="password" 
                    required
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-[var(--secondary)]/50 transition-colors"
                    placeholder="••••••••"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
                />
                </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white/[0.03] rounded-2xl">
             <div className="mt-1">
                <CheckCircle2 className="w-4 h-4 text-[var(--secondary)]" />
             </div>
             <p className="text-xs text-gray-400 leading-relaxed">
                By creating an account, you agree to our <Link href="#" className="text-white hover:underline">Terms of Service</Link> and <Link href="#" className="text-white hover:underline">Privacy Policy</Link>. This is a simulated platform for educational purposes.
             </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--secondary)] text-[var(--background)] font-bold py-4 rounded-2xl text-lg flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[var(--secondary)]/10"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Create Account</span>}
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/[0.05]">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[var(--secondary)] font-bold hover:underline">Sign in instead</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
