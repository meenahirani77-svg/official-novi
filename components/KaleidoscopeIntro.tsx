/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, FastForward, Play, Zap } from 'lucide-react';

interface KaleidoscopeIntroProps {
  onComplete: () => void;
}

export const KaleidoscopeIntro: React.FC<KaleidoscopeIntroProps> = ({ onComplete }) => {
  // Animation phases:
  // 'rotating' -> photo rotates smoothly ("gol ghumengi")
  // 'zooming' -> photo zooms in deeply ("fir zoom hogi")
  // 'revealing' -> "Novicut" name appears with neon glow ("Novicut aaye ga name")
  // 'opening' -> opens into website ("fir open hoga")
  const [phase, setPhase] = useState<'rotating' | 'zooming' | 'revealing' | 'opening'>('rotating');
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Phase 1: Rotating (0s to 2.8s) - "gol ghumengi"
    const timer1 = setTimeout(() => {
      setPhase('zooming');
    }, 2800);

    // Phase 2: Zooming (2.8s to 5.2s) - "fir zoom hogi"
    const timer2 = setTimeout(() => {
      setPhase('revealing');
    }, 5200);

    // Phase 3: Revealing Name (5.2s to 8.2s) - "Novicut aaye ga name"
    const timer3 = setTimeout(() => {
      setPhase('opening');
    }, 8200);

    // Phase 4: Open Website - "fir open hoga"
    const timer4 = setTimeout(() => {
      onComplete();
    }, 9400);

    // Progress bar ticker
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1.1;
      });
    }, 100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div 
      onClick={onComplete}
      className="fixed inset-0 z-[100] bg-[#05010a] flex items-center justify-center overflow-hidden select-none cursor-pointer"
    >
      {/* 1. PHOTO ROTATING & ZOOMING CONTAINER */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <motion.div
          className="relative w-[180vw] h-[180vw] sm:w-[140vw] sm:h-[140vw] max-w-none flex items-center justify-center"
          initial={{ rotate: 0, scale: 1 }}
          animate={{
            rotate: phase === 'rotating' ? 360 : [360, 720, 1080],
            scale: 
              phase === 'rotating' ? 1.05 :
              phase === 'zooming' ? 2.6 :
              phase === 'revealing' ? 3.4 : 
              4.5,
            filter: phase === 'opening' ? 'brightness(2) blur(10px)' : 'brightness(1.1) contrast(1.15)',
          }}
          transition={{
            rotate: {
              duration: phase === 'rotating' ? 2.8 : 6,
              ease: "linear",
              repeat: Infinity,
            },
            scale: {
              duration: 
                phase === 'zooming' ? 2.4 :
                phase === 'revealing' ? 3.0 : 1.2,
              ease: [0.22, 1, 0.36, 1],
            },
            filter: {
              duration: 1.0,
            }
          }}
        >
          {/* THE EXACT KALEIDOSCOPE PHOTO */}
          <img
            src="/intro_kaleidoscope.jpg"
            alt="NoviCut Kaleidoscope Chandelier"
            className="w-full h-full object-cover rounded-full shadow-[0_0_150px_rgba(236,72,153,0.8)]"
          />

          {/* Radial Neon Pulsing Ring Overlay */}
          <div className="absolute inset-0 rounded-full border-4 border-pink-500/40 shadow-[inset_0_0_100px_rgba(217,70,239,0.7)] animate-pulse pointer-events-none" />
          <div className="absolute inset-16 rounded-full border-2 border-purple-400/30 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
        </motion.div>
      </div>

      {/* Cinematic Dark Vignette & Light Flare */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, rgba(5, 1, 10, 0.6) 65%, #05010a 95%)'
        }}
      />

      {/* 2. "NOVICUT" NAME & EMBLEM REVEAL */}
      <AnimatePresence>
        {(phase === 'revealing' || phase === 'opening') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3, filter: 'blur(20px)' }}
            animate={{ 
              opacity: phase === 'opening' ? 0 : 1, 
              scale: phase === 'opening' ? 1.4 : 1, 
              filter: phase === 'opening' ? 'blur(15px)' : 'blur(0px)' 
            }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(25px)' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            {/* Glowing Neon Emblem */}
            <motion.div
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
              className="relative w-28 h-28 md:w-32 md:h-32 mb-6 flex items-center justify-center rounded-3xl bg-gradient-to-tr from-[#9d174d] via-[#701a75] to-[#4c1d95] p-1.5 shadow-[0_0_80px_rgba(236,72,153,0.9)] border-2 border-pink-400/80"
            >
              <div className="w-full h-full rounded-[22px] bg-[#0a0216]/95 flex items-center justify-center relative overflow-hidden backdrop-blur-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.5)_0%,transparent_70%)] animate-pulse" />
                
                {/* Stylized 'N' Video Emblem */}
                <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 relative z-10 drop-shadow-[0_0_20px_#ec4899]">
                  <defs>
                    <linearGradient id="introEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="45%" stopColor="#ec4899" />
                      <stop offset="75%" stopColor="#d946ef" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M24 80 V20 L52 58 V20 H76 V80 L48 42 V80 Z"
                    fill="url(#introEmblemGrad)"
                  />
                  <circle cx="76" cy="20" r="5.5" fill="#f43f5e" className="animate-ping origin-center" />
                </svg>
              </div>
            </motion.div>

            {/* Title: NoviCut */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display text-6xl md:text-8xl font-black tracking-tight text-white mb-3 relative"
            >
              <span className="bg-gradient-to-r from-pink-400 via-fuchsia-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(236,72,153,0.9)]">
                NoviCut
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center gap-3 text-sm md:text-lg font-heading tracking-[0.35em] uppercase text-pink-200"
            >
              <span>EDIT</span>
              <span className="text-pink-500">•</span>
              <span>CREATE</span>
              <span className="text-pink-500">•</span>
              <span>SHINE</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 font-mono text-xs"
            >
              ✨ PRO AI VIDEO STUDIO
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. SUBTLE PHASE INDICATOR & SKIP BUTTON */}
      <div className="absolute bottom-8 left-8 right-8 z-40 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
          <span className="text-xs font-mono tracking-widest text-pink-400/90 uppercase">
            {phase === 'rotating' && "Rotating Kaleidoscope Core"}
            {phase === 'zooming' && "Zooming Quantum Aperture"}
            {phase === 'revealing' && "Synthesizing NoviCut Engine"}
            {phase === 'opening' && "Opening Studio..."}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-32 sm:w-44 h-1.5 rounded-full bg-white/10 overflow-hidden backdrop-blur-md">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className="absolute top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/90 border border-pink-500/40 hover:border-pink-500 text-pink-300 hover:text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg"
      >
        <span>Skip Intro</span>
        <FastForward className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default KaleidoscopeIntro;
