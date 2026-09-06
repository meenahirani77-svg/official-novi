/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  X, Check, Plus, Trash2, Wand2, Sparkles, UploadCloud, 
  RotateCw, RefreshCw, Layers, Shield, Eye, Grid, Disc, 
  Sliders, Gauge, Palette, Play, PenTool, Type,
  Volume2, VolumeX, Smile, Film, Snowflake, RotateCcw,
  Scissors, Maximize2, Zap
} from 'lucide-react';
import { 
  EditorToolId, Project, VideoClip, TextOverlay, 
  AspectRatio, StickerOverlay 
} from '../../types';
import { FILTER_PRESETS } from '../../data/presets';
import { generateAIAutoEdit, generateAICaptionsFromText } from '../../services/geminiService';

interface EditorToolPanelsProps {
  activeTool: EditorToolId;
  onClose: () => void;
  project: Project;
  onUpdateProject: (updated: Project) => void;
  selectedClip: VideoClip | null;
  onUpdateClip: (updatedClip: VideoClip) => void;
  currentTime: number;
  onOpenMusicModal: () => void;
  onOpenMoreTools: () => void;
  onTriggerEffect?: (effectName: string) => void;
  onSetDrawMode?: (isDraw: boolean) => void;
  onDeleteClip?: () => void;
  onDuplicateClip?: () => void;
}

export const EditorToolPanels: React.FC<EditorToolPanelsProps> = ({
  activeTool,
  onClose,
  project,
  onUpdateProject,
  selectedClip,
  onUpdateClip,
  currentTime,
  onOpenMusicModal,
  onOpenMoreTools,
  onTriggerEffect,
  onSetDrawMode,
  onDeleteClip,
  onDuplicateClip,
}) => {
  // Common states
  const [speedCurve, setSpeedCurve] = useState<string>('Standard');
  const [newTextContent, setNewTextContent] = useState<string>('NEW TITLE');
  const [textAnimation, setTextAnimation] = useState<TextOverlay['animation']>('typewriter');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [selectedFont, setSelectedFont] = useState<string>('Space Grotesk');
  const [pipBlend, setPipBlend] = useState<'normal' | 'screen' | 'multiply' | 'overlay'>('normal');

  // AI states
  const [aiPrompt, setAiPrompt] = useState<string>('Create a high-energy aesthetic cyberpunk reel with beat-synced cuts');
  const [aiStyle, setAiStyle] = useState<'Cinematic' | 'Trending' | 'Aesthetic' | 'Cyberpunk'>('Cyberpunk');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState<string | null>(null);

  // Tracking State
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [trackingProgress, setTrackingProgress] = useState<number>(0);

  // File Picker for PIP media
  const pipFileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle PIP Media Import
  const handlePipFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const newPipClip: VideoClip = {
      id: `pip-${Date.now()}`,
      title: file.name,
      url: fileUrl,
      type: file.type.startsWith('video') ? 'video' : 'photo',
      duration: 10,
      startTime: currentTime,
      trimStart: 0,
      trimEnd: 10,
      speed: 1,
      volume: 80,
      opacity: 100,
      scale: 0.8,
      rotation: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      exposure: 0,
      temperature: 0,
      tint: 0,
      vignette: 0,
      blur: 0,
      isPIP: true,
      pipX: 60,
      pipY: 20,
      pipScale: 0.9,
      blendMode: pipBlend
    };

    // Remove existing PIP if replacing
    const filteredClips = project.clips.filter(c => !c.isPIP);
    onUpdateProject({
      ...project,
      clips: [...filteredClips, newPipClip]
    });
  };

  // Add New Text Overlay
  const handleAddText = () => {
    if (!newTextContent.trim()) return;

    const newText: TextOverlay = {
      id: `txt-${Date.now()}`,
      text: newTextContent,
      startTime: currentTime,
      duration: 3.5,
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: selectedFont,
      color: textColor,
      hasGlow: true,
      hasOutline: true,
      animation: textAnimation,
      hasBackground: false,
    };

    onUpdateProject({
      ...project,
      texts: [...project.texts, newText]
    });
    setNewTextContent('');
  };

  // Run AI Auto Edit
  const handleRunAiAutoEdit = async () => {
    setIsGeneratingAi(true);
    setAiGeneratedSuccess(null);

    try {
      const plan = await generateAIAutoEdit(aiPrompt, aiStyle);

      // Apply AI Plan: update beat markers, captions, and project title
      const updatedCaptions = plan.captions.map(c => ({
        time: c.time,
        text: c.text,
        highlight: c.highlight
      }));

      onUpdateProject({
        ...project,
        name: plan.title,
        autoCaptions: updatedCaptions,
        beatMarkers: [1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6, 10.8, 12.0]
      });

      setAiGeneratedSuccess(`Generated AI Edit Plan! ${plan.captions.length} captions & beat-cuts synced.`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Run Motion Tracking Simulation
  const handleStartTracking = () => {
    setIsTracking(true);
    setTrackingProgress(0);

    const interval = setInterval(() => {
      setTrackingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTracking(false);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  // Change Aspect Ratio
  const handleSetRatio = (ratio: AspectRatio) => {
    onUpdateProject({
      ...project,
      aspectRatio: ratio
    });
  };

  return (
    <div className="w-full bg-[#120726] border-t border-pink-500/30 p-4 text-white text-xs select-none">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-heading font-bold uppercase tracking-wider text-pink-400 text-xs">
            Tool:
          </span>
          <span className="text-white bg-pink-500/20 px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-pink-500/40">
            {activeTool.toUpperCase()}
          </span>
        </div>

        {/* Close Button with 44px touch target */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close tool panel"
          className="min-w-[44px] min-h-[44px] px-2 rounded-full bg-white/10 hover:bg-pink-500/30 active:bg-pink-500/50 border border-white/20 hover:border-pink-400 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5 text-pink-300" />
        </button>
      </div>

      {/* Hidden file input for PIP media */}
      <input
        ref={pipFileInputRef}
        type="file"
        accept="video/*,image/*"
        className="hidden"
        onChange={handlePipFileSelect}
      />

      {/* 0. CLIP EDITING OPTIONS (Opened via Clip tab) */}
      {activeTool === 'clip' && selectedClip && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Selected Clip Header with Information & Delete Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent border border-pink-500/30">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-300 flex-shrink-0">
                {selectedClip.type === 'video' ? <Film className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <div className="text-white font-bold truncate max-w-[220px] text-xs">
                  {selectedClip.title}
                </div>
                <div className="text-[10px] text-zinc-400 font-mono flex items-center gap-2 mt-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 uppercase font-bold text-[9px]">
                    {selectedClip.type}
                  </span>
                  <span>Duration: {(selectedClip.trimEnd - selectedClip.trimStart).toFixed(1)}s</span>
                  {selectedClip.effect && (
                    <span className="text-emerald-400 font-bold">FX: {selectedClip.effect}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Action Buttons: Duplicate & Delete Clip */}
            <div className="flex items-center gap-2">
              {onDuplicateClip && (
                <button
                  type="button"
                  onClick={onDuplicateClip}
                  title="Duplicate this clip"
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Duplicate</span>
                </button>
              )}

              {onDeleteClip && (
                <button
                  type="button"
                  onClick={onDeleteClip}
                  title="Delete this selected clip from timeline"
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.5)] transition-all cursor-pointer active:scale-95 border border-rose-400/50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Clip</span>
                </button>
              )}
            </div>
          </div>

          {/* 1. Clip Effects & Shaders */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Apply Video Effect:</span>
              </span>
              {selectedClip.effect && (
                <button
                  onClick={() => onUpdateClip({ ...selectedClip, effect: undefined })}
                  className="text-[10px] text-zinc-400 hover:text-white"
                >
                  Clear Effect
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {['None', 'Glitch', 'RGB Split', 'Glow', 'VHS 80s', 'Film Grain', 'Lens Flare', 'Strobe Flash', 'Cyberpunk', 'Prism', 'Zoom Blur', 'Invert', 'Mirror'].map((eff) => {
                const isSelected = eff === 'None' ? !selectedClip.effect : selectedClip.effect === eff;
                return (
                  <button
                    key={eff}
                    type="button"
                    onClick={() => {
                      const newEffect = eff === 'None' ? undefined : eff;
                      onUpdateClip({ ...selectedClip, effect: newEffect });
                      if (newEffect && onTriggerEffect) {
                        onTriggerEffect(newEffect);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-[11px] font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.6)]'
                        : 'bg-white/5 text-zinc-300 border-white/10 hover:border-pink-500/40 hover:text-white'
                    }`}
                  >
                    {eff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Color Grade Presets */}
          <div>
            <span className="text-zinc-400 block mb-1.5 font-medium">Color Grade Presets:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {FILTER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onUpdateClip({
                    ...selectedClip,
                    filterPreset: preset.name,
                    brightness: preset.brightness,
                    contrast: preset.contrast,
                    saturation: preset.saturation
                  })}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-[11px] font-semibold border transition-all cursor-pointer ${
                    selectedClip.filterPreset === preset.name
                      ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:border-pink-500/40'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Sliders: Adjustments, Speed, Scale, Rotation, Volume */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2 border-t border-white/5">
            
            {/* Brightness */}
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                <span>Brightness</span>
                <span className="text-pink-300 font-mono">{selectedClip.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={selectedClip.brightness}
                onChange={(e) => onUpdateClip({ ...selectedClip, brightness: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Contrast */}
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                <span>Contrast</span>
                <span className="text-pink-300 font-mono">{selectedClip.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={selectedClip.contrast}
                onChange={(e) => onUpdateClip({ ...selectedClip, contrast: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Saturation */}
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                <span>Saturation</span>
                <span className="text-pink-300 font-mono">{selectedClip.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={selectedClip.saturation}
                onChange={(e) => onUpdateClip({ ...selectedClip, saturation: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Speed */}
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                <span>Speed</span>
                <span className="text-pink-300 font-mono">{selectedClip.speed || 1}x</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="3"
                step="0.25"
                value={selectedClip.speed || 1}
                onChange={(e) => onUpdateClip({ ...selectedClip, speed: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Scale / Zoom */}
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                <span>Scale / Zoom</span>
                <span className="text-pink-300 font-mono">{Math.round((selectedClip.scale || 1) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.05"
                value={selectedClip.scale || 1}
                onChange={(e) => onUpdateClip({ ...selectedClip, scale: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>

            {/* Rotation */}
            <div className="bg-black/20 p-2 rounded-lg border border-white/5">
              <div className="flex justify-between text-zinc-400 mb-1 text-[10px]">
                <span>Rotation</span>
                <span className="text-pink-300 font-mono">{selectedClip.rotation || 0}°</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={selectedClip.rotation || 0}
                  onChange={(e) => onUpdateClip({ ...selectedClip, rotation: Number(e.target.value) })}
                  className="w-full accent-pink-500"
                />
                <button
                  type="button"
                  onClick={() => onUpdateClip({ ...selectedClip, rotation: ((selectedClip.rotation || 0) + 90) % 360 })}
                  title="Rotate 90 degrees"
                  className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono text-zinc-300"
                >
                  +90°
                </button>
              </div>
            </div>

          </div>

          {/* 4. Audio Volume & Animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/5">
            {/* Volume */}
            <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-lg border border-white/5">
              <Volume2 className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between text-zinc-400 mb-0.5 text-[10px]">
                  <span>Audio Volume</span>
                  <span className="text-pink-300 font-mono">{selectedClip.volume ?? 100}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={selectedClip.volume ?? 100}
                  onChange={(e) => onUpdateClip({ ...selectedClip, volume: Number(e.target.value) })}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>

            {/* Animation */}
            <div className="flex items-center gap-2 bg-black/20 p-2.5 rounded-lg border border-white/5">
              <span className="text-zinc-400 text-xs whitespace-nowrap">Animation:</span>
              <div className="flex items-center gap-1 flex-wrap">
                {['none', 'pulse', 'bounce'].map((anim) => (
                  <button
                    key={anim}
                    type="button"
                    onClick={() => onUpdateClip({ ...selectedClip, animation: anim === 'none' ? undefined : anim })}
                    className={`px-2.5 py-1 rounded text-[10px] capitalize font-medium ${
                      (selectedClip.animation || 'none') === anim
                        ? 'bg-pink-500 text-white'
                        : 'bg-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {anim}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 1. TRIM & SPLIT */}
      {(activeTool === 'trim' || activeTool === 'split') && selectedClip && (
        <div className="space-y-3">
          <p className="text-zinc-400">
            Selected Clip: <span className="text-white font-semibold">{selectedClip.title}</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Trim Start</span>
                <span className="text-pink-300 font-mono">{selectedClip.trimStart.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="0"
                max={selectedClip.duration - 1}
                step="0.1"
                value={selectedClip.trimStart}
                onChange={(e) => onUpdateClip({ ...selectedClip, trimStart: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Trim End</span>
                <span className="text-pink-300 font-mono">{selectedClip.trimEnd.toFixed(1)}s</span>
              </div>
              <input
                type="range"
                min="1"
                max={selectedClip.duration}
                step="0.1"
                value={selectedClip.trimEnd}
                onChange={(e) => onUpdateClip({ ...selectedClip, trimEnd: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. SPEED */}
      {activeTool === 'speed' && selectedClip && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Speed Preset:</span>
            {[0.2, 0.5, 1, 1.5, 2, 4, 8].map((s) => (
              <button
                key={s}
                onClick={() => onUpdateClip({ ...selectedClip, speed: s })}
                className={`px-2.5 py-1 rounded-md font-mono ${
                  selectedClip.speed === s
                    ? 'bg-pink-500 text-white font-bold shadow-[0_0_10px_#ec4899]'
                    : 'bg-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-zinc-400">Speed Curves:</span>
            {['Standard', 'Montage Ramp', 'Hero Flash', 'Bullet Time'].map((curve) => (
              <button
                key={curve}
                onClick={() => setSpeedCurve(curve)}
                className={`px-2.5 py-1 rounded-md text-[11px] ${
                  speedCurve === curve
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'bg-white/5 text-zinc-400'
                }`}
              >
                {curve}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. PIP (PICTURE IN PICTURE) */}
      {activeTool === 'pip' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => pipFileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Add from Device Gallery</span>
            </button>

            <button
              onClick={() => {
                const samplePip: VideoClip = {
                  id: `pip-sample-${Date.now()}`,
                  title: 'Cosmic Star Overlay',
                  url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop',
                  type: 'photo',
                  duration: 8,
                  startTime: currentTime,
                  trimStart: 0,
                  trimEnd: 8,
                  speed: 1,
                  volume: 100,
                  opacity: 90,
                  scale: 0.8,
                  rotation: 0,
                  brightness: 100,
                  contrast: 100,
                  saturation: 100,
                  exposure: 0,
                  temperature: 0,
                  tint: 0,
                  vignette: 0,
                  blur: 0,
                  isPIP: true,
                  pipX: 65,
                  pipY: 20,
                  pipScale: 0.8,
                  blendMode: 'screen'
                };
                onUpdateProject({
                  ...project,
                  clips: [...project.clips.filter(c => !c.isPIP), samplePip]
                });
              }}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200"
            >
              Use Neon Stock PIP
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-zinc-400">PIP Blend Mode:</span>
            {(['normal', 'screen', 'multiply', 'overlay'] as const).map((b) => (
              <button
                key={b}
                onClick={() => {
                  setPipBlend(b);
                  const pip = project.clips.find(c => c.isPIP);
                  if (pip) {
                    onUpdateClip({ ...pip, blendMode: b });
                  }
                }}
                className={`px-2.5 py-1 rounded capitalize ${
                  pipBlend === b ? 'bg-pink-500 text-white' : 'bg-white/5 text-zinc-400'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. TEXT SYSTEM */}
      {activeTool === 'text' && (
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Enter overlay text..."
              value={newTextContent}
              onChange={(e) => setNewTextContent(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-pink-500/30 text-white focus:outline-none focus:border-pink-500"
            />
            <button
              onClick={handleAddText}
              className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Text
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5">
            {/* Font Selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">Font:</span>
              {['Space Grotesk', 'Orbitron', 'Syncopate'].map((font) => (
                <button
                  key={font}
                  onClick={() => setSelectedFont(font)}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    selectedFont === font ? 'bg-pink-500 text-white' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {font}
                </button>
              ))}
            </div>

            {/* Animation Selection */}
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-400">Animation:</span>
              {(['typewriter', 'pop', 'fade', 'glitch'] as const).map((anim) => (
                <button
                  key={anim}
                  onClick={() => setTextAnimation(anim)}
                  className={`px-2 py-0.5 rounded text-[11px] capitalize ${
                    textAnimation === anim ? 'bg-pink-500 text-white' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {anim}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. FILTERS & COLOR ADJUSTMENTS */}
      {(activeTool === 'filter' || activeTool === 'adjust') && selectedClip && (
        <div className="space-y-4">
          {/* Presets Horizontal Ribbon */}
          <div>
            <span className="text-zinc-400 block mb-1">Color Grade Presets:</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {FILTER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onUpdateClip({
                    ...selectedClip,
                    filterPreset: preset.name,
                    brightness: preset.brightness,
                    contrast: preset.contrast,
                    saturation: preset.saturation
                  })}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-[11px] font-semibold border ${
                    selectedClip.filterPreset === preset.name
                      ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                      : 'bg-white/5 text-zinc-300 border-white/10 hover:border-pink-500/40'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <div className="flex justify-between text-zinc-400 mb-0.5">
                <span>Brightness</span>
                <span className="text-pink-300">{selectedClip.brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={selectedClip.brightness}
                onChange={(e) => onUpdateClip({ ...selectedClip, brightness: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 mb-0.5">
                <span>Contrast</span>
                <span className="text-pink-300">{selectedClip.contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={selectedClip.contrast}
                onChange={(e) => onUpdateClip({ ...selectedClip, contrast: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 mb-0.5">
                <span>Saturation</span>
                <span className="text-pink-300">{selectedClip.saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={selectedClip.saturation}
                onChange={(e) => onUpdateClip({ ...selectedClip, saturation: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 mb-0.5">
                <span>Vignette</span>
                <span className="text-pink-300">{selectedClip.vignette}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={selectedClip.vignette}
                onChange={(e) => onUpdateClip({ ...selectedClip, vignette: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. EFFECTS */}
      {activeTool === 'effects' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-zinc-300 font-medium">Click an effect to apply to the selected video/photo clip:</p>
            {selectedClip?.effect && (
              <button
                type="button"
                onClick={() => {
                  if (selectedClip) onUpdateClip({ ...selectedClip, effect: undefined });
                }}
                className="text-[11px] text-pink-400 hover:text-pink-300 font-semibold cursor-pointer"
              >
                Clear Effect
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {['None', 'Glitch', 'RGB Split', 'Glow', 'VHS 80s', 'Film Grain', 'Lens Flare', 'Strobe Flash', 'Cyberpunk', 'Prism', 'Zoom Blur', 'Invert', 'Mirror'].map((eff) => {
              const isSelected = eff === 'None' ? !selectedClip?.effect : selectedClip?.effect === eff;
              return (
                <button
                  key={eff}
                  type="button"
                  onClick={() => {
                    const newEff = eff === 'None' ? undefined : eff;
                    if (selectedClip) {
                      onUpdateClip({ ...selectedClip, effect: newEff });
                    }
                    if (newEff && onTriggerEffect) {
                      onTriggerEffect(newEff);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.6)]'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10 hover:border-pink-500/30'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>{eff}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. CHROMA KEY */}
      {activeTool === 'chroma' && selectedClip && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-medium">Chroma Key / Green Screen Removal</span>
            <button
              onClick={() => onUpdateClip({ ...selectedClip, chromaKey: !selectedClip.chromaKey })}
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                selectedClip.chromaKey
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/10 text-zinc-400'
              }`}
            >
              {selectedClip.chromaKey ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-zinc-400">Key Color:</span>
            {['#00ff00', '#0000ff', '#ff00ff'].map((col) => (
              <div
                key={col}
                className="w-6 h-6 rounded-full border-2 border-white/40 cursor-pointer"
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>
      )}

      {/* 8. MOTION TRACKING */}
      {activeTool === 'tracking' && (
        <div className="space-y-3">
          <p className="text-zinc-400">
            Select a subject or object to track its trajectory across all frames:
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartTracking}
              disabled={isTracking}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>{isTracking ? `Tracking Neural Paths (${trackingProgress}%)...` : 'Start AI Motion Tracking'}</span>
            </button>
          </div>

          {isTracking && (
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-pink-500 transition-all duration-200"
                style={{ width: `${trackingProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 9. AI STUDIO */}
      {activeTool === 'ai' && (
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Wand2 className="w-4 h-4 text-pink-400" />
              NoviCut AI Auto Director & Smart Edit
            </span>
            <p className="text-[11px] text-zinc-400">
              Enter your vision. The AI model will calculate beat cuts, cinematic filters, and kinetic captions.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-black/50 border border-pink-500/40 text-white focus:outline-none focus:border-pink-500 text-xs"
            />
            <div className="flex gap-2">
              {(['Cyberpunk', 'Cinematic', 'Trending', 'Aesthetic'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setAiStyle(style)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold ${
                    aiStyle === style ? 'bg-pink-500 text-white' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
            <button
              onClick={handleRunAiAutoEdit}
              disabled={isGeneratingAi}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:brightness-110 text-white font-bold tracking-wide shadow-[0_0_15px_rgba(236,72,153,0.5)] whitespace-nowrap cursor-pointer"
            >
              {isGeneratingAi ? "Synthesizing..." : "Generate Auto Edit"}
            </button>
          </div>

          {aiGeneratedSuccess && (
            <div className="p-2.5 rounded-lg bg-pink-950/40 border border-pink-500/40 text-pink-300 font-medium">
              ✨ {aiGeneratedSuccess}
            </div>
          )}
        </div>
      )}

      {/* 10. DRAW TOOL */}
      {activeTool === 'draw' && (
        <div className="space-y-3">
          <p className="text-zinc-400">
            Draw directly on top of the video canvas with glowing cyber pens:
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSetDrawMode && onSetDrawMode(true)}
              className="px-3.5 py-1.5 rounded-lg bg-pink-500 text-white font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <PenTool className="w-4 h-4" />
              <span>Enable Draw Mode</span>
            </button>
            <span className="text-xs text-pink-300 font-mono">
              (Use your mouse or finger to doodle on the video screen above)
            </span>
          </div>
        </div>
      )}

      {/* 11. CANVAS ASPECT RATIO */}
      {activeTool === 'canvas' && (
        <div className="space-y-3">
          <span className="text-zinc-400 block mb-1">Select Canvas Aspect Ratio:</span>
          <div className="flex items-center gap-2">
            {(['9:16', '16:9', '1:1', '4:5', '4:3'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => handleSetRatio(ratio)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs border ${
                  project.aspectRatio === ratio
                    ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_12px_#ec4899]'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:border-pink-500/40'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 12. MORE TOOLS LINK */}
      {activeTool === 'more' && (
        <div className="flex items-center justify-between">
          <span className="text-zinc-300">Looking for all 120+ advanced editing tools?</span>
          <button
            onClick={onOpenMoreTools}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold"
          >
            Open More Tools Screen
          </button>
        </div>
      )}

      {/* MUSIC / AUDIO TOOL SHORTCUT */}
      {(activeTool === 'music' || activeTool === 'voice' || activeTool === 'audio') && (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-semibold block">Open Audio & Music Studio</span>
            <span className="text-[11px] text-zinc-400">Choose from royalty-free library, import from device gallery, or record voiceover</span>
          </div>
          <button
            onClick={onOpenMusicModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer"
          >
            Launch Music Studio
          </button>
        </div>
      )}

      {/* 13. VOLUME & AUDIO LEVELS */}
      {activeTool === 'volume' && selectedClip && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-pink-400" />
              Clip Volume Level: {selectedClip.volume || 100}%
            </span>
            <button
              onClick={() => onUpdateClip({ ...selectedClip, volume: (selectedClip.volume ?? 100) === 0 ? 100 : 0 })}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 ${
                (selectedClip.volume ?? 100) === 0 ? 'bg-red-500/30 text-red-300 border border-red-500/50' : 'bg-white/10 text-zinc-300'
              }`}
            >
              {(selectedClip.volume ?? 100) === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{(selectedClip.volume ?? 100) === 0 ? 'Unmute' : 'Mute'}</span>
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={selectedClip.volume ?? 100}
            onChange={(e) => onUpdateClip({ ...selectedClip, volume: Number(e.target.value) })}
            className="w-full accent-pink-500"
          />
          <div className="flex items-center gap-2 pt-1">
            <span className="text-zinc-400 text-[11px]">Presets:</span>
            {[0, 50, 100, 150, 200].map((vol) => (
              <button
                key={vol}
                onClick={() => onUpdateClip({ ...selectedClip, volume: vol })}
                className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px]"
              >
                {vol}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 14. STICKERS */}
      {activeTool === 'sticker' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-pink-400" />
              Add Cyber Stickers & Emojis
            </span>
            <span className="text-[10px] text-zinc-400">Tap to place at current playhead</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {['🔥', '✨', '💖', '🎬', '⚡', '👑', '🚀', '💫', '🎯', '💯', '🌟', '💥'].map((stk) => (
              <button
                key={stk}
                onClick={() => {
                  const newSticker: StickerOverlay = {
                    id: `sticker-${Date.now()}`,
                    stickerUrl: stk,
                    startTime: currentTime,
                    duration: 4,
                    x: 50 + (Math.random() * 20 - 10),
                    y: 50 + (Math.random() * 20 - 10),
                    scale: 1.2,
                    rotation: 0
                  };
                  onUpdateProject({
                    ...project,
                    stickers: [...(project.stickers || []), newSticker]
                  });
                }}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 text-xl flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              >
                {stk}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 15. CAPTIONS */}
      {activeTool === 'captions' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
              <Type className="w-4 h-4 text-pink-400" />
              AI Kinetic Subtitles & Captions
            </span>
            <span className="text-[10px] text-pink-400 font-mono">Real-Time Subtitle Track</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const autoSubs: TextOverlay = {
                  id: `sub-${Date.now()}`,
                  text: '✨ Creating Magic with NoviCut Pro',
                  startTime: currentTime,
                  duration: 3.5,
                  x: 50,
                  y: 82,
                  fontSize: 22,
                  fontFamily: 'Orbitron',
                  color: '#facc15',
                  hasGlow: true,
                  hasOutline: true,
                  animation: 'pop'
                };
                onUpdateProject({
                  ...project,
                  texts: [...project.texts, autoSubs]
                });
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Wand2 className="w-4 h-4" />
              <span>Generate Beat-Synced Caption</span>
            </button>
          </div>
        </div>
      )}

      {/* 16. ANIMATION */}
      {activeTool === 'animation' && selectedClip && (
        <div className="space-y-2">
          <span className="text-zinc-400 block">Clip Entry & Motion Animation:</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['None', 'Zoom In', 'Fade In', 'Slide Up', 'Cyber Glitch', 'Spin Burst', 'Pulse'].map((anim) => (
              <button
                key={anim}
                onClick={() => onUpdateClip({ ...selectedClip, animation: anim })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap border ${
                  selectedClip.animation === anim
                    ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_10px_#ec4899]'
                    : 'bg-white/5 text-zinc-300 border-white/10 hover:border-pink-500/40'
                }`}
              >
                {anim}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 17. BACKGROUND */}
      {activeTool === 'background' && (
        <div className="space-y-2">
          <span className="text-zinc-400 block">Studio Canvas Background:</span>
          <div className="flex items-center gap-2">
            {[
              { label: 'Deep Cyberpunk', bg: '#06010d' },
              { label: 'Neon Magenta', bg: '#3b0764' },
              { label: 'Dark Violet', bg: '#170529' },
              { label: 'Kaleidoscope Core', bg: 'kaleidoscope' }
            ].map((theme) => (
              <button
                key={theme.label}
                onClick={() => {
                  if (theme.bg === 'kaleidoscope') {
                    // add background kaleidoscope
                    if (selectedClip) {
                      onUpdateClip({ ...selectedClip, filterPreset: 'Neon' });
                    }
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-pink-500/20 border border-white/10 text-zinc-300 text-xs flex items-center gap-1.5"
              >
                <span className="w-3 h-3 rounded-full border border-white/30" style={{ backgroundColor: theme.bg !== 'kaleidoscope' ? theme.bg : '#ec4899' }} />
                <span>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 18. FREEZE FRAME */}
      {activeTool === 'freeze' && selectedClip && (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-semibold block flex items-center gap-1.5">
              <Snowflake className="w-4 h-4 text-cyan-400" />
              Freeze Frame
            </span>
            <span className="text-[11px] text-zinc-400">Freeze video at current frame ({currentTime.toFixed(1)}s) for 2 seconds</span>
          </div>
          <button
            onClick={() => {
              const freezeClip: VideoClip = {
                ...selectedClip,
                id: `freeze-${Date.now()}`,
                title: `${selectedClip.title} (Freeze)`,
                type: 'photo',
                duration: 2,
                startTime: currentTime,
                trimStart: 0,
                trimEnd: 2
              };
              onUpdateProject({
                ...project,
                duration: project.duration + 2,
                clips: [...project.clips, freezeClip]
              });
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer shadow-md"
          >
            Insert 2s Freeze
          </button>
        </div>
      )}

      {/* 19. REVERSE */}
      {activeTool === 'reverse' && selectedClip && (
        <div className="flex items-center justify-between">
          <div>
            <span className="text-white font-semibold block flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-pink-400" />
              Reverse Playback
            </span>
            <span className="text-[11px] text-zinc-400">Plays video frames backwards from end to start</span>
          </div>
          <button
            onClick={() => {
              onUpdateClip({
                ...selectedClip,
                isReversed: !selectedClip.isReversed
              });
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedClip.isReversed ? 'bg-pink-500 text-white shadow-[0_0_15px_#ec4899]' : 'bg-white/10 text-zinc-300'
            }`}
          >
            {selectedClip.isReversed ? 'Reversed (Active)' : 'Enable Reverse'}
          </button>
        </div>
      )}

    </div>
  );
};
