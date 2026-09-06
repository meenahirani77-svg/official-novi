/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType = 
  | 'intro'
  | 'home'
  | 'editor'
  | 'more_tools'
  | 'templates'
  | 'projects'
  | 'profile'
  | 'photo_to_video';

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '4:3' | '3:4';

export type ExportResolution = '480p' | '720p' | '1080p' | '1440p' | '4k';
export type ExportFPS = 24 | 25 | 30 | 50 | 60;
export type ExportFormat = 'mp4' | 'webm' | 'mov';

export interface VideoClip {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  type: 'video' | 'photo';
  duration: number; // in seconds
  startTime: number; // position on timeline in seconds
  trimStart: number;
  trimEnd: number;
  speed: number;
  volume: number;
  opacity: number;
  filterPreset?: string;
  effect?: string;
  brightness: number; // 100 is default
  contrast: number; // 100 is default
  saturation: number; // 100 is default
  exposure: number; // 0 default
  temperature: number; // 0 default
  tint: number; // 0 default
  vignette: number; // 0 default
  blur: number; // 0 default
  animation?: string;
  scale: number;
  rotation: number;
  crop?: string;
  maskType?: 'none' | 'circle' | 'rectangle' | 'linear' | 'radial';
  maskFeather?: number;
  maskInvert?: boolean;
  chromaKey?: boolean;
  chromaColor?: string;
  chromaIntensity?: number;
  blendMode?: 'normal' | 'screen' | 'multiply' | 'overlay' | 'lighten';
  isPIP?: boolean;
  pipX?: number;
  pipY?: number;
  pipScale?: number;
}

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  duration: number;
  x: number; // percentage from left
  y: number; // percentage from top
  fontSize: number;
  fontFamily: string;
  color: string;
  gradient?: string;
  hasOutline?: boolean;
  hasGlow?: boolean;
  hasBackground?: boolean;
  bgColor?: string;
  animation?: 'none' | 'fade' | 'pop' | 'typewriter' | 'zoom' | 'slide' | 'bounce' | 'glitch';
}

export interface StickerOverlay {
  id: string;
  emoji: string;
  name: string;
  startTime: number;
  duration: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface EffectTrackItem {
  id: string;
  name: string;
  type: string;
  startTime: number;
  duration: number;
  intensity: number;
}

export interface AudioItem {
  id: string;
  title: string;
  artist?: string;
  url: string;
  duration: number;
  startTime: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
  isDeviceAudio?: boolean;
  isVoiceover?: boolean;
  category?: string;
  bpm?: number;
}

export interface Keyframe {
  id: string;
  time: number;
  property: 'position' | 'scale' | 'rotation' | 'opacity' | 'volume' | 'blur';
  value: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface Project {
  id: string;
  name: string;
  duration: number;
  aspectRatio: AspectRatio;
  lastEdited?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: 'recent' | 'draft' | 'favorite' | 'completed';
  thumbnail: string;
  clips: VideoClip[];
  texts: TextOverlay[];
  stickers: StickerOverlay[];
  effects: EffectTrackItem[];
  audioItems: AudioItem[];
  drawings?: { id: string; points: { x: number; y: number }[]; color: string; size: number }[];
  beatMarkers?: number[]; // seconds
  autoCaptions?: { time: number; text: string; highlight?: string }[];
}

export type PlanType = 'free' | 'pro' | 'pro+';

export interface VideoTemplate {
  id: string;
  title: string;
  category: string;
  duration: number;
  clipCount?: number;
  thumbnail: string;
  previewUrl?: string;
  isPro: boolean;
  description: string;
  musicTrack: string;
  musicTitle?: string;
  aspectRatio: AspectRatio;
  clipsPreview: { title: string; url: string; duration: number }[];
  tags?: string[];
}

export type Template = VideoTemplate;

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro' | 'pro_plus';
  aiCredits: number;
  maxCredits: number;
}

export type EditorToolId = 
  | 'clip'
  | 'gallery'
  | 'trim'
  | 'split'
  | 'speed'
  | 'animation'
  | 'pip'
  | 'text'
  | 'filter'
  | 'effects'
  | 'adjust'
  | 'audio'
  | 'music'
  | 'voice'
  | 'transition'
  | 'overlay'
  | 'sticker'
  | 'mask'
  | 'chroma'
  | 'tracking'
  | 'keyframe'
  | 'ai'
  | 'captions'
  | 'background'
  | 'draw'
  | 'freeze'
  | 'reverse'
  | 'canvas'
  | 'adjustment'
  | 'more';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
