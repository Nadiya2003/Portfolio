'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';

export function Testimonials({ data }: { data?: any[] }) {
  const testimonials = (data || []).filter((t: any) => t.status !== 'archived');
  if (testimonials.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
          title="Client Feedback"
          subtitle="Testimonials"
          color="cyan"
        />

        {/* Auto-scrolling carousel container */}
        <div className="relative w-full flex overflow-x-hidden group">
          {/* Gradient masks for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-dark-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-dark-900 to-transparent z-10 pointer-events-none" />

          <motion.div
            className="flex gap-6 py-4 px-4"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
            style={{ width: 'max-content' }}
          >
            {/* Double the items to create seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial: any, idx: number) => (
              <GlassCard
                key={`${testimonial._id}-${idx}`}
                className="w-[350px] md:w-[450px] p-8 shrink-0 relative"
                hoverEffect
              >
                <Quote className="absolute top-6 right-6 text-white/5 w-16 h-16" />

                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="fill-neon-cyan text-neon-cyan drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]"
                    />
                  ))}
                </div>

                <p className="text-white/80 text-lg leading-relaxed mb-8 relative z-10">
                  &ldquo;{testimonial.text || testimonial.content}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {testimonial.thumbnail || testimonial.image ? (
                    <img
                      src={testimonial.thumbnail || testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-xs text-white/50">Img</div>
                  )}
                  <div>
                    <h4 className="text-white font-bold font-display">
                      {testimonial.name}
                    </h4>
                    <p className="text-white/50 text-sm">{testimonial.role || testimonial.position}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
