'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  color?: 'blue' | 'purple' | 'cyan';
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
  color = 'blue',
}: SectionHeadingProps) {
  const colorClasses: Record<string, string> = {
    blue: 'text-neon-blue',
    purple: 'text-neon-purple',
    cyan: 'text-neon-cyan',
  };

  const dotClasses: Record<string, string> = {
    blue: 'bg-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]',
    purple: 'bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.8)]',
    cyan: 'bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]',
  };

  return (
    <div
      className={twMerge(
        'mb-16',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
          style={{
            justifyContent: align === 'center' ? 'center' : 'flex-start',
          }}
        >
          <span
            className={twMerge('w-2 h-2 rounded-full', dotClasses[color])}
          />
          <span
            className={twMerge(
              'uppercase tracking-widest text-sm font-medium',
              colorClasses[color]
            )}
          >
            {subtitle}
          </span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white"
      >
        {title}
      </motion.h2>
    </div>
  );
}
