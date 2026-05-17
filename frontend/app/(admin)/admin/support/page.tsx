"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  User,
  ShieldCheck,
  Search,
  Filter,
  Check
} from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface Message {
  id: number;
  ticket_id: number;
  sender_id: number;
  content: string;
  is_admin: boolean;
  created_at: string;
}

interface Ticket {
  id: number;
  user_id: number;
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/admin/tickets");
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      // Silently refresh the admin tickets list in the background
      try {
        const res = await api.get("/api/admin/tickets");
        setTickets(res.data);
      } catch (err) {
        console.error("Error background polling admin tickets:", err);
      }

      // Silently refresh the active ticket's chat messages in the background
      if (selectedTicket) {
        try {
          const res = await api.get(`/api/admin/tickets/${selectedTicket.id}`);
          setSelectedTicket(res.data);
        } catch (err) {
          console.error("Error background polling active ticket messages:", err);
        }
      }
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [selectedTicket?.id]);

  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket?.messages]);

  const handleSelectTicket = async (ticketId: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/tickets/${ticketId}`);
      setSelectedTicket(res.data);
    } catch (err) {
      console.error("Error fetching ticket details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket || sending) return;

    setSending(true);
    try {
      const res = await api.post(`/api/admin/tickets/${selectedTicket.id}/messages`, {
        content: newMessage
      });
      
      setSelectedTicket(prev => prev ? {
        ...prev,
        messages: [...prev.messages, res.data]
      } : null);
      
      setNewMessage("");
      fetchTickets();
    } catch (err) {
      console.error("Error sending message:", err);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (ticketId: number, status: string) => {
    try {
      const res = await api.patch(`/api/admin/tickets/${ticketId}/status?status=${status}`);
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: res.data.status });
      }
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: res.data.status } : t));
      toast.success(`Ticket marked as ${status}`);
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === "all" || t.status === filter;
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toString().includes(search);
    return matchesFilter && matchesSearch;
  });

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col">
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Ticket List Panel */}
        <div className={`flex-col ${selectedTicket ? 'hidden lg:flex' : 'flex'} w-full lg:w-[420px] bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden`}>
          <div className="p-6 border-b border-white/5 bg-white/[0.01]">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-500">Tickets Queue</h3>
                <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">
                  {tickets.filter(t => t.status === 'open').length} Open
                </span>
             </div>
             
             <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text" 
                    placeholder="Search by subject or ID..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-white/10"
                  />
                </div>
                
                <div className="flex gap-2">
                   {['all', 'open', 'closed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                          filter === s 
                            ? 'bg-white/10 border-white/10 text-white' 
                            : 'bg-transparent border-transparent text-gray-600 hover:text-gray-400'
                        }`}
                      >
                        {s}
                      </button>
                   ))}
                </div>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-sm">No tickets found</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => handleSelectTicket(ticket.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all group relative border ${
                    selectedTicket?.id === ticket.id 
                      ? "bg-white/[0.05] border-white/10" 
                      : "bg-transparent border-transparent hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${
                      ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium">
                      #{ticket.id}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm truncate pr-4 ${selectedTicket?.id === ticket.id ? 'text-[var(--primary)]' : 'text-gray-300'}`}>
                    {ticket.subject}
                  </h4>
                  <div className="flex items-center justify-between mt-3">
                     <div className="flex items-center text-[10px] text-gray-600">
                        <User className="w-3 h-3 mr-1" />
                        User ID: {ticket.user_id}
                     </div>
                     <div className="text-[10px] text-gray-600">
                        {new Date(ticket.updated_at).toLocaleDateString()}
                     </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area Panel */}
        <div className={`flex-1 flex flex-col bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden ${!selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
          {!selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-20 h-20 bg-white/[0.03] rounded-3xl flex items-center justify-center mb-6 rotate-3">
                <MessageSquare className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-lg font-bold mb-1">Select a ticket to respond</h3>
              <p className="text-gray-600 text-sm max-w-xs">
                Pick a conversation from the queue to start chatting with the user.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-white/5 bg-white/[0.01] flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="font-bold text-lg flex items-center">
                      {selectedTicket.subject}
                      <span className="ml-3 text-[10px] text-gray-600 font-mono">#{selectedTicket.id}</span>
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                       <div className="flex items-center space-x-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${selectedTicket.status === 'open' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                          <span className="text-[9px] uppercase font-black tracking-widest text-gray-500">{selectedTicket.status}</span>
                       </div>
                       <span className="text-[9px] text-gray-700 font-black uppercase">User ID: {selectedTicket.user_id}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {selectedTicket.status === 'open' ? (
                      <button 
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'closed')}
                        className="flex items-center space-x-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                         <CheckCircle2 className="w-4 h-4" />
                         <span>Close Ticket</span>
                      </button>
                   ) : (
                      <button 
                        onClick={() => handleUpdateStatus(selectedTicket.id, 'open')}
                        className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                      >
                         <RefreshCcw className="w-4 h-4" />
                         <span>Reopen Ticket</span>
                      </button>
                   )}
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {selectedTicket.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] group`}>
                      <div className={`flex items-center mb-2 space-x-2 ${msg.is_admin ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                          {msg.is_admin ? 'Admin (You)' : `User #${selectedTicket.user_id}`}
                        </span>
                        <span className="text-[9px] text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.is_admin 
                          ? 'bg-[var(--primary)] text-[var(--background)] font-medium rounded-tr-none' 
                          : 'bg-white/[0.05] border border-white/5 text-gray-300 rounded-tl-none'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-white/5 shrink-0 bg-white/[0.01]">
                <form onSubmit={handleSendMessage} className="relative">
                  <textarea
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a response to the user..."
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-white/10 transition-all resize-none text-sm placeholder:text-gray-700"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="absolute right-3 bottom-3 w-10 h-10 bg-[var(--primary)] text-[var(--background)] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const RefreshCcw = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);
