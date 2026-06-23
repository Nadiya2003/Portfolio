'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, User, Briefcase, Grid, Zap, Mail } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const NAV_LINKS = [
  { name: 'Home',      href: '#home',      Icon: Home },
  { name: 'About',     href: '#about',     Icon: User },
  { name: 'Services',  href: '#services',  Icon: Briefcase },
  { name: 'Portfolio', href: '#portfolio', Icon: Grid },
  { name: 'Skills',    href: '#skills',    Icon: Zap },
  { name: 'Contact',   href: '#contact',   Icon: Mail },
];

export function Navigation({ settings }: { settings?: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={twMerge(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent',
          isScrolled ? 'glass-nav py-4' : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => scrollTo(e, '#home')}
            className="text-xl font-display font-bold tracking-tighter flex items-center gap-2 group"
          >
            {settings?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.logo} alt="Logo" className="w-8 h-8 rounded-lg object-contain shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            ) : (
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-shadow">
                {settings?.siteName ? settings.siteName.charAt(0) : 'N'}
              </span>
            )}
            <span className="hidden sm:block">{settings?.siteName || 'Nadiya'}</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="relative text-sm font-medium text-white/70 hover:text-white transition-colors py-2"
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Bottom-Sheet Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-nav-wrapper"
            className="fixed inset-0 z-40"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-50 bg-[#0d0d14]/95 backdrop-blur-2xl border-t border-white/10 rounded-t-3xl pb-safe"
            >
              {/* Pull bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Site name */}
              <div className="px-6 pb-4 border-b border-white/8">
                <p className="text-xs text-white/40 uppercase tracking-widest">Navigation</p>
              </div>

              <nav className="px-4 py-3 grid grid-cols-3 gap-2">
                {NAV_LINKS.map((link, i) => {
                  const isActive = activeSection === link.href.substring(1);
                  const { Icon } = link;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => scrollTo(e, link.href)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={twMerge(
                        'flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-all',
                        isActive
                          ? 'bg-neon-blue/15 text-neon-blue'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium">{link.name}</span>
                    </motion.a>
                  );
                })}
              </nav>

              {/* Bottom safe area padding for notch phones */}
              <div className="h-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
