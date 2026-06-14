"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getInitials } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMobileMenuOpen?: () => void;
}

export default function Header({ title, subtitle, onMobileMenuOpen }: HeaderProps) {
  const { admin } = useAuthStore();

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
        <div className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg glass text-[#52525b] hover:text-white transition-colors cursor-pointer text-xs">
          <Search size={13} />
          <span>Search...</span>
          <kbd className="ml-4 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-[#52525b]">⌘K</kbd>
        </div>
        <button className="w-8 h-8 rounded-lg glass flex items-center justify-center text-[#71717A] hover:text-white transition-colors relative">
          <Bell size={15} />
        </button>
        <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-xs font-bold">
          {admin ? getInitials(admin.name) : "A"}
        </div>
      </div>
    </header>
  );
}
