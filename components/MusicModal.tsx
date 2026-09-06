/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Music, FolderOpen, Volume2, Mic, Play, Pause, Plus, 
  Trash2, Scissors, Zap, Sparkles, Check, UploadCloud, Radio, RefreshCw 
} from 'lucide-react';
import { AudioItem } from '../types';
import { MUSIC_CATALOG, SOUND_EFFECTS } from '../data/presets';

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAudio: (audio: AudioItem) => void;
  currentAudioItems?: AudioItem[];
  onRemoveAudio?: (id: string) => void;
}

export const MusicModal: React.FC<MusicModalProps> = ({
  isOpen,
  onClose,
  onAddAudio,
  currentAudioItems = [],
  onRemoveAudio
}) => {
  const [activeTab, setActiveTab] = useState<'music' | 'gallery' | 'sfx' | 'voiceover'>('music');
  const [musicCategory, setMusicCategory] = useState<string>('All');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [importedAudios, setImportedAudios] = useState<AudioItem[]>([
    {
      id: 'dev-1',
      title: 'Neon_Pulse_Edit_v2.mp3',
      artist: 'Device Storage',
      url: '',
      duration: 24,
      startTime: 0,
      volume: 85,
      fadeIn: 1,
      fadeOut: 1.5,
      isDeviceAudio: true,
      bpm: 124
    }
  ]);
  const [selectedGalleryAudio, setSelectedGalleryAudio] = useState<AudioItem | null>(null);
  const [galleryTrimStart, setGalleryTrimStart] = useState<number>(0);
  const [galleryTrimEnd, setGalleryTrimEnd] = useState<number>(24);
  const [galleryVolume, setGalleryVolume] = useState<number>(85);
  const [galleryFadeIn, setGalleryFadeIn] = useState<number>(1);
  const [galleryFadeOut, setGalleryFadeOut] = useState<number>(1);
  const [beatDetected, setBeatDetected] = useState<boolean>(false);

  // File Picker Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Voiceover state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<number | null>(null);

  // Web Audio Preview Synthesizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);

  const categories = ['All', 'Trending', 'Chill', 'Love', 'Travel', 'Vlog', 'Cinematic', 'Party', 'Motivation', 'Relax', 'Beat'];

  // Initialize or get AudioContext
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const stopPreviewSound = () => {
    activeOscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    activeOscillatorsRef.current = [];
    setPlayingTrackId(null);
  };

  const playSynthPreview = (trackId: string, bpm: number = 120) => {
    if (playingTrackId === trackId) {
      stopPreviewSound();
      return;
    }
    stopPreviewSound();

    try {
      const ctx = getAudioContext();
      setPlayingTrackId(trackId);

      // Create a groovy melodic 8-beat synth phrase
      const now = ctx.currentTime;
      const beatLength = 60 / bpm;
      const notes = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 440];

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = i % 2 === 0 ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, now + i * (beatLength / 2));

        gain.gain.setValueAtTime(0, now + i * (beatLength / 2));
        gain.gain.linearRampToValueAtTime(0.2, now + i * (beatLength / 2) + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * (beatLength / 2));

        // Lowpass filter for warm cyber vibe
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + i * (beatLength / 2));
        osc.stop(now + (i + 1) * (beatLength / 2));

        activeOscillatorsRef.current.push(osc);
      });

      // Auto clear state after phrase plays (~4 seconds)
      setTimeout(() => {
        setPlayingTrackId(prev => (prev === trackId ? null : prev));
      }, notes.length * (beatLength / 2) * 1000 + 200);

    } catch (e) {
      console.warn("Audio preview failed:", e);
      setPlayingTrackId(null);
    }
  };

  // Handle Real Device File Picker
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate audio file
    if (!file.type.startsWith('audio/')) {
      alert("Please select a valid audio file from your device.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const newAudio: AudioItem = {
      id: `imported-${Date.now()}`,
      title: file.name,
      artist: 'Device Gallery',
      url: objectUrl,
      duration: 30, // default fallback until loaded
      startTime: 0,
      volume: 85,
      fadeIn: 1,
      fadeOut: 1,
      isDeviceAudio: true,
      bpm: 125
    };

    // Attempt to extract real duration from HTML Audio
    const testAudio = new Audio();
    testAudio.src = objectUrl;
    testAudio.onloadedmetadata = () => {
      newAudio.duration = Math.round(testAudio.duration) || 30;
      setGalleryTrimEnd(newAudio.duration);
    };

    setImportedAudios(prev => [newAudio, ...prev]);
    setSelectedGalleryAudio(newAudio);
    setGalleryTrimStart(0);
    setGalleryTrimEnd(30);
    setBeatDetected(false);
  };

  // Handle Voice Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioBlob(audioUrl);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      recordTimerRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Microphone permission was denied or is not supported in this browser. You can still import audio files from Gallery!");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordTimerRef.current) {
        clearInterval(recordTimerRef.current);
      }
    }
  };

  const handleAddVoiceoverToTimeline = () => {
    if (!recordedAudioBlob) return;
    const voiceItem: AudioItem = {
      id: `voice-${Date.now()}`,
      title: `Voiceover ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      artist: 'You (Microphone)',
      url: recordedAudioBlob,
      duration: recordingSeconds || 5,
      startTime: 0,
      volume: 100,
      fadeIn: 0.2,
      fadeOut: 0.5,
      isVoiceover: true
    };
    onAddAudio(voiceItem);
    onClose();
  };

  // Filtered Music List
  const filteredMusic = musicCategory === 'All' 
    ? MUSIC_CATALOG 
    : MUSIC_CATALOG.filter(m => m.category === musicCategory);

  useEffect(() => {
    return () => {
      stopPreviewSound();
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c0517] border border-pink-500/40 rounded-2xl shadow-[0_0_50px_rgba(217,70,239,0.25)] flex flex-col overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-pink-500/20 bg-[#120724]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading text-white">Audio & Music Studio</h2>
              <p className="text-xs text-pink-300/70">Royalty-Free Tracks • Device Gallery • Sound Effects • Voiceover</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopPreviewSound();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5 bg-[#0e061c]">
          <button
            onClick={() => { setActiveTab('music'); stopPreviewSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'music'
                ? 'border-pink-500 text-pink-400 font-semibold shadow-[0_2px_12px_rgba(236,72,153,0.3)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music</span>
          </button>

          <button
            onClick={() => { setActiveTab('gallery'); stopPreviewSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'border-pink-500 text-pink-400 font-semibold shadow-[0_2px_12px_rgba(236,72,153,0.3)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Gallery</span>
            {importedAudios.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-mono">
                {importedAudios.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('sfx'); stopPreviewSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'sfx'
                ? 'border-pink-500 text-pink-400 font-semibold shadow-[0_2px_12px_rgba(236,72,153,0.3)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Sound Effects</span>
          </button>

          <button
            onClick={() => { setActiveTab('voiceover'); stopPreviewSound(); }}
            className={`flex items-center gap-2 px-4 py-2.5 font-medium text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'voiceover'
                ? 'border-pink-500 text-pink-400 font-semibold shadow-[0_2px_12px_rgba(236,72,153,0.3)]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Voiceover</span>
          </button>
        </div>

        {/* Hidden File Picker for Gallery Import */}
        <input 
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* TAB 1: MUSIC */}
          {activeTab === 'music' && (
            <div className="space-y-5">
              {/* Categories Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setMusicCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      musicCategory === cat
                        ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]'
                        : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Music List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMusic.map((track) => {
                  const isPlaying = playingTrackId === track.id;
                  return (
                    <div
                      key={track.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#140a28]/70 border border-white/5 hover:border-pink-500/40 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => playSynthPreview(track.id, track.bpm || 128)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                            isPlaying 
                              ? 'bg-pink-500 text-white shadow-[0_0_15px_#ec4899] animate-pulse' 
                              : 'bg-white/10 text-pink-400 hover:bg-pink-500 hover:text-white'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div>
                          <h4 className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
                            {track.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                            <span>{track.artist}</span>
                            <span>•</span>
                            <span>{track.duration}s</span>
                            {track.bpm && (
                              <>
                                <span>•</span>
                                <span className="text-pink-400 font-mono text-[10px]">{track.bpm} BPM</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onAddAudio({
                            ...track,
                            id: `track-${Date.now()}`
                          });
                          onClose();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500 text-pink-300 hover:text-white border border-pink-500/30 text-xs font-semibold transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY (DEVICE AUDIO) */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Gallery Import Hero Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-pink-950/30 to-[#120624] border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 justify-center md:justify-start">
                    <FolderOpen className="w-5 h-5 text-pink-400" />
                    Device Audio & Music Gallery
                  </h3>
                  <p className="text-xs text-pink-200/70 max-w-md">
                    Select your personal music, songs, voice recordings, or sound files directly from your phone or computer storage.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:brightness-110 text-white font-semibold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Choose from Gallery</span>
                  </button>
                </div>
              </div>

              {/* Imported Audio List */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-pink-400 font-mono mb-3">
                  Device & Imported Tracks ({importedAudios.length})
                </h4>

                {importedAudios.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-white/[0.02] border border-dashed border-white/10">
                    <Music className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <p className="text-sm text-zinc-400">No imported audio files yet.</p>
                    <p className="text-xs text-zinc-500 mt-1">Tap "Choose from Gallery" above to select files from your device.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2.5">
                    {importedAudios.map((audio) => {
                      const isSelected = selectedGalleryAudio?.id === audio.id;
                      const isPlaying = playingTrackId === audio.id;

                      return (
                        <div
                          key={audio.id}
                          onClick={() => {
                            setSelectedGalleryAudio(audio);
                            setGalleryTrimEnd(audio.duration);
                          }}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-pink-950/30 border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.2)]'
                              : 'bg-[#140a28]/60 border-white/5 hover:border-pink-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                playSynthPreview(audio.id, audio.bpm || 120);
                              }}
                              className="w-9 h-9 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500 hover:text-white flex items-center justify-center transition-colors"
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>
                            <div>
                              <div className="text-sm font-semibold text-white flex items-center gap-2">
                                <span>{audio.title}</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono">
                                  Device File
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400">{audio.duration}s • Ready to edit & sync</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddAudio(audio);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-400 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected Audio Editing Controls */}
              {selectedGalleryAudio && (
                <div className="p-4 rounded-xl bg-[#130726] border border-pink-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                      Edit Selected Audio: {selectedGalleryAudio.title}
                    </span>
                    <button
                      onClick={() => setBeatDetected(!beatDetected)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                        beatDetected
                          ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                          : 'bg-white/5 border-white/10 text-zinc-300 hover:border-yellow-500/50'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{beatDetected ? "Beat Detected (124 BPM)" : "Detect Beats"}</span>
                    </button>
                  </div>

                  {/* Waveform Visualization Mock */}
                  <div className="h-14 bg-black/40 rounded-lg p-2 flex items-center gap-1 overflow-hidden relative">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const heightPercent = Math.max(15, Math.sin(i * 0.4) * 85 + (i % 3 === 0 ? 30 : 10));
                      const isBeat = beatDetected && i % 6 === 0;
                      return (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all ${
                            isBeat ? 'bg-yellow-400 shadow-[0_0_8px_#facc15]' : 'bg-pink-500/60'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      );
                    })}
                  </div>

                  {/* Trim & Volume Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Volume</span>
                        <span className="text-pink-300">{galleryVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={galleryVolume}
                        onChange={(e) => setGalleryVolume(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Fade In</span>
                        <span className="text-pink-300">{galleryFadeIn}s</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={galleryFadeIn}
                        onChange={(e) => setGalleryFadeIn(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Fade Out</span>
                        <span className="text-pink-300">{galleryFadeOut}s</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={galleryFadeOut}
                        onChange={(e) => setGalleryFadeOut(Number(e.target.value))}
                        className="w-full accent-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOUND EFFECTS */}
          {activeTab === 'sfx' && (
            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Studio-grade sound transitions, impacts, and cyberpunk digital effects.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SOUND_EFFECTS.map((sfx) => {
                  const isPlaying = playingTrackId === sfx.id;
                  return (
                    <div
                      key={sfx.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#140a28]/70 border border-white/5 hover:border-pink-500/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sfx.icon}</span>
                        <div>
                          <h4 className="text-sm font-semibold text-white">{sfx.name}</h4>
                          <span className="text-xs text-zinc-400">{sfx.category} • {sfx.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => playSynthPreview(sfx.id, 140)}
                          className="w-8 h-8 rounded-lg bg-white/10 hover:bg-pink-500 text-white flex items-center justify-center transition-colors"
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                        </button>
                        <button
                          onClick={() => {
                            onAddAudio({
                              id: `sfx-${Date.now()}`,
                              title: sfx.name,
                              artist: 'Sound FX',
                              url: '',
                              duration: 2,
                              startTime: 0,
                              volume: 90,
                              fadeIn: 0.1,
                              fadeOut: 0.2,
                              category: sfx.category
                            });
                            onClose();
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500 text-pink-300 hover:text-white text-xs font-medium transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: VOICEOVER */}
          {activeTab === 'voiceover' && (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-white">Record Studio Voiceover</h3>
                <p className="text-xs text-zinc-400 max-w-md">
                  Record live commentary, podcast narration, or video captions using your microphone.
                </p>
              </div>

              {/* Live Record Button */}
              <div className="relative">
                {isRecording && (
                  <span className="absolute inset-0 rounded-full bg-pink-500/40 animate-ping" />
                )}
                <button
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all cursor-pointer ${
                    isRecording 
                      ? 'bg-rose-600 text-white shadow-[0_0_30px_#f43f5e]' 
                      : 'bg-gradient-to-tr from-pink-600 to-purple-600 text-white hover:scale-105 shadow-[0_0_30px_rgba(236,72,153,0.5)]'
                  }`}
                >
                  <Mic className="w-8 h-8 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {isRecording ? "Stop" : "Record"}
                  </span>
                </button>
              </div>

              {/* Timer */}
              <div className="font-mono text-lg text-pink-400 font-bold">
                {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:
                {String(recordingSeconds % 60).padStart(2, '0')}
              </div>

              {recordedAudioBlob && (
                <div className="w-full max-w-md p-4 rounded-xl bg-pink-950/30 border border-pink-500/30 space-y-3">
                  <p className="text-xs text-pink-300 font-medium">Recording saved successfully!</p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={handleAddVoiceoverToTimeline}
                      className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-400 text-white font-semibold text-xs flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Add to Timeline
                    </button>
                    <button
                      onClick={() => {
                        setRecordedAudioBlob(null);
                        setRecordingSeconds(0);
                      }}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 text-xs flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Re-record
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Current Project Audio Track Overview */}
        {currentAudioItems.length > 0 && (
          <div className="px-6 py-3 border-t border-white/5 bg-[#0a0314] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <Music className="w-3.5 h-3.5 text-pink-400" />
              <span>Timeline Audio Tracks: {currentAudioItems.length}</span>
            </div>
            <div className="flex items-center gap-2">
              {currentAudioItems.map((item) => (
                <div key={item.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 text-xs text-zinc-300 border border-white/10">
                  <span className="truncate max-w-[100px]">{item.title}</span>
                  {onRemoveAudio && (
                    <button 
                      onClick={() => onRemoveAudio(item.id)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
