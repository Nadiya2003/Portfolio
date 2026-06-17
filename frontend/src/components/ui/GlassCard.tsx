'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glowColor?: 'blue' | 'purple' | 'cyan' | 'pink' | 'emerald' | 'none';
}

export function GlassCard({
  children,
  className,
  hoverEffect = false,
  glowColor = 'none',
  ...props
}: GlassCardProps) {
  const glowClasses: Record<string, string> = {
    blue: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:border-neon-blue/30',
    purple:
      'hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-neon-purple/30',
    cyan: 'hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:border-neon-cyan/30',
    pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-500/30',
    emerald: 'hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] hover:border-emerald-400/30',
    none: '',
  };

  return (
    <motion.div
      className={twMerge(
        'glass-panel rounded-2xl overflow-hidden transition-all duration-300',
        hoverEffect && 'glass-panel-hover cursor-pointer',
        hoverEffect && glowColor !== 'none' && glowClasses[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
