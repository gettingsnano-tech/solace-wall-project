"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { 
  ArrowLeft, 
  Wallet, 
  History, 
  Plus, 
  Loader2, 
  ShieldCheck,
  CreditCard,
  ChevronDown,
  Pencil,
  Check,
  X,
  FileText,
  AlertTriangle,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [balances, setBalances] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [coins, setCoins] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpData, setTopUpData] = useState({
    coin_id: "",
    amount: "",
    notes: ""
  });
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Create Deposit (blockchain record) state
  const [showCreateDeposit, setShowCreateDeposit] = useState(false);
  const [depositData, setDepositData] = useState({
    coin_id: "",
    network: "",
    amount: "",
    tx_hash: "",
    from_address: "",
    to_address: "",
    confirmations: "",
    timestamp: "",
    status: "approved",
    notes: "",
    update_balance: true,
  });
  const [depositLoading, setDepositLoading] = useState(false);
  
  const [depositNetworks, setDepositNetworks] = useState<any[]>([]);
  const [loadingDepositNetworks, setLoadingDepositNetworks] = useState(false);

  // Inline balance edit state
  const [editingCoinId, setEditingCoinId] = useState<number | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [showFullEmail, setShowFullEmail] = useState(false);

  // Date edit state
  const [editingDateType, setEditingDateType] = useState<'user'|'tx'|null>(null);
  const [editingDateId, setEditingDateId] = useState<number|null>(null);
  const [editDateValue, setEditDateValue] = useState("");
  const [editDateLoading, setEditDateLoading] = useState(false);

  const maskEmail = (email: string) => {
    if (!email) return "";
    const [name, domain] = email.split("@");
    if (!name || !domain) return email;
    const maskedName = name.length > 2 ? `${name.substring(0, 2)}***` : `${name.charAt(0)}***`;
    return `${maskedName}@${domain}`;
  };

  const fetchData = async () => {
    try {
      const [coinsRes, usersRes] = await Promise.all([
        api.get("/api/admin/coins"),
        api.get("/api/admin/users")
      ]);
      
      const foundUser = usersRes.data.find((u: any) => u.id === parseInt(id as string));
      if (!foundUser) {
        toast.error("User not found");
        router.push("/admin/users");
        return;
      }
      
      setUser(foundUser);
      setCoins(coinsRes.data);
      
      // Fetching real data for detailed overview
      const [balRes, walletRes, txRes] = await Promise.all([
        api.get(`/api/admin/users/${id}/balances`),
        api.get(`/api/admin/users/${id}/wallets`),
        api.get(`/api/admin/users/${id}/transactions`)
      ]);
      
      setBalances(balRes.data); 
      setWallets(walletRes.data);
      setTransactions(txRes.data);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      toast.error(error.response?.data?.detail || "Failed to load user details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (depositData.coin_id) {
      const fetchNetworks = async () => {
        setLoadingDepositNetworks(true);
        try {
          const { data } = await api.get(`/api/user/coins/${depositData.coin_id}/networks`);
          setDepositNetworks(data);
          setDepositData(prev => ({ ...prev, network: data.length > 0 ? data[0].name : "" }));
        } catch (error) {
          console.error("Failed to fetch networks", error);
          setDepositNetworks([]);
        } finally {
          setLoadingDepositNetworks(false);
        }
      };
      fetchNetworks();
    } else {
      setDepositNetworks([]);
      setDepositData(prev => ({ ...prev, network: "" }));
    }
  }, [depositData.coin_id]);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopUpLoading(true);
    try {
      await api.post("/api/admin/topup", {
        user_id: parseInt(id as string),
        coin_id: parseInt(topUpData.coin_id),
        amount: parseFloat(topUpData.amount),
        notes: topUpData.notes
      });
      toast.success("Balance topped up successfully!");
      setShowTopUp(false);
      setTopUpData({ coin_id: "", amount: "", notes: "" });
      fetchData();
    } catch (error) {
      toast.error("Top-up failed.");
    } finally {
      setTopUpLoading(false);
    }
  };

  const handleCreateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDepositLoading(true);
    try {
      const payload: any = {
        coin_id: parseInt(depositData.coin_id),
        network: depositData.network,
        amount: parseFloat(depositData.amount),
        tx_hash: depositData.tx_hash,
        from_address: depositData.from_address,
        to_address: depositData.to_address,
        status: depositData.status,
        update_balance: depositData.update_balance,
        notes: depositData.notes || null,
      };
      if (depositData.confirmations) payload.confirmations = parseInt(depositData.confirmations);
      if (depositData.timestamp) payload.timestamp = new Date(depositData.timestamp).toISOString();
      await api.post(`/api/admin/users/${id}/deposit`, payload);
      toast.success("Deposit transaction recorded successfully!");
      setShowCreateDeposit(false);
      setDepositData({ coin_id: "", network: "", amount: "", tx_hash: "", from_address: "", to_address: "", confirmations: "", timestamp: "", status: "approved", notes: "", update_balance: true });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to create deposit.");
    } finally {
      setDepositLoading(false);
    }
  };

  const handleSetBalance = async (coinId: number, coinSymbol: string) => {
    const val = parseFloat(editAmount);
    if (isNaN(val) || val < 0) {
      toast.error("Please enter a valid non-negative amount.");
      return;
    }
    setEditLoading(true);
    try {
      await api.put(`/api/admin/users/${id}/balances/${coinId}`, { amount: val });
      toast.success(`${coinSymbol} balance updated to ${val}.`);
      setEditingCoinId(null);
      setEditAmount("");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update balance.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleUserAction = async (action: string) => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    setActionLoading(true);
    try {
      if (action === 'delete') {
        await api.delete(`/api/admin/users/${id}`);
        toast.success("User deleted successfully.");
        router.push("/admin/users");
      } else {
        await api.post(`/api/admin/users/${id}/${action}`);
        const messages: Record<string, string> = {
          enable: "User account enabled.",
          disable: "User account disabled.",
          verify: "User email has been verified.",
          "reset-password": "User password has been reset.",
        };
        toast.success(messages[action] || `Action '${action}' completed.`);
        fetchData();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || `Failed to ${action} user.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleKYCAction = async (status: string, notes: string = "") => {
    if (!confirm(`Are you sure you want to ${status} this KYC request?`)) return;
    
    setActionLoading(true);
    try {
      await api.post(`/api/admin/kyc/${id}/review`, { status, notes });
      toast.success(`KYC ${status} successfully.`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || `Failed to update KYC status.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDateUpdate = async (type: 'user'|'tx', itemId: number) => {
    if (!editDateValue) return;
    setEditDateLoading(true);
    try {
      const formattedDate = new Date(editDateValue).toISOString();
      if (type === 'user') {
        await api.patch(`/api/admin/users/${itemId}/date`, { new_date: formattedDate });
        toast.success("User registration date updated.");
      } else if (type === 'tx') {
        await api.patch(`/api/admin/transactions/${itemId}/date`, { new_date: formattedDate });
        toast.success("Transaction date updated.");
      }
      setEditingDateType(null);
      setEditingDateId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to update date.");
    } finally {
      setEditDateLoading(false);
    }
  };

  if (loading) {
    return (
       <div className="flex h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
       </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-full transition-colors">
               <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
               <h1 className="text-3xl font-black">{user.full_name}</h1>
               <div className="flex items-center space-x-2">
                  <p 
                    className="text-gray-400 text-sm font-medium cursor-pointer hover:text-white transition-colors"
                    onClick={() => setShowFullEmail(!showFullEmail)}
                    title="Click to toggle full email"
                   >
                     {showFullEmail ? user.email : maskEmail(user.email)}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${user.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {user.is_active ? 'Active' : 'Disabled'}
                  </span>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Balances Card */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass-card p-10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-xl font-bold flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-[var(--secondary)]" />
                    <span>User Balances</span>
                 </h3>
                 <div className="flex items-center space-x-3">
                   <button 
                    onClick={() => setShowCreateDeposit(true)}
                    className="bg-[var(--secondary)]/10 text-[var(--secondary)] border border-[var(--secondary)]/30 p-2 rounded-xl flex items-center space-x-2 font-bold px-4 hover:bg-[var(--secondary)] hover:text-[var(--background)] transition-all"
                   >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">Record Deposit</span>
                   </button>
                   <button 
                    onClick={() => setShowTopUp(true)}
                    className="bg-[var(--primary)] text-[var(--background)] p-2 rounded-xl flex items-center space-x-2 font-bold px-4 hover:scale-105 transition-transform"
                   >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs">Top Up</span>
                   </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coins.map((coin: any, idx) => {
                    const balance = balances.find((b: any) => b.coin.id === coin.id);
                    const amount = balance ? parseFloat(balance.amount) : 0;
                    const isEditing = editingCoinId === coin.id;
                    return (
                      <div key={idx} className={`bg-white/[0.03] border p-6 rounded-2xl group transition-all ${
                        isEditing
                          ? 'border-[var(--primary)]/50 bg-white/[0.05]'
                          : 'border-white/5 hover:border-[var(--primary)]/20'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img src={coin.icon_url} alt={coin.symbol} className="w-8 h-8 rounded-full" />
                            <div>
                              <div className="font-bold text-sm tracking-tight">{coin.name}</div>
                              <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{coin.symbol}</div>
                            </div>
                          </div>
                          {!isEditing ? (
                            <button
                              onClick={() => {
                                setEditingCoinId(coin.id);
                                setEditAmount(amount.toFixed(coin.symbol === 'USDT' ? 2 : 6));
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-[var(--primary)]/10 text-gray-500 hover:text-[var(--primary)] transition-all"
                              title="Edit balance"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleSetBalance(coin.id, coin.symbol)}
                                disabled={editLoading}
                                className="p-1.5 rounded-lg bg-[var(--primary)]/20 hover:bg-[var(--primary)]/40 text-[var(--primary)] transition-all"
                                title="Save"
                              >
                                {editLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => { setEditingCoinId(null); setEditAmount(""); }}
                                disabled={editLoading}
                                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-all"
                                title="Cancel"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="mt-1">
                            <input
                              type="number"
                              autoFocus
                              min="0"
                              step={coin.symbol === 'USDT' ? '0.01' : '0.000001'}
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSetBalance(coin.id, coin.symbol);
                                if (e.key === 'Escape') { setEditingCoinId(null); setEditAmount(""); }
                              }}
                              className="w-full bg-[#0A0E1A] border border-[var(--primary)]/40 rounded-xl py-2.5 px-4 text-sm font-mono font-bold focus:outline-none focus:border-[var(--primary)] transition-colors"
                              placeholder={coin.symbol === 'USDT' ? '0.00' : '0.00000000'}
                            />
                            <p className="text-[10px] text-gray-600 mt-1.5 pl-1">Enter new balance · Enter to save · Esc to cancel</p>
                          </div>
                        ) : (
                          <div className="text-right">
                            <div className="font-mono text-sm font-bold">{amount.toFixed(coin.symbol === 'USDT' ? 2 : 6)}</div>
                            <div className="text-[10px] text-gray-600 font-bold">Balance</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
               </div>
           </div>

           <div className="glass-card p-10 rounded-[2.5rem]">
               <h3 className="text-xl font-bold flex items-center space-x-3 mb-10">
                  <Wallet className="w-5 h-5 text-[var(--primary)]" />
                  <span>Assigned Wallets</span>
               </h3>
               {wallets.length > 0 ? (
                 <div className="space-y-4">
                   {wallets.map((w: any, idx) => (
                     <div key={idx} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl flex justify-between items-center">
                        <div>
                          <div className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">{w.coin.symbol} - {w.network}</div>
                          <div className="font-mono text-xs break-all text-[var(--primary)]">{w.address.address}</div>
                        </div>
                        <div className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-400 font-bold">ACTIVE</div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-12 text-gray-500 italic font-medium bg-black/10 rounded-[1.5rem] border border-dashed border-white/5">
                    No wallet addresses generated by this user yet.
                 </div>
               )}
            </div>

            <div className="glass-card p-10 rounded-[2.5rem]">
               <h3 className="text-xl font-bold flex items-center space-x-3 mb-10">
                  <History className="w-5 h-5 text-[var(--secondary)]" />
                  <span>Transaction History</span>
               </h3>
               {transactions.length > 0 ? (
                 <div className="divide-y divide-white/5">
                   {transactions.map((tx: any, idx) => (
                     <div key={idx} className="py-5 flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className={`w-8 h-8 mt-0.5 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                             {tx.type === 'deposit' ? 'D' : 'W'}
                          </div>
                          <div className="min-w-0">
                             <div className="font-bold text-sm">{parseFloat(tx.amount).toFixed(6)} {tx.coin.symbol}</div>
                             <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{tx.network}</div>
                             {editingDateType === 'tx' && editingDateId === tx.id ? (
                                <div className="flex items-center space-x-2 mt-1">
                                  <input 
                                    type="datetime-local" 
                                    className="bg-[#0A0E1A] border border-[var(--primary)]/40 rounded-lg px-2 py-1 text-xs text-white"
                                    value={editDateValue}
                                    onChange={(e) => setEditDateValue(e.target.value)}
                                  />
                                  <button onClick={() => handleDateUpdate('tx', tx.id)} className="text-green-500 hover:text-green-400">
                                    {editDateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                  </button>
                                  <button onClick={() => {setEditingDateType(null); setEditingDateId(null);}} className="text-red-500 hover:text-red-400">
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                             ) : (
                                <div className="text-[10px] text-gray-500 group flex items-center space-x-2 mt-0.5">
                                  <span>{new Date(tx.timestamp).toLocaleString()}</span>
                                  <button 
                                    onClick={() => {
                                      setEditingDateType('tx');
                                      setEditingDateId(tx.id);
                                      const d = new Date(tx.timestamp);
                                      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                                      setEditDateValue(d.toISOString().slice(0,16));
                                    }}
                                    className="opacity-0 group-hover:opacity-100 text-[var(--primary)] transition-opacity"
                                  >
                                    <Pencil className="w-3 h-3" />
                                  </button>
                                </div>
                             )}
                             {tx.from_address && (
                               <div className="text-[9px] font-mono text-gray-600 mt-1 truncate max-w-[180px]" title={tx.from_address}>
                                 From: {tx.from_address}
                               </div>
                             )}
                             {tx.tx_hash && (
                               <div className="text-[9px] font-mono text-gray-600 truncate max-w-[180px]" title={tx.tx_hash}>
                                 Hash: {tx.tx_hash}
                               </div>
                             )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                           <div className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'approved' ? 'text-green-500' : tx.status === 'pending' ? 'text-yellow-500' : 'text-red-400'}`}>{tx.status}</div>
                           {tx.confirmations != null && (
                             <div className="text-[9px] text-gray-500 font-bold mt-0.5">{tx.confirmations} confirms</div>
                           )}
                           {tx.notes && (
                             <div className="text-[9px] text-gray-600 italic mt-0.5 max-w-[100px] truncate" title={tx.notes}>{tx.notes}</div>
                           )}
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="text-center py-12 text-gray-500 italic font-medium bg-black/10 rounded-[1.5rem] border border-dashed border-white/5">
                    No transactions found for this user.
                 </div>
               )}
            </div>

            {/* KYC Details Section */}
            {user.kyc_status !== 'not_submitted' && (
              <div className="glass-card p-10 rounded-[2.5rem]">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-bold flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-[var(--primary)]" />
                    <span>KYC Verification</span>
                  </h3>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    user.kyc_status === 'approved' ? 'bg-green-500/10 text-green-500' :
                    user.kyc_status === 'pending' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {user.kyc_status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Document Type</p>
                    <p className="font-bold text-lg">{user.kyc_document_type}</p>
                  </div>
                  {user.kyc_notes && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Admin Notes</p>
                      <p className="text-sm text-gray-400 bg-white/5 p-4 rounded-xl border border-white/5">{user.kyc_notes}</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  {[
                    { label: "Front Document", url: user.kyc_document_front },
                    { label: "Back Document", url: user.kyc_document_back },
                    { label: "Selfie", url: user.kyc_selfie },
                  ].map((doc, idx) => doc.url && (
                    <div key={idx} className="space-y-3">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{doc.label}</p>
                      <div className="relative group aspect-[4/3] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        <img 
                          src={doc.url} 
                          alt={doc.label} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-6 h-6 text-white" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {user.kyc_status === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-white/5">
                    <button
                      onClick={() => {
                        const reason = prompt("Enter rejection reason:");
                        if (reason !== null) handleKYCAction('rejected', reason);
                      }}
                      disabled={actionLoading}
                      className="flex-1 bg-red-500/10 text-red-500 py-4 rounded-2xl font-bold hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2"
                    >
                      <X className="w-5 h-5" />
                      <span>Reject KYC</span>
                    </button>
                    <button
                      onClick={() => handleKYCAction('approved')}
                      disabled={actionLoading}
                      className="flex-1 bg-[var(--primary)] text-[var(--background)] py-4 rounded-2xl font-bold hover:scale-105 transition-all flex items-center justify-center space-x-2"
                    >
                      <Check className="w-5 h-5" />
                      <span>Approve KYC</span>
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* Sidebar Status/Actions */}
        <div className="space-y-8">
           <div className="glass-card p-10 rounded-[2.5rem]">
              <h4 className="font-bold mb-6 flex items-center space-x-2">
                 <ShieldCheck className="w-5 h-5 text-[var(--secondary)]" />
                 <span>Account Control</span>
              </h4>
              <div className="space-y-4">
                 <button 
                  onClick={() => handleUserAction(user.is_active ? 'disable' : 'enable')}
                  disabled={actionLoading}
                  className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-sm font-bold py-4 rounded-2xl transition-all"
                 >
                    {user.is_active ? 'Disable Account' : 'Enable Account'}
                 </button>

                 {/* Email Verification Control */}
                 {user.is_verified ? (
                   <div className="w-full flex items-center justify-center space-x-2 bg-green-500/10 text-green-400 text-sm font-bold py-4 rounded-2xl border border-green-500/20">
                     <ShieldCheck className="w-4 h-4" />
                     <span>Email Verified</span>
                   </div>
                 ) : (
                   <button
                     onClick={() => handleUserAction('verify')}
                     disabled={actionLoading}
                     className="w-full bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-[#0A0E1A] text-sm font-bold py-4 rounded-2xl transition-all border border-amber-500/20"
                   >
                     Verify Email
                   </button>
                 )}

                 <button 
                  onClick={() => handleUserAction('reset-password')}
                  disabled={actionLoading}
                  className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-sm font-bold py-4 rounded-2xl transition-all"
                 >
                    Reset Password
                 </button>
                 <button 
                  onClick={() => handleUserAction('delete')}
                  disabled={actionLoading}
                  className="w-full bg-red-500/10 text-red-500 hover:bg-red-500 text-sm font-bold py-4 rounded-2xl hover:text-white transition-all"
                 >
                    Delete User
                 </button>
              </div>
           </div>

           <div className="glass-card p-10 rounded-[2.5rem]">
              <h4 className="font-bold mb-6 flex items-center space-x-2">
                 <History className="w-5 h-5 text-gray-400" />
                 <span>Audit Trail</span>
              </h4>
              <div className="space-y-4">
                 <div className="text-xs text-gray-500 leading-relaxed group flex flex-col space-y-2">
                    <span>Account created on</span>
                    {editingDateType === 'user' && editingDateId === user.id ? (
                       <div className="flex items-center space-x-2">
                         <input 
                           type="datetime-local" 
                           className="bg-[#0A0E1A] border border-[var(--primary)]/40 rounded-lg px-2 py-1 text-xs text-white w-full"
                           value={editDateValue}
                           onChange={(e) => setEditDateValue(e.target.value)}
                         />
                         <button onClick={() => handleDateUpdate('user', user.id)} className="text-green-500 hover:text-green-400 bg-white/5 p-1 rounded">
                           {editDateLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                         </button>
                         <button onClick={() => {setEditingDateType(null); setEditingDateId(null);}} className="text-red-500 hover:text-red-400 bg-white/5 p-1 rounded">
                           <X className="w-3 h-3" />
                         </button>
                       </div>
                    ) : (
                       <div className="flex items-center space-x-2 text-white font-bold">
                          <span>{new Date(user.created_at).toLocaleString()}</span>
                          <button 
                            onClick={() => {
                              setEditingDateType('user');
                              setEditingDateId(user.id);
                              const d = new Date(user.created_at);
                              d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                              setEditDateValue(d.toISOString().slice(0,16));
                            }}
                            className="opacity-0 group-hover:opacity-100 text-[var(--primary)] transition-opacity"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                       </div>
                    )}
                 </div>
                 <p className="text-xs text-gray-500 leading-relaxed italic">No recent admin activity for this user.</p>
              </div>
           </div>
        </div>
      </div>

      {/* Create Deposit Modal */}
      <AnimatePresence>
        {showCreateDeposit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-2xl p-10 rounded-[3rem] overflow-y-auto max-h-[90vh]"
            >
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-1">Record <span className="text-gradient">Blockchain Deposit</span></h3>
                <p className="text-xs text-gray-500 font-medium">Copy transaction data from the blockchain explorer and enter it below to create an official deposit record for this user.</p>
              </div>
              <form onSubmit={handleCreateDeposit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset *</label>
                    <select
                      required
                      className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 appearance-none focus:outline-none focus:border-[var(--secondary)] text-sm font-bold"
                      value={depositData.coin_id}
                      onChange={(e) => setDepositData({...depositData, coin_id: e.target.value})}
                    >
                      <option value="">Select coin</option>
                      {coins.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Network *</label>
                    <div className="relative">
                       <select
                         required
                         disabled={loadingDepositNetworks || !depositData.coin_id}
                         className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 appearance-none focus:outline-none focus:border-[var(--secondary)] text-sm font-bold disabled:opacity-50"
                         value={depositData.network}
                         onChange={(e) => setDepositData({...depositData, network: e.target.value})}
                       >
                         {!depositData.coin_id ? (
                           <option value="">Select a coin first</option>
                         ) : loadingDepositNetworks ? (
                           <option value="">Loading networks...</option>
                         ) : depositNetworks.length === 0 ? (
                           <option value="">No networks available</option>
                         ) : (
                           depositNetworks.map((net: any) => (
                             <option key={net.id} value={net.name}>{net.label} ({net.name})</option>
                           ))
                         )}
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Transaction Hash (TX ID) *</label>
                  <input
                    required
                    type="text"
                    placeholder="0xabc123... (copy from blockchain explorer)"
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-[var(--secondary)] text-sm font-mono"
                    value={depositData.tx_hash}
                    onChange={(e) => setDepositData({...depositData, tx_hash: e.target.value.trim()})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sender Address (From) *</label>
                    <input
                      required
                      type="text"
                      placeholder="0x..."
                      className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-[var(--secondary)] text-sm font-mono"
                      value={depositData.from_address}
                      onChange={(e) => setDepositData({...depositData, from_address: e.target.value.trim()})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Receiver Address (To) *</label>
                    <input
                      required
                      type="text"
                      placeholder="0x... (platform wallet)"
                      className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-[var(--secondary)] text-sm font-mono"
                      value={depositData.to_address}
                      onChange={(e) => setDepositData({...depositData, to_address: e.target.value.trim()})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount *</label>
                    <input
                      required
                      type="number"
                      step="0.000001"
                      min="0"
                      placeholder="0.00000000"
                      className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-[var(--secondary)] text-sm font-bold"
                      value={depositData.amount}
                      onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Confirmations</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 12"
                      className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-[var(--secondary)] text-sm font-bold"
                      value={depositData.confirmations}
                      onChange={(e) => setDepositData({...depositData, confirmations: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</label>
                    <select
                      className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 appearance-none focus:outline-none focus:border-[var(--secondary)] text-sm font-bold"
                      value={depositData.status}
                      onChange={(e) => setDepositData({...depositData, status: e.target.value})}
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Transaction Timestamp (from blockchain)</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-[var(--secondary)] text-sm font-medium"
                    value={depositData.timestamp}
                    onChange={(e) => setDepositData({...depositData, timestamp: e.target.value})}
                  />
                  <p className="text-[9px] text-gray-600 pl-1">Leave blank to use current time. Copy from blockchain explorer for accuracy.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Internal Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Verified on Etherscan block #19271234"
                    className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-3.5 px-5 focus:outline-none focus:border-[var(--secondary)] text-sm font-medium"
                    value={depositData.notes}
                    onChange={(e) => setDepositData({...depositData, notes: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-3 bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                  <input
                    type="checkbox"
                    id="update_balance"
                    checked={depositData.update_balance}
                    onChange={(e) => setDepositData({...depositData, update_balance: e.target.checked})}
                    className="w-4 h-4 accent-[var(--secondary)]"
                  />
                  <label htmlFor="update_balance" className="text-sm font-bold cursor-pointer">
                    Credit amount to user balance
                    <span className="text-[10px] text-gray-500 font-normal ml-2">(uncheck to record only, without adding funds)</span>
                  </label>
                </div>

                <div className="flex space-x-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateDeposit(false)}
                    className="flex-1 bg-white/[0.05] py-4 rounded-2xl text-sm font-bold hover:bg-white/[0.1] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={depositLoading}
                    className="flex-1 bg-[var(--secondary)] text-[var(--background)] py-4 rounded-2xl text-sm font-bold flex items-center justify-center hover:scale-105 transition-all"
                  >
                    {depositLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Record Deposit"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Up Modal */}
      <AnimatePresence>
         {showTopUp && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-card w-full max-w-md p-10 rounded-[3rem]"
              >
                 <h3 className="text-2xl font-black mb-6">Top Up <span className="text-gradient">Balance</span></h3>
                 <form onSubmit={handleTopUp} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Select Asset</label>
                       <div className="relative">
                          <select 
                            required
                            className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                            value={topUpData.coin_id}
                            onChange={(e) => setTopUpData({...topUpData, coin_id: e.target.value})}
                          >
                             <option value="">Choose coin</option>
                             {coins.map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.symbol})</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                       </div>
                    </div>

                     <div className="space-y-2">
                        {(() => {
                          const selectedCoin = coins.find((c: any) => String(c.id) === String(topUpData.coin_id));
                          return (
                            <>
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                Credit Amount{selectedCoin ? <span className="text-[var(--primary)] normal-case font-bold ml-2">in {selectedCoin.symbol}</span> : ""}
                              </label>
                              <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                                  {selectedCoin?.icon_url ? (
                                    <img src={selectedCoin.icon_url} alt={selectedCoin.symbol} className="w-5 h-5 rounded-full object-contain" />
                                  ) : (
                                    <span className="text-xs font-black text-gray-500">?</span>
                                  )}
                                </div>
                                <input
                                  type="number"
                                  required
                                  step={selectedCoin?.symbol === 'USDT' ? '0.01' : '0.000001'}
                                  min="0"
                                  className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 pl-12 pr-20 focus:outline-none focus:border-[var(--primary)] text-sm font-bold"
                                  placeholder={selectedCoin?.symbol === 'USDT' ? '0.00' : '0.00000000'}
                                  value={topUpData.amount}
                                  onChange={(e) => setTopUpData({...topUpData, amount: e.target.value})}
                                />
                                {selectedCoin && (
                                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">
                                    {selectedCoin.symbol}
                                  </span>
                                )}
                              </div>
                            </>
                          );
                        })()}
                     </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Internal Notes</label>
                       <textarea 
                          className="w-full bg-[#0A0E1A] border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-[var(--primary)] text-sm font-medium h-24 resize-none"
                          placeholder="e.g. Investor Liquidity Credit"
                          value={topUpData.notes}
                          onChange={(e) => setTopUpData({...topUpData, notes: e.target.value})}
                       />
                    </div>

                    <div className="flex space-x-4">
                       <button 
                        type="button"
                        onClick={() => setShowTopUp(false)}
                        className="flex-1 bg-white/[0.05] py-4 rounded-2xl text-sm font-bold hover:bg-white/[0.1] transition-all"
                       >
                          Cancel
                       </button>
                       <button 
                        type="submit"
                        disabled={topUpLoading}
                        className="flex-1 btn-primary py-4 rounded-2xl text-sm font-bold flex items-center justify-center"
                       >
                          {topUpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Credit"}
                       </button>
                    </div>
                 </form>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
