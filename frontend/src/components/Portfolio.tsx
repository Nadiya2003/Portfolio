'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
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

// Accent color per category for a premium look
const CATEGORY_COLORS: Record<string, string> = {
  'All':             'from-neon-blue to-neon-purple',
  'Projects':        'from-sky-400 to-blue-600',
  'Graphic Design':  'from-pink-400 to-rose-600',
  'UI/UX Design':    'from-violet-400 to-purple-600',
  'Web Development': 'from-emerald-400 to-teal-600',
  'Video Editing':   'from-orange-400 to-amber-600',
  'Pencil Arts':     'from-yellow-400 to-lime-500',
};

export function Portfolio({ projects }: { projects?: any[] }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Build the normalised list — only non-archived items
  const allProjects = useMemo(() => {
    if (!projects) return [];
    return projects
      .filter(p => p.status !== 'archived')
      .map(p => ({
        ...p,
        image: p.thumbnail,           // normalise field name
        tags: p.tags || [],
        // fallback: if _sectionType missing, derive from category field
        _sectionType: p._sectionType || p.category || 'Projects',
      }));
  }, [projects]);

  // Only show filter tabs for sections that actually have items
  const availableCategories = useMemo(() => {
    const presentTypes = new Set(allProjects.map(p => p._sectionType));
    return SECTION_CATEGORIES.filter(
      c => c === 'All' || presentTypes.has(c)
    );
  }, [allProjects]);

  const filtered =
    activeFilter === 'All'
      ? allProjects
      : allProjects.filter(p => p._sectionType === activeFilter);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Selected Works" subtitle="Portfolio" color="blue" />

        {/* Category filter tabs */}
        {availableCategories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {availableCategories.map((cat) => {
              const isActive = activeFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={twMerge(
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border',
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

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <GlassCard
                  className="group cursor-pointer h-full flex flex-col"
                  hoverEffect
                  glowColor="blue"
                  onClick={() => setSelectedProject(project)}
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
                    <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Project <ExternalLink size={16} />
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Section type badge */}
                      <span className="text-xs font-bold tracking-wider text-neon-blue uppercase mb-1 block">
                        {project._sectionType}
                      </span>
                      <h3 className="text-xl font-display font-bold text-white mb-2">
                        {project.title}
                      </h3>
                      {/* Item-level category shown as a subtle tag */}
                      {project.category && (
                        <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10">
                          {project.category}
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <div
              className="absolute inset-0 bg-dark-900/90 backdrop-blur-xl"
              onClick={() => setSelectedProject(null)}
            />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border-neon-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] no-scrollbar"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-black/80 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              <div className="p-1">
                {/* Before/After Slider or single image */}
                <div className="w-full aspect-video md:aspect-[21/9] rounded-t-xl overflow-hidden relative bg-dark-800">
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
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      No Image
                    </div>
                  )}
                </div>

                {/* Modal content */}
                <div className="p-8 md:p-12">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {/* Section badge */}
                    <span className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-sm font-medium">
                      {selectedProject._sectionType}
                    </span>
                    {/* Item category */}
                    {selectedProject.category && (
                      <span className="px-3 py-1 rounded-full bg-white/5 text-white/50 border border-white/10 text-sm">
                        {selectedProject.category}
                      </span>
                    )}
                    {/* Tags */}
                    {selectedProject.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                    {selectedProject.title}
                  </h2>

                  <p className="text-white/70 text-lg leading-relaxed max-w-3xl whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>

                  {/* Live URL / GitHub links if present */}
                  {(selectedProject.liveUrl || selectedProject.githubUrl) && (
                    <div className="flex gap-4 mt-8">
                      {selectedProject.liveUrl && (
                        <a
                          href={selectedProject.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/30 text-neon-blue hover:bg-neon-blue/20 transition-colors text-sm font-medium"
                        >
                          <ExternalLink size={14} /> Live Preview
                        </a>
                      )}
                      {selectedProject.githubUrl && (
                        <a
                          href={selectedProject.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
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
