/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Lock, Unlock, Eye, EyeOff, Volume2, VolumeX, 
  ZoomIn, ZoomOut, Scissors, Trash2, Copy, Plus, Zap, Music, Video, Type, Sparkles,
  Film, FolderPlus, SlidersHorizontal
} from 'lucide-react';
import { Project, VideoClip, AudioItem } from '../../types';

interface EditorTimelineProps {
  project: Project;
  currentTime: number;
  onSeek: (time: number) => void;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onSplitClip: () => void;
  onDeleteClip: () => void;
  onDuplicateClip: () => void;
  onAddMedia: () => void;
  onOpenClipOptions?: () => void;
  onOpenGallery?: () => void;
  zoomLevel: number;
  onZoomChange: (zoom: number) => void;
}

export const EditorTimeline: React.FC<EditorTimelineProps> = ({
  project,
  currentTime,
  onSeek,
  selectedClipId,
  onSelectClip,
  onSplitClip,
  onDeleteClip,
  onDuplicateClip,
  onAddMedia,
  onOpenClipOptions,
  onOpenGallery,
  zoomLevel,
  onZoomChange
}) => {
  const rulerContainerRef = useRef<HTMLDivElement | null>(null);

  // Pixels per second based on zoom level
  const pxPerSec = 40 * zoomLevel;
  const timelineWidth = Math.max(800, project.duration * pxPerSec + 100);

  const selectedClip = project.clips.find(c => c.id === selectedClipId);

  // Ruler tick marks (every second or half second)
  const totalSeconds = Math.ceil(project.duration) + 2;
  const ticks = Array.from({ length: totalSeconds });

  // Handle seeking via clicking or dragging on ruler/timeline
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerContainerRef.current) return;
    const rect = rulerContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + rulerContainerRef.current.scrollLeft;
    const targetTime = Math.max(0, Math.min(project.duration, clickX / pxPerSec));
    onSeek(targetTime);
  };

  const playheadLeft = currentTime * pxPerSec;

  return (
    <div className="w-full bg-[#0a0314] border-t border-pink-500/20 flex flex-col select-none text-white">
      
      {/* Timeline Quick Tools Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#0e051c] text-xs">
        
        {/* Left: Action Buttons (Clip Options, Delete, Split, Duplicate, Gallery, Add Media) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          
          {/* Dynamic Clip Tab & Delete Button when clip is selected */}
          {selectedClip ? (
            <>
              <button
                type="button"
                onClick={onOpenClipOptions}
                title="Open editing options for selected clip"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-bold border border-pink-400/60 shadow-[0_0_12px_rgba(236,72,153,0.5)] transition-all cursor-pointer animate-in fade-in active:scale-95"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Clip</span>
              </button>

              <button
                type="button"
                onClick={onDeleteClip}
                title="Delete selected clip from timeline"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold border border-rose-400/60 shadow-[0_0_12px_rgba(225,29,72,0.5)] transition-all cursor-pointer animate-in fade-in active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </>
          ) : (
            <button
              onClick={onDeleteClip}
              title="Delete selected clip (select a clip first)"
              disabled={!selectedClipId}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 text-zinc-500 border border-white/5 opacity-50 cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSplitClip}
            title="Split clip at playhead"
            disabled={!selectedClip}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              selectedClip 
                ? 'bg-white/5 hover:bg-pink-500/20 hover:text-pink-300 text-zinc-300 border border-white/10 cursor-pointer' 
                : 'bg-white/5 text-zinc-500 border border-white/5 opacity-50 cursor-not-allowed'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>

          {selectedClip && (
            <button
              type="button"
              onClick={onDuplicateClip}
              title="Duplicate selected clip"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 text-zinc-300 border border-white/10 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Duplicate</span>
            </button>
          )}

          {/* Gallery Button on Side of Timeline */}
          <button
            type="button"
            onClick={onOpenGallery || onAddMedia}
            title="Open device gallery to select multiple photos or videos"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 text-purple-200 border border-purple-500/40 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
            <span>Gallery</span>
          </button>

          <button
            type="button"
            onClick={onAddMedia}
            title="Add photos or videos"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-semibold shadow-[0_0_12px_rgba(236,72,153,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Media</span>
          </button>
        </div>

        {/* Right: Zoom Level Controls */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-400 font-mono">Zoom:</span>
          <button
            onClick={() => onZoomChange(Math.max(0.6, zoomLevel - 0.2))}
            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-pink-400 w-8 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(2.5, zoomLevel + 0.2))}
            className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Track Workspace with Header Columns and Timeline Ruler/Lanes */}
      <div className="flex w-full overflow-hidden h-52 md:h-60 relative">
        
        {/* Left Column: Track Headers */}
        <div className="w-24 md:w-32 flex-shrink-0 bg-[#0d0418] border-r border-white/10 flex flex-col z-20">
          
          {/* Header Spacer for Ruler */}
          <div className="h-6 border-b border-white/5 bg-[#090312] px-2 flex items-center text-[10px] text-zinc-500 font-mono">
            TRACKS
          </div>

          {/* Track Labels */}
          <div className="flex-1 overflow-hidden flex flex-col justify-between py-1 text-[11px] font-mono">
            
            {/* Track 1: VIDEO */}
            <div className="h-14 px-2 flex items-center justify-between border-b border-white/5 text-pink-300">
              <div className="flex items-center gap-1.5 truncate">
                <Video className="w-3.5 h-3.5 text-pink-400" />
                <span>VIDEO</span>
              </div>
              <Eye className="w-3 h-3 text-zinc-500 hover:text-white cursor-pointer" />
            </div>

            {/* Track 2: PIP & OVERLAY */}
            <div className="h-8 px-2 flex items-center justify-between border-b border-white/5 text-purple-300">
              <span className="truncate">PIP / FX</span>
              <Eye className="w-3 h-3 text-zinc-500 hover:text-white cursor-pointer" />
            </div>

            {/* Track 3: TEXT */}
            <div className="h-7 px-2 flex items-center justify-between border-b border-white/5 text-blue-300">
              <div className="flex items-center gap-1">
                <Type className="w-3 h-3 text-blue-400" />
                <span>TEXT</span>
              </div>
              <Eye className="w-3 h-3 text-zinc-500" />
            </div>

            {/* Track 4: AUDIO / MUSIC */}
            <div className="h-10 px-2 flex items-center justify-between text-emerald-300">
              <div className="flex items-center gap-1">
                <Music className="w-3 h-3 text-emerald-400" />
                <span>MUSIC</span>
              </div>
              <Volume2 className="w-3 h-3 text-zinc-500 hover:text-white cursor-pointer" />
            </div>

          </div>

        </div>

        {/* Right Scrollable Area: Ruler + Tracks + Playhead */}
        <div 
          ref={rulerContainerRef}
          onClick={handleTimelineClick}
          className="flex-1 overflow-x-auto relative cursor-pointer custom-scrollbar bg-[#080210]"
        >
          <div style={{ width: `${timelineWidth}px` }} className="relative h-full">

            {/* Time Ruler */}
            <div className="h-6 border-b border-white/10 bg-[#0c0417] relative flex items-center">
              {ticks.map((_, sec) => (
                <div
                  key={sec}
                  className="absolute top-0 bottom-0 border-l border-white/15 flex flex-col justify-between pl-1"
                  style={{ left: `${sec * pxPerSec}px` }}
                >
                  <span className="text-[9px] font-mono text-zinc-500">{sec}s</span>
                  <div className="w-px h-1.5 bg-white/20" />
                </div>
              ))}

              {/* Beat Markers (Neon yellow dots along ruler) */}
              {project.beatMarkers?.map((beat, bIdx) => (
                <div
                  key={bIdx}
                  title={`Beat sync: ${beat}s`}
                  className="absolute top-1 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15] transform -translate-x-1 z-10 animate-pulse"
                  style={{ left: `${beat * pxPerSec}px` }}
                />
              ))}
            </div>

            {/* Red / Neon Magenta Scrubbable Playhead */}
            <div 
              className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center"
              style={{ left: `${playheadLeft}px` }}
            >
              {/* Playhead Handle */}
              <div className="w-3.5 h-3.5 bg-gradient-to-b from-pink-500 to-rose-600 rounded-sm shadow-[0_0_10px_#ec4899] -translate-y-0.5" />
              {/* Playhead Needle Line */}
              <div className="w-0.5 flex-1 bg-pink-500 shadow-[0_0_8px_#ec4899]" />
            </div>

            {/* TRACK 1: VIDEO CLIPS */}
            <div className="h-14 border-b border-white/5 relative p-1 flex items-center">
              {project.clips.filter(c => !c.isPIP).map((clip) => {
                const isSelected = selectedClipId === clip.id;
                const clipDuration = clip.trimEnd - clip.trimStart;
                const clipWidth = clipDuration * pxPerSec;
                const clipLeft = clip.startTime * pxPerSec;

                return (
                  <div
                    key={clip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClip(clip.id);
                    }}
                    style={{
                      left: `${clipLeft}px`,
                      width: `${clipWidth}px`,
                    }}
                    className={`absolute h-12 rounded-lg overflow-hidden border transition-all cursor-pointer flex items-center px-2 text-xs font-semibold ${
                      isSelected
                        ? 'border-pink-500 bg-pink-950/60 shadow-[0_0_15px_rgba(236,72,153,0.4)] ring-2 ring-pink-500/50'
                        : 'border-white/10 bg-[#170b2e]/80 hover:border-pink-500/40'
                    }`}
                  >
                    {/* Thumbnail Preview strip */}
                    <div className="absolute inset-0 opacity-40 overflow-hidden pointer-events-none">
                      <img src={clip.thumbnail || clip.url} alt="" className="w-full h-full object-cover" />
                    </div>

                    <span className="relative z-10 text-white truncate max-w-[85%] drop-shadow-md">
                      {clip.title}
                    </span>

                    {/* Left & Right Trim Handles */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pink-500/40 hover:bg-pink-400 cursor-ew-resize" />
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-pink-500/40 hover:bg-pink-400 cursor-ew-resize" />
                  </div>
                );
              })}
            </div>

            {/* TRACK 2: PIP & EFFECT BLOCKS */}
            <div className="h-8 border-b border-white/5 relative p-0.5">
              {project.clips.filter(c => c.isPIP).map((pip) => {
                const pipWidth = (pip.trimEnd - pip.trimStart) * pxPerSec;
                return (
                  <div
                    key={pip.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClip(pip.id);
                    }}
                    style={{
                      left: `${pip.startTime * pxPerSec}px`,
                      width: `${pipWidth}px`,
                    }}
                    className="absolute h-7 rounded-md bg-purple-900/60 border border-purple-500/50 flex items-center px-2 text-[10px] text-purple-200 font-mono shadow-sm truncate"
                  >
                    PIP: {pip.title}
                  </div>
                );
              })}

              {project.effects.map((eff) => (
                <div
                  key={eff.id}
                  style={{
                    left: `${eff.startTime * pxPerSec}px`,
                    width: `${eff.duration * pxPerSec}px`,
                  }}
                  className="absolute h-7 rounded-md bg-rose-950/50 border border-rose-500/40 flex items-center px-2 text-[10px] text-rose-300 font-mono shadow-sm truncate"
                >
                  FX: {eff.name}
                </div>
              ))}
            </div>

            {/* TRACK 3: TEXT BLOCKS */}
            <div className="h-7 border-b border-white/5 relative p-0.5">
              {project.texts.map((txt) => (
                <div
                  key={txt.id}
                  style={{
                    left: `${txt.startTime * pxPerSec}px`,
                    width: `${txt.duration * pxPerSec}px`,
                  }}
                  className="absolute h-6 rounded bg-blue-950/60 border border-blue-500/50 flex items-center px-2 text-[10px] text-blue-200 font-sans font-medium truncate"
                >
                  T: {txt.text}
                </div>
              ))}
            </div>

            {/* TRACK 4: MUSIC & AUDIO */}
            <div className="h-10 relative p-1">
              {project.audioItems.map((aud) => (
                <div
                  key={aud.id}
                  style={{
                    left: `${aud.startTime * pxPerSec}px`,
                    width: `${aud.duration * pxPerSec}px`,
                  }}
                  className="absolute h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center px-2 text-xs text-emerald-300 font-mono shadow-sm overflow-hidden"
                >
                  <Music className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{aud.title}</span>
                  {/* Waveform graphic lines */}
                  <div className="absolute right-2 flex items-center gap-0.5 opacity-50 pointer-events-none">
                    <span className="w-0.5 h-3 bg-emerald-400" />
                    <span className="w-0.5 h-5 bg-emerald-400" />
                    <span className="w-0.5 h-2 bg-emerald-400" />
                    <span className="w-0.5 h-4 bg-emerald-400" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
