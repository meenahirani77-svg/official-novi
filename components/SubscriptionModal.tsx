/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Check, Sparkles, Crown, Zap, Shield, Star, 
  ArrowRight, CheckCircle2, Film, Video
} from 'lucide-react';
import { PlanType } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  reason?: string;
  userEmail?: string;
  userName?: string;
  onOpenProfile?: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
  reason,
  userEmail = 'meenahirani77@gmail.com',
  userName = 'Meena Hirani',
  onOpenProfile
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const isMeena = userEmail.toLowerCase().includes('meena') || 
                  userEmail.toLowerCase() === 'meenahirani77@gmail.com' ||
                  currentPlan === 'pro+';

  if (!isOpen) return null;

  const handleUpgrade = (plan: PlanType) => {
    onSelectPlan(plan);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  const handleActivateFreeVip = () => {
    onSelectPlan('pro+');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0d051c] border border-pink-500/40 rounded-3xl shadow-[0_0_70px_rgba(217,70,239,0.4)] overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-pink-500/20 bg-gradient-to-r from-[#17092e] to-[#0c0418] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.7)]">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-heading text-white flex items-center gap-2">
                <span>NoviCut Pro HD Studio</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-pink-500/30 text-pink-300 font-mono border border-pink-500/40">
                  HD QUALITY
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                2 Videos Free • Upgrade for Unlimited HD Exports without Watermark
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

        {/* Optional Alert message if user hit the 2 free limit */}
        {reason && (
          <div className="px-6 py-2.5 bg-pink-500/20 border-b border-pink-500/30 flex items-center gap-2.5 text-xs text-pink-200">
            <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span>{reason}</span>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* Success Banner */}
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center gap-2 text-sm font-bold animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Pro Plan Activated! You can now export unlimited videos in Full HD & 4K.</span>
            </div>
          )}

          {/* MEENA HIRANI / VIP CREATOR 100% FREE PASS CALLOUT */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-600/20 border-2 border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.25)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black font-heading text-amber-200">
                    👑 Meena Hirani • VIP Lifetime Free Creator Pass
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-mono font-bold">
                    100% FREE
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                  Recognized Account: <span className="font-mono text-amber-300 font-semibold">{userEmail}</span>. 
                  તમારા માટે આ એપ કાયમ માટે 100% Free છે! કોઈ ₹29 કે ₹300 ચૂકવવાની જરૂર નથી.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleActivateFreeVip}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 hover:brightness-110 text-white font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentPlan === 'pro+' ? 'VIP Active (Unlimited)' : 'Activate VIP Free'}</span>
            </button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center">
            <div className="p-1 rounded-full bg-[#170a2d] border border-pink-500/30 flex items-center shadow-inner">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Monthly (₹29 Only)
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>Yearly (₹300 Only)</span>
                <span className="px-1.5 py-0.2 rounded bg-yellow-400/25 text-yellow-300 text-[10px] font-extrabold">
                  ₹25/MO
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* 1. FREE PLAN */}
            <div className="p-5 rounded-2xl border bg-white/[0.02] border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-white text-base">Free Trial Plan</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                    2 FREE VIDEOS
                  </span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black font-heading text-white">₹0</span>
                  <span className="text-xs text-zinc-400"> / first 2 videos</span>
                </div>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400" />
                    <span><strong>2 Full Video Exports</strong> for free</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400" />
                    <span>HD 1080p Video Quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400" />
                    <span>All Standard Editing Tools</span>
                  </li>
                  <li className="flex items-center gap-2 text-zinc-400">
                    <X className="w-4 h-4 text-zinc-500" />
                    <span>Locked after 2 videos</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 text-[11px] text-zinc-400 text-center">
                Active for your first 2 video creations
              </div>
            </div>

            {/* 2. PRO HD PLAN (EXPLICIT PRICING: ₹29 MONTHLY / ₹300 YEARLY) */}
            <div className="p-5 rounded-2xl border relative flex flex-col justify-between bg-gradient-to-b from-[#22093d] to-[#120524] border-pink-500 shadow-[0_0_35px_rgba(236,72,153,0.35)] ring-2 ring-pink-500/50">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                RECOMMENDED
              </div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-heading font-bold text-pink-300 text-base flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                    NoviCut Pro HD
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 font-mono border border-pink-500/30">
                    UNLIMITED
                  </span>
                </div>

                <div className="mb-4">
                  {billingCycle === 'monthly' ? (
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-black font-heading text-white">₹29</span>
                      <span className="text-xs text-pink-300 font-medium">only / month</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black font-heading text-white">₹300</span>
                        <span className="text-xs text-pink-300 font-medium">only / year</span>
                      </div>
                      <span className="text-[11px] text-yellow-300 font-bold">Just ₹25 per month!</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 text-xs text-zinc-100">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span className="font-bold text-white">HD & 4K Ultra Video Quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span className="font-bold text-white">Unlimited Video Exports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span className="font-bold text-white">No Watermark</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span>All 120+ Pro Video Tools & Effects</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span>AI Auto Edit, Captions & Chroma Key</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-pink-400 flex-shrink-0" />
                    <span>High-Speed Cloud Rendering</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleUpgrade('pro')}
                className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 text-white font-heading font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
              >
                <span>Subscribe for {billingCycle === 'monthly' ? '₹29/month' : '₹300/year'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Guarantee Badges */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-around gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-pink-400" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-pink-400" />
              <span>Full HD & 4K Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-pink-400" />
              <span>Cancel Anytime</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SubscriptionModal;
