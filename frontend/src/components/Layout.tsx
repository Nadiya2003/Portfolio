'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Safely check touch support on the client only
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    if (!isTouch) {
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-dark-900 text-white selection:bg-neon-blue/30 selection:text-white overflow-x-hidden">
      {/* Ambient Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-neon-blue/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-neon-cyan/10 blur-[100px]" />
      </div>

      {/* Custom Cursor Glow (Desktop Only) */}
      {!isTouchDevice && (
        <motion.div
          className="fixed top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none z-0 mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(0,0,0,0) 50%)',
          }}
          animate={{
            x: mousePosition.x - 300,
            y: mousePosition.y - 300,
          }}
          transition={{
            type: 'tween',
            ease: 'backOut',
            duration: 0.5,
          }}
        />
      )}

      {/* Main Content */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
