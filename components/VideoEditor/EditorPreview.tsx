/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, 
  Sparkles, Zap, Shield, Film, AlertCircle, MonitorPlay,
  Tv, Eye, Radio, RefreshCw
} from 'lucide-react';
import { AspectRatio, Project, VideoClip, TextOverlay, StickerOverlay } from '../../types';

interface EditorPreviewProps {
  project: Project;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  activeClip: VideoClip | null;
  selectedTextId: string | null;
  onSelectText: (id: string | null) => void;
  onUpdateTextPosition?: (id: string, x: number, y: number) => void;
  activeEffectName?: string;
  isDrawMode?: boolean;
  drawingColor?: string;
  drawingSize?: number;
  onAddDrawingPoint?: (point: { x: number; y: number }) => void;
}

export const EditorPreview: React.FC<EditorPreviewProps> = ({
  project,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  activeClip,
  selectedTextId,
  onSelectText,
  onUpdateTextPosition,
  activeEffectName,
  isDrawMode = false,
  drawingColor = '#ec4899',
  drawingSize = 4,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPaths, setDrawPaths] = useState<{ points: { x: number; y: number }[]; color: string; size: number }[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Find clip at current playhead
  const currentClip = project.clips.find(
    c => currentTime >= c.startTime && currentTime <= (c.startTime + (c.trimEnd - c.trimStart))
  ) || project.clips[0] || null;

  // Find PIP clip if any
  const pipClip = project.clips.find(c => c.isPIP);

  // Check if current clip is a video format - strictly distinguish photos from videos
  const isVideoClip = Boolean(
    currentClip && (
      currentClip.type === 'video' ||
      (!currentClip.type && (
        currentClip.url.endsWith('.mp4') ||
        currentClip.url.endsWith('.webm') ||
        currentClip.url.endsWith('.mov') ||
        (currentClip.url.startsWith('blob:') && !currentClip.url.includes('image'))
      ))
    ) && currentClip.type !== 'photo'
  );

  // Active texts at current time
  const visibleTexts = project.texts.filter(
    t => currentTime >= t.startTime && currentTime <= (t.startTime + t.duration)
  );

  // Active stickers at current time
  const visibleStickers = project.stickers.filter(
    s => currentTime >= s.startTime && currentTime <= (s.startTime + s.duration)
  );

  // Active caption
  const currentCaption = project.autoCaptions?.find(
    c => currentTime >= c.time && currentTime <= c.time + 3.0
  );

  // Format timecode
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
  };

  // Compute active effect (from tool interaction or stored on clip)
  const clipToRender = activeClip || currentClip;
  const effectiveEffect = activeEffectName || clipToRender?.effect;

  // Compute CSS filter string for active clip
  const exposureVal = 100 + (clipToRender?.exposure ?? 0);
  const tintRotate = (clipToRender?.tint ?? 0) * 1.8;
  const tempSepia = (clipToRender?.temperature ?? 0) > 0 ? (clipToRender?.temperature ?? 0) * 0.4 : 0;

  const filterString = clipToRender ? `
    brightness(${(clipToRender.brightness ?? 100) * (exposureVal / 100)}%)
    contrast(${clipToRender.contrast ?? 100}%)
    saturate(${clipToRender.saturation ?? 100}%)
    blur(${clipToRender.blur ?? 0}px)
    ${tempSepia > 0 ? `sepia(${tempSepia}%)` : ''}
    ${tintRotate !== 0 ? `hue-rotate(${tintRotate}deg)` : ''}
    ${clipToRender.filterPreset === 'Cyberpunk' || effectiveEffect === 'Cyberpunk' ? 'hue-rotate(300deg) contrast(125%) saturate(145%)' : ''}
    ${clipToRender.filterPreset === 'Neon Magenta' ? 'hue-rotate(320deg) saturate(150%)' : ''}
    ${clipToRender.filterPreset === 'Cinematic' ? 'contrast(120%) saturate(120%)' : ''}
    ${clipToRender.filterPreset === 'Vintage' || effectiveEffect === 'Sepia' ? 'sepia(50%) contrast(100%) saturate(90%)' : ''}
    ${clipToRender.filterPreset === 'Retro' ? 'sepia(25%) contrast(120%) saturate(110%)' : ''}
    ${clipToRender.filterPreset === 'Noir' || effectiveEffect === 'Noir' ? 'grayscale(100%) contrast(140%)' : ''}
    ${effectiveEffect === 'Invert' ? 'invert(100%)' : ''}
  `.replace(/\s+/g, ' ').trim() : 'none';

  const isMirrored = effectiveEffect === 'Mirror';
  const transformString = clipToRender ? `scale(${clipToRender.scale || 1}) rotate(${clipToRender.rotation || 0}deg) ${isMirrored ? 'scaleX(-1)' : ''}` : 'none';

  // Video Element Playback & Time Synchronization
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideoClip || !currentClip) return;

    // Calculate local time in the clip
    const clipOffset = Math.max(0, currentTime - currentClip.startTime);
    const targetVideoTime = currentClip.trimStart + clipOffset;

    // Sync current time if drift exceeds 0.25 seconds
    if (Math.abs(video.currentTime - targetVideoTime) > 0.25) {
      video.currentTime = targetVideoTime;
    }

    // Sync playback rate with clip speed
    video.playbackRate = currentClip.speed || 1;

    // Sync volume & mute
    video.volume = isMuted ? 0 : (currentClip.volume ?? 100) / 100;
    video.muted = isMuted;

    // Sync play/pause
    if (isPlaying) {
      video.play().catch(() => {
        // Autoplay may need user gesture
      });
    } else {
      video.pause();
    }
  }, [isPlaying, currentTime, currentClip, isVideoClip, isMuted]);

  // PIP Video Playback Sync
  useEffect(() => {
    const pipVideo = pipVideoRef.current;
    if (!pipVideo || !pipClip) return;
    pipVideo.muted = true; // PiP video defaults to muted background
    if (isPlaying) {
      pipVideo.play().catch(() => {});
    } else {
      pipVideo.pause();
    }
  }, [isPlaying, pipClip]);

  // Aspect ratio class mapping
  const aspectClass = 
    project.aspectRatio === '9:16' ? 'aspect-[9/16] h-[380px] sm:h-[440px] md:h-[480px]' :
    project.aspectRatio === '16:9' ? 'aspect-[16/9] w-full max-w-[640px]' :
    project.aspectRatio === '1:1' ? 'aspect-square h-[360px] sm:h-[420px]' :
    project.aspectRatio === '4:5' ? 'aspect-[4/5] h-[380px] sm:h-[440px]' :
    'aspect-[4/3] h-[360px] sm:h-[420px]';

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Drawing Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawMode) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setDrawPaths(prev => [
      ...prev,
      { points: [{ x, y }], color: drawingColor, size: drawingSize }
    ]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDrawMode) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawPaths(prev => {
      const copy = [...prev];
      const currentStroke = copy[copy.length - 1];
      if (currentStroke) {
        currentStroke.points.push({ x, y });
      }
      return copy;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Re-render drawings on canvas
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaths.forEach(stroke => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [drawPaths]);

  return (
    <div className="flex flex-col items-center justify-center w-full relative select-none py-1">
      
      {/* 1. TOP VIDEO MONITOR HEADER BAR */}
      <div className="w-full max-w-[650px] flex items-center justify-between mb-2 px-3 py-1.5 rounded-xl bg-[#140827]/90 border border-pink-500/30 text-white text-xs backdrop-blur-md shadow-md">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-pink-400'}`} />
          <span className="font-heading font-bold text-[11px] tracking-wider text-pink-300 uppercase flex items-center gap-1.5">
            <MonitorPlay className="w-3.5 h-3.5 text-pink-400" />
            <span className="truncate max-w-[130px] sm:max-w-[200px]">
              {currentClip ? currentClip.title : 'No Video'}
            </span>
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 font-mono border border-pink-500/40">
            {isVideoClip ? 'HD MP4' : 'IMAGE'}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-pink-400 font-bold">{formatTime(currentTime)}</span>
          <span className="text-zinc-500">/</span>
          <span className="text-zinc-400">{formatTime(project.duration)}</span>
          
          <div className="hidden sm:flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 text-[10px]">
            <span>1080p 60FPS</span>
          </div>

          <button
            onClick={toggleFullscreen}
            title="Fullscreen View"
            className="ml-1 w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. REAL-TIME VIDEO CANVAS PLAYER */}
      <div 
        ref={containerRef}
        onClick={onTogglePlay}
        className={`relative ${aspectClass} bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.9)] border-2 border-pink-500/40 flex items-center justify-center cursor-pointer group transition-all duration-300`}
      >
        {/* MEDIA DISPLAY: Real HTML5 Video or Photo */}
        {currentClip ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
            {isVideoClip ? (
              <video
                key={`vid-${currentClip.id}-${currentClip.url}`}
                ref={videoRef}
                src={currentClip.url}
                playsInline
                preload="auto"
                loop
                muted={isMuted}
                onLoadedMetadata={() => setIsVideoLoaded(true)}
                onLoadedData={() => setIsVideoLoaded(true)}
                onCanPlay={() => setIsVideoLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-200 ${
                  clipToRender?.animation === 'pulse' ? 'animate-pulse' :
                  clipToRender?.animation === 'bounce' ? 'animate-bounce' : ''
                }`}
                style={{
                  filter: filterString,
                  transform: transformString,
                  opacity: (clipToRender?.opacity ?? 100) / 100,
                }}
              />
            ) : (
              <img
                key={`img-${currentClip.id}-${currentClip.url}`}
                src={currentClip.url}
                alt={currentClip.title}
                className={`w-full h-full object-cover transition-all duration-300 ${
                  clipToRender?.animation === 'pulse' ? 'animate-pulse' :
                  clipToRender?.animation === 'bounce' ? 'animate-bounce' : ''
                } ${
                  isPlaying ? 'scale-105 transition-transform duration-1000' : ''
                }`}
                style={{
                  filter: filterString,
                  transform: transformString,
                  opacity: (clipToRender?.opacity ?? 100) / 100,
                }}
              />
            )}

            {/* Vignette Overlay */}
            {(clipToRender?.vignette ?? 0) > 0 && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, transparent 30%, rgba(0,0,0,${(clipToRender?.vignette ?? 0) / 100}) 100%)`
                }}
              />
            )}
          </div>
        ) : (
          <div className="text-center p-6 space-y-3 z-10">
            <Film className="w-12 h-12 text-pink-400 mx-auto opacity-70 animate-pulse" />
            <p className="text-sm font-semibold text-white">No media on monitor</p>
            <p className="text-xs text-zinc-400">Tap below or upload video/photo to start editing</p>
          </div>
        )}

        {/* Live Effects Overlay (Glitch, RGB Split, Neon Glow, VHS, Film Grain, Lens Flare, Strobe, Prism, Zoom Blur) */}
        {effectiveEffect && (
          <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
            {effectiveEffect === 'Glitch' && (
              <div className="absolute inset-0 bg-pink-500/15 mix-blend-color-dodge animate-pulse">
                <div className="w-full h-full opacity-50 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.4)_2px,rgba(255,255,255,0.4)_4px)]" />
                <div className="absolute inset-0 border-y-4 border-pink-500/50 animate-ping" />
              </div>
            )}
            {effectiveEffect === 'RGB Split' && (
              <div className="absolute inset-0 border-4 border-cyan-400/50 translate-x-2 -translate-y-1 mix-blend-screen shadow-[inset_0_0_40px_rgba(236,72,153,0.5)]" />
            )}
            {effectiveEffect === 'Glow' && (
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(236,72,153,0.85)] border-2 border-pink-400/60" />
            )}
            {(effectiveEffect === 'VHS 80s' || effectiveEffect === 'VHS') && (
              <div className="absolute inset-0 bg-black/15 mix-blend-overlay">
                <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.2)_3px,rgba(255,255,255,0.2)_6px)]" />
                <div className="absolute top-4 left-4 text-emerald-400 font-mono text-xs drop-shadow-[0_0_6px_#10b981] font-bold">
                  PLAY ▶ SP 0:00:{Math.floor(currentTime)}
                </div>
                <div className="absolute bottom-4 right-4 text-white/80 font-mono text-[10px]">
                  AUTO-TRACKING ●
                </div>
              </div>
            )}
            {effectiveEffect === 'Film Grain' && (
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:8px_8px] mix-blend-overlay" />
            )}
            {effectiveEffect === 'Lens Flare' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-1 bg-cyan-400 blur-sm shadow-[0_0_30px_#22d3ee] transform -rotate-12" />
                <div className="w-48 h-48 rounded-full bg-pink-500/30 blur-2xl absolute" />
              </div>
            )}
            {effectiveEffect === 'Strobe Flash' && (
              <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
            )}
            {effectiveEffect === 'Prism' && (
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-green-500/10 to-blue-500/10 mix-blend-color-dodge border-2 border-fuchsia-400/40" />
            )}
            {effectiveEffect === 'Zoom Blur' && (
              <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] border border-pink-500/30" />
            )}
          </div>
        )}

        {/* Picture-in-Picture (PIP) Layer */}
        {pipClip && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute z-20 cursor-move border-2 border-pink-400/70 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all"
            style={{
              left: `${pipClip.pipX ?? 60}%`,
              top: `${pipClip.pipY ?? 15}%`,
              width: `${(pipClip.pipScale ?? 0.8) * 38}%`,
              aspectRatio: '16/9',
              mixBlendMode: pipClip.blendMode ?? 'normal',
              opacity: (pipClip.opacity ?? 100) / 100,
            }}
          >
            {pipClip.type === 'video' ? (
              <video
                ref={pipVideoRef}
                src={pipClip.url}
                playsInline
                loop
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <img 
                src={pipClip.url} 
                alt="PIP Media" 
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-pink-300 font-mono font-bold">
              PIP
            </div>
          </div>
        )}

        {/* Text Overlays */}
        {visibleTexts.map((textItem) => {
          const isSelected = selectedTextId === textItem.id;
          return (
            <div
              key={textItem.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectText(textItem.id);
              }}
              style={{
                left: `${textItem.x}%`,
                top: `${textItem.y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${textItem.fontSize}px`,
                fontFamily: textItem.fontFamily,
                color: textItem.color,
                background: textItem.hasBackground ? textItem.bgColor || 'rgba(0,0,0,0.6)' : 'transparent',
              }}
              className={`absolute z-25 px-3 py-1 rounded cursor-pointer whitespace-nowrap select-none transition-all font-bold ${
                isSelected ? 'ring-2 ring-pink-500 shadow-[0_0_15px_#ec4899]' : ''
              } ${textItem.hasGlow ? 'drop-shadow-[0_0_12px_rgba(236,72,153,0.9)]' : ''} ${
                textItem.hasOutline ? '[-webkit-text-stroke:1px_#ffffff]' : ''
              }`}
            >
              {textItem.text}
            </div>
          );
        })}

        {/* Sticker Overlays */}
        {visibleStickers.map((stk) => (
          <div
            key={stk.id}
            style={{
              left: `${stk.x}%`,
              top: `${stk.y}%`,
              transform: `translate(-50%, -50%) scale(${stk.scale}) rotate(${stk.rotation}deg)`
            }}
            className="absolute z-25 text-3xl select-none cursor-pointer filter drop-shadow-md"
          >
            {stk.emoji}
          </div>
        ))}

        {/* Auto Captions Banner */}
        {currentCaption && (
          <div className="absolute bottom-6 left-4 right-4 z-28 text-center pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <span className="inline-block px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs md:text-sm font-bold tracking-wide border border-pink-500/50 shadow-[0_0_25px_rgba(236,72,153,0.5)]">
              {currentCaption.text.split(' ').map((word, wIdx) => {
                const isHighlight = currentCaption.highlight && word.toLowerCase().includes(currentCaption.highlight.toLowerCase());
                return (
                  <span 
                    key={wIdx} 
                    className={isHighlight ? 'text-pink-400 font-extrabold underline decoration-pink-500 underline-offset-2' : ''}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </span>
          </div>
        )}

        {/* Draw Overlay Canvas */}
        <canvas
          ref={drawCanvasRef}
          width={400}
          height={600}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={(e) => e.stopPropagation()}
          className={`absolute inset-0 w-full h-full z-30 ${isDrawMode ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
        />

        {/* Playhead Center Action Indicator when paused */}
        {!isPlaying && (
          <div className="absolute z-35 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-pink-500/90 text-white flex items-center justify-center shadow-[0_0_30px_#ec4899] backdrop-blur-sm transform transition-transform group-hover:scale-110">
              <Play className="w-7 h-7 ml-1" />
            </div>
            <span className="mt-2 text-[10px] font-mono tracking-widest uppercase text-white/90 bg-black/60 px-2 py-0.5 rounded-full border border-pink-500/40">
              Click to Play Video
            </span>
          </div>
        )}

        {/* Top Watermark / Pro Indicator */}
        <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-pink-500/30 text-[10px] text-pink-300 font-mono">
          <Sparkles className="w-3 h-3 text-pink-400" />
          <span>NOVICUT REAL-TIME</span>
        </div>
      </div>

      {/* 3. PLAYBACK SCRUBBER & CONTROL DOCK */}
      <div className="w-full max-w-[650px] flex items-center justify-between mt-2.5 px-4 py-2 rounded-xl bg-[#110722]/95 border border-pink-500/20 backdrop-blur-md text-white text-xs shadow-lg">
        
        {/* Play/Pause & Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all cursor-pointer active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={() => onSeek(Math.max(0, currentTime - 1))}
            title="Rewind 1 sec"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white font-mono text-[11px] cursor-pointer"
          >
            -1s
          </button>

          <button
            onClick={() => onSeek(Math.min(project.duration, currentTime + 1))}
            title="Forward 1 sec"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white font-mono text-[11px] cursor-pointer"
          >
            +1s
          </button>

          <button
            onClick={() => onSeek(0)}
            title="Restart from beginning"
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center Progress Scrub Bar */}
        <div className="flex-1 mx-4 flex items-center gap-2">
          <input
            type="range"
            min="0"
            max={project.duration}
            step="0.05"
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full accent-pink-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "Unmute" : "Mute"}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-pink-300" />}
          </button>

          <div className="px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-mono text-[11px] font-bold border border-pink-500/30">
            {project.aspectRatio}
          </div>
        </div>

      </div>

    </div>
  );
};
