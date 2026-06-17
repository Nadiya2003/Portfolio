"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Layers, User, FolderOpen, Palette, Monitor,
  Code2, Video, PenTool, Image, MessageSquare, Phone, Settings,
  UserCircle, ChevronLeft, ChevronRight, Sparkles, LogOut,
  Star, Mail, Layout, Zap
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Hero Section", href: "/hero", icon: Layers },
  { label: "About Section", href: "/about", icon: User },
  { label: "Skills", href: "/skills", icon: Zap },
  { label: "Services", href: "/services", icon: Sparkles },
  { type: "divider", label: "Portfolio" },
  { label: "All Projects", href: "/projects", icon: FolderOpen },
  { label: "Graphic Designs", href: "/graphic", icon: Palette },
  { label: "UI/UX Designs", href: "/uiux", icon: Layout },
  { label: "Web Development", href: "/web", icon: Code2 },
  { label: "Video Editing", href: "/video", icon: Video },
  { label: "Pencil Arts", href: "/pencil", icon: PenTool },
  { type: "divider", label: "Content" },
  { label: "Media Library", href: "/media", icon: Image },
  { label: "Testimonials", href: "/testimonials", icon: Star },
  { label: "Messages", href: "/messages", icon: Mail },
  { type: "divider", label: "Settings" },
  { label: "Contact Details", href: "/contact-details", icon: Phone },
  { label: "Site Settings", href: "/settings", icon: Settings },
  { label: "My Profile", href: "/profile", icon: UserCircle },
];

interface SidebarProps { collapsed: boolean; onToggle: () => void; }

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { admin, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{ background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center gap-2">
              {settings?.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logo} alt="Logo" className="w-7 h-7 rounded-lg object-contain bg-white/5" />
              ) : (
                <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="text-white" />
                </div>
              )}
              <span className="font-bold text-sm text-white tracking-tight">{settings?.siteName || "Portfolio CMS"}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          settings?.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo} alt="Logo" className="w-7 h-7 rounded-lg object-contain bg-white/5 mx-auto" />
          ) : (
            <div className="w-7 h-7 rounded-lg gradient-purple flex items-center justify-center mx-auto">
              <Sparkles size={14} className="text-white" />
            </div>
          )
        )}
        <button onClick={onToggle} className={cn("w-7 h-7 rounded-lg glass flex items-center justify-center text-[#71717A] hover:text-white transition-colors flex-shrink-0", collapsed && "mx-auto")}>
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item, i) => {
          if (item.type === "divider") {
            return collapsed ? (
              <div key={i} className="my-2 border-t mx-2" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
            ) : (
              <div key={i} className="pt-4 pb-1 px-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#52525b]">{item.label}</span>
              </div>
            );
          }
          const Icon = item.icon!;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href!));
          return (
            <Link key={item.href} href={item.href!}>
              <div className={cn(
                "flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 group relative",
                isActive
                  ? "bg-[rgba(139,92,246,0.15)] text-white"
                  : "text-[#71717A] hover:text-white hover:bg-white/5",
                collapsed && "justify-center px-0"
              )}>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#8B5CF6] rounded-full" />}
                <Icon size={16} className={cn(isActive ? "text-[#8B5CF6]" : "text-[#52525b] group-hover:text-[#A1A1AA]", "flex-shrink-0")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap border border-white/10 transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t p-3 space-y-1" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className={cn("flex items-center gap-2 p-2 rounded-lg", collapsed && "justify-center")}>
          <div className="w-7 h-7 rounded-full gradient-purple flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {admin ? getInitials(admin.name) : "A"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{admin?.name || "Admin"}</p>
              <p className="text-[10px] text-[#71717A] truncate">{admin?.email}</p>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className={cn("flex items-center gap-2 w-full px-2 py-2 rounded-lg text-[#71717A] hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm", collapsed && "justify-center")}>
          <LogOut size={14} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
