"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { useAuthStore } from "@/lib/store";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, fetchMe } = useAuthStore();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        const response = await api.get(`/api/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");
        // Refresh user status in store if logged in
        await fetchMe();
      } catch (error: any) {
        setStatus("error");
        setMessage(error.response?.data?.detail || "Verification failed. The link may be invalid or expired.");
      }
    };

    verify();
  }, [token, fetchMe]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="absolute inset-0 -z-10 bg-[#0A0E1A]">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[var(--secondary)] opacity-[0.03] blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10 rounded-[2.5rem] text-center"
      >
        <div className="flex justify-center mb-6">
          {status === "loading" && <Loader2 className="w-16 h-16 text-[var(--secondary)] animate-spin" />}
          {status === "success" && <CheckCircle2 className="w-16 h-16 text-green-500" />}
          {status === "error" && <XCircle className="w-16 h-16 text-red-500" />}
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {status === "loading" ? "Verifying..." : status === "success" ? "Verified!" : "Error"}
        </h1>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          {message}
        </p>

        {status !== "loading" && (
          <Link 
            href={user ? "/dashboard" : "/auth/login"}
            className="w-full bg-[var(--secondary)] text-[var(--background)] font-bold py-4 rounded-2xl flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[var(--secondary)]/10"
          >
            <span>{user ? "Proceed to Dashboard" : "Proceed to Login"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}
      </motion.div>
    </div>
  );
}
