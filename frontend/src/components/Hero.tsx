'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { PERSONA } from './data';
import { MagneticButton } from './ui/MagneticButton';
import { GlassCard } from './ui/GlassCard';

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-12 overflow-hidden"
    >
      {/* Floating 3D-ish Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[10%] w-64 h-64 border border-white/5 rounded-3xl bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm transform rotate-12"
        />
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-[20%] left-[5%] w-48 h-48 border border-neon-blue/20 rounded-full bg-gradient-to-tr from-neon-blue/5 to-transparent backdrop-blur-md"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neon-purple/30 mb-8">
              <span className="w-2 h-2 rounded-full bg-neon-purple animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              <span className="text-sm font-medium text-white/80">
                Available for new projects
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.1] tracking-tight mb-6"
          >
            Designing{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-cyan to-white">
              Experiences.
            </span>
            <br />
            Building Digital{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-white">
              Excellence.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed"
          >
            {PERSONA.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              color="blue"
              onClick={() => scrollToSection('#portfolio')}
            >
              View Portfolio <ArrowRight size={18} />
            </MagneticButton>

            <MagneticButton variant="secondary" color="purple">
              Download CV <Download size={18} />
            </MagneticButton>

            <MagneticButton
              variant="outline"
              color="cyan"
              onClick={() => scrollToSection('#contact')}
            >
              Contact Me <Mail size={18} />
            </MagneticButton>
          </motion.div>
        </div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20"
        >
          {PERSONA.stats.map((stat, index) => (
            <GlassCard
              key={index}
              className="p-6 text-center"
              hoverEffect
              glowColor="blue"
            >
              <div className="text-3xl md:text-4xl font-display font-bold text-white mb-1">
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm text-white/50 uppercase tracking-wider">
                {stat.label}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
