/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { 
  X, UploadCloud, Film, Image as ImageIcon, Plus, Check, 
  Trash2, Play, Sparkles, Clock, FolderPlus, Layers
} from 'lucide-react';
import { VideoClip, Project } from '../../types';

interface GalleryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onAddClip: (clip: VideoClip) => void;
  currentTime: number;
}

interface GalleryItem {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'photo';
  duration: number;
  thumbnail?: string;
  addedAt: number;
}

// Built-in stock media options for immediate preview and testing
const INITIAL_STOCK_GALLERY: GalleryItem[] = [
  {
    id: 'stock-1',
    title: 'Cyberpunk Tokyo Night',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    type: 'photo',
    duration: 5,
    addedAt: Date.now() - 10000
  },
  {
    id: 'stock-2',
    title: 'Neon Tunnel Drive',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop',
    type: 'photo',
    duration: 5,
    addedAt: Date.now() - 20000
  },
  {
    id: 'stock-3',
    title: 'Retro Aesthetic Vibe',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    type: 'photo',
    duration: 5,
    addedAt: Date.now() - 30000
  },
  {
    id: 'stock-4',
    title: 'Synthwave Sunset Highway',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    type: 'photo',
    duration: 5,
    addedAt: Date.now() - 40000
  }
];

export const GalleryDrawer: React.FC<GalleryDrawerProps> = ({
  isOpen,
  onClose,
  project,
  onAddClip,
  currentTime,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_STOCK_GALLERY);
  const [filterType, setFilterType] = useState<'all' | 'video' | 'photo'>('all');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  // Handle Multi-file Selection from Device
  const handleDeviceFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const fileList = Array.from(files);

    // Process each file sequentially or in parallel
    const newItems: GalleryItem[] = [];

    fileList.forEach((file, index) => {
      const isVideo = file.type.startsWith('video');
      const fileUrl = URL.createObjectURL(file);

      if (isVideo) {
        const tempVideo = document.createElement('video');
        tempVideo.preload = 'metadata';
        tempVideo.src = fileUrl;
        tempVideo.onloadedmetadata = () => {
          const duration = tempVideo.duration && isFinite(tempVideo.duration) && tempVideo.duration > 0
            ? Math.round(tempVideo.duration * 10) / 10
            : 8;

          const item: GalleryItem = {
            id: `media-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
            title: file.name,
            url: fileUrl,
            type: 'video',
            duration,
            addedAt: Date.now()
          };

          setGalleryItems(prev => [item, ...prev]);
        };
        tempVideo.onerror = () => {
          const item: GalleryItem = {
            id: `media-${Date.now()}-${index}`,
            title: file.name,
            url: fileUrl,
            type: 'video',
            duration: 8,
            addedAt: Date.now()
          };
          setGalleryItems(prev => [item, ...prev]);
        };
      } else {
        const item: GalleryItem = {
          id: `media-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 5)}`,
          title: file.name,
          url: fileUrl,
          type: 'photo',
          duration: 5,
          addedAt: Date.now()
        };
        newItems.push(item);
      }
    });

    if (newItems.length > 0) {
      setGalleryItems(prev => [...newItems, ...prev]);
    }

    setIsProcessing(false);
    // Reset input so user can pick same or more files again immediately
    e.target.value = '';
  };

  // Append a gallery item to the project timeline
  const handleInsertClipToProject = (item: GalleryItem) => {
    // Determine target start time: at end of current project or current playhead
    const lastClip = project.clips.filter(c => !c.isPIP).sort((a, b) => (a.startTime + (a.trimEnd - a.trimStart)) - (b.startTime + (b.trimEnd - b.trimStart))).pop();
    const targetStartTime = lastClip 
      ? lastClip.startTime + (lastClip.trimEnd - lastClip.trimStart)
      : (project.clips.length === 0 ? 0 : currentTime);

    const newClip: VideoClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: item.title,
      url: item.url,
      type: item.type,
      duration: item.duration,
      startTime: targetStartTime,
      trimStart: 0,
      trimEnd: item.duration,
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

    onAddClip(newClip);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 2000);
  };

  const filteredItems = galleryItems.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-full sm:w-[380px] md:w-[420px] bg-[#0c0418] border-r border-pink-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col backdrop-blur-xl animate-in slide-in-from-left duration-200 text-white">
      
      {/* Hidden file input supporting MULTIPLE files */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={handleDeviceFilesSelected}
      />

      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#120726]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(236,72,153,0.5)]">
            <FolderPlus className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-heading text-white flex items-center gap-2">
              Device Gallery & Media
            </h2>
            <p className="text-[11px] text-zinc-400">
              Select multiple photos & videos from your device
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="min-w-[36px] min-h-[36px] rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Action Banner: Add Multiple Files */}
      <div className="p-4 border-b border-white/5 bg-gradient-to-b from-[#14082c] to-[#0c0418]">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-[0.99] transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>+ SELECT PHOTOS / VIDEOS FROM DEVICE</span>
        </button>
        <p className="text-[10px] text-zinc-400 text-center mt-2">
          You can select multiple files at once, or open Gallery again to add more one by one.
        </p>
      </div>

      {/* Filter Tabs & Count */}
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-white/5 text-xs bg-[#090214]">
        <div className="flex items-center gap-1.5">
          {(['all', 'video', 'photo'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg capitalize text-[11px] font-medium transition-all ${
                filterType === type 
                  ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]' 
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Media' : type === 'video' ? 'Videos' : 'Photos'}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-zinc-500 font-mono">
          {filteredItems.length} items
        </span>
      </div>

      {/* Media Items Scrollable Grid */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 space-y-2 text-zinc-500">
            <Film className="w-8 h-8 mx-auto opacity-40" />
            <p className="text-xs">No media found in gallery</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-pink-400 hover:underline text-xs"
            >
              Upload from your device
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isAdded = justAddedId === item.id;

            return (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-white/10 bg-white/[0.03] hover:border-pink-500/50 hover:bg-white/[0.06] transition-all p-2 flex items-center gap-3 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0 bg-black">
                  {item.type === 'video' ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Badge */}
                  <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-pink-300 font-bold">
                    {item.type === 'video' ? `${item.duration}s` : 'PHOTO'}
                  </span>
                </div>

                {/* Media Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    {item.type === 'video' ? (
                      <Film className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    )}
                    <h3 className="text-xs font-semibold text-white truncate">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-400 font-mono">
                    <span>{item.type.toUpperCase()}</span>
                    <span>•</span>
                    <span>{item.duration}s duration</span>
                  </div>
                </div>

                {/* Quick Add Button */}
                <button
                  onClick={() => handleInsertClipToProject(item)}
                  title="Add to project timeline"
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500 text-white shadow-[0_0_12px_#10b981]'
                      : 'bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/40'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Drawer Footer Info */}
      <div className="p-3 border-t border-white/10 bg-[#090214] flex items-center justify-between text-[11px] text-zinc-400">
        <span>Timeline clips: {project.clips.length}</span>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Upload More</span>
        </button>
      </div>

    </div>
  );
};
