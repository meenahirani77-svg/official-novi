/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Film, Scissors, Sparkles, Wand2, Type, Music, 
  Layers, Sliders, Volume2, Shield, FolderPlus, Trash2, 
  Gauge, Maximize2, Search, ArrowRight, CheckCircle2, 
  HelpCircle, Lightbulb, Play
} from 'lucide-react';
import { EditorToolId } from '../types';

interface ToolInfo {
  id: string;
  name: string;
  category: 'core' | 'effects' | 'audio' | 'ai';
  icon: React.ReactNode;
  tagline: string;
  whatItDoes: string;
  usedFor: string;
  whenToUse: string;
  howItWorks: string;
  whatYouCanCreate: string;
}

const TOOLS_DIRECTORY: ToolInfo[] = [
  {
    id: 'clip',
    name: 'Clip Editing & Inspector',
    category: 'core',
    icon: <Film className="w-5 h-5 text-pink-400" />,
    tagline: 'Deep per-clip controls for trimming, effects, color, scale & audio',
    whatItDoes: 'Provides individual control over any selected video or photo clip on the timeline—adjust speed, rotation, brightness, volume, and apply visual shaders.',
    usedFor: 'Fine-tuning, sizing, color correcting, and styling individual segments of your project.',
    whenToUse: 'Whenever you click on any photo or video clip in the timeline or preview stage.',
    howItWorks: 'Selecting a clip opens the Clip tab with dedicated sliders, rotation tools, effect pickers, and audio controls that apply directly to that media.',
    whatYouCanCreate: 'Cinematic crop zooms, mirrored dance moves, rotated footage, customized color styles, and timed media animations.'
  },
  {
    id: 'gallery',
    name: 'Device Gallery (Multi-Media Picker)',
    category: 'core',
    icon: <FolderPlus className="w-5 h-5 text-purple-400" />,
    tagline: 'Upload and sequence multiple photos & videos from your phone or PC',
    whatItDoes: 'A dedicated side drawer allowing you to browse and upload multiple photos and videos from your device storage and add them one after another to the timeline.',
    usedFor: 'Importing your phone camera roll, multiple photos, video clips, and B-roll sequentially.',
    whenToUse: 'When starting a new video or anytime you want to add more photos/videos to extend your story.',
    howItWorks: 'Select multiple files via the native file browser. Videos automatically register their duration and appear in the gallery drawer with "+ Add" buttons to append them to the timeline.',
    whatYouCanCreate: 'Photo dumps, travel vlogs, wedding montages, birthday slideshows, and multi-scene music videos.'
  },
  {
    id: 'delete',
    name: 'Clip Delete Button',
    category: 'core',
    icon: <Trash2 className="w-5 h-5 text-rose-400" />,
    tagline: 'Instantly removes the selected clip and recalculates the timeline',
    whatItDoes: 'Permanently removes the currently selected video or photo clip from the timeline and automatically updates the project duration.',
    usedFor: 'Removing bad takes, mistaken uploads, unwanted clips, or redundant photos.',
    whenToUse: 'Whenever you select a clip that you no longer want in your final video.',
    howItWorks: 'Clicking Delete instantly removes the active clip from the project state, recalculates the total duration, and selects the next available clip.',
    whatYouCanCreate: 'Tight, polished edits with zero filler or accidental duplicate frames.'
  },
  {
    id: 'effects',
    name: 'Live Video Effects & Shaders',
    category: 'effects',
    icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
    tagline: 'Glitch, RGB Split, Neon Glow, VHS 80s, Film Grain, Lens Flare & Strobe',
    whatItDoes: 'Applies hardware-accelerated live visual shaders and effects directly on the video or photo monitor during playback.',
    usedFor: 'Adding aesthetic visual flair, cybernetic aesthetics, retro nostalgia, or high-energy transitions.',
    whenToUse: 'On musical beat drops, exciting moments, intro hooks, or throughout stylized aesthetic videos.',
    howItWorks: 'Blends CSS matrix filters, scanlines, and screen blend-modes live over the video frames with zero rendering lag.',
    whatYouCanCreate: 'Viral TikTok glitch reels, synthwave 80s tape videos, cyberpunk neon edits, and retro film vlogs.'
  },
  {
    id: 'trim-split',
    name: 'Trim & Split Tools',
    category: 'core',
    icon: <Scissors className="w-5 h-5 text-emerald-400" />,
    tagline: 'Slice clips at the exact playhead millisecond or trim start/end points',
    whatItDoes: 'Cuts a video clip into two independent parts at the playhead, or trims out dead air from the start and end of a clip.',
    usedFor: 'Eliminating awkward pauses, cutting to the beat of music, and isolating the best parts of footage.',
    whenToUse: 'At the very beginning of editing to clean up raw camera recordings into punchy clips.',
    howItWorks: 'Calculates the playhead offset and divides the clip into two separate timeline elements with corresponding start and end timestamps.',
    whatYouCanCreate: 'Fast-paced jump cuts, dynamic story pacing, and seamless rhythm-synced edits.'
  },
  {
    id: 'speed',
    name: 'Speed & Slow Motion',
    category: 'core',
    icon: <Gauge className="w-5 h-5 text-amber-400" />,
    tagline: '0.25x buttery slow-motion to 5x hyper-speed timelapse',
    whatItDoes: 'Controls the playback rate of video footage with presets like 0.25x, 0.5x, 1x, 2x, and 5x.',
    usedFor: 'Emphasizing dramatic action moments, creating hyper-speed transitions, or time-lapsing long processes.',
    whenToUse: 'During sports tricks, dance choreography, sunsets, product reveals, or cooking tutorials.',
    howItWorks: 'Adjusts the HTML5 video playback rate and proportionally updates the clip duration on the timeline.',
    whatYouCanCreate: 'Cinematic slow-motion drops, lightning-fast tutorial summaries, and smooth action sequences.'
  },
  {
    id: 'pip',
    name: 'Picture-in-Picture (PIP) & Chroma Key',
    category: 'effects',
    icon: <Layers className="w-5 h-5 text-indigo-400" />,
    tagline: 'Overlay floating reaction videos, gaming facecams & green screen VFX',
    whatItDoes: 'Places a secondary video or photo on top of your main timeline video, with full control over scale, position, and green-screen transparency.',
    usedFor: 'Reaction videos, gaming commentaries, dual-camera interviews, and green-screen meme overlays.',
    whenToUse: 'When you need to display two media tracks simultaneously on the same screen.',
    howItWorks: 'Renders a hardware-accelerated secondary canvas layer with position coordinates, border radii, and chroma-key color removal.',
    whatYouCanCreate: 'Twitch/YouTube style gaming videos with facecam, TikTok reaction videos, and green-screen comedy sketches.'
  },
  {
    id: 'text',
    name: 'Text, Titles & AI Captions',
    category: 'core',
    icon: <Type className="w-5 h-5 text-yellow-400" />,
    tagline: 'Custom typography, neon titles, subtitles & AI-generated captions',
    whatItDoes: 'Adds customizable text overlays with animated entrance effects, neon glow, custom fonts, and Gemini AI auto-caption generation.',
    usedFor: 'Adding headlines, subtitles, social callouts, watermarks, and educational bullet points.',
    whenToUse: 'For mobile viewers who watch without sound (over 80% of social media feeds).',
    howItWorks: 'Renders scalable vector text layers overlaid on the canvas with customizable start and end timestamps.',
    whatYouCanCreate: 'Alex Hormozi-style viral captioned reels, lyric videos, professional title intros, and informative explainer videos.'
  },
  {
    id: 'audio',
    name: 'Music, Voiceover & Beat Sync',
    category: 'audio',
    icon: <Music className="w-5 h-5 text-pink-400" />,
    tagline: 'Royalty-free soundtracks, microphone voice recording & volume mixing',
    whatItDoes: 'Provides a royalty-free music library, audio trimmer, voiceover recorder, and multi-track volume mixer.',
    usedFor: 'Adding background music, voice narration, sound effects, and emotional atmosphere.',
    whenToUse: 'In every project to give your video professional acoustic depth and rhythm.',
    howItWorks: 'Uses the browser Web Audio API to schedule and synchronize audio tracks with the timeline video playhead.',
    whatYouCanCreate: 'High-energy workout reels, emotional cinematic trailers, documentary voiceovers, and TikTok dance edits.'
  },
  {
    id: 'filter',
    name: 'Color Grading & Filter Presets',
    category: 'effects',
    icon: <Sliders className="w-5 h-5 text-fuchsia-400" />,
    tagline: 'Cyberpunk, Vintage 70s, Noir, Cinematic 35mm & Sunset Warmth',
    whatItDoes: 'Applies instant cinematic color lookups and allows manual adjustment of brightness, contrast, saturation, vignette, and blur.',
    usedFor: 'Fixing dark or dull camera recordings and giving the entire video a uniform cinematic color identity.',
    whenToUse: 'After cutting your clips together to establish the visual mood and palette.',
    howItWorks: 'Processes the video frames through mathematical color transformation matrices in real-time CSS shaders.',
    whatYouCanCreate: 'Moody cyberpunk nightscapes, warm golden-hour memories, vintage retro film footage, and crisp product commercials.'
  },
  {
    id: 'canvas',
    name: 'Canvas Ratios & Safe Zones',
    category: 'core',
    icon: <Maximize2 className="w-5 h-5 text-blue-400" />,
    tagline: '9:16 Reels/Shorts, 16:9 YouTube, 1:1 Square, 4:5 Feed formats',
    whatItDoes: 'Allows changing the project aspect ratio with guides that show where TikTok and Instagram UI buttons sit to avoid blocked text.',
    usedFor: 'Repurposing footage for different social media platforms without ugly stretching.',
    whenToUse: 'At the start of your project or before exporting for a specific platform.',
    howItWorks: 'Adjusts the preview viewport aspect ratio with responsive letterboxing and guides.',
    whatYouCanCreate: 'Native vertical 9:16 reels, widescreen 16:9 YouTube videos, and square Instagram feed carousels.'
  },
  {
    id: 'ai',
    name: 'AI Auto Edit & Smart Cuts',
    category: 'ai',
    icon: <Wand2 className="w-5 h-5 text-purple-400" />,
    tagline: 'Gemini AI analyzes media, suggests cuts, titles & tempo syncs',
    whatItDoes: 'Harnesses Google Gemini AI to analyze raw video/photo uploads, detect emotional highlights, and automatically structure a video.',
    usedFor: 'Instant creation when you have dozens of photos/videos and want a finished edit in seconds.',
    whenToUse: 'When you are in a hurry or need creative inspiration for pacing and song choices.',
    howItWorks: 'Sends structured metadata to server-side Gemini AI models which calculate optimal cut points and music rhythm.',
    whatYouCanCreate: 'Automated vacation recaps, year-end highlights, product showcases, and dynamic party reels.'
  }
];

interface ToolsDirectorySectionProps {
  onStartTool?: (toolId: EditorToolId) => void;
  onNewProject?: () => void;
}

export const ToolsDirectorySection: React.FC<ToolsDirectorySectionProps> = ({
  onStartTool,
  onNewProject
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'effects' | 'audio' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedToolId, setExpandedToolId] = useState<string | null>('clip');

  const filteredTools = TOOLS_DIRECTORY.filter(tool => {
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.whatItDoes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.usedFor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.whatYouCanCreate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="tools-guide-section" className="w-full mt-14 mb-8 pt-8 border-t border-pink-500/20">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-pink-400" />
            <span>Complete Website & Tools Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Explore All Video Editing Tools
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl mt-1">
            Learn what each tool does, when to use it, how it operates behind the scenes, and what you can create with it.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools & features..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {[
          { id: 'all', label: 'All Tools (12)' },
          { id: 'core', label: 'Core & Timeline' },
          { id: 'effects', label: 'Shaders & Effects' },
          { id: 'audio', label: 'Audio & Music' },
          { id: 'ai', label: 'AI Smart Tools' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => {
          const isExpanded = expandedToolId === tool.id;

          return (
            <div
              key={tool.id}
              className={`rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                isExpanded 
                  ? 'bg-gradient-to-b from-[#180a32] to-[#100522] border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.2)]'
                  : 'bg-[#100622]/80 border-white/10 hover:border-pink-500/30 hover:bg-[#14082c]'
              }`}
            >
              {/* Card Top */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    {tool.icon}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-[10px] font-mono uppercase tracking-wider text-pink-300 border border-white/10 font-bold">
                    {tool.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  {tool.name}
                </h3>
                <p className="text-xs text-pink-300/90 font-medium mb-3">
                  {tool.tagline}
                </p>

                {/* What it does */}
                <div className="space-y-3 text-xs text-zinc-300">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-0.5">
                      What it does:
                    </span>
                    <p className="leading-relaxed text-zinc-300">
                      {tool.whatItDoes}
                    </p>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-white/10 animate-in fade-in duration-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-0.5">
                          Used For:
                        </span>
                        <p className="leading-relaxed text-zinc-300">
                          {tool.usedFor}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400 block mb-0.5">
                          Where & When to Use:
                        </span>
                        <p className="leading-relaxed text-zinc-300">
                          {tool.whenToUse}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block mb-0.5">
                          How it works:
                        </span>
                        <p className="leading-relaxed text-zinc-300">
                          {tool.howItWorks}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-pink-400 block mb-0.5">
                          What you can create:
                        </span>
                        <p className="leading-relaxed text-pink-200 bg-pink-500/10 p-2 rounded-lg border border-pink-500/20">
                          ✨ {tool.whatYouCanCreate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Toggle Read More & Try Button */}
              <div className="px-5 py-3 bg-black/30 border-t border-white/5 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setExpandedToolId(isExpanded ? null : tool.id)}
                  className="text-pink-400 hover:text-pink-300 font-semibold cursor-pointer transition-colors"
                >
                  {isExpanded ? 'Show Less ▲' : 'Read Full Details ▼'}
                </button>

                {onNewProject && (
                  <button
                    type="button"
                    onClick={onNewProject}
                    className="flex items-center gap-1 text-zinc-400 hover:text-white font-medium cursor-pointer transition-colors"
                  >
                    <span>Use in Editor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Summary Callout */}
      <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-600/10 to-indigo-600/10 border border-pink-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 flex-shrink-0">
            <Play className="w-6 h-6 ml-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Ready to create your next viral video?
            </h4>
            <p className="text-xs text-zinc-400">
              Open the editor, pick photos/videos from your device gallery, trim, add effects, and export in full HD.
            </p>
          </div>
        </div>

        {onNewProject && (
          <button
            onClick={onNewProject}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            Start New Project Now
          </button>
        )}
      </div>

    </section>
  );
};
