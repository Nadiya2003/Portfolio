'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SKILLS } from './data';
import { SectionHeading } from './ui/SectionHeading';
import { GlassCard } from './ui/GlassCard';

interface ProgressRingProps {
  radius: number;
  stroke: number;
  progress: number;
  colorClass: string;
}

const ProgressRing = ({ radius, stroke, progress, colorClass }: ProgressRingProps) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={colorClass}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-display font-bold text-white">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export function Skills() {
  return (
    <section id="skills" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading
          title="Technical Arsenal"
          subtitle="Skills"
          color="purple"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Design Skills */}
          <GlassCard className="p-8" hoverEffect glowColor="purple">
            <h3 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              Design
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {SKILLS.design.map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center gap-3"
                >
                  <ProgressRing
                    radius={40}
                    stroke={4}
                    progress={skill.level}
                    colorClass="text-neon-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                  />
                  <span className="text-sm font-medium text-white/80 text-center">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* UI/UX Skills */}
          <GlassCard className="p-8" hoverEffect glowColor="cyan">
            <h3 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              UI/UX
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {SKILLS.uiux.map((skill) => (
                <div
                  key={skill.name}
                  className="flex flex-col items-center gap-3"
                >
                  <ProgressRing
                    radius={40}
                    stroke={4}
                    progress={skill.level}
                    colorClass="text-neon-cyan drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                  />
                  <span className="text-sm font-medium text-white/80 text-center">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Development Skills */}
          <GlassCard className="p-8" hoverEffect glowColor="blue">
            <h3 className="text-xl font-display font-bold text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              Development
            </h3>
            <div className="space-y-5">
              {SKILLS.development.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/80">{skill.name}</span>
                    <span className="text-neon-blue">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full bg-neon-blue shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
