"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, Search, Trash2, Eye, EyeOff, RefreshCw, Inbox } from "lucide-react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: "50" };
      if (search) params.search = search;
      if (filter === "unread") params.isRead = "false";
      if (filter === "read") params.isRead = "true";
      const res = await api.get("/contact", { params });
      setMessages(res.data.data || []);
    } finally { setLoading(false); }
  }, [search, filter]);

  useEffect(() => { load(); }, [load]);

  const handleToggleRead = async (msg: Message) => {
    await api.patch(`/contact/${msg._id}/read`);
    setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: !m.isRead } : m));
    if (selected?._id === msg._id) setSelected({ ...msg, isRead: !msg.isRead });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/contact/${deleteId}`);
      setMessages((prev) => prev.filter((m) => m._id !== deleteId));
      if (selected?._id === deleteId) setSelected(null);
      toast.success("Message deleted");
      setDeleteId(null);
    } finally { setDeleting(false); }
  };

  const handleSelect = async (msg: Message) => {
    setSelected(msg);
    if (!msg.isRead) {
      await api.patch(`/contact/${msg._id}/read`);
      setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: true } : m));
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-6">
      {/* Sidebar list */}
      <div className="w-80 flex-shrink-0 glass rounded-2xl flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b space-y-3" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">Inbox</h2>
              {unreadCount > 0 && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#8B5CF6] text-white font-semibold">{unreadCount}</span>}
            </div>
            <button onClick={load} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-[#71717A] hover:text-white transition-colors">
              <RefreshCw size={12} />
            </button>
          </div>
          <div className="flex gap-2">
            {(["all", "unread", "read"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`flex-1 h-7 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-[#8B5CF6] text-white" : "bg-white/5 text-[#71717A] hover:text-white"}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-white/5 border border-white/08 text-white text-xs placeholder:text-[#52525b] outline-none focus:border-[#8B5CF6]/50 transition-all"
            />
          </div>
        </div>
        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-3 space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#52525b] gap-2">
              <Inbox size={32} />
              <p className="text-sm">No messages</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} onClick={() => handleSelect(msg)}
                className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b transition-colors ${selected?._id === msg._id ? "bg-[#8B5CF6]/10" : "hover:bg-white/3"}`}
                style={{ borderColor: "rgba(255,255,255,0.05)" }}
              >
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${msg.isRead ? "bg-[#3f3f46]" : "bg-[#8B5CF6]"}`} />
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-semibold truncate ${msg.isRead ? "text-[#A1A1AA]" : "text-white"}`}>{msg.name}</p>
                    <p className="text-[10px] text-[#52525b] flex-shrink-0">{new Date(msg.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-[11px] text-[#71717A] truncate mt-0.5">{msg.subject}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message detail */}
      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="p-6 border-b flex items-start justify-between" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div>
                <h2 className="text-base font-semibold text-white">{selected.subject}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-[#A1A1AA]">From: <span className="text-white">{selected.name}</span></span>
                  <span className="text-xs text-[#71717A]">&lt;{selected.email}&gt;</span>
                </div>
                <p className="text-[11px] text-[#52525b] mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleToggleRead(selected)} title={selected.isRead ? "Mark unread" : "Mark read"}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#71717A] hover:text-white transition-colors">
                  {selected.isRead ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={() => setDeleteId(selected._id)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl gradient-purple text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                <Mail size={13} /> Reply via Email
              </a>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#52525b] gap-3">
            <Mail size={40} />
            <p className="text-sm">Select a message to read</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId} title="Delete Message" message="This action cannot be undone. The message will be permanently deleted."
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting}
      />
    </div>
  );
}
