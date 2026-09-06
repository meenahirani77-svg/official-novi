/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Scissors, Layers, Sliders, Wand2, 
  Sparkles, Film, Mic, Type, Image as ImageIcon, Maximize2, 
  Download, Zap, Eye, Move, Palette, Music, Video, Star
} from 'lucide-react';
import { EditorToolId } from '../types';

interface MoreToolsScreenProps {
  onBack: () => void;
  onSelectTool: (toolId: EditorToolId) => void;
}

interface ToolCategoryGroup {
  title: string;
  icon: React.ReactNode;
  description: string;
  tools: {
    name: string;
    toolId: EditorToolId;
    isPro?: boolean;
    isAi?: boolean;
    desc?: string;
  }[];
}

export const MoreToolsScreen: React.FC<MoreToolsScreenProps> = ({ onBack, onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const toolCategories: ToolCategoryGroup[] = [
    {
      title: 'EDITING',
      icon: <Scissors className="w-5 h-5 text-pink-400" />,
      description: 'Core cut, trim, duplicate, speed and reframe tools',
      tools: [
        { name: 'Trim', toolId: 'trim' },
        { name: 'Split', toolId: 'split' },
        { name: 'Cut', toolId: 'split' },
        { name: 'Delete', toolId: 'trim' },
        { name: 'Duplicate', toolId: 'trim' },
        { name: 'Copy', toolId: 'trim' },
        { name: 'Paste', toolId: 'trim' },
        { name: 'Crop', toolId: 'canvas' },
        { name: 'Rotate', toolId: 'adjust' },
        { name: 'Flip', toolId: 'adjust' },
        { name: 'Resize', toolId: 'canvas' },
        { name: 'Reframe', toolId: 'canvas' },
        { name: 'Reverse', toolId: 'reverse' },
        { name: 'Freeze Frame', toolId: 'freeze' },
        { name: 'Stabilize', toolId: 'adjust', isPro: true },
        { name: 'Speed', toolId: 'speed' },
        { name: 'Speed Curve', toolId: 'speed', isPro: true },
      ]
    },
    {
      title: 'ADVANCED EDITING',
      icon: <Layers className="w-5 h-5 text-purple-400" />,
      description: 'Keyframes, chroma key, masking, and motion tracking',
      tools: [
        { name: 'Keyframes', toolId: 'keyframe', isPro: true },
        { name: 'Masking', toolId: 'mask' },
        { name: 'Mask Animation', toolId: 'mask', isPro: true },
        { name: 'Motion Tracking', toolId: 'tracking', isPro: true, isAi: true },
        { name: 'Object Tracking', toolId: 'tracking', isPro: true, isAi: true },
        { name: 'Chroma Key', toolId: 'chroma' },
        { name: 'Green Screen', toolId: 'chroma' },
        { name: 'Blend Modes', toolId: 'pip' },
        { name: 'Adjustment Layer', toolId: 'adjustment', isPro: true },
        { name: 'Motion Blur', toolId: 'effects', isPro: true },
        { name: 'Time Remapping', toolId: 'speed', isPro: true },
        { name: 'Multi-layer Editing', toolId: 'pip' },
      ]
    },
    {
      title: 'COLOR & GRADING',
      icon: <Palette className="w-5 h-5 text-fuchsia-400" />,
      description: 'Professional color wheels, HSL, LUTs, and exposure adjustments',
      tools: [
        { name: 'Brightness', toolId: 'adjust' },
        { name: 'Contrast', toolId: 'adjust' },
        { name: 'Exposure', toolId: 'adjust' },
        { name: 'Highlights', toolId: 'adjust' },
        { name: 'Shadows', toolId: 'adjust' },
        { name: 'Whites', toolId: 'adjust' },
        { name: 'Blacks', toolId: 'adjust' },
        { name: 'Saturation', toolId: 'adjust' },
        { name: 'Vibrance', toolId: 'adjust' },
        { name: 'Temperature', toolId: 'adjust' },
        { name: 'Tint', toolId: 'adjust' },
        { name: 'Sharpness', toolId: 'adjust' },
        { name: 'Clarity', toolId: 'adjust' },
        { name: 'Fade', toolId: 'adjust' },
        { name: 'Vignette', toolId: 'adjust' },
        { name: 'Grain', toolId: 'adjust' },
        { name: 'HSL', toolId: 'filter', isPro: true },
        { name: 'RGB Curves', toolId: 'filter', isPro: true },
        { name: 'Color Wheels', toolId: 'filter', isPro: true },
        { name: 'LUT Support', toolId: 'filter', isPro: true },
      ]
    },
    {
      title: 'EFFECTS',
      icon: <Sparkles className="w-5 h-5 text-rose-400" />,
      description: 'Glitch, VHS, RGB split, light leaks, and camera shakes',
      tools: [
        { name: 'Glitch', toolId: 'effects' },
        { name: 'VHS Retro', toolId: 'effects' },
        { name: 'RGB Split', toolId: 'effects' },
        { name: 'Camera Shake', toolId: 'effects' },
        { name: 'Zoom Pulse', toolId: 'effects' },
        { name: 'Spin FX', toolId: 'effects' },
        { name: 'Strobe Flash', toolId: 'effects' },
        { name: 'Neon Glow', toolId: 'effects' },
        { name: 'Lens Blur', toolId: 'effects' },
        { name: 'Lens Flare', toolId: 'effects' },
        { name: 'Light Leak', toolId: 'effects' },
        { name: 'Bokeh', toolId: 'effects' },
        { name: 'Distortion', toolId: 'effects' },
        { name: 'Warp', toolId: 'effects' },
        { name: 'Retro 80s', toolId: 'effects' },
        { name: 'Vintage 35mm', toolId: 'effects' },
        { name: 'Cinematic Flare', toolId: 'effects' },
      ]
    },
    {
      title: 'TRANSITIONS',
      icon: <Film className="w-5 h-5 text-cyan-400" />,
      description: 'Seamless cut transitions with kinetic dynamics',
      tools: [
        { name: 'Fade', toolId: 'transition' },
        { name: 'Dissolve', toolId: 'transition' },
        { name: 'Zoom In/Out', toolId: 'transition' },
        { name: 'Spin Transition', toolId: 'transition' },
        { name: 'Slide Push', toolId: 'transition' },
        { name: 'Wipe', toolId: 'transition' },
        { name: 'Blur Dissolve', toolId: 'transition' },
        { name: 'Flash Cut', toolId: 'transition' },
        { name: 'Glitch Switch', toolId: 'transition' },
        { name: 'Morph Transition', toolId: 'transition', isPro: true },
      ]
    },
    {
      title: 'ANIMATION',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      description: 'In, Out, and Loop keyframe and kinetic motion presets',
      tools: [
        { name: 'Fade In/Out', toolId: 'animation' },
        { name: 'Pop Up', toolId: 'animation' },
        { name: 'Zoom In', toolId: 'animation' },
        { name: 'Slide Across', toolId: 'animation' },
        { name: 'Typewriter Text', toolId: 'animation' },
        { name: 'Bounce Dynamics', toolId: 'animation' },
        { name: 'Shake Vibration', toolId: 'animation' },
        { name: 'Rotate 360', toolId: 'animation' },
        { name: 'Swing Pendulum', toolId: 'animation' },
        { name: 'Float Hover', toolId: 'animation' },
        { name: 'Neon Pulse', toolId: 'animation' },
        { name: 'Motion Path', toolId: 'animation', isPro: true },
      ]
    },
    {
      title: 'ARTIFICIAL INTELLIGENCE (AI)',
      icon: <Wand2 className="w-5 h-5 text-pink-500" />,
      description: 'Neural video automation, smart auto-edit, and auto-captions',
      tools: [
        { name: 'AI Auto Edit', toolId: 'ai', isAi: true },
        { name: 'AI Background Removal', toolId: 'ai', isAi: true, isPro: true },
        { name: 'AI Object Removal', toolId: 'ai', isAi: true, isPro: true },
        { name: 'AI Captions Generator', toolId: 'captions', isAi: true },
        { name: 'AI Voice Enhancement', toolId: 'audio', isAi: true },
        { name: 'AI Noise Reduction', toolId: 'audio', isAi: true },
        { name: 'AI Scene Detection', toolId: 'ai', isAi: true },
        { name: 'AI Highlight Detection', toolId: 'ai', isAi: true },
        { name: 'AI Motion Tracking', toolId: 'tracking', isAi: true, isPro: true },
        { name: 'AI Script to Video', toolId: 'ai', isAi: true },
        { name: 'AI Thumbnail Generator', toolId: 'ai', isAi: true },
        { name: 'AI Video Ideas', toolId: 'ai', isAi: true },
      ]
    },
    {
      title: 'AUDIO & SOUND',
      icon: <Music className="w-5 h-5 text-emerald-400" />,
      description: 'Royalty-free music, device gallery, voiceover, and beat sync',
      tools: [
        { name: 'Music Library', toolId: 'music' },
        { name: 'Gallery Audio Import', toolId: 'music' },
        { name: 'Sound Effects', toolId: 'music' },
        { name: 'Studio Voiceover', toolId: 'voice' },
        { name: 'Extract Audio', toolId: 'audio' },
        { name: 'Detach Audio', toolId: 'audio' },
        { name: 'Audio Trim', toolId: 'audio' },
        { name: 'Volume Curve', toolId: 'audio' },
        { name: 'Equalizer & Bass', toolId: 'audio', isPro: true },
        { name: 'Beat Detection & Sync', toolId: 'audio', isPro: true },
        { name: 'Voice Changer', toolId: 'audio' },
      ]
    },
    {
      title: 'TEXT, STICKERS & DRAW',
      icon: <Type className="w-5 h-5 text-blue-400" />,
      description: 'Kinetic typography, neon outline, graffiti draw, and stickers',
      tools: [
        { name: 'Text & Titles', toolId: 'text' },
        { name: 'Animated Text', toolId: 'text' },
        { name: 'Neon Text Styles', toolId: 'text' },
        { name: 'Draw & Doodle', toolId: 'draw' },
        { name: 'Stickers & Emojis', toolId: 'sticker' },
        { name: 'Watermark Removal', toolId: 'text', isPro: true },
      ]
    },
    {
      title: 'CANVAS & EXPORT',
      icon: <Maximize2 className="w-5 h-5 text-violet-400" />,
      description: 'Aspect ratio framing and ultra HD multi-format rendering',
      tools: [
        { name: '9:16 Vertical Reel', toolId: 'canvas' },
        { name: '16:9 Cinema Widescreen', toolId: 'canvas' },
        { name: '1:1 Square Feed', toolId: 'canvas' },
        { name: '4:5 Social Portrait', toolId: 'canvas' },
        { name: '1080p Full HD', toolId: 'trim' },
        { name: '4K Ultra HD Export', toolId: 'trim', isPro: true },
        { name: '60 FPS Smooth Render', toolId: 'trim', isPro: true },
      ]
    }
  ];

  // Filter tools by search query
  const filteredCategories = toolCategories.map(cat => {
    if (!searchQuery.trim()) return cat;
    const q = searchQuery.toLowerCase();
    const matchedTools = cat.tools.filter(t => 
      t.name.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q)
    );
    return {
      ...cat,
      tools: matchedTools
    };
  }).filter(cat => cat.tools.length > 0);

  return (
    <div className="min-h-screen bg-[#06020c] text-white pt-6 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-pink-400 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-white flex items-center gap-2">
              <span>All Video Tools</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                120+ Features
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">Explore every editing, AI, color, and audio capability</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search any tool (e.g. Chroma, Beat, Glitch)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#120726] border border-pink-500/20 focus:border-pink-500 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-[0_0_15px_rgba(217,70,239,0.1)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Categorized Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#0f061e]/80 border border-white/5 hover:border-pink-500/40 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col justify-between"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase font-heading text-white">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{cat.description}</p>
                </div>
              </div>

              {/* Tools Badges */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {cat.tools.map((tool, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => onSelectTool(tool.toolId)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-pink-500 hover:text-white border border-white/10 hover:border-pink-400 text-xs text-zinc-300 transition-all cursor-pointer group"
                  >
                    <span>{tool.name}</span>
                    {tool.isAi && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-pink-500/30 text-pink-300 font-mono font-bold group-hover:bg-white group-hover:text-pink-600">
                        AI
                      </span>
                    )}
                    {tool.isPro && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold group-hover:bg-white group-hover:text-amber-600">
                        PRO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
