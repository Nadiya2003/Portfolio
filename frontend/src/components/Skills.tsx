'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';
import { twMerge } from 'tailwind-merge';

// ─── Progress Ring ────────────────────────────────────────────────────────────
interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  colorClass: string;
}

const ProgressRing = ({ radius, stroke, progress, colorClass }: ProgressRingProps) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={colorClass}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-display font-bold text-white">{progress}%</span>
      </div>
    </div>
  );
};

// ─── Color profiles ───────────────────────────────────────────────────────────
const COLOR_PROFILES = [
  {
    name: 'purple' as const,
    dot: 'bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.8)]',
    text: 'text-neon-purple',
    ring: 'text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]',
    bar: 'bg-neon-purple',
  },
  {
    name: 'cyan' as const,
    dot: 'bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]',
    text: 'text-neon-cyan',
    ring: 'text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
    bar: 'bg-neon-cyan',
  },
  {
    name: 'blue' as const,
    dot: 'bg-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]',
    text: 'text-neon-blue',
    ring: 'text-neon-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]',
    bar: 'bg-neon-blue',
  },
  {
    name: 'pink' as const,
    dot: 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]',
    text: 'text-pink-500',
    ring: 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]',
    bar: 'bg-pink-500',
  },
  {
    name: 'emerald' as const,
    dot: 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]',
    text: 'text-emerald-400',
    ring: 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]',
    bar: 'bg-emerald-400',
  },
];

// ─── Mobile Carousel ─────────────────────────────────────────────────────────
function SkillsCarousel({ children, count, accentClass }: { children: React.ReactNode[]; count: number; accentClass: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement;
    if (child) child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    setActiveIdx(idx);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const observers: IntersectionObserver[] = [];
    Array.from(el.children).forEach((child, idx) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.intersectionRatio > 0.5) setActiveIdx(idx); },
        { root: el, threshold: 0.5 }
      );
      obs.observe(child);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [count]);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 px-1"
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className="snap-center flex-shrink-0 w-[85vw] max-w-[340px]">
            {child}
          </div>
        ))}
      </div>

      {/* Dots */}
      {count > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {Array.from({ length: count }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={twMerge(
                'transition-all duration-300 rounded-full',
                idx === activeIdx
                  ? `w-5 h-1.5 ${accentClass}`
                  : 'w-1.5 h-1.5 bg-white/20'
              )}
              aria-label={`Skill category ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {count > 1 && (
        <>
          <button
            onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
            disabled={activeIdx === 0}
            className="absolute left-0 top-[42%] -translate-y-1/2 -translate-x-1 z-10 w-8 h-8 rounded-full bg-dark-900/80 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-0 transition-opacity"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollTo(Math.min(count - 1, activeIdx + 1))}
            disabled={activeIdx === count - 1}
            className="absolute right-0 top-[42%] -translate-y-1/2 translate-x-1 z-10 w-8 h-8 rounded-full bg-dark-900/80 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-0 transition-opacity"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function Skills() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/_/backend`
        : 'http://localhost:5000');

    fetch(`${baseUrl}/api/skills`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.categories) {
          setCategories(res.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  if (categories.length === 0) return null;

  const renderCategoryCard = (cat: any, index: number) => {
    const profile = COLOR_PROFILES[index % COLOR_PROFILES.length];
    const tools: any[] = cat.tools || [];
    const style: 'rings' | 'bars' = cat.displayStyle === 'bars' ? 'bars' : 'rings';

    return (
      <GlassCard key={cat._id || cat.categoryName} className="p-7" hoverEffect glowColor={profile.name}>
        <h3 className="text-xl font-display font-bold text-white mb-7 flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${profile.dot}`} />
          {cat.categoryName}
        </h3>

        {style === 'rings' ? (
          <div className="grid grid-cols-2 gap-5">
            {tools.map((tool: any, ti: number) => (
              <motion.div
                key={`${tool.name}-${ti}`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: ti * 0.08 }}
                className="flex flex-col items-center gap-3"
              >
                <ProgressRing
                  radius={44}
                  stroke={4}
                  progress={Number(tool.level) || 0}
                  colorClass={profile.ring}
                />
                <span className="text-sm font-medium text-white/80 text-center leading-tight">
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {tools.map((tool: any, ti: number) => (
              <motion.div
                key={`${tool.name}-${ti}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: ti * 0.08 }}
              >
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/80 font-medium">{tool.name}</span>
                  <span className={`font-bold ${profile.text}`}>{tool.level}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tool.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: ti * 0.08 + 0.2, ease: 'easeOut' }}
                    className={`h-full ${profile.bar} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    );
  };

  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Technical Arsenal" subtitle="Skills & Tools" color="purple" />

        {/* ── Desktop Grid (md+) ── */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat: any, index: number) => renderCategoryCard(cat, index))}
        </div>

        {/* ── Mobile Carousel (< md) ── */}
        <div className="md:hidden">
          <SkillsCarousel
            count={categories.length}
            accentClass="bg-neon-purple shadow-[0_0_6px_rgba(168,85,247,0.7)]"
          >
            {categories.map((cat: any, index: number) => (
              <div key={cat._id || cat.categoryName}>
                {renderCategoryCard(cat, index)}
              </div>
            ))}
          </SkillsCarousel>
        </div>
      </div>
    </section>
  );
}
