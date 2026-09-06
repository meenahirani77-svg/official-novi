/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const FluidBackground: React.FC = () => {
  // Star/dust particle field with neon pink and violet glimmer
  const particles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 4 + 3,
      delay: Math.random() * 3,
      color: i % 3 === 0 ? '#f43f5e' : i % 3 === 1 ? '#d946ef' : '#a855f7',
      opacity: Math.random() * 0.5 + 0.2
    }));
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#06020c] pointer-events-none select-none">
      {/* Deep Neon Radial Gradients */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[65vw] h-[65vw] rounded-full blur-[140px] opacity-25"
        style={{ background: 'radial-gradient(circle, #ec4899 0%, #701a75 50%, transparent 70%)' }}
      />
      <div 
        className="absolute top-[40%] -right-[15%] w-[60vw] h-[60vw] rounded-full blur-[160px] opacity-20"
        style={{ background: 'radial-gradient(circle, #8b5cf6 0%, #4c1d95 50%, transparent 70%)' }}
      />
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[55vw] h-[55vw] rounded-full blur-[150px] opacity-25"
        style={{ background: 'radial-gradient(circle, #d946ef 0%, #3b0764 50%, transparent 70%)' }}
      />

      {/* Subtle Futuristic Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(236, 72, 153, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(236, 72, 153, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Dynamic Kaleidoscopic Geometric Ambient Rings */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
          className="w-[900px] h-[900px] rounded-full border border-pink-500/20 border-dashed flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            className="w-[680px] h-[680px] rounded-full border border-fuchsia-500/30 flex items-center justify-center"
          >
            <div className="w-[450px] h-[450px] rounded-full border border-purple-500/25 border-dotted" />
          </motion.div>
        </motion.div>
      </div>

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 6px ${p.color}`
          }}
          animate={{
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default FluidBackground;
