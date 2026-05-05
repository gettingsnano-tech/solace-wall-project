"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  User,
  ShieldCheck
} from "lucide-react";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

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
  subject: string;
  status: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketMessage, setNewTicketMessage] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    try {
      const res = await api.get("/api/user/tickets");
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
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedTicket?.messages]);

  const handleSelectTicket = async (ticketId: number) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/user/tickets/${ticketId}`);
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
      const res = await api.post(`/api/user/tickets/${selectedTicket.id}/messages`, {
        content: newMessage
      });
      
      // Update selected ticket messages locally
      setSelectedTicket(prev => prev ? {
        ...prev,
        messages: [...prev.messages, res.data]
      } : null);
      
      setNewMessage("");
      fetchTickets(); // Refresh list to update "last active"
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await api.post("/api/user/tickets", {
        subject: newTicketSubject,
        content: newTicketMessage
      });
      setTickets([res.data, ...tickets]);
      setShowNewTicketModal(false);
      setNewTicketSubject("");
      setNewTicketMessage("");
      handleSelectTicket(res.data.id);
    } catch (err) {
      console.error("Error creating ticket:", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Support Center
          </h1>
          <p className="text-gray-500 text-sm mt-1">Get assistance from our dedicated team</p>
        </div>
        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center space-x-2 bg-[var(--primary)] text-[var(--background)] px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-[var(--primary)]/20"
        >
          <Plus className="w-5 h-5" />
          <span>New Ticket</span>
        </button>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Ticket List */}
        <div className={`flex-col ${selectedTicket ? 'hidden lg:flex' : 'flex'} w-full lg:w-[380px] bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden`}>
          <div className="p-5 border-b border-white/10 bg-white/[0.02]">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Your Tickets</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {tickets.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">No tickets yet</p>
                <p className="text-gray-600 text-xs mt-1">Our team is ready to help when you need us.</p>
              </div>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => handleSelectTicket(ticket.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all group relative ${
                    selectedTicket?.id === ticket.id 
                      ? "bg-[var(--primary)]/[0.08] border border-[var(--primary)]/30" 
                      : "hover:bg-white/[0.05] border border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      ticket.status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {ticket.status}
                    </span>
                    <span className="text-[10px] text-gray-600 font-medium">
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className={`font-bold text-sm truncate pr-4 ${selectedTicket?.id === ticket.id ? 'text-white' : 'text-gray-300'}`}>
                    {ticket.subject}
                  </h4>
                  <div className="flex items-center mt-2 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Last update: {formatTime(ticket.updated_at)}
                  </div>
                  <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 transition-transform ${selectedTicket?.id === ticket.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100'}`} />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Interface */}
        <div className={`flex-1 flex flex-col bg-white/[0.03] border border-white/10 rounded-3xl overflow-hidden ${!selectedTicket ? 'hidden lg:flex' : 'flex'}`}>
          {!selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-gradient-to-br from-[var(--primary)]/20 to-purple-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <MessageSquare className="w-10 h-10 text-[var(--primary)]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Select a ticket</h3>
              <p className="text-gray-500 max-w-sm">
                Choose a ticket from the sidebar to view messages or create a new one to get started.
              </p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h3 className="font-bold text-lg">{selectedTicket.subject}</h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className={`w-2 h-2 rounded-full ${selectedTicket.status === 'open' ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                      <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">{selectedTicket.status}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center space-x-3 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span>Secure Communication Channel</span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedTicket.messages.map((msg, idx) => (
                  <div key={msg.id} className={`flex ${msg.is_admin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] group`}>
                      <div className={`flex items-center mb-1.5 space-x-2 ${msg.is_admin ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${msg.is_admin ? 'bg-blue-600' : 'bg-[var(--primary)]'}`}>
                          {msg.is_admin ? <ShieldCheck className="w-3.5 h-3.5 text-white" /> : <User className="w-3.5 h-3.5 text-[var(--background)]" />}
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                          {msg.is_admin ? 'Admin Support' : 'You'}
                        </span>
                        <span className="text-[10px] text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                      <div className={`p-4 rounded-3xl text-sm leading-relaxed ${
                        msg.is_admin 
                          ? 'bg-white/[0.08] border border-white/10 text-gray-200 rounded-tl-none' 
                          : 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-5 border-t border-white/10 shrink-0 bg-[#0A0E1A]">
                <form onSubmit={handleSendMessage} className="relative">
                  <textarea
                    rows={1}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Type your message here..."
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:border-[var(--primary)]/50 transition-all resize-none text-sm placeholder:text-gray-600"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="absolute right-2 top-2 w-12 h-12 bg-[var(--primary)] text-[var(--background)] rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-lg shadow-[var(--primary)]/20"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </button>
                </form>
                <p className="text-[10px] text-gray-600 mt-3 text-center flex items-center justify-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Expect a response within 12-24 hours</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicketModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewTicketModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#0E1322] border border-white/10 rounded-[2rem] w-full max-w-lg overflow-hidden relative z-[101] shadow-2xl shadow-black"
            >
              <div className="p-8 border-b border-white/10 bg-white/[0.02]">
                <h2 className="text-xl font-bold">Open New Ticket</h2>
                <p className="text-gray-500 text-sm mt-1">Describe your issue and our team will help you.</p>
              </div>
              <form onSubmit={handleCreateTicket} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    placeholder="e.g. Deposit not reflecting"
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[var(--primary)] transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={newTicketMessage}
                    onChange={(e) => setNewTicketMessage(e.target.value)}
                    placeholder="Provide details about your issue..."
                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl p-4 focus:outline-none focus:border-[var(--primary)] transition-all text-sm resize-none"
                  />
                </div>
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTicketModal(false)}
                    className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-1 py-4 bg-[var(--primary)] text-[var(--background)] rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit Ticket"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
