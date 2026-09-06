/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Home, Film, Plus, MoreHorizontal, Crown, Sparkles, 
  RotateCcw, Wand2, Music 
} from 'lucide-react';
import { Project, VideoTemplate, PlanType, EditorToolId } from './types';
import { INITIAL_PROJECTS, SAMPLE_TEMPLATES } from './data/presets';
import { KaleidoscopeIntro } from './components/KaleidoscopeIntro';
import { HomeScreen } from './components/HomeScreen';
import { TemplatesScreen } from './components/TemplatesScreen';
import { VideoEditor } from './components/VideoEditor/VideoEditor';
import { MoreToolsScreen } from './components/MoreToolsScreen';
import { SubscriptionModal } from './components/SubscriptionModal';
import { MusicModal } from './components/MusicModal';
import { AIChat } from './components/AIChat';
import FluidBackground from './components/FluidBackground';

export default function App() {
  // Screen router: 'intro' | 'home' | 'editor' | 'more_tools' | 'templates'
  const [currentScreen, setCurrentScreen] = useState<'intro' | 'home' | 'editor' | 'more_tools' | 'templates'>('intro');

  // Active projects list with local storage backup
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('novicut_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PROJECTS;
      }
    }
    return INITIAL_PROJECTS;
  });

  // Current active project in editor
  const [activeProject, setActiveProject] = useState<Project>(INITIAL_PROJECTS[0]);

  // Specific tool to open when navigating from More Tools into Editor
  const [initialEditorTool, setInitialEditorTool] = useState<EditorToolId>('trim');

  // Monetization Plan & Free Exports Tracker
  const [currentPlan, setCurrentPlan] = useState<PlanType>(() => {
    const savedPlan = localStorage.getItem('novicut_plan');
    return (savedPlan as PlanType) || 'free';
  });

  // Track 2 free videos export limit
  const [freeExportsCount, setFreeExportsCount] = useState<number>(() => {
    const saved = localStorage.getItem('novicut_free_exports_count');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Modals
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [subscriptionReason, setSubscriptionReason] = useState<string | undefined>(undefined);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);

  // Sync projects to localStorage
  useEffect(() => {
    localStorage.setItem('novicut_projects', JSON.stringify(projects));
  }, [projects]);

  // Sync plan to localStorage
  useEffect(() => {
    localStorage.setItem('novicut_plan', currentPlan);
  }, [currentPlan]);

  // Sync free exports to localStorage
  useEffect(() => {
    localStorage.setItem('novicut_free_exports_count', freeExportsCount.toString());
  }, [freeExportsCount]);

  const handleExportSuccess = () => {
    if (currentPlan === 'free') {
      setFreeExportsCount(prev => prev + 1);
    }
  };

  const handleOpenSubscriptionModal = (reason?: string) => {
    setSubscriptionReason(reason);
    setIsSubscriptionOpen(true);
  };

  // Action: Launch New Project from Scratch
  const handleNewProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: `Untitled Project ${projects.length + 1}`,
      duration: 12,
      aspectRatio: '9:16',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: '/intro_kaleidoscope.jpg',
      clips: [
        {
          id: `clip-init-${Date.now()}`,
          title: 'Kaleidoscope Core',
          url: '/intro_kaleidoscope.jpg',
          thumbnail: '/intro_kaleidoscope.jpg',
          type: 'photo',
          duration: 12,
          startTime: 0,
          trimStart: 0,
          trimEnd: 12,
          speed: 1,
          volume: 100,
          opacity: 100,
          scale: 1,
          rotation: 0,
          brightness: 100,
          contrast: 110,
          saturation: 115,
          exposure: 0,
          temperature: 0,
          tint: 0,
          vignette: 20,
          blur: 0,
          isPIP: false
        }
      ],
      texts: [
        {
          id: 'text-title',
          text: 'Good Vibes ♡',
          startTime: 0.5,
          duration: 6,
          x: 50,
          y: 45,
          fontSize: 28,
          fontFamily: 'Orbitron',
          color: '#ffffff',
          hasGlow: true,
          hasOutline: true,
          animation: 'pop'
        }
      ],
      stickers: [
        {
          id: `stk-${Date.now()}`,
          stickerUrl: '♡',
          startTime: 0.5,
          duration: 6,
          x: 75,
          y: 42,
          scale: 1.5,
          rotation: 0
        }
      ],
      audioItems: [
        {
          id: 'audio-init',
          title: 'Cyber Pulse Odyssey',
          url: '',
          duration: 12,
          startTime: 0,
          volume: 80,
          type: 'music',
          waveform: [0.3, 0.6, 0.8, 0.5, 0.9, 0.4, 0.7, 0.8, 0.5]
        }
      ],
      effects: [],
      transitions: [],
      beatMarkers: [1.5, 3.0, 4.5, 6.0, 7.5, 9.0, 10.5]
    };

    setProjects(prev => [newProj, ...prev]);
    setActiveProject(newProj);
    setCurrentScreen('editor');
  };

  // Action: Open Existing Draft
  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setCurrentScreen('editor');
  };

  // Action: Delete Draft
  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // Action: Save Project updates from Editor
  const handleSaveProject = (updated: Project) => {
    setActiveProject(updated);
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Action: Use Template
  const handleSelectTemplate = (template: VideoTemplate) => {
    const templateProject: Project = {
      id: `template-${Date.now()}`,
      name: `${template.title} Draft`,
      duration: template.duration,
      aspectRatio: template.aspectRatio,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: template.thumbnail,
      clips: template.clipsPreview.map((clip, idx) => ({
        id: `tpl-clip-${idx}-${Date.now()}`,
        title: clip.title,
        url: clip.url,
        type: 'photo',
        duration: clip.duration,
        startTime: idx * (template.duration / template.clipsPreview.length),
        trimStart: 0,
        trimEnd: clip.duration,
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
      })),
      texts: [
        {
          id: 'tpl-text',
          text: template.title.toUpperCase(),
          startTime: 0,
          duration: template.duration,
          x: 50,
          y: 50,
          fontSize: 26,
          fontFamily: 'Orbitron',
          color: '#ffffff',
          hasGlow: true,
          hasOutline: true,
          animation: 'pop'
        }
      ],
      stickers: [],
      audioItems: [
        {
          id: 'tpl-audio',
          title: template.musicTrack,
          url: '',
          duration: template.duration,
          startTime: 0,
          volume: 85,
          type: 'music'
        }
      ],
      effects: [],
      transitions: [],
      beatMarkers: [1.2, 2.4, 3.6, 4.8, 6.0, 7.2, 8.4, 9.6]
    };

    setProjects(prev => [templateProject, ...prev]);
    setActiveProject(templateProject);
    setCurrentScreen('editor');
  };

  // Action: Select Tool from More Tools Screen
  const handleSelectToolFromMore = (toolId: EditorToolId) => {
    setInitialEditorTool(toolId);
    setCurrentScreen('editor');
  };

  return (
    <div className="relative min-h-screen bg-[#06020c] text-white font-sans overflow-x-hidden selection:bg-pink-500 selection:text-white">
      
      {/* Visual Identity: Fluid Neon Magenta-Purple Kaleidoscopic Background */}
      <FluidBackground />

      {/* Screen Routing with Smooth Motion Fade Transitions */}
      <AnimatePresence mode="wait">
        
        {/* 1. KALEIDOSCOPE INTRO ANIMATION */}
        {currentScreen === 'intro' && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-black"
          >
            <KaleidoscopeIntro onComplete={() => setCurrentScreen('home')} />
          </motion.div>
        )}

        {/* 2. HOME SCREEN */}
        {currentScreen === 'home' && (
          <motion.div
            key="home-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <HomeScreen
              projects={projects}
              onNewProject={handleNewProject}
              onOpenProject={handleOpenProject}
              onDeleteProject={handleDeleteProject}
              onSelectTemplate={handleSelectTemplate}
              onOpenTemplates={() => setCurrentScreen('templates')}
              onOpenMoreTools={() => setCurrentScreen('more_tools')}
              onOpenSubscription={() => handleOpenSubscriptionModal()}
              onOpenMusicModal={() => setIsMusicModalOpen(true)}
              currentPlan={currentPlan}
              freeExportsCount={freeExportsCount}
              onReplayIntro={() => setCurrentScreen('intro')}
              onQuickActionTool={(toolId) => {
                setInitialEditorTool(toolId);
                setCurrentScreen('editor');
              }}
            />
          </motion.div>
        )}

        {/* 2.5 VIRAL TEMPLATES HUB SCREEN */}
        {currentScreen === 'templates' && (
          <motion.div
            key="templates-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative z-10"
          >
            <TemplatesScreen
              onBack={() => setCurrentScreen('home')}
              onSelectTemplate={handleSelectTemplate}
              onOpenSubscription={() => handleOpenSubscriptionModal()}
              currentPlan={currentPlan}
            />
          </motion.div>
        )}

        {/* 3. ADVANCED MORE TOOLS SCREEN */}
        {currentScreen === 'more_tools' && (
          <motion.div
            key="more-tools-screen"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="relative z-10"
          >
            <MoreToolsScreen
              onBack={() => setCurrentScreen('home')}
              onSelectTool={handleSelectToolFromMore}
            />
          </motion.div>
        )}

        {/* 4. FULL VIDEO EDITOR SCREEN */}
        {currentScreen === 'editor' && (
          <motion.div
            key="editor-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-40"
          >
            <VideoEditor
              key={activeProject.id}
              initialProject={activeProject}
              onBackToHome={() => setCurrentScreen('home')}
              onOpenMoreTools={() => setCurrentScreen('more_tools')}
              onSaveProject={handleSaveProject}
              currentPlan={currentPlan}
              freeExportsCount={freeExportsCount}
              onExportSuccess={handleExportSuccess}
              onOpenSubscriptionModal={handleOpenSubscriptionModal}
            />
          </motion.div>
        )}

      </AnimatePresence>

      {/* FLOATING GLASS NAVIGATION DOCK (VISIBLE ON HOME, TEMPLATES & MORE TOOLS) */}
      {(currentScreen === 'home' || currentScreen === 'templates' || currentScreen === 'more_tools') && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-[#110523]/85 backdrop-blur-xl border border-pink-500/30 shadow-[0_0_35px_rgba(217,70,239,0.35)] select-none">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentScreen === 'home'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setCurrentScreen('templates')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentScreen === 'templates'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_#ec4899]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Film className="w-4 h-4" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          <button
            onClick={handleNewProject}
            className="flex items-center gap-1 px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-400 text-white text-xs font-bold shadow-[0_0_15px_#ec4899] transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </button>

          <button
            onClick={() => setCurrentScreen('more_tools')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              currentScreen === 'more_tools'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <MoreHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Tools</span>
          </button>

          <button
            onClick={() => handleOpenSubscriptionModal()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-amber-300 hover:text-amber-200 hover:bg-amber-400/10 transition-colors cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            <span className="hidden sm:inline">Pro</span>
          </button>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Replay Intro Animation button */}
          <button
            onClick={() => setCurrentScreen('intro')}
            title="Replay Kaleidoscopic Intro"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-pink-500/20 text-zinc-400 hover:text-pink-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* GLOBAL MODALS */}
      {(currentScreen === 'home' || currentScreen === 'templates' || currentScreen === 'more_tools') && (
        <AIChat />
      )}

      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        currentPlan={currentPlan}
        onSelectPlan={(plan) => setCurrentPlan(plan)}
        reason={subscriptionReason}
      />

      <MusicModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        onAddAudio={(audio) => {
          if (activeProject) {
            handleSaveProject({
              ...activeProject,
              audioItems: [...activeProject.audioItems, audio]
            });
          }
        }}
        currentAudioItems={activeProject?.audioItems || []}
        onRemoveAudio={(id) => {
          if (activeProject) {
            handleSaveProject({
              ...activeProject,
              audioItems: activeProject.audioItems.filter(a => a.id !== id)
            });
          }
        }}
      />

    </div>
  );
}
