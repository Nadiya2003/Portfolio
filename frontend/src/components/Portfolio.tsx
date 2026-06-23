'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';
import { BeforeAfterSlider } from './ui/BeforeAfterSlider';
import { twMerge } from 'tailwind-merge';

// Section-level category labels (matches _sectionType tags set in page.tsx)
const SECTION_CATEGORIES = [
  'All',
  'Projects',
  'Graphic Design',
  'UI/UX Design',
  'Web Development',
  'Video Editing',
  'Pencil Arts',
];

// Which categories should open the live URL directly on card click
const LINK_CATEGORIES = new Set(['Web Development', 'UI/UX Design', 'Projects']);

// Which categories need full-image lightbox (object-contain, no crop)
const FULLIMAGE_CATEGORIES = new Set(['Graphic Design', 'Pencil Arts', 'Video Editing']);

const CATEGORY_COLORS: Record<string, string> = {
  'All':             'from-neon-blue to-neon-purple',
  'Projects':        'from-sky-400 to-blue-600',
  'Graphic Design':  'from-pink-400 to-rose-600',
  'UI/UX Design':    'from-violet-400 to-purple-600',
  'Web Development': 'from-emerald-400 to-teal-600',
  'Video Editing':   'from-orange-400 to-amber-600',
  'Pencil Arts':     'from-yellow-400 to-lime-500',
};

// ─── Mobile Carousel wrapper ────────────────────────────────────────────────
function MobileCarousel({ items, renderItem }: { items: any[]; renderItem: (item: any, idx: number) => React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scrollTo = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement;
    if (child) child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    setActiveIdx(idx);
  };

  // Track active index via IntersectionObserver
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
  }, [items.length]);

  return (
    <div className="relative">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 px-1"
        style={{ scrollPaddingLeft: '1rem' }}
      >
        {items.map((item, idx) => (
          <div key={`${item._sectionType}-${item._id}-${idx}`} className="snap-center flex-shrink-0 w-[80vw] max-w-[320px]">
            {renderItem(item, idx)}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={twMerge(
                'transition-all duration-300 rounded-full',
                idx === activeIdx
                  ? 'w-5 h-1.5 bg-neon-blue shadow-[0_0_6px_rgba(59,130,246,0.7)]'
                  : 'w-1.5 h-1.5 bg-white/20'
              )}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Prev / Next arrows (only if >1 item) */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => scrollTo(Math.max(0, activeIdx - 1))}
            disabled={activeIdx === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 z-10 w-8 h-8 rounded-full bg-dark-900/80 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-0 transition-opacity"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollTo(Math.min(items.length - 1, activeIdx + 1))}
            disabled={activeIdx === items.length - 1}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 z-10 w-8 h-8 rounded-full bg-dark-900/80 backdrop-blur border border-white/10 flex items-center justify-center text-white/60 disabled:opacity-0 transition-opacity"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function Portfolio({ projects }: { projects?: any[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const allProjects = useMemo(() => {
    if (!projects) return [];
    return projects
      .filter(p => p.status !== 'archived')
      .map(p => ({
        ...p,
        image: p.thumbnail,
        tags: p.tags || [],
        _sectionType: p._sectionType || p.category || 'Projects',
      }));
  }, [projects]);

  const availableCategories = useMemo(() => {
    const presentTypes = new Set(allProjects.map(p => p._sectionType));
    return SECTION_CATEGORIES.filter(c => c === 'All' || presentTypes.has(c));
  }, [allProjects]);

  const filtered =
    activeFilter === 'All'
      ? allProjects
      : allProjects.filter(p => p._sectionType === activeFilter);

  const handleCardClick = (project: any) => {
    // For web/UI categories: open live URL in new tab if present, otherwise modal
    if (LINK_CATEGORIES.has(project._sectionType) && project.liveUrl) {
      window.open(project.liveUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setSelectedProject(project);
  };

  // Render a single project card
  const renderCard = (project: any) => {
    const isLinkType = LINK_CATEGORIES.has(project._sectionType);
    const overlayLabel = isLinkType
      ? <><ExternalLink size={14} /> Visit Website</>
      : <><ExternalLink size={14} /> View Full Image</>;

    return (
      <GlassCard
        className="group cursor-pointer h-full flex flex-col"
        hoverEffect
        glowColor="blue"
        onClick={() => handleCardClick(project)}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-dark-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              No Thumbnail
            </div>
          )}
          <div className="absolute inset-0 bg-dark-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium flex items-center gap-2 text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              {overlayLabel}
            </span>
          </div>
        </div>
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold tracking-wider text-neon-blue uppercase mb-1 block">
              {project._sectionType}
            </span>
            <h3 className="text-lg font-display font-bold text-white mb-1 leading-snug">
              {project.title}
            </h3>
            {project.category && (
              <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                {project.category}
              </span>
            )}
          </div>
          {/* For web/UI items: show live URL label as a subtle badge */}
          {isLinkType && project.liveUrl && (
            <div className="mt-3 flex items-center gap-1 text-xs text-neon-blue/70 truncate">
              <ExternalLink size={11} />
              <span className="truncate">{project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
            </div>
          )}
        </div>
      </GlassCard>
    );
  };

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Selected Works" subtitle="Portfolio" color="blue" />

        {/* Category filter tabs — desktop: flex-wrap, mobile: horizontal scroll */}
        {availableCategories.length > 1 && (
          <div className="flex gap-2 mb-10 md:mb-12 md:flex-wrap md:justify-center overflow-x-auto no-scrollbar pb-1">
            {availableCategories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={twMerge(
                    'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border',
                    isActive
                      ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/30'
                  )}
                >
                  {cat}
                  {isActive && (
                    <span className="ml-1.5 text-xs font-bold opacity-70">
                      ({filtered.length})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/30">
            <span className="text-5xl mb-4">🗂️</span>
            <p className="text-lg">No items in this category yet.</p>
          </div>
        )}

        {/* ── Desktop Grid (md+) ── */}
        <div className="hidden md:block">
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={`${project._sectionType}-${project._id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderCard(project)}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── Mobile Carousel (< md) ── */}
        <div className="md:hidden">
          {filtered.length > 0 && (
            <MobileCarousel items={filtered} renderItem={(project) => renderCard(project)} />
          )}
        </div>
      </div>

      {/* ── Project Modal ── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-12"
          >
            <div
              className="absolute inset-0 bg-dark-900/90 backdrop-blur-xl"
              onClick={() => setSelectedProject(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              className="relative w-full max-w-5xl max-h-[94dvh] sm:max-h-[90vh] overflow-y-auto glass-panel rounded-t-3xl sm:rounded-2xl border-neon-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] no-scrollbar"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Drag handle pill — mobile only */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="p-1">
                {/* Image area */}
                <div
                  className={twMerge(
                    'w-full rounded-t-2xl sm:rounded-xl overflow-hidden relative bg-dark-800',
                    FULLIMAGE_CATEGORIES.has(selectedProject._sectionType)
                      ? 'aspect-auto max-h-[60vh] flex items-center justify-center'
                      : 'aspect-video md:aspect-[21/9]'
                  )}
                >
                  {selectedProject.beforeImage && selectedProject.image ? (
                    <BeforeAfterSlider
                      beforeImage={selectedProject.beforeImage}
                      afterImage={selectedProject.image}
                    />
                  ) : selectedProject.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className={twMerge(
                        'w-full',
                        FULLIMAGE_CATEGORIES.has(selectedProject._sectionType)
                          ? 'max-h-[60vh] object-contain'
                          : 'h-full object-cover'
                      )}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 py-20">
                      No Image
                    </div>
                  )}
                </div>

                {/* Modal content */}
                <div className="p-6 md:p-10">
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-sm font-medium">
                      {selectedProject._sectionType}
                    </span>
                    {selectedProject.category && (
                      <span className="px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-sm">
                        {selectedProject.category}
                      </span>
                    )}
                    {selectedProject.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
                    {selectedProject.title}
                  </h2>

                  {selectedProject.description && (
                    <p className="text-white/70 text-base md:text-lg leading-relaxed text-justify max-w-3xl whitespace-pre-wrap">
                      {selectedProject.description}
                    </p>
                  )}

                  {/* Action buttons */}
                  {(selectedProject.liveUrl || selectedProject.githubUrl) && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 transition-colors text-sm font-medium"
                        >
                          <ExternalLink size={14} /> Visit Website
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
