/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Flame, Sparkles, Wand2, 
  Crown, Play, Music, Clock, Layers, ArrowUpRight, Filter 
} from 'lucide-react';
import { VideoTemplate, PlanType } from '../types';
import { SAMPLE_TEMPLATES } from '../data/presets';
import { TemplatePreviewModal } from './TemplatePreviewModal';

interface TemplatesScreenProps {
  onBack: () => void;
  onSelectTemplate: (template: VideoTemplate) => void;
  onOpenSubscription?: () => void;
  currentPlan?: PlanType;
}

export const TemplatesScreen: React.FC<TemplatesScreenProps> = ({
  onBack,
  onSelectTemplate,
  onOpenSubscription,
  currentPlan = 'free'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAspect, setSelectedAspect] = useState<'all' | '9:16' | '16:9'>('all');
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<VideoTemplate | null>(null);

  const categories = [
    'All',
    'Trending',
    'Reels 9:16',
    'Cyberpunk',
    'Travel',
    'Love',
    'Birthday',
    'Party',
    'Festival',
    'Fitness',
    'Fashion',
    'Memories',
    'Photo Dump'
  ];

  const filteredTemplates = SAMPLE_TEMPLATES.filter((tpl) => {
    // Category filter
    let matchesCategory = selectedCategory === 'All';
    if (selectedCategory === 'Trending') {
      matchesCategory = true;
    } else if (selectedCategory === 'Reels 9:16') {
      matchesCategory = tpl.aspectRatio === '9:16';
    } else if (selectedCategory === 'Cyberpunk') {
      matchesCategory = tpl.category === 'Cyberpunk' || tpl.title.toLowerCase().includes('cyber') || tpl.title.toLowerCase().includes('neon');
    } else if (selectedCategory === 'Party') {
      matchesCategory = tpl.category === 'Party' || tpl.category === 'Friends' || tpl.category === 'Birthday';
    } else {
      matchesCategory = tpl.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        tpl.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Aspect ratio filter
    const matchesAspect = selectedAspect === 'all' || tpl.aspectRatio === selectedAspect;

    // Search query filter
    const matchesSearch = 
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesAspect && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#070210] text-white pt-5 pb-28 px-4 md:px-8 max-w-7xl mx-auto select-none animate-fade-in">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Back to Home"
            className="min-w-[44px] min-h-[44px] rounded-2xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/50 flex items-center justify-center text-white transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-pink-300" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black font-heading tracking-wide text-white">
                Viral Video Templates
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/40">
                BEAT SYNC
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              One-tap trending templates with sound, beat drops & cyber effects
            </p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative w-48 sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#130628] border border-pink-500/30 focus:border-pink-500 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 2. CATEGORY PILLS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/50'
                : 'bg-[#120626] border border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
            }`}
          >
            {cat === 'Trending' && <Flame className="w-3.5 h-3.5 inline mr-1 text-orange-400" />}
            {cat}
          </button>
        ))}
      </div>

      {/* 3. TEMPLATES COUNT & ASPECT FILTER */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <span className="text-xs font-mono text-zinc-400">
          Showing <strong className="text-pink-300">{filteredTemplates.length}</strong> ready-to-use templates
        </span>

        <div className="flex items-center gap-1.5 bg-[#120626] p-1 rounded-xl border border-white/10 text-[11px]">
          <button
            onClick={() => setSelectedAspect('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedAspect === 'all' ? 'bg-pink-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Ratios
          </button>
          <button
            onClick={() => setSelectedAspect('9:16')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedAspect === '9:16' ? 'bg-pink-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            9:16 Reels
          </button>
          <button
            onClick={() => setSelectedAspect('16:9')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              selectedAspect === '16:9' ? 'bg-pink-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            16:9 Cinema
          </button>
        </div>
      </div>

      {/* 4. TEMPLATES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => setSelectedTemplateForPreview(tpl)}
            className="group rounded-3xl overflow-hidden bg-[#110526] border border-white/10 hover:border-pink-500/60 shadow-lg hover:shadow-[0_0_35px_rgba(217,70,239,0.3)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            {/* Visual Thumbnail */}
            <div className="relative aspect-[9/16] max-h-80 w-full overflow-hidden bg-black">
              <img
                src={tpl.thumbnail}
                alt={tpl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0321] via-transparent to-black/40 opacity-80" />

              {/* Badges Top */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-pink-300 border border-white/15">
                  {tpl.category}
                </span>
                {tpl.isPro && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>PRO</span>
                  </span>
                )}
              </div>

              {/* Play Hover Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/35 backdrop-blur-[2px]">
                <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-[0_0_25px_#ec4899] transform group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-0.5 fill-white" />
                </div>
              </div>

              {/* Bottom Quick Info & Use Button */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                <span className="text-zinc-300 font-mono text-[11px] bg-black/60 px-2 py-1 rounded-lg backdrop-blur-sm">
                  {tpl.duration}s • {tpl.clipCount || tpl.clipsPreview.length || 3} clips
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(tpl);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-[0_0_15px_rgba(236,72,153,0.6)] flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                >
                  <span>Use</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Template Description */}
            <div className="p-4">
              <h3 className="font-bold text-sm text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                {tpl.title}
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>

              {/* Music info */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center gap-2 text-[11px] text-pink-300/80">
                <Music className="w-3.5 h-3.5 flex-shrink-0 text-pink-400" />
                <span className="truncate">{tpl.musicTrack || 'Beat Synced Audio'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 5. INTERACTIVE TEMPLATE PREVIEW MODAL */}
      <TemplatePreviewModal
        template={selectedTemplateForPreview}
        isOpen={Boolean(selectedTemplateForPreview)}
        onClose={() => setSelectedTemplateForPreview(null)}
        onUseTemplate={(tpl) => {
          setSelectedTemplateForPreview(null);
          onSelectTemplate(tpl);
        }}
      />

    </div>
  );
};
