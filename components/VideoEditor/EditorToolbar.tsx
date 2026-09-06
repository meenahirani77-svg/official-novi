/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { 
  Scissors, Gauge, PlayCircle, Layers, Type, SlidersHorizontal, 
  Sparkles, Sliders, Volume2, Music, Mic, Film, Image as ImageIcon, 
  Smile, Shield, Wand2, Disc, Eye, PenTool, Snowflake, RotateCcw, 
  Maximize2, Grid, MoreHorizontal, ChevronLeft, ChevronRight, FolderPlus
} from 'lucide-react';
import { EditorToolId } from '../../types';

interface EditorToolbarProps {
  activeTool: EditorToolId | null;
  onSelectTool: (tool: EditorToolId) => void;
  selectedClipId?: string | null;
}

interface ToolGroup {
  groupName: string;
  tools: {
    id: EditorToolId;
    name: string;
    icon: React.ReactNode;
  }[];
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  activeTool,
  onSelectTool,
  selectedClipId
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const toolSets: ToolGroup[] = [
    {
      groupName: 'Clip & Media',
      tools: [
        { id: 'clip', name: 'Clip', icon: <Film className="w-4 h-4" /> },
        { id: 'gallery', name: 'Gallery', icon: <FolderPlus className="w-4 h-4" /> },
        { id: 'trim', name: 'Trim', icon: <Scissors className="w-4 h-4" /> },
        { id: 'split', name: 'Split', icon: <Scissors className="w-4 h-4" /> },
        { id: 'speed', name: 'Speed', icon: <Gauge className="w-4 h-4" /> },
        { id: 'animation', name: 'Animation', icon: <PlayCircle className="w-4 h-4" /> },
        { id: 'pip', name: 'PIP', icon: <Layers className="w-4 h-4" /> },
      ]
    },
    {
      groupName: 'Set 2',
      tools: [
        { id: 'text', name: 'Text', icon: <Type className="w-4 h-4" /> },
        { id: 'filter', name: 'Filter', icon: <SlidersHorizontal className="w-4 h-4" /> },
        { id: 'effects', name: 'Effects', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'adjust', name: 'Adjust', icon: <Sliders className="w-4 h-4" /> },
        { id: 'audio', name: 'Audio', icon: <Volume2 className="w-4 h-4" /> },
      ]
    },
    {
      groupName: 'Set 3',
      tools: [
        { id: 'music', name: 'Music', icon: <Music className="w-4 h-4" /> },
        { id: 'voice', name: 'Voice', icon: <Mic className="w-4 h-4" /> },
        { id: 'transition', name: 'Transition', icon: <Film className="w-4 h-4" /> },
        { id: 'overlay', name: 'Overlay', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'sticker', name: 'Sticker', icon: <Smile className="w-4 h-4" /> },
      ]
    },
    {
      groupName: 'Set 4',
      tools: [
        { id: 'mask', name: 'Mask', icon: <Disc className="w-4 h-4" /> },
        { id: 'chroma', name: 'Chroma', icon: <Shield className="w-4 h-4" /> },
        { id: 'tracking', name: 'Tracking', icon: <Eye className="w-4 h-4" /> },
        { id: 'keyframe', name: 'Keyframe', icon: <Grid className="w-4 h-4" /> },
        { id: 'ai', name: 'AI Studio', icon: <Wand2 className="w-4 h-4" /> },
      ]
    },
    {
      groupName: 'Set 5',
      tools: [
        { id: 'captions', name: 'Captions', icon: <Type className="w-4 h-4" /> },
        { id: 'background', name: 'Background', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'draw', name: 'Draw', icon: <PenTool className="w-4 h-4" /> },
        { id: 'freeze', name: 'Freeze', icon: <Snowflake className="w-4 h-4" /> },
        { id: 'reverse', name: 'Reverse', icon: <RotateCcw className="w-4 h-4" /> },
      ]
    },
    {
      groupName: 'Set 6',
      tools: [
        { id: 'canvas', name: 'Canvas', icon: <Maximize2 className="w-4 h-4" /> },
        { id: 'adjustment', name: 'Adj. Layer', icon: <Layers className="w-4 h-4" /> },
        { id: 'more', name: 'More Tools', icon: <MoreHorizontal className="w-4 h-4" /> },
      ]
    }
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 260;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative w-full bg-[#0c0418] border-t border-pink-500/20 px-2 py-2 select-none">
      
      {/* Scroll Left Button */}
      <button
        onClick={() => handleScroll('left')}
        className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/70 hover:bg-pink-500/30 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Swipeable Tool Ribbon */}
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-6 overflow-x-auto scroll-smooth py-1 px-8 scrollbar-none"
      >
        {toolSets.map((group, gIdx) => (
          <div key={gIdx} className="flex items-center gap-2 flex-shrink-0">
            {group.tools.map((tool) => {
              const isSelected = activeTool === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] border border-pink-400 scale-105'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/5'
                  }`}
                >
                  <div className={`mb-1 ${isSelected ? 'text-white drop-shadow-[0_0_8px_#ffffff]' : 'text-zinc-300'}`}>
                    {tool.icon}
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider whitespace-nowrap">
                    {tool.name}
                  </span>
                </button>
              );
            })}

            {/* Set Divider */}
            {gIdx < toolSets.length - 1 && (
              <div className="w-px h-8 bg-white/10 mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/70 hover:bg-pink-500/30 text-zinc-300 hover:text-white flex items-center justify-center backdrop-blur-md border border-white/10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

    </div>
  );
};
