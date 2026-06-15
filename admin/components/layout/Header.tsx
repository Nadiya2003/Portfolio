"use client";

import { useState } from "react";
import { Bell, Search, Menu, LogOut, User as UserIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMobileMenuOpen?: () => void;
}

export default function Header({ title, subtitle, onMobileMenuOpen }: HeaderProps) {
  const { admin, logout } = useAuthStore();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0a0a0a" }}>
      <div className="flex items-center gap-4">
        <button onClick={onMobileMenuOpen} className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-[#71717A] hover:text-white hover:bg-white/5 transition-colors">
          <Menu size={18} />
        </button>
        <div>
          <h1 className="text-base font-semibold text-white leading-none">{title}</h1>
          {subtitle && <p className="text-xs text-[#71717A] mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => setShowSearch(true)} className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg glass text-[#52525b] hover:text-white transition-colors cursor-pointer text-xs">
          <Search size={13} />
          <span>Search...</span>
          <kbd className="ml-4 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#52525b]">⌘K</kbd>
        </button>
        <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[#71717A] hover:text-white transition-colors relative">
          <Bell size={15} />
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-xs font-bold"
          >
            {admin ? getInitials(admin.name) : "A"}
          </button>
          
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-[#111111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-semibold text-white truncate">{admin?.name || "Admin"}</p>
                  <p className="text-xs text-[#71717A] truncate">{admin?.email}</p>
                </div>
                <div className="p-1">
                  <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-[#A1A1AA] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                    <UserIcon size={14} /> Profile Settings
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSearch(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search size={18} className="text-[#71717A]" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search dashboard..." 
                  className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-[#52525b]"
                />
                <button onClick={() => setShowSearch(false)} className="text-xs text-[#52525b] bg-white/5 px-2 py-1 rounded">ESC</button>
              </div>
              <div className="p-4 py-8 text-center text-sm text-[#71717A]">
                Type to search across portfolio...
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
