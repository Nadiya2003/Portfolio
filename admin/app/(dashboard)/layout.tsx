"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Dashboard", subtitle: "Welcome back! Here's what's happening." },
  "/hero": { title: "Hero Section", subtitle: "Manage your hero section content" },
  "/about": { title: "About Section", subtitle: "Update your bio, skills & timeline" },
  "/projects": { title: "Portfolio Projects", subtitle: "Manage all your portfolio projects" },
  "/graphic": { title: "Graphic Designs", subtitle: "Logo, flyer, banner & branding work" },
  "/uiux": { title: "UI/UX Designs", subtitle: "App designs, dashboards & case studies" },
  "/web": { title: "Web Development", subtitle: "Frontend, backend & full stack projects" },
  "/video": { title: "Video Editing", subtitle: "Reels, promos & motion graphics" },
  "/pencil": { title: "Pencil Arts", subtitle: "Portraits, sketches & illustrations" },
  "/media": { title: "Media Library", subtitle: "All your uploaded files & images" },
  "/testimonials": { title: "Testimonials", subtitle: "Client reviews & recommendations" },
  "/messages": { title: "Contact Messages", subtitle: "Inbox from your portfolio visitors" },
  "/contact-details": { title: "Contact Details", subtitle: "Update your contact information" },
  "/settings": { title: "Website Settings", subtitle: "SEO, logo, favicon & site config" },
  "/profile": { title: "My Profile", subtitle: "Manage your admin account" },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { token, fetchMe, admin } = useAuthStore();
  const { fetchSettings } = useSettingsStore();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      router.replace("/login");
    } else if (!admin) {
      fetchMe();
      fetchSettings();
    }
  }, [token, admin, fetchMe, fetchSettings, router]);

  if (!mounted || !token) return null;

  const pageInfo = pageTitles[pathname] || { title: "Admin", subtitle: "" };
  const sidebarWidth = collapsed ? 64 : 240;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300" style={{ marginLeft: sidebarWidth }}>
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
