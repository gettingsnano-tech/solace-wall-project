"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Users, 
  Search, 
  ArrowRight,
  ExternalLink,
  Loader2,
  Mail,
  Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/admin/users");
        setUsers(data);
      } catch (error) {
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
         <div>
            <h1 className="text-3xl font-black mb-2">User <span className="text-gradient">Records</span></h1>
            <p className="text-gray-400">Monitor and manage all registered platform users.</p>
         </div>
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input 
               type="text" 
               placeholder="Search by name or email..." 
               className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-[var(--primary)]/50 transition-colors"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="glass-card rounded-[2.5rem] overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/[0.05] text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                     <th className="px-8 py-6">User Details</th>
                     <th className="px-6 py-6">ID</th>
                     <th className="px-6 py-6">Role</th>
                     <th className="px-6 py-6">Registered</th>
                     <th className="px-6 py-6">Status</th>
                     <th className="px-8 py-6 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/[0.05]">
                  {filteredUsers.length > 0 ? filteredUsers.map((user, idx) => (
                    <motion.tr 
                       key={user.id}
                       initial={{ opacity: 0, y: 5 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: idx * 0.05 }}
                       className="group hover:bg-white/[0.02]"
                    >
                       <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center font-bold text-[var(--primary)]">
                                {user.full_name?.charAt(0)}
                             </div>
                             <div>
                                <div className="font-bold">{user.full_name}</div>
                                <div className="text-xs text-gray-500 flex items-center space-x-1">
                                   <Mail className="w-3 h-3" />
                                   <span>{user.email}</span>
                                </div>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-6 font-mono text-xs text-gray-500">#{user.id}</td>
                       <td className="px-6 py-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white/[0.05] px-2 py-1 rounded-md">
                             {user.role}
                          </span>
                       </td>
                       <td className="px-6 py-6">
                          <div className="text-xs text-gray-400 flex items-center space-x-1 font-medium">
                             <Calendar className="w-3 h-3" />
                             <span>{new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center space-x-2">
                             <div className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-[var(--secondary)]' : 'bg-red-500'}`}></div>
                             <span className="text-[10px] font-black uppercase tracking-widest">{user.is_active ? 'Active' : 'Banned'}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <Link 
                            href={`/admin/users/${user.id}`}
                            className="bg-white/[0.05] hover:bg-[var(--primary)] hover:text-[var(--background)] px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center space-x-2"
                          >
                             <span>Manage</span>
                             <ArrowRight className="w-3 h-3" />
                          </Link>
                       </td>
                    </motion.tr>
                  )) : (
                    <tr>
                       <td colSpan={6} className="px-8 py-20 text-center text-gray-500 font-medium italic">
                          No users found matching your criteria.
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
