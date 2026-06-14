"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: "purple" | "blue" | "pink" | "green" | "yellow";
  change?: string;
  loading?: boolean;
}

const colorMap = {
  purple: { bg: "rgba(139,92,246,0.1)", icon: "#8B5CF6", border: "rgba(139,92,246,0.2)" },
  blue: { bg: "rgba(6,182,212,0.1)", icon: "#06B6D4", border: "rgba(6,182,212,0.2)" },
  pink: { bg: "rgba(236,72,153,0.1)", icon: "#EC4899", border: "rgba(236,72,153,0.2)" },
  green: { bg: "rgba(34,197,94,0.1)", icon: "#22C55E", border: "rgba(34,197,94,0.2)" },
  yellow: { bg: "rgba(245,158,11,0.1)", icon: "#F59E0B", border: "rgba(245,158,11,0.2)" },
};

export default function StatCard({ title, value, icon: Icon, color = "purple", change, loading }: StatCardProps) {
  const colors = colorMap[color];

  if (loading) {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="skeleton h-10 w-10 rounded-xl mb-4" />
        <div className="skeleton h-7 w-16 mb-2" />
        <div className="skeleton h-4 w-24" />
      </div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="glass rounded-2xl p-5 cursor-default"
      style={{ borderColor: colors.border }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: colors.bg }}>
          <Icon size={18} style={{ color: colors.icon }} />
        </div>
        {change && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
            change.startsWith("+") ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
          )}>
            {change}
          </span>
        )}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-bold text-white mb-1 tabular-nums"
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </motion.p>
      <p className="text-xs text-[#71717A] font-medium">{title}</p>
    </motion.div>
  );
}
