/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Plus, Search, Bell, Cloud, Crown, Sparkles, Wand2, 
  Film, Music, Type, Scissors, Shield, Camera, MoreHorizontal, 
  Play, Clock, Trash2, Edit3, ChevronRight, Video, Flame, Star, 
  ExternalLink, Layers, ArrowUpRight, Lightbulb
} from 'lucide-react';
import { Project, VideoTemplate, PlanType, EditorToolId } from '../types';
import { SAMPLE_TEMPLATES } from '../data/presets';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { ToolsDirectorySection } from './ToolsDirectorySection';

interface HomeScreenProps {
  projects: Project[];
  onNewProject: () => void;
  onOpenProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectTemplate: (template: VideoTemplate) => void;
  onOpenTemplates?: () => void;
  onOpenMoreTools: () => void;
  onOpenSubscription: () => void;
  onOpenMusicModal: () => void;
  currentPlan: PlanType;
  onQuickActionTool: (toolId: EditorToolId) => void;
  freeExportsCount?: number;
  onReplayIntro?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  onNewProject,
  onOpenProject,
  onDeleteProject,
  onSelectTemplate,
  onOpenTemplates,
  onOpenMoreTools,
  onOpenSubscription,
  onOpenMusicModal,
  currentPlan,
  onQuickActionTool,
  freeExportsCount = 0,
  onReplayIntro
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'recent' | 'templates' | 'ai'>('all');
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<string>('All');
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<VideoTemplate | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter templates by category and search
  const templateCategories = [
    'All', 
    'Trending', 
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

  const filteredTemplates = SAMPLE_TEMPLATES.filter(t => {
    let matchesCat = activeTemplateCategory === 'All';
    if (activeTemplateCategory === 'Trending') {
      matchesCat = true;
    } else if (activeTemplateCategory === 'Cyberpunk') {
      matchesCat = t.category === 'Cyberpunk' || t.title.toLowerCase().includes('cyber') || t.title.toLowerCase().includes('neon');
    } else if (activeTemplateCategory === 'Party') {
      matchesCat = t.category === 'Party' || t.category === 'Friends' || t.category === 'Birthday';
    } else {
      matchesCat = t.category?.toLowerCase() === activeTemplateCategory.toLowerCase() ||
        t.tags?.some(tag => tag.toLowerCase() === activeTemplateCategory.toLowerCase());
    }

    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter projects by search
  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick action buttons
  const quickActions = [
    {
      id: 'ai',
      name: 'AI Auto Edit',
      desc: 'Smart beat sync & cuts',
      icon: <Wand2 className="w-5 h-5 text-pink-400" />,
      isAi: true,
      action: () => onQuickActionTool('ai')
    },
    {
      id: 'templates',
      name: 'Templates',
      desc: 'Trending viral reels',
      icon: <Film className="w-5 h-5 text-purple-400" />,
      action: () => {
        if (onOpenTemplates) {
          onOpenTemplates();
        } else {
          setSelectedTab('templates');
          document.getElementById('templates-section')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      id: 'music',
      name: 'Beat Sync',
      desc: 'Music to video rhythm',
      icon: <Music className="w-5 h-5 text-emerald-400" />,
      action: () => onOpenMusicModal()
    },
    {
      id: 'captions',
      name: 'Auto Captions',
      desc: 'Kinetic animated text',
      icon: <Type className="w-5 h-5 text-blue-400" />,
      isAi: true,
      action: () => onQuickActionTool('captions')
    },
    {
      id: 'chroma',
      name: 'Remove BG',
      desc: 'Green screen & chroma',
      icon: <Shield className="w-5 h-5 text-cyan-400" />,
      isPro: true,
      action: () => onQuickActionTool('chroma')
    },
    {
      id: 'more',
      name: 'More Tools',
      desc: '120+ advanced studio tools',
      icon: <MoreHorizontal className="w-5 h-5 text-rose-400" />,
      action: () => onOpenMoreTools()
    }
  ];

  return (
    <div className="min-h-screen bg-transparent text-white pt-4 pb-28 px-4 md:px-8 max-w-7xl mx-auto select-none">
      
      {/* 2. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5">
          {/* Kaleidoscopic Glyph Icon */}
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-700 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.6)] border border-pink-400/50 overflow-hidden group">
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8),transparent_70%)] animate-pulse" />
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-500 relative z-10" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black font-heading tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-pink-400">
                NOVICUT
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                v2.5 AI
              </span>
            </div>
            <p className="text-[11px] font-sans font-medium text-pink-300/80 tracking-wide">
              Next-Gen AI Video Editor & Motion Studio
            </p>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search templates, effects, tools, drafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#110624]/90 border border-pink-500/20 focus:border-pink-500 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)]"
          />
        </div>

        {/* Right: Quick Indicators & Pro Badge */}
        <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
          {/* Replay Intro Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              title="Watch Intro Animation Again"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-[11px] font-mono text-pink-300 transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-pink-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Intro Animation</span>
            </button>
          )}

          {/* Tools Guide Quick Link */}
          <button
            onClick={() => document.getElementById('tools-guide-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-pink-400" />
            <span>Tools Guide</span>
          </button>

          {/* Free Tier Status / Limit Notice Badge */}
          {currentPlan === 'free' ? (
            <button
              onClick={onOpenSubscription}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                freeExportsCount >= 2
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                  : 'bg-pink-500/20 border-pink-500/40 text-pink-300'
              }`}
            >
              <span>
                {freeExportsCount >= 2
                  ? '🔒 Free Limit (2/2 Used)'
                  : `🎁 ${2 - freeExportsCount} Free HD Videos Left`}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono">
              <Crown className="w-3.5 h-3.5 text-yellow-400" />
              <span>PRO UNLIMITED HD</span>
            </div>
          )}

          {/* Pro Upgrade Crown CTA */}
          <button
            onClick={onOpenSubscription}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:brightness-110 text-white text-xs font-bold font-heading shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>{currentPlan === 'free' ? 'PRO (₹29/MO • ₹300/YR)' : 'MANAGE PRO'}</span>
          </button>

          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-[#0d041c] flex items-center justify-center font-bold text-xs text-pink-300">
              NC
            </div>
          </div>
        </div>

      </div>

      {/* 3. HERO CREATION DOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
        
        {/* PRIMARY HERO CARD: + NEW PROJECT WITH KALEIDOSCOPE CORE */}
        <div 
          onClick={onNewProject}
          className="lg:col-span-5 relative group cursor-pointer rounded-3xl p-6 md:p-8 bg-gradient-to-br from-[#2a0845]/90 via-[#160528]/95 to-[#0b0214] border border-pink-500/40 hover:border-pink-400 shadow-[0_0_40px_rgba(217,70,239,0.3)] transition-all duration-300 overflow-hidden flex flex-col justify-between"
        >
          {/* Animated Neon Kaleidoscope Glow & Circular Mandala Ring */}
          <div className="absolute -right-6 -bottom-6 w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden opacity-40 group-hover:opacity-75 transition-opacity duration-500 pointer-events-none border-2 border-pink-500/50 shadow-[0_0_40px_#ec4899]">
            <img
              src="/intro_kaleidoscope.jpg"
              alt="Kaleidoscope Mandala"
              className="w-full h-full object-cover animate-spin"
              style={{ animationDuration: '24s' }}
            />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-[10px] font-bold border border-pink-500/40">
                PRO AI STUDIO
              </span>
              <Sparkles className="w-5 h-5 text-pink-400 group-hover:rotate-12 transition-transform" />
            </div>

            <h2 className="text-2xl md:text-3xl font-black font-heading tracking-tight text-white mb-2 group-hover:text-pink-100 transition-colors">
              Turn Your Ideas Into Stunning Videos
            </h2>
            <p className="text-xs text-pink-200/90 font-medium mb-3">
              Edit • Enhance • Create with AI
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
              Start from scratch with your photos, videos, and music. Professional multi-track timeline ready.
            </p>
          </div>

          <div className="mt-6 relative z-10 flex items-center gap-3">
            <button 
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.6)] group-hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Project</span>
            </button>
            <span className="text-[11px] text-zinc-400">9:16 Reels • 16:9 Cinema • 4K HD</span>
          </div>
        </div>

        {/* SURROUNDING QUICK-ACTION TILES */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {quickActions.map((action) => (
            <div
              key={action.id}
              onClick={action.action}
              className="relative p-4 rounded-2xl bg-[#110523]/80 hover:bg-[#190833] border border-white/5 hover:border-pink-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_25px_rgba(217,70,239,0.2)] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-pink-500/20 border border-white/10 group-hover:border-pink-500/40 flex items-center justify-center transition-colors">
                    {action.icon}
                  </div>
                  {action.isAi && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/30 text-pink-300 font-mono font-bold">
                      AI
                    </span>
                  )}
                  {action.isPro && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                      PRO
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xs text-white group-hover:text-pink-300 transition-colors">
                  {action.name}
                </h3>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                  {action.desc}
                </p>
              </div>

              <div className="mt-3 flex items-center text-[10px] text-pink-400 font-semibold group-hover:translate-x-1 transition-transform">
                <span>Launch</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* SECTION TABS (All, Recent Drafts, Templates, AI Studio) */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-6">
        {[
          { id: 'all', label: 'All Projects' },
          { id: 'recent', label: 'Recent Drafts' },
          { id: 'templates', label: 'Viral Templates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedTab === tab.id
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-[0_0_15px_rgba(217,70,239,0.2)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* DRAFTS & RECENT PROJECTS SECTION */}
      {(selectedTab === 'all' || selectedTab === 'recent') && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <span>Recent Project Drafts</span>
              <span className="text-xs text-zinc-400 font-mono">({filteredProjects.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj)}
                className="group relative rounded-2xl overflow-hidden bg-[#100622]/90 border border-white/5 hover:border-pink-500/50 shadow-lg hover:shadow-[0_0_30px_rgba(217,70,239,0.2)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                  <img
                    src={proj.thumbnail || proj.clips[0]?.url}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e041c] via-transparent to-transparent opacity-80" />
                  
                  {/* Aspect Ratio Badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-pink-300 border border-white/10">
                    {proj.aspectRatio}
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-zinc-300">
                    {proj.duration}s
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="w-11 h-11 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-[0_0_20px_#ec4899]">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white group-hover:text-pink-300 transition-colors line-clamp-1">
                        {proj.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>Edited recently • {proj.clips.length} clips</span>
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      title="Delete draft"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIRAL TEMPLATES SHOWCASE */}
      {(selectedTab === 'all' || selectedTab === 'templates') && (
        <div id="templates-section" className="scroll-mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>Trending Reel & TikTok Templates</span>
                </h3>
                {onOpenTemplates && (
                  <button
                    onClick={onOpenTemplates}
                    className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1 ml-2 transition-colors cursor-pointer"
                  >
                    <span>View All ({SAMPLE_TEMPLATES.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-xs text-zinc-400">One-tap beat synced templates ready to customize</p>
            </div>

            {/* Template Category filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {templateCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTemplateCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTemplateCategory === cat
                      ? 'bg-pink-500 text-white shadow-[0_0_10px_#ec4899]'
                      : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateForPreview(tpl)}
                className="group rounded-2xl overflow-hidden bg-[#100622]/90 border border-white/5 hover:border-pink-500/50 shadow-lg hover:shadow-[0_0_30px_rgba(217,70,239,0.25)] transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[9/16] max-h-72 w-full overflow-hidden bg-black">
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d041c] via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono text-pink-300 border border-white/10">
                      {tpl.category}
                    </span>
                    {tpl.isPro && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                        PRO
                      </span>
                    )}
                  </div>

                  {/* Play Center Indicator on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-[0_0_15px_#ec4899]">
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10">
                    <span className="text-zinc-300 font-mono text-[11px] bg-black/60 px-2 py-1 rounded-md">{tpl.duration}s</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTemplate(tpl);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs shadow-md flex items-center gap-1 cursor-pointer"
                    >
                      <span>Use Template</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-sm text-white group-hover:text-pink-300 transition-colors">
                    {tpl.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                    {tpl.description}
                  </p>
                  <div className="mt-2 text-[10px] text-pink-300/80 flex items-center gap-1 truncate">
                    <Music className="w-3 h-3 text-pink-400 flex-shrink-0" />
                    <span className="truncate">{tpl.musicTrack || 'Beat Synced Audio'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMPREHENSIVE TOOLS & WEBSITE KNOWLEDGE SECTION */}
      <ToolsDirectorySection onNewProject={onNewProject} />

      {/* INTERACTIVE TEMPLATE PREVIEW MODAL */}
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
