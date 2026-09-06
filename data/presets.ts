/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Template, VideoTemplate, AudioItem, VideoClip } from '../types';

export const INITIAL_CLIPS: VideoClip[] = [
  {
    id: 'clip-1',
    title: 'Neon Light Trails Motion',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop',
    type: 'video',
    duration: 5,
    startTime: 0,
    trimStart: 0,
    trimEnd: 5,
    speed: 1,
    volume: 100,
    opacity: 100,
    filterPreset: 'Cyberpunk',
    brightness: 105,
    contrast: 120,
    saturation: 135,
    exposure: 5,
    temperature: -10,
    tint: 15,
    vignette: 25,
    blur: 0,
    animation: 'zoom_in',
    scale: 1,
    rotation: 0,
    maskType: 'none',
    chromaKey: false,
    blendMode: 'normal',
    isPIP: false,
  },
  {
    id: 'clip-2',
    title: 'Cyber Kaleidoscope Motion',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop',
    type: 'video',
    duration: 5,
    startTime: 5,
    trimStart: 0,
    trimEnd: 5,
    speed: 1,
    volume: 100,
    opacity: 100,
    filterPreset: 'Neon Magenta',
    brightness: 110,
    contrast: 115,
    saturation: 140,
    exposure: 0,
    temperature: 5,
    tint: 20,
    vignette: 20,
    blur: 0,
    animation: 'pan_right',
    scale: 1,
    rotation: 0,
    maskType: 'none',
    chromaKey: false,
    blendMode: 'normal',
    isPIP: false,
  },
  {
    id: 'clip-3',
    title: 'Future Highway Sequence',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop',
    type: 'video',
    duration: 5,
    startTime: 10,
    trimStart: 0,
    trimEnd: 5,
    speed: 1,
    volume: 100,
    opacity: 100,
    filterPreset: 'Cinematic',
    brightness: 100,
    contrast: 110,
    saturation: 120,
    exposure: 0,
    temperature: 0,
    tint: 0,
    vignette: 15,
    blur: 0,
    animation: 'fade',
    scale: 1,
    rotation: 0,
    maskType: 'none',
    chromaKey: false,
    blendMode: 'normal',
    isPIP: false,
  }
];

export const INITIAL_PROJECT: Project = {
  id: 'proj-default-1',
  name: 'Neon Cyber Vibes',
  duration: 15,
  aspectRatio: '9:16',
  lastEdited: 'Just now',
  status: 'recent',
  thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
  clips: INITIAL_CLIPS,
  texts: [
    {
      id: 'txt-1',
      text: 'NOVICUT STUDIO',
      startTime: 1,
      duration: 4,
      x: 50,
      y: 25,
      fontSize: 28,
      fontFamily: 'Orbitron',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #d946ef 50%, #8b5cf6 100%)',
      hasGlow: true,
      hasOutline: true,
      animation: 'typewriter'
    },
    {
      id: 'txt-2',
      text: 'CREATE • EDIT • SHINE',
      startTime: 5.5,
      duration: 4,
      x: 50,
      y: 78,
      fontSize: 18,
      fontFamily: 'Space Grotesk',
      color: '#ffffff',
      hasGlow: true,
      hasBackground: true,
      bgColor: 'rgba(15, 6, 28, 0.75)',
      animation: 'pop'
    }
  ],
  stickers: [
    {
      id: 'stk-1',
      emoji: '⚡',
      name: 'Neon Spark',
      startTime: 0.5,
      duration: 5,
      x: 85,
      y: 18,
      scale: 1.4,
      rotation: 12
    }
  ],
  effects: [
    {
      id: 'eff-1',
      name: 'Cyber Glow',
      type: 'glow',
      startTime: 0,
      duration: 15,
      intensity: 75
    }
  ],
  audioItems: [
    {
      id: 'aud-1',
      title: 'Neon Horizon',
      artist: 'SynthWave Labs',
      url: '',
      duration: 15,
      startTime: 0,
      volume: 85,
      fadeIn: 1,
      fadeOut: 1.5,
      bpm: 128,
      category: 'Cyberpunk'
    }
  ],
  beatMarkers: [1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6, 10.8, 12.0, 13.2, 14.4],
  autoCaptions: [
    { time: 1.0, text: "Step into the future of creative video", highlight: "future" },
    { time: 4.5, text: "Powered by real-time neon rendering", highlight: "neon" },
    { time: 9.0, text: "Every beat synchronized with perfection", highlight: "perfection" },
    { time: 12.5, text: "Export in ultra-crisp resolution", highlight: "resolution" }
  ]
};

export const RECENT_PROJECTS_DATA: Project[] = [
  INITIAL_PROJECT,
  {
    id: 'proj-2',
    name: 'My Tokyo Vlog',
    duration: 24,
    aspectRatio: '9:16',
    lastEdited: '2 hours ago',
    status: 'recent',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=500&auto=format&fit=crop',
    clips: [],
    texts: [],
    stickers: [],
    effects: [],
    audioItems: []
  },
  {
    id: 'proj-3',
    name: 'Travel Reel: Bali Sunset',
    duration: 18,
    aspectRatio: '9:16',
    lastEdited: 'Yesterday',
    status: 'recent',
    thumbnail: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=500&auto=format&fit=crop',
    clips: [],
    texts: [],
    stickers: [],
    effects: [],
    audioItems: []
  },
  {
    id: 'proj-4',
    name: 'Love Story & Anniversary',
    duration: 30,
    aspectRatio: '16:9',
    lastEdited: '3 days ago',
    status: 'favorite',
    thumbnail: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=500&auto=format&fit=crop',
    clips: [],
    texts: [],
    stickers: [],
    effects: [],
    audioItems: []
  },
  {
    id: 'proj-5',
    name: 'College Memories 2025',
    duration: 45,
    aspectRatio: '1:1',
    lastEdited: 'Last week',
    status: 'completed',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=500&auto=format&fit=crop',
    clips: [],
    texts: [],
    stickers: [],
    effects: [],
    audioItems: []
  }
];

export const INITIAL_PROJECTS: Project[] = RECENT_PROJECTS_DATA;

export const TEMPLATES_DATA: Template[] = [
  {
    id: 'tmpl-0',
    title: 'Kaleidoscope Neon Dreams',
    category: 'Cyberpunk',
    duration: 12,
    clipCount: 4,
    previewUrl: '/intro_kaleidoscope.jpg',
    isPro: false,
    description: 'Hypnotic rotating kaleidoscope mandala with pulsing neon bass and glowing particle bursts.',
    musicTitle: 'Psychedelic Trance Odyssey (132 BPM)',
    tags: ['Kaleidoscope', 'Neon', 'Reels', 'Glitch']
  },
  {
    id: 'tmpl-1',
    title: 'Neon Cyberpunk Reel',
    category: 'Cyberpunk',
    duration: 15,
    clipCount: 6,
    previewUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
    isPro: false,
    description: 'High octane beat synced cuts with chromatic aberration and glitch transitions.',
    musicTitle: 'Cybernetic Heartbeat (130 BPM)',
    tags: ['Reels', 'Glitch', 'Cyber', 'Trending']
  },
  {
    id: 'tmpl-2',
    title: 'Eternal Love & Romance',
    category: 'Love',
    duration: 20,
    clipCount: 8,
    previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
    isPro: true,
    description: 'Warm dreamlike pastel glow, smooth dissolves, and heartfelt quotes.',
    musicTitle: 'Moonlit Serenade',
    tags: ['Romance', 'Aesthetic', 'Soft']
  },
  {
    id: 'tmpl-3',
    title: 'Happy Birthday Celebration',
    category: 'Birthday',
    duration: 18,
    clipCount: 10,
    previewUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop',
    isPro: false,
    description: 'Confetti pop animations, bouncy kinetic typography, and festive beats.',
    musicTitle: 'Birthday Grooves 2025',
    tags: ['Celebration', 'Party', 'Joy']
  },
  {
    id: 'tmpl-4',
    title: 'Golden Hour Wanderlust',
    category: 'Travel',
    duration: 22,
    clipCount: 7,
    previewUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
    isPro: false,
    description: 'Cinematic color grading with slow motion speed curves and ambient soundscapes.',
    musicTitle: 'Sunset Horizons Lo-Fi',
    tags: ['Nature', 'Wanderlust', 'Scenic']
  },
  {
    id: 'tmpl-5',
    title: 'Campus & College Memories',
    category: 'College',
    duration: 30,
    clipCount: 12,
    previewUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop',
    isPro: true,
    description: 'Retro Polaroid frames, handwriting text styles, and nostalgic beats.',
    musicTitle: 'Youth Forever Synth',
    tags: ['Friends', 'School', 'Nostalgia']
  },
  {
    id: 'tmpl-6',
    title: 'Royal Wedding Highlights',
    category: 'Wedding',
    duration: 35,
    clipCount: 15,
    previewUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop',
    isPro: true,
    description: 'Luxurious gold light leaks, orchestral crescendo, and cinematic transitions.',
    musicTitle: 'Royalty Strings & Piano',
    tags: ['Elegant', 'Bridal', 'Luxury']
  },
  {
    id: 'tmpl-7',
    title: 'Friends Squad Night Out',
    category: 'Friends',
    duration: 16,
    clipCount: 9,
    previewUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=600&auto=format&fit=crop',
    isPro: false,
    description: 'Dynamic strobe transitions, energetic beat drops, and neon stickers.',
    musicTitle: 'Midnight Club Banger',
    tags: ['Squad', 'Nightlife', 'Fun']
  },
  {
    id: 'tmpl-8',
    title: 'Electric Music Festival',
    category: 'Festival',
    duration: 25,
    clipCount: 11,
    previewUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop',
    isPro: true,
    description: 'Laser light show effects, heavy bass drops, and kaleidoscopic zooms.',
    musicTitle: 'Ultra Bass Rave Drop',
    tags: ['EDM', 'Crowd', 'Lasers']
  },
  {
    id: 'tmpl-9',
    title: 'Beast Mode Gym & Fitness',
    category: 'Fitness',
    duration: 20,
    clipCount: 8,
    previewUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    isPro: false,
    description: 'Heavy bass hits, camera shakes, flash frames, and motivational typography.',
    musicTitle: 'Adrenaline Phonk',
    tags: ['Workout', 'Motivation', 'Power']
  },
  {
    id: 'tmpl-10',
    title: 'Haute Runway & Fashion Week',
    category: 'Fashion',
    duration: 15,
    clipCount: 6,
    previewUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop',
    isPro: true,
    description: 'High contrast monochrome with vibrant neon accents and editorial magazine layouts.',
    musicTitle: 'Vogue Minimal Techno',
    tags: ['Style', 'Editorial', 'Aesthetic']
  },
  {
    id: 'tmpl-11',
    title: 'Golden Memories Rewind',
    category: 'Memories',
    duration: 28,
    clipCount: 14,
    previewUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop',
    isPro: false,
    description: 'Warm film grain, super-8 camera borders, and acoustic guitar melodies.',
    musicTitle: 'Acoustic Memories',
    tags: ['Vintage', 'Film', 'Family']
  },
  {
    id: 'tmpl-12',
    title: 'Weekend Photo Dump 9:16',
    category: 'Photo Dump',
    duration: 14,
    clipCount: 16,
    previewUrl: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=600&auto=format&fit=crop',
    isPro: false,
    description: 'Rapid photo flash sync, grid collage effects, and viral trending sound.',
    musicTitle: 'Viral Chill Pop Beat',
    tags: ['Quick', 'Dump', 'Casual']
  }
];

export const SAMPLE_TEMPLATES: VideoTemplate[] = TEMPLATES_DATA.map(t => ({
  ...t,
  thumbnail: t.previewUrl,
  aspectRatio: '9:16',
  musicTrack: t.musicTitle,
  clipsPreview: [
    { title: `${t.title} Scene 1`, url: t.previewUrl, duration: 4 },
    { title: `${t.title} Scene 2`, url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop', duration: 4 },
    { title: `${t.title} Scene 3`, url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop', duration: Math.max(2, t.duration - 8) }
  ]
}));

export const MUSIC_CATALOG: AudioItem[] = [
  { id: 'm-1', title: 'Cyber Pulse Resonance', artist: 'Hyperion', url: '', duration: 32, startTime: 0, volume: 80, fadeIn: 1, fadeOut: 2, category: 'Trending', bpm: 128 },
  { id: 'm-2', title: 'Neon Highway Drift', artist: 'Astral Wave', url: '', duration: 28, startTime: 0, volume: 85, fadeIn: 0.5, fadeOut: 1, category: 'Chill', bpm: 110 },
  { id: 'm-3', title: 'Electric Night In Shibuya', artist: 'Kitsune Beats', url: '', duration: 45, startTime: 0, volume: 90, fadeIn: 1, fadeOut: 2, category: 'Party', bpm: 135 },
  { id: 'm-4', title: 'Warm Hugs & Lavender Sun', artist: 'Sweet Horizon', url: '', duration: 25, startTime: 0, volume: 75, fadeIn: 2, fadeOut: 2, category: 'Love', bpm: 92 },
  { id: 'm-5', title: 'Wanderlust Aerodrome', artist: 'Cloud Nomad', url: '', duration: 38, startTime: 0, volume: 80, fadeIn: 1, fadeOut: 1.5, category: 'Travel', bpm: 118 },
  { id: 'm-6', title: 'Coffee & Code Morning', artist: 'Lo-Fi Chillers', url: '', duration: 40, startTime: 0, volume: 70, fadeIn: 2, fadeOut: 2, category: 'Vlog', bpm: 85 },
  { id: 'm-7', title: 'Interstellar Odyssey', artist: 'Cosmic Symphony', url: '', duration: 52, startTime: 0, volume: 90, fadeIn: 3, fadeOut: 3, category: 'Cinematic', bpm: 100 },
  { id: 'm-8', title: 'Relentless Grit (Phonk)', artist: 'Shadow Beast', url: '', duration: 30, startTime: 0, volume: 85, fadeIn: 0.5, fadeOut: 1, category: 'Motivation', bpm: 140 },
  { id: 'm-9', title: 'Velvet Dreamscape', artist: 'Serenade Labs', url: '', duration: 36, startTime: 0, volume: 65, fadeIn: 3, fadeOut: 3, category: 'Relax', bpm: 75 },
  { id: 'm-10', title: 'Heavy Bass Drop 808', artist: 'Trap Master', url: '', duration: 26, startTime: 0, volume: 95, fadeIn: 0.2, fadeOut: 1, category: 'Beat', bpm: 145 },
];

export const SOUND_EFFECTS = [
  { id: 'sfx-1', name: 'Cinematic Whoosh', category: 'Transitions', duration: '0.8s', icon: '💨' },
  { id: 'sfx-2', name: 'Cyber Glitch Stutter', category: 'Digital', duration: '1.2s', icon: '⚡' },
  { id: 'sfx-3', name: 'Sub Bass Drop', category: 'Impact', duration: '2.5s', icon: '🔊' },
  { id: 'sfx-4', name: 'Camera Shutter Click', category: 'Real', duration: '0.4s', icon: '📸' },
  { id: 'sfx-5', name: 'Neon Laser Beam', category: 'Sci-Fi', duration: '0.9s', icon: '🔫' },
  { id: 'sfx-6', name: 'Vinyl Record Crackle', category: 'Vintage', duration: '4.0s', icon: '📻' },
  { id: 'sfx-7', name: 'Success Chime', category: 'UI', duration: '1.0s', icon: '✨' },
  { id: 'sfx-8', name: 'Deep Thunder Hit', category: 'Dramatic', duration: '3.0s', icon: '🌩️' },
];

export const FILTER_PRESETS = [
  { name: 'Original', css: 'none', brightness: 100, contrast: 100, saturation: 100, sepia: 0, hue: 0 },
  { name: 'Cyberpunk', css: 'contrast(130%) saturate(150%) hue-rotate(300deg)', brightness: 110, contrast: 130, saturation: 150, sepia: 0, hue: 300 },
  { name: 'Neon Magenta', css: 'contrast(125%) saturate(160%) hue-rotate(320deg)', brightness: 105, contrast: 125, saturation: 160, sepia: 0, hue: 320 },
  { name: 'Cinematic Teal', css: 'contrast(115%) saturate(120%) hue-rotate(180deg)', brightness: 100, contrast: 115, saturation: 120, sepia: 10, hue: 180 },
  { name: 'Vintage Warm', css: 'sepia(35%) contrast(95%) brightness(105%)', brightness: 105, contrast: 95, saturation: 90, sepia: 35, hue: 15 },
  { name: 'Retro VHS', css: 'contrast(120%) saturate(140%) sepia(20%)', brightness: 102, contrast: 120, saturation: 140, sepia: 20, hue: -10 },
  { name: 'Emerald Night', css: 'hue-rotate(140deg) saturate(130%) contrast(120%)', brightness: 95, contrast: 120, saturation: 130, sepia: 0, hue: 140 },
  { name: 'Pastel Dream', css: 'brightness(115%) contrast(90%) saturate(110%)', brightness: 115, contrast: 90, saturation: 110, sepia: 10, hue: 340 },
  { name: 'Noir B&W', css: 'grayscale(100%) contrast(140%) brightness(95%)', brightness: 95, contrast: 140, saturation: 0, sepia: 0, hue: 0 },
];
