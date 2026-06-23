'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const PARTICLE_DATA = Array.from({ length: 18 }).map((_, i) => ({
  id: i,
  left: Math.random() * 100,
  duration: 3 + Math.random() * 2,
  delay: Math.random() * 2,
}));

export function IntroSequence({ lines }: { lines?: string[] }) {
  const [isVisible, setIsVisible] = useState(true);
  // Store viewport height safely (SSR returns 0, real value set in effect)
  const [viewportHeight, setViewportHeight] = useState(0);

  const finish = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('introPlayed', 'true');
    }
  };

  useEffect(() => {
    // Set real viewport height on client
    setViewportHeight(window.innerHeight);

    if (
      typeof window !== 'undefined' &&
      sessionStorage.getItem('introPlayed')
    ) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(finish, 4200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-dark-900 flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Skip Button */}
          <button
            onClick={finish}
            className="absolute top-8 right-8 text-white/50 hover:text-white text-xs tracking-widest uppercase transition-colors z-50"
          >
            Skip Intro
          </button>

          {/* Background Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Particles — only render when viewport height is known */}
          {viewportHeight > 0 &&
            PARTICLE_DATA.map((p) => (
              <motion.span
                key={p.id}
                className="absolute bottom-0 w-1 h-1 bg-neon-blue rounded-full"
                style={{
                  left: `${p.left}%`,
                  boxShadow: '0 0 10px rgba(59,130,246,0.8)',
                }}
                initial={{ y: 80, opacity: 0 }}
                animate={{
                  y: -(viewportHeight + 80),
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: p.duration,
                  repeat: Infinity,
                  delay: p.delay,
                  ease: 'linear',
                }}
              />
            ))}

          {/* Signature / Logo Reveal */}
          <div className="relative z-10 flex flex-col items-center px-6">
            <motion.svg
              width="200"
              height="80"
              viewBox="0 0 200 80"
              className="mb-8"
              initial="hidden"
              animate="visible"
            >
              <motion.path
                d="M 40 60 L 40 20 L 80 20 L 80 40 L 40 40 M 100 60 L 140 20 L 160 60"
                fill="transparent"
                stroke="url(#neonGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 1.8, ease: 'easeInOut' },
                  },
                }}
              />
              <defs>
                <linearGradient
                  id="neonGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Morphing Lines */}
            <div className="flex flex-col items-center gap-2 mt-4 text-center">
              {(lines && lines.length > 0 ? lines : ["HELLO", "I'M NADEESHA", "GRAPHIC DESIGNER & DEVELOPER"]).map((line, i) => (
                <motion.h1
                  key={i}
                  initial={{ opacity: 0, y: 20, filter: 'blur(12px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ delay: 1.3 + (i * 0.4), duration: 0.9 }}
                  className={twMerge(
                    "font-display tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 text-center",
                    i === 0 ? "text-xl md:text-2xl font-medium" : 
                    i === 1 ? "text-4xl md:text-6xl font-bold" : 
                    "text-lg md:text-xl font-light text-neon-blue mt-2"
                  )}
                >
                  {line}
                </motion.h1>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 2.2, duration: 0.9, ease: 'easeInOut' }}
              className="h-px w-full max-w-[200px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent mt-6"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
