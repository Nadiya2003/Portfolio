"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen, Palette, Monitor, Code2, Video, PenTool,
  MessageSquare, Mail, TrendingUp, Clock, Eye
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface Stats {
  totalMessages: number;
  unreadMessages: number;
  totalProjects: number;
  totalGraphic: number;
  totalUIUX: number;
  totalWeb: number;
  totalVideo: number;
  totalPencil: number;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  isRead: boolean;
  createdAt: string;
}

const chartData = [
  { month: "Jan", views: 120, messages: 4 },
  { month: "Feb", views: 190, messages: 8 },
  { month: "Mar", views: 270, messages: 12 },
  { month: "Apr", views: 210, messages: 7 },
  { month: "May", views: 340, messages: 15 },
  { month: "Jun", views: 280, messages: 10 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const load = async () => {
      try {
        const [statsRes, msgsRes] = await Promise.all([
          api.get("/contact/stats"),
          api.get("/contact?limit=5"),
        ]);
        setStats(statsRes.data.data);
        setMessages(msgsRes.data.data || []);
      } catch (e) { /* ignore */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const statCards = [
    { title: "Total Projects", value: stats?.totalProjects ?? 0, icon: FolderOpen, color: "purple" as const },
    { title: "Graphic Designs", value: stats?.totalGraphic ?? 0, icon: Palette, color: "blue" as const },
    { title: "UI/UX Projects", value: stats?.totalUIUX ?? 0, icon: Monitor, color: "pink" as const },
    { title: "Web Projects", value: stats?.totalWeb ?? 0, icon: Code2, color: "green" as const },
    { title: "Video Projects", value: stats?.totalVideo ?? 0, icon: Video, color: "yellow" as const },
    { title: "Pencil Arts", value: stats?.totalPencil ?? 0, icon: PenTool, color: "purple" as const },
    { title: "Total Messages", value: stats?.totalMessages ?? 0, icon: Mail, color: "blue" as const },
    { title: "Unread Messages", value: stats?.unreadMessages ?? 0, icon: MessageSquare, color: "pink" as const },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <StatCard {...card} loading={loading} />
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-white">Activity Overview</h3>
              <p className="text-xs text-[#71717A] mt-0.5">Portfolio views & messages</p>
            </div>
            <div className="flex gap-4 text-xs text-[#71717A]">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />Views</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#06B6D4]" />Messages</span>
            </div>
          </div>
          {mounted ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#71717A", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: 12 }} />
                <Area type="monotone" dataKey="views" stroke="#8B5CF6" strokeWidth={2} fill="url(#gViews)" />
                <Area type="monotone" dataKey="messages" stroke="#06B6D4" strokeWidth={2} fill="url(#gMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-[220px] skeleton rounded-xl" />
          )}
        </motion.div>

        {/* Recent Messages */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Messages</h3>
            <Link href="/messages" className="text-xs text-[#8B5CF6] hover:text-[#A78BFA] transition-colors">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-[#52525b] text-sm">No messages yet</div>
          ) : (
            <div className="space-y-3 flex-1">
              {messages.map((msg) => (
                <Link key={msg._id} href="/messages">
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${msg.isRead ? "bg-[#3f3f46]" : "bg-[#8B5CF6]"}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">{msg.name}</p>
                      <p className="text-[10px] text-[#71717A] truncate">{msg.subject}</p>
                      <p className="text-[10px] text-[#52525b] mt-0.5">{formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add Project", href: "/projects", icon: FolderOpen, color: "#8B5CF6" },
            { label: "Upload Design", href: "/graphic", icon: Palette, color: "#06B6D4" },
            { label: "View Messages", href: "/messages", icon: Mail, color: "#EC4899" },
            { label: "Edit Hero", href: "/hero", icon: TrendingUp, color: "#22C55E" },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div whileHover={{ y: -2 }} className="glass glass-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: action.color + "1a" }}>
                  <action.icon size={16} style={{ color: action.color }} />
                </div>
                <span className="text-sm text-[#A1A1AA] font-medium">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
