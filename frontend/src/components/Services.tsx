'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';
import { twMerge } from 'tailwind-merge';

// ─── Mobile Carousel ─────────────────────────────────────────────────────────
function ServiceCarousel({ children, count }: { children: React.ReactNode[]; count: number }) {
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
                  ? 'w-5 h-1.5 bg-neon-cyan shadow-[0_0_6px_rgba(34,211,238,0.7)]'
                  : 'w-1.5 h-1.5 bg-white/20'
              )}
              aria-label={`Service ${idx + 1}`}
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
export function Services({ data }: { data?: any[] }) {
  const services = (data || []).filter((s: any) => s.status !== 'archived');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const getColorClass = (color: string) =>
    color === 'blue' ? 'text-neon-blue'
    : color === 'purple' ? 'text-neon-purple'
    : color === 'cyan' ? 'text-neon-cyan'
    : color === 'pink' ? 'text-pink-400'
    : color === 'green' ? 'text-green-400'
    : color === 'yellow' ? 'text-yellow-400'
    : 'text-neon-cyan';

  const renderServiceCard = (service: any) => {
    const IconComponent = (LucideIcons as any)[service.icon] || Sparkles;
    const colorClass = getColorClass(service.color);
    return (
      <GlassCard
        className="h-full p-7 relative overflow-hidden group"
        hoverEffect
        glowColor={service.color as any || 'cyan'}
      >
        <IconComponent
          className={`absolute -right-8 -bottom-8 w-48 h-48 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${colorClass}`}
        />
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl glass-panel flex items-center justify-center mb-5 ${colorClass}`}>
            <IconComponent size={24} />
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-4">
            {service.title}
          </h3>
          {service.skills && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-3">
              {service.skills.map((skill: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-white/70 text-sm">
                  <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${colorClass}`} />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </GlassCard>
    );
  };

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="My Services" subtitle="What I Do" color="cyan" />

        {/* ── Desktop Grid (md+) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="hidden md:grid grid-cols-2 gap-6 lg:gap-8"
        >
          {services.map((service: any) => (
            <motion.div key={service._id} variants={itemVariants}>
              {renderServiceCard(service)}
            </motion.div>
          ))}
        </motion.div>

        {/* ── Mobile Carousel (< md) ── */}
        <div className="md:hidden">
          <ServiceCarousel count={services.length}>
            {services.map((service: any) => (
              <div key={service._id}>
                {renderServiceCard(service)}
              </div>
            ))}
          </ServiceCarousel>
        </div>
      </div>
    </section>
  );
}
