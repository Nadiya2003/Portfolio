'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import { PROJECTS } from './data';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';
import { BeforeAfterSlider } from './ui/BeforeAfterSlider';
import { twMerge } from 'tailwind-merge';

type Project = typeof PROJECTS[0];

const CATEGORIES = [
  'All',
  'Graphic Design',
  'Video Editing',
  'Web Development',
  'UI/UX Design',
  'Pencil Art',
];

export function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="Selected Works" subtitle="Portfolio" color="blue" />

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={twMerge(
                'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border',
                activeFilter === category
                  ? 'bg-neon-blue/20 border-neon-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'bg-transparent border-white/10 text-white/60 hover:text-white hover:border-white/30'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
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
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-dark-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Project <ExternalLink size={16} />
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-neon-blue uppercase mb-2 block">
                        {project.category}
                      </span>
                      <h3 className="text-xl font-display font-bold text-white mb-3">
                        {project.title}
                      </h3>
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
                {/* Before/After Slider Area */}
                <div className="w-full aspect-video md:aspect-[21/9] rounded-t-xl overflow-hidden relative bg-dark-800">
                  {selectedProject.beforeImage ? (
                    <BeforeAfterSlider
                      beforeImage={selectedProject.beforeImage}
                      afterImage={selectedProject.image}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-12">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20 text-sm font-medium">
                      {selectedProject.category}
                    </span>
                    {selectedProject.tags.map((tag) => (
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

                  <p className="text-white/70 text-lg leading-relaxed max-w-3xl">
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
