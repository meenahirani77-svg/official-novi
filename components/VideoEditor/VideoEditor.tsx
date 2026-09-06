/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Undo2, Redo2, Download, Save, 
  Sparkles, Check, ChevronDown, Layers, Upload, Plus,
  FolderPlus, Film
} from 'lucide-react';
import { 
  Project, VideoClip, TextOverlay, AspectRatio, 
  EditorToolId, AudioItem, PlanType 
} from '../../types';
import { EditorPreview } from './EditorPreview';
import { EditorTimeline } from './EditorTimeline';
import { EditorToolbar } from './EditorToolbar';
import { EditorToolPanels } from './EditorToolPanels';
import { GalleryDrawer } from './GalleryDrawer';
import { MusicModal } from '../MusicModal';
import { ExportModal } from '../ExportModal';

interface VideoEditorProps {
  initialProject: Project;
  onBackToHome: () => void;
  onOpenMoreTools: () => void;
  onSaveProject: (project: Project) => void;
  currentPlan?: PlanType;
  freeExportsCount?: number;
  onExportSuccess?: () => void;
  onOpenSubscriptionModal?: (reason?: string) => void;
}

export const VideoEditor: React.FC<VideoEditorProps> = ({
  initialProject,
  onBackToHome,
  onOpenMoreTools,
  onSaveProject,
  currentPlan = 'free',
  freeExportsCount = 0,
  onExportSuccess,
  onOpenSubscriptionModal
}) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(
    project.clips[0]?.id || null
  );
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorToolId | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [activeEffectName, setActiveEffectName] = useState<string | undefined>(undefined);
  const [isDrawMode, setIsDrawMode] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>('Saved');

  // Hidden Media Picker for timeline
  const addMediaInputRef = useRef<HTMLInputElement | null>(null);

  // Undo/Redo Stacks
  const historyRef = useRef<Project[]>([initialProject]);
  const historyIndexRef = useRef<number>(0);

  // Playhead interval ticker
  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= project.duration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(project.duration, prev + 0.1);
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, project.duration]);

  // Push to history on major changes
  const updateProjectWithHistory = (newProject: Project) => {
    setProject(newProject);
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('All changes saved');
      onSaveProject(newProject);
    }, 400);

    const history = historyRef.current.slice(0, historyIndexRef.current + 1);
    history.push(newProject);
    historyRef.current = history;
    historyIndexRef.current = history.length - 1;
  };

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      setProject(historyRef.current[historyIndexRef.current]);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      setProject(historyRef.current[historyIndexRef.current]);
    }
  };

  // Selected Clip
  const selectedClip = project.clips.find(c => c.id === selectedClipId) || project.clips[0] || null;

  const handleUpdateClip = (updated: VideoClip) => {
    const newClips = project.clips.map(c => c.id === updated.id ? updated : c);
    updateProjectWithHistory({
      ...project,
      clips: newClips
    });
  };

  // Split Clip at Playhead
  const handleSplitClip = () => {
    if (!selectedClip) return;
    const splitPoint = currentTime - selectedClip.startTime;
    if (splitPoint <= 0.5 || splitPoint >= (selectedClip.trimEnd - selectedClip.trimStart) - 0.5) {
      return; // Too close to edges
    }

    const firstPart: VideoClip = {
      ...selectedClip,
      id: `clip-${Date.now()}-1`,
      trimEnd: selectedClip.trimStart + splitPoint
    };

    const secondPart: VideoClip = {
      ...selectedClip,
      id: `clip-${Date.now()}-2`,
      startTime: currentTime,
      trimStart: selectedClip.trimStart + splitPoint
    };

    const newClips = project.clips.flatMap(c => c.id === selectedClip.id ? [firstPart, secondPart] : [c]);
    updateProjectWithHistory({
      ...project,
      clips: newClips
    });
    setSelectedClipId(secondPart.id);
  };

  // Delete Clip
  const handleDeleteClip = () => {
    if (!selectedClip) return;
    const newClips = project.clips.filter(c => c.id !== selectedClip.id);
    const newDuration = newClips.length > 0
      ? Math.max(...newClips.map(c => c.startTime + (c.trimEnd - c.trimStart)))
      : 10;

    updateProjectWithHistory({
      ...project,
      duration: newDuration,
      clips: newClips
    });

    setSelectedClipId(newClips[0]?.id || null);
    if (activeTool === 'clip' && newClips.length === 0) {
      setActiveTool(null);
    }
  };

  // Add Clip From Gallery
  const handleAddClipFromGallery = (newClip: VideoClip) => {
    const newDuration = Math.max(project.duration, newClip.startTime + (newClip.trimEnd - newClip.trimStart));
    updateProjectWithHistory({
      ...project,
      duration: newDuration,
      clips: [...project.clips, newClip]
    });
    setSelectedClipId(newClip.id);
    setCurrentTime(newClip.startTime);
    setSaveStatus(`Added: ${newClip.title}`);
    setTimeout(() => setSaveStatus('All changes saved'), 2500);
  };

  // Duplicate Clip
  const handleDuplicateClip = () => {
    if (!selectedClip) return;
    const duplicated: VideoClip = {
      ...selectedClip,
      id: `dup-${Date.now()}`,
      startTime: selectedClip.startTime + (selectedClip.trimEnd - selectedClip.trimStart)
    };
    updateProjectWithHistory({
      ...project,
      clips: [...project.clips, duplicated]
    });
  };

  // Add Real Media from Device or Stock
  const handleAddMediaFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');

    const addClipWithDuration = (clipDuration: number, mediaType: 'video' | 'photo') => {
      // If project has no clips, start at 0, otherwise place at current playhead or timeline end
      const targetStartTime = project.clips.length === 0 ? 0 : currentTime;

      const newClip: VideoClip = {
        id: `media-${Date.now()}`,
        title: file.name,
        url: fileUrl,
        type: mediaType,
        duration: clipDuration,
        startTime: targetStartTime,
        trimStart: 0,
        trimEnd: clipDuration,
        speed: 1,
        volume: 100,
        opacity: 100,
        scale: 1,
        rotation: 0,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        exposure: 0,
        temperature: 0,
        tint: 0,
        vignette: 0,
        blur: 0,
        isPIP: false
      };

      const newDuration = Math.max(project.duration, targetStartTime + clipDuration);

      updateProjectWithHistory({
        ...project,
        duration: newDuration,
        clips: [...project.clips, newClip]
      });

      setSelectedClipId(newClip.id);
      setCurrentTime(targetStartTime);
      setSaveStatus(`Loaded: ${file.name}`);
      setTimeout(() => setSaveStatus('Saved'), 3000);
    };

    if (isVideo) {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = fileUrl;
      tempVideo.onloadedmetadata = () => {
        const vidDur = tempVideo.duration && isFinite(tempVideo.duration) && tempVideo.duration > 0
          ? Math.round(tempVideo.duration * 10) / 10
          : 8;
        addClipWithDuration(vidDur, 'video');
      };
      tempVideo.onerror = () => {
        addClipWithDuration(8, 'video');
      };
    } else {
      addClipWithDuration(5, 'photo');
    }

    // Reset input so same file can be reselected if desired
    e.target.value = '';
  };

  // Add Audio to timeline from MusicModal
  const handleAddAudioItem = (audio: AudioItem) => {
    updateProjectWithHistory({
      ...project,
      audioItems: [...project.audioItems, audio]
    });
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#06020c] flex flex-col overflow-hidden select-none">
      
      {/* Hidden file input for adding media */}
      <input
        ref={addMediaInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleAddMediaFile}
      />

      {/* TOP NAVIGATION BAR */}
      <div className="h-14 border-b border-pink-500/20 bg-[#0c0418]/90 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0 z-30">
        
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <input
              type="text"
              value={project.name}
              onChange={(e) => updateProjectWithHistory({ ...project, name: e.target.value })}
              className="bg-transparent border-b border-transparent hover:border-pink-500/50 focus:border-pink-500 text-sm font-bold font-heading text-white focus:outline-none px-1"
            />
            <div className="flex items-center gap-2 text-[10px] text-zinc-400">
              <span className="text-emerald-400 font-mono">● {saveStatus}</span>
              <span>•</span>
              <span>{project.aspectRatio}</span>
            </div>
          </div>
        </div>

        {/* Center: Undo / Redo & Aspect Ratio Picker */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndexRef.current <= 0}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center text-zinc-300"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndexRef.current >= historyRef.current.length - 1}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center justify-center text-zinc-300"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {/* Aspect Ratio Selector */}
          <select
            value={project.aspectRatio}
            onChange={(e) => updateProjectWithHistory({ ...project, aspectRatio: e.target.value as AspectRatio })}
            className="bg-[#150a2a] border border-pink-500/30 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="9:16">9:16 (Reels/TikTok)</option>
            <option value="16:9">16:9 (YouTube Widescreen)</option>
            <option value="1:1">1:1 (Square Post)</option>
            <option value="4:5">4:5 (Portrait Feed)</option>
            <option value="4:3">4:3 (Classic Video)</option>
          </select>
        </div>

        {/* Right: Plan Status & Export Button */}
        <div className="flex items-center gap-2.5">
          {currentPlan === 'free' ? (
            <button
              onClick={() => onOpenSubscriptionModal?.("Upgrade to unlock unlimited HD video exports without watermark.")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                freeExportsCount >= 2
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                  : 'bg-pink-500/20 border-pink-500/40 text-pink-300'
              }`}
            >
              <span>
                {freeExportsCount >= 2 
                  ? '🔒 Free Limit Reached' 
                  : `🎁 ${2 - freeExportsCount} Free HD Left`}
              </span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
              <span>PRO HD</span>
            </div>
          )}

          {/* Gallery Button: Add Multiple Photos/Videos */}
          <button
            onClick={() => setIsGalleryOpen(true)}
            title="Open device gallery to add multiple photos or videos"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-purple-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Gallery</span>
          </button>

          {/* Direct Upload Video / Photo */}
          <button
            onClick={() => addMediaInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/50 text-pink-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Add Media</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

      </div>

      {/* MAIN WORKSPACE SPLIT (PREVIEW + CONTROLS) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* CENTER / TOP: VIDEO PREVIEW STAGE */}
        <div className="flex-1 flex items-center justify-center p-3 md:p-6 overflow-hidden bg-gradient-to-b from-[#080312] to-[#0d041c]">
          <EditorPreview
            project={project}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            onSeek={(t) => setCurrentTime(t)}
            activeClip={selectedClip}
            selectedTextId={selectedTextId}
            onSelectText={(id) => setSelectedTextId(id)}
            activeEffectName={activeEffectName}
            isDrawMode={isDrawMode}
          />
        </div>

      </div>

      {/* ACTIVE TOOL OPTIONS PANEL (EXPANDED ONLY WHEN TOOL IS ACTIVE) */}
      {activeTool && (
        <EditorToolPanels
          activeTool={activeTool}
          onClose={() => setActiveTool(null)}
          project={project}
          onUpdateProject={updateProjectWithHistory}
          selectedClip={selectedClip}
          onUpdateClip={handleUpdateClip}
          currentTime={currentTime}
          onOpenMusicModal={() => setIsMusicModalOpen(true)}
          onOpenMoreTools={onOpenMoreTools}
          onTriggerEffect={(eff) => {
            setActiveEffectName(eff);
            setTimeout(() => setActiveEffectName(undefined), 3000);
          }}
          onSetDrawMode={(draw) => setIsDrawMode(draw)}
          onDeleteClip={handleDeleteClip}
          onDuplicateClip={handleDuplicateClip}
        />
      )}

      {/* HORIZONTALLY SWIPEABLE BOTTOM TOOLBAR */}
      <EditorToolbar
        activeTool={activeTool}
        selectedClipId={selectedClipId}
        onSelectTool={(tool) => {
          if (tool === 'gallery') {
            setIsGalleryOpen(true);
          } else if (tool === 'more') {
            onOpenMoreTools();
          } else if (tool === 'music' || tool === 'voice') {
            setIsMusicModalOpen(true);
          } else {
            setActiveTool(prev => prev === tool ? null : tool);
          }
        }}
      />

      {/* MULTI-TRACK TIMELINE */}
      <EditorTimeline
        project={project}
        currentTime={currentTime}
        onSeek={(t) => setCurrentTime(t)}
        selectedClipId={selectedClipId}
        onSelectClip={(id) => setSelectedClipId(id)}
        onSplitClip={handleSplitClip}
        onDeleteClip={handleDeleteClip}
        onDuplicateClip={handleDuplicateClip}
        onAddMedia={() => setIsGalleryOpen(true)}
        onOpenClipOptions={() => setActiveTool('clip')}
        onOpenGallery={() => setIsGalleryOpen(true)}
        zoomLevel={zoomLevel}
        onZoomChange={(z) => setZoomLevel(z)}
      />

      {/* GALLERY DRAWER (Select multiple photos or videos from device) */}
      <GalleryDrawer
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        project={project}
        onAddClip={handleAddClipFromGallery}
        currentTime={currentTime}
      />

      {/* MUSIC & AUDIO MODAL */}
      <MusicModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        onAddAudio={handleAddAudioItem}
        currentAudioItems={project.audioItems}
        onRemoveAudio={(id) => {
          updateProjectWithHistory({
            ...project,
            audioItems: project.audioItems.filter(a => a.id !== id)
          });
        }}
      />

      {/* EXPORT MODAL */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        currentPlan={currentPlan}
        freeExportsCount={freeExportsCount}
        onExportSuccess={onExportSuccess || (() => {})}
        onOpenSubscriptionModal={onOpenSubscriptionModal || (() => {})}
      />

    </div>
  );
};
