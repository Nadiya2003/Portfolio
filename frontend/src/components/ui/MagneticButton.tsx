'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  color?: 'blue' | 'purple' | 'cyan';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function MagneticButton({
  children,
  variant = 'primary',
  color = 'blue',
  className,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const baseStyles =
    'relative px-6 py-3 rounded-full font-medium text-sm tracking-wide transition-colors overflow-hidden group flex items-center justify-center gap-2';

  const variants = {
    primary: {
      blue: 'bg-neon-blue text-white hover:bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      purple:
        'bg-neon-purple text-white hover:bg-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
      cyan: 'bg-neon-cyan text-dark-900 hover:bg-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    },
    secondary: {
      blue: 'bg-dark-800 text-white border border-white/10 hover:border-neon-blue/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]',
      purple:
        'bg-dark-800 text-white border border-white/10 hover:border-neon-purple/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      cyan: 'bg-dark-800 text-white border border-white/10 hover:border-neon-cyan/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]',
    },
    outline: {
      blue: 'bg-transparent text-white border border-neon-blue/50 hover:bg-neon-blue/10',
      purple:
        'bg-transparent text-white border border-neon-purple/50 hover:bg-neon-purple/10',
      cyan: 'bg-transparent text-white border border-neon-cyan/50 hover:bg-neon-cyan/10',
    },
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      className={twMerge(baseStyles, variants[variant][color], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
      )}
    </motion.button>
  );
}
