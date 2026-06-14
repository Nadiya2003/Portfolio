'use client';

import React from 'react';
import { ArrowUp } from 'lucide-react';

export function Footer({ settings, hero }: { settings?: any, hero?: any }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const name = hero?.fullName || settings?.siteName || 'Portfolio';

  return (
    <footer className="relative border-t border-white/5 bg-dark-900 pt-16 pb-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-neon-blue/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="text-2xl font-display font-bold tracking-tighter flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              {name.charAt(0)}
            </span>
            <span>{name}</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="#home" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#portfolio" className="hover:text-white transition-colors">
              Portfolio
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/60 hover:text-white hover:border-neon-blue/50 transition-all group"
          >
            <ArrowUp
              size={20}
              className="group-hover:-translate-y-1 transition-transform"
            />
          </button>
        </div>

        <div className="text-center text-white/40 text-sm border-t border-white/5 pt-8">
          <p>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
