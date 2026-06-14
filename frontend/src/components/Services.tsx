'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';

export function Services({ data }: { data?: any[] }) {
  const services = data || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading title="My Services" subtitle="What I Do" color="cyan" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {services.filter((s: any) => s.status !== 'archived').map((service: any) => {
            // Dynamically get icon, fallback to Sparkles
            const IconComponent = (LucideIcons as any)[service.icon] || Sparkles;
            
            const colorClass =
              service.color === 'blue' ? 'text-neon-blue'
                : service.color === 'purple' ? 'text-neon-purple'
                : service.color === 'cyan' ? 'text-neon-cyan'
                : service.color === 'pink' ? 'text-pink-400'
                : service.color === 'green' ? 'text-green-400'
                : service.color === 'yellow' ? 'text-yellow-400'
                : 'text-neon-cyan';

            return (
              <motion.div key={service._id} variants={itemVariants}>
                <GlassCard
                  className="h-full p-8 relative overflow-hidden group"
                  hoverEffect
                  glowColor={service.color as any || 'cyan'}
                >
                  <IconComponent
                    className={`absolute -right-8 -bottom-8 w-48 h-48 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${colorClass}`}
                  />
                  <div className="relative z-10">
                    <div className={`w-14 h-14 rounded-xl glass-panel flex items-center justify-center mb-6 ${colorClass}`}>
                      <IconComponent size={28} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white mb-6">
                      {service.title}
                    </h3>
                    {service.skills && (
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                        {service.skills.map((skill: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-white/70 text-sm">
                            <CheckCircle2 size={16} className={`mt-0.5 shrink-0 ${colorClass}`} />
                            <span>{skill}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
