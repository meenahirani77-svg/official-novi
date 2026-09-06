/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Play, Pause, Music, Film, Sparkles, Wand2, 
  Clock, Layers, Check, ArrowRight, Volume2, VolumeX, Flame 
} from 'lucide-react';
import { VideoTemplate } from '../types';

interface TemplatePreviewModalProps {
  template: VideoTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: VideoTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  isOpen,
  onClose,
  onUseTemplate
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setActiveClipIndex(0);
    }
  }, [isOpen, template?.id]);

  // Cycle preview clips if image-based template
  useEffect(() => {
    if (!isOpen || !template || !isPlaying) return;
    const interval = setInterval(() => {
      setActiveClipIndex((prev) => (prev + 1) % (template.clipsPreview.length || 1));
    }, 2500);
    return () => clearInterval(interval);
  }, [isOpen, template, isPlaying]);

  if (!isOpen || !template) return null;

  const currentPreviewClip = template.clipsPreview[activeClipIndex] || {
    url: template.thumbnail,
    title: template.title
  };

  const isVideoUrl = 
    currentPreviewClip.url?.endsWith('.mp4') || 
    currentPreviewClip.url?.endsWith('.webm') ||
    currentPreviewClip.url?.includes('googlevideo') ||
    currentPreviewClip.url?.includes('commondatastorage');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-[#110524] border border-pink-500/40 shadow-[0_0_60px_rgba(217,70,239,0.35)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Top Right with 44px touch target */}
        <button
          onClick={onClose}
          aria-label="Close template preview"
          className="absolute top-3 right-3 z-30 min-w-[44px] min-h-[44px] rounded-full bg-black/60 hover:bg-pink-500/40 border border-white/20 hover:border-pink-400 flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5 text-pink-300" />
        </button>

        {/* Left/Top: 9:16 Video / Media Preview Stage */}
        <div className="relative w-full md:w-5/12 aspect-[9/16] max-h-[50vh] md:max-h-full bg-black flex items-center justify-center overflow-hidden flex-shrink-0">
          {isVideoUrl ? (
            <video
              ref={videoRef}
              src={currentPreviewClip.url}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentPreviewClip.url || template.thumbnail}
              alt={template.title}
              className="w-full h-full object-cover transition-all duration-700 scale-105"
            />
          )}

          {/* Gradient Overlay for bottom text */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Aspect Ratio Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-pink-300">
            {template.aspectRatio || '9:16'} REELS
          </div>

          {/* Play/Pause Toggle & Sound Button */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-9 h-9 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-[0_0_15px_#ec4899] hover:scale-105 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-8 h-8 rounded-full bg-black/70 border border-white/20 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-pink-400" />}
            </button>
          </div>

          {/* Multi-clip dot indicators */}
          {template.clipsPreview.length > 1 && (
            <div className="absolute bottom-14 left-0 right-0 flex items-center justify-center gap-1.5 z-20">
              {template.clipsPreview.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activeClipIndex ? 'w-5 bg-pink-400 shadow-[0_0_8px_#ec4899]' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right/Bottom: Template Details & Action */}
        <div className="p-5 md:p-6 flex-1 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/40">
                  {template.category.toUpperCase()}
                </span>
                {template.isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/40">
                    PRO
                  </span>
                )}
                <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Trending
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-black font-heading tracking-wide text-white">
                {template.title}
              </h2>
              <p className="text-xs text-zinc-300/80 leading-relaxed mt-1">
                {template.description}
              </p>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Clock className="w-4 h-4 text-pink-400" />
                <div>
                  <span className="text-[10px] text-zinc-400 block">Duration</span>
                  <span className="text-xs font-bold font-mono text-white">{template.duration} Seconds</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <div>
                  <span className="text-[10px] text-zinc-400 block">Media Clips</span>
                  <span className="text-xs font-bold font-mono text-white">
                    {template.clipCount || template.clipsPreview.length || 3} Slots
                  </span>
                </div>
              </div>
            </div>

            {/* Beat Synced Audio Track info */}
            <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 flex-shrink-0">
                <Music className="w-5 h-5 animate-pulse" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] text-pink-300/80 block font-semibold">Included Beat-Sync Music</span>
                <span className="text-xs font-bold text-white truncate block">
                  {template.musicTrack || template.musicTitle || 'Cyber Beat Odyssey (128 BPM)'}
                </span>
              </div>
            </div>

            {/* Template Features Checklist */}
            <div className="space-y-1.5 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Auto Beat-Synced Cuts & Speed Curves</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Kinetic Typography & Glowing Cyber Effects</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Ready to customize with your photos or videos</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 pt-3 border-t border-white/10">
            <button
              onClick={() => {
                onClose();
                onUseTemplate(template);
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:brightness-110 active:scale-[0.99] text-white font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>Use This Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-zinc-400 mt-2">
              Opens multi-track studio timeline with all clips, beat markers & typography pre-loaded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
