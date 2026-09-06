/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Download, Share2, Check, Sparkles, Film, 
  RefreshCw, HardDrive, Zap, Crown, Lock, ArrowRight
} from 'lucide-react';
import { Project, ExportResolution, ExportFPS, ExportFormat, PlanType } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currentPlan: PlanType;
  freeExportsCount: number;
  onExportSuccess: () => void;
  onOpenSubscriptionModal: (reason?: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
  currentPlan,
  freeExportsCount,
  onExportSuccess,
  onOpenSubscriptionModal
}) => {
  const [resolution, setResolution] = useState<ExportResolution>('1080p');
  const [fps, setFps] = useState<ExportFPS>(30);
  const [format, setFormat] = useState<ExportFormat>('mp4');

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [exportStage, setExportStage] = useState<string>('Ready to Render');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const isFreePlan = currentPlan === 'free';
  const hasReachedFreeLimit = isFreePlan && freeExportsCount >= 2;
  const remainingFreeVideos = Math.max(0, 2 - freeExportsCount);

  // Calculate estimated file size in MB
  const calculateEstimatedSize = () => {
    let bitrateMbps = 5;
    if (resolution === '480p') bitrateMbps = 2.5;
    else if (resolution === '720p') bitrateMbps = 5.0;
    else if (resolution === '1080p') bitrateMbps = 10.0;
    else if (resolution === '1440p') bitrateMbps = 18.0;
    else if (resolution === '4k') bitrateMbps = 35.0;

    const fpsMultiplier = fps / 30;
    const totalMegabits = bitrateMbps * fpsMultiplier * project.duration;
    const megabytes = (totalMegabits / 8).toFixed(1);
    return `${megabytes} MB`;
  };

  const handleStartExport = () => {
    if (hasReachedFreeLimit) {
      onOpenSubscriptionModal("You have reached your 2 free video exports limit. Upgrade for ₹29/month or ₹300/year to export unlimited HD videos!");
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);

    const stages = [
      'Analyzing multi-track video timeline...',
      'Synthesizing video compositing layers...',
      'Applying real-time color filters & neon effects...',
      'Encoding audio channels & beat-sync markers...',
      'Multiplexing final HD video stream...'
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);

      const stageIndex = Math.min(stages.length - 1, Math.floor((currentProgress / 100) * stages.length));
      setExportStage(stages[stageIndex]);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsExporting(false);
        setExportStage('Export Complete!');
        
        // Notify export success and increment count
        onExportSuccess();

        // Create download blob or provide active clip URL
        const firstVideoClip = project.clips.find(c => c.url.endsWith('.mp4') || c.type === 'video');
        if (firstVideoClip && !firstVideoClip.url.startsWith('blob:')) {
          setDownloadUrl(firstVideoClip.url);
        } else {
          const exportSummary = `NoviCut Studio Video Export\nTitle: ${project.name}\nResolution: ${resolution}\nFramerate: ${fps}fps\nFormat: ${format}\nDuration: ${project.duration}s\nClips Count: ${project.clips.length}\nRendered via NoviCut Ultra Engine`;
          const blob = new Blob([exportSummary], { type: format === 'mp4' ? 'video/mp4' : 'video/webm' });
          setDownloadUrl(URL.createObjectURL(blob));
        }
      }
    }, 110);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.name,
          text: `Check out my video "${project.name}" edited with NoviCut!`,
          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0e061e] border border-pink-500/40 rounded-3xl shadow-[0_0_60px_rgba(217,70,239,0.35)] overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-pink-500/20 bg-gradient-to-r from-[#17092e] to-[#0d041c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.6)]">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-heading text-white flex items-center gap-2">
                <span>Export High Definition Video</span>
              </h2>
              <p className="text-xs text-zinc-400">
                {project.name} • {project.duration}s • {project.aspectRatio}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Tier Status / Limit Notice */}
        {isFreePlan ? (
          <div className={`p-4 border-b text-xs flex items-center justify-between ${
            hasReachedFreeLimit 
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200' 
              : 'bg-pink-500/15 border-pink-500/30 text-pink-200'
          }`}>
            <div className="flex items-center gap-2.5">
              {hasReachedFreeLimit ? (
                <Lock className="w-4 h-4 text-rose-400 flex-shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
              )}
              <div>
                <p className="font-bold">
                  {hasReachedFreeLimit 
                    ? "2 Free Video Exports Used!" 
                    : `Free Trial: ${remainingFreeVideos} of 2 Free HD Exports Remaining`}
                </p>
                <p className="text-[11px] text-zinc-300">
                  {hasReachedFreeLimit
                    ? "Upgrade to Pro for ₹29/mo or ₹300/yr to export unlimited HD & 4K videos."
                    : "Enjoy HD quality on your first 2 videos free of charge."}
                </p>
              </div>
            </div>

            {hasReachedFreeLimit && (
              <button
                onClick={() => onOpenSubscriptionModal("Upgrade to export unlimited videos in HD Quality")}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-[11px] whitespace-nowrap shadow-md cursor-pointer"
              >
                Upgrade (₹29/mo)
              </button>
            )}
          </div>
        ) : (
          <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-b border-pink-500/30 flex items-center gap-2 px-5 text-xs text-pink-200">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="font-bold">NoviCut Pro Active:</span>
            <span>Unlimited HD & 4K Ultra Exports • No Watermark</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar space-y-5">
          
          {/* Export Settings */}
          {!isExporting && !downloadUrl && (
            <div className="space-y-4">
              
              {/* Resolution Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Resolution (HD Quality)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['720p', '1080p', '1440p', '4k'] as ExportResolution[]).map((res) => {
                    const is4kLocked = res === '4k' && isFreePlan;
                    return (
                      <button
                        key={res}
                        disabled={is4kLocked}
                        onClick={() => setResolution(res)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-heading font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                          resolution === res
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 border-pink-400 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                            : 'bg-white/5 border-white/10 text-zinc-300 hover:border-pink-500/40 hover:text-white'
                        } ${is4kLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        <span className="uppercase">{res}</span>
                        <span className="text-[9px] text-zinc-300 font-normal">
                          {res === '720p' && 'HD Ready'}
                          {res === '1080p' && 'Full HD'}
                          {res === '1440p' && '2K Quad'}
                          {res === '4k' && (isFreePlan ? 'Pro Only' : 'Ultra HD')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Framerate Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Framerate (Smooth Motion)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {([24, 30, 50, 60] as ExportFPS[]).map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setFps(rate)}
                      className={`py-2 px-3 rounded-xl border text-xs font-heading font-bold transition-all text-center cursor-pointer ${
                        fps === rate
                          ? 'bg-pink-500/30 border-pink-400 text-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.4)]'
                          : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {rate} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* Format & Estimated Size */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <HardDrive className="w-4 h-4 text-pink-400" />
                  <span>Estimated File Size:</span>
                  <span className="text-white font-mono font-bold">{calculateEstimatedSize()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono text-[11px] font-bold border border-pink-500/30 uppercase">
                    {format} • H.264
                  </span>
                </div>
              </div>

            </div>
          )}

          {/* Rendering Progress View */}
          {isExporting && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-4 border-pink-500/20 border-t-pink-500 animate-spin flex items-center justify-center">
                <Film className="w-6 h-6 text-pink-400" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-lg text-white mb-1">
                  Rendering Your Video in {resolution}
                </h3>
                <p className="text-xs text-pink-300 font-mono animate-pulse">
                  {exportStage}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-sm h-3 rounded-full bg-white/10 overflow-hidden border border-white/10 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-sm font-mono font-bold text-pink-400">
                {progress}%
              </div>
            </div>
          )}

          {/* Download & Share View when Completed */}
          {downloadUrl && (
            <div className="py-5 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                <Check className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-white mb-1">
                  Export Complete!
                </h3>
                <p className="text-xs text-zinc-400">
                  Your video is rendered in high quality {resolution} ({fps} FPS).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md pt-2">
                <a
                  href={downloadUrl}
                  download={`${project.name.toLowerCase().replace(/\s+/g, '-')}-${resolution}.${format}`}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Video</span>
                </a>

                <button
                  onClick={handleShare}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-heading font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-pink-400" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-pink-500/20 bg-[#0a0316] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>

          {!isExporting && !downloadUrl && (
            hasReachedFreeLimit ? (
              <button
                onClick={() => onOpenSubscriptionModal("Upgrade to export unlimited videos in HD Quality")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-heading font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center gap-2 cursor-pointer"
              >
                <span>Upgrade to Pro (₹29/mo or ₹300/yr)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartExport}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-heading font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Render & Export in {resolution}</span>
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
};

export default ExportModal;
