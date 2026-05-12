"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  User, 
  Mail, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck,
  Globe,
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store";

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const [kycStatus, setKycStatus] = useState("not_submitted");
  
  // KYC Upload States
  const [showKycForm, setShowKycForm] = useState(false);
  const [docType, setDocType] = useState("ID Card");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [submittingKyc, setSubmittingKyc] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setKycStatus(user.kyc_status || "not_submitted");
      setLoading(false);
    } else {
      fetchMe().then((u) => {
        if (u) {
          setFullName(u.full_name || "");
          setKycStatus(u.kyc_status || "not_submitted");
        }
        setLoading(false);
      });
    }
  }, [user, fetchMe]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // In a real app, we'd have a dedicated profile update endpoint
      // For now, let's assume we can update full_name via settings or a new endpoint
      await api.put("/api/user/settings/profile", { full_name: fullName });
      toast.success("Profile updated successfully.");
      await fetchMe();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontFile || !selfieFile) {
      toast.error("Please upload the required documents.");
      return;
    }

    setSubmittingKyc(true);
    const formData = new FormData();
    formData.append("document_type", docType);
    formData.append("document_front", frontFile);
    if (backFile) formData.append("document_back", backFile);
    formData.append("selfie", selfieFile);

    try {
      await api.post("/api/user/kyc/submit", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("KYC submitted successfully!");
      setShowKycForm(false);
      await fetchMe();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "KYC submission failed.");
    } finally {
      setSubmittingKyc(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12 pb-20">
      <div>
         <h1 className="text-3xl lg:text-4xl font-black mb-2">User <span className="text-gradient">Profile</span></h1>
         <p className="text-gray-400 text-sm lg:text-base">Manage your personal information and identity verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-8 rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full bg-[var(--primary)]/10 border-4 border-white/5 flex items-center justify-center overflow-hidden">
                <span className="text-5xl font-black text-[var(--primary)]">{fullName.charAt(0)}</span>
              </div>
              <button className="absolute bottom-1 right-1 p-2.5 bg-[var(--primary)] text-[var(--background)] rounded-xl shadow-xl hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-xl font-black mb-1">{fullName}</h3>
            <p className="text-xs text-gray-500 font-bold tracking-widest uppercase mb-4">{user.role}</p>
            
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 ${
              kycStatus === 'approved' ? 'bg-green-500/10 text-green-500' :
              kycStatus === 'pending' ? 'bg-orange-500/10 text-orange-500' :
              'bg-red-500/10 text-red-500'
            }`}>
              {kycStatus === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              <span>KYC: {kycStatus.replace('_', ' ')}</span>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
             <div className="flex items-center space-x-4 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                   <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Email Address</p>
                   <p className="font-bold truncate">{user.email}</p>
                </div>
             </div>
             <div className="flex items-center space-x-4 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                   <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Account Status</p>
                   <p className="font-bold text-[var(--secondary)]">Active & Secure</p>
                </div>
             </div>
             <div className="flex items-center space-x-4 text-sm">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">
                   <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-0.5">Joined On</p>
                   <p className="font-bold">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Edit Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-8 lg:p-10 rounded-[2.5rem]">
              <h3 className="text-xl font-black mb-8 flex items-center space-x-3">
                 <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[var(--primary)]" />
                 </div>
                 <span>General Information</span>
              </h3>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Name</label>
                       <input 
                         type="text" 
                         required
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                         placeholder="Your full name"
                         value={fullName}
                         onChange={(e) => setFullName(e.target.value)}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Email (Cannot be changed)</label>
                       <input 
                         type="email" 
                         disabled
                         className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl py-4 px-6 text-gray-600 text-sm font-bold cursor-not-allowed"
                         value={user.email}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">User ID</label>
                       <input 
                         type="text" 
                         disabled
                         className="w-full bg-[#0A0E1A] border border-white/5 rounded-2xl py-4 px-6 text-gray-600 text-sm font-bold cursor-not-allowed font-mono"
                         value={`#${user.id.toString().padStart(6, '0')}`}
                       />
                    </div>
                 </div>

                 <button 
                   type="submit" 
                   disabled={updating}
                   className="btn-primary py-4 px-10 w-full sm:w-auto flex items-center justify-center space-x-2"
                 >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Update Profile</span>}
                 </button>
              </form>
           </div>

           {/* KYC Section */}
           <div className="glass-card p-8 lg:p-10 rounded-[2.5rem]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <h3 className="text-xl font-black flex items-center space-x-3">
                   <div className="w-10 h-10 rounded-xl bg-[var(--secondary)]/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[var(--secondary)]" />
                   </div>
                   <span>Identity Verification (KYC)</span>
                </h3>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  kycStatus === 'approved' ? 'text-[var(--secondary)] bg-[var(--secondary)]/10' :
                  kycStatus === 'pending' ? 'text-orange-500 bg-orange-500/10' :
                  'text-red-500 bg-red-500/10'
                }`}>
                  {kycStatus}
                </div>
              </div>

              {kycStatus === 'not_submitted' || kycStatus === 'rejected' ? (
                <div className="space-y-6">
                  {kycStatus === 'rejected' && (
                    <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-start space-x-4">
                       <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                       <div>
                          <p className="text-red-500 font-bold text-sm">Previous Submission Rejected</p>
                          <p className="text-red-500/70 text-xs mt-1">{user.kyc_notes || "No reason provided."}</p>
                       </div>
                    </div>
                  )}

                  <div className="bg-white/[0.03] p-6 rounded-3xl border border-dashed border-white/10 text-center">
                    <p className="text-sm text-gray-400 mb-6">Verify your identity to increase limits and enable all platform features. You'll need a valid government-issued ID and a selfie.</p>
                    <button 
                      onClick={() => setShowKycForm(!showKycForm)}
                      className="btn-secondary py-3 px-8 text-sm"
                    >
                      {showKycForm ? "Cancel Submission" : "Start Verification"}
                    </button>
                  </div>

                  {showKycForm && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      onSubmit={handleKycSubmit} 
                      className="space-y-6 pt-6 border-t border-white/5"
                    >
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Document Type</label>
                        <select 
                          className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                          value={docType}
                          onChange={(e) => setDocType(e.target.value)}
                        >
                          <option>ID Card</option>
                          <option>Passport</option>
                          <option>Driver's License</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Document Front</label>
                          <label className="flex flex-col items-center justify-center w-full h-32 bg-[#0A0E1A] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[var(--primary)] transition-colors">
                            <Upload className="w-6 h-6 text-gray-500 mb-2" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{frontFile ? frontFile.name : "Choose File"}</span>
                            <input type="file" className="hidden" onChange={(e) => setFrontFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Document Back (Optional)</label>
                          <label className="flex flex-col items-center justify-center w-full h-32 bg-[#0A0E1A] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[var(--primary)] transition-colors">
                            <Upload className="w-6 h-6 text-gray-500 mb-2" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{backFile ? backFile.name : "Choose File"}</span>
                            <input type="file" className="hidden" onChange={(e) => setBackFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Hand-held Selfie</label>
                          <label className="flex flex-col items-center justify-center w-full h-32 bg-[#0A0E1A] border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-[var(--primary)] transition-colors">
                            <Upload className="w-6 h-6 text-gray-500 mb-2" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{selfieFile ? selfieFile.name : "Choose File"}</span>
                            <input type="file" className="hidden" onChange={(e) => setSelfieFile(e.target.files?.[0] || null)} />
                          </label>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        disabled={submittingKyc}
                        className="btn-primary py-4 px-10 w-full sm:w-auto flex items-center justify-center space-x-2"
                      >
                         {submittingKyc ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Submit for Review</span>}
                      </button>
                    </motion.form>
                  )}
                </div>
              ) : (
                <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 flex items-center space-x-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                     kycStatus === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'
                   }`}>
                      {kycStatus === 'approved' ? <CheckCircle2 className="w-8 h-8" /> : <Loader2 className="w-8 h-8 animate-spin" />}
                   </div>
                   <div>
                      <p className="font-black text-lg mb-1">
                        {kycStatus === 'approved' ? "Identity Verified" : "Verification Pending"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {kycStatus === 'approved' 
                          ? "Thank you! Your identity has been successfully verified. You now have full access to all features." 
                          : "We are currently reviewing your documents. This usually takes 24-48 hours. We'll notify you once it's done."}
                      </p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
