'use client';

import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Github, Youtube, Dribbble, Globe } from 'lucide-react';

export function Footer({ settings, hero }: { settings?: any, hero?: any }) {
  const name = hero?.fullName || settings?.siteName || 'Portfolio';
  const socials = settings?.socials || {};

  const getSocialIcon = (key: string) => {
    switch (key) {
      case 'facebook': return <Facebook size={18} />;
      case 'instagram': return <Instagram size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'twitter': return <Twitter size={18} />;
      case 'github': return <Github size={18} />;
      case 'youtube': return <Youtube size={18} />;
      case 'dribbble': return <Dribbble size={18} />;
      default: return <Globe size={18} />;
    }
  };

  return (
    <footer className="relative border-t border-white/5 bg-dark-900 pt-16 pb-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-neon-blue/10 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 md:mb-12">
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

          <div className="flex items-center gap-4">
            {Object.entries(socials).map(([key, url]) => {
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-white/60 hover:text-white hover:border-neon-blue/50 hover:bg-neon-blue/10 transition-all group"
                  aria-label={key}
                >
                  {getSocialIcon(key)}
                </a>
              );
            })}
          </div>
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
