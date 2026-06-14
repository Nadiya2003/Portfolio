'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PERSONA, TIMELINE } from './data';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';

export function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="lg:col-span-5 relative"
          >
            <GlassCard className="p-2 relative z-10" glowColor="purple" hoverEffect>
              <div className="relative rounded-xl overflow-hidden aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
                  alt={PERSONA.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-display font-bold text-white">
                    {PERSONA.name}
                  </h3>
                  <p className="text-neon-purple font-medium">{PERSONA.title}</p>
                </div>
              </div>
            </GlassCard>

            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-neon-cyan/30 rounded-full blur-[2px] -z-10" />
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-neon-purple/20 rounded-full blur-[60px] -z-10" />
          </motion.div>

          {/* Right: Content & Timeline */}
          <div className="lg:col-span-7">
            <SectionHeading
              title="About Me"
              subtitle="The Journey"
              align="left"
              color="purple"
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-invert prose-lg max-w-none mb-12"
            >
              <p className="text-white/70 leading-relaxed text-lg">{PERSONA.bio}</p>
            </motion.div>

            {/* Experience Timeline */}
            <div className="relative border-l border-white/10 ml-3 md:ml-0 space-y-8">
              {TIMELINE.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 md:pl-10"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.8)]" />

                  <GlassCard className="p-6" hoverEffect glowColor="purple">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-neon-purple text-xs font-bold tracking-wider mb-3">
                      {item.year}
                    </span>
                    <h4 className="text-xl font-display font-bold text-white mb-1">
                      {item.role}
                    </h4>
                    <h5 className="text-white/50 text-sm mb-3">{item.company}</h5>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
