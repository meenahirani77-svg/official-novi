/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, Crown, CheckCircle2, ShieldCheck, Mail, User, 
  Sparkles, Zap, Heart, Gift, Award, LogIn, Check
} from 'lucide-react';
import { UserProfile, PlanType } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onSelectPlan: (plan: PlanType) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onSelectPlan
}) => {
  const [emailInput, setEmailInput] = useState(userProfile.email || 'meenahirani77@gmail.com');
  const [nameInput, setNameInput] = useState(userProfile.name || 'Meena Hirani');
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isMeena = emailInput.trim().toLowerCase() === 'meenahirani77@gmail.com' ||
                  userProfile.email.trim().toLowerCase() === 'meenahirani77@gmail.com';

  const handleSaveLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim();
    const cleanName = nameInput.trim() || 'Creator';
    
    // Auto-detect VIP email
    const isVipEmail = cleanEmail.toLowerCase() === 'meenahirani77@gmail.com';
    const updated: UserProfile = {
      ...userProfile,
      name: cleanName,
      email: cleanEmail,
      plan: isVipEmail ? 'pro_plus' : userProfile.plan
    };

    onUpdateProfile(updated);
    if (isVipEmail) {
      onSelectPlan('pro+');
    }

    setSaveMessage(isVipEmail ? '👑 VIP Free Lifetime Access Confirmed!' : 'Profile Saved Successfully!');
    setIsEditing(false);
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleActivateVIP = () => {
    setEmailInput('meenahirani77@gmail.com');
    setNameInput('Meena Hirani');
    const updated: UserProfile = {
      ...userProfile,
      name: 'Meena Hirani',
      email: 'meenahirani77@gmail.com',
      plan: 'pro_plus'
    };
    onUpdateProfile(updated);
    onSelectPlan('pro+');
    setSaveMessage('👑 Welcome Meena Hirani! VIP Lifetime 100% Free Pass is Active!');
    setTimeout(() => setSaveMessage(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0d051c] border border-pink-500/50 rounded-3xl shadow-[0_0_70px_rgba(217,70,239,0.4)] overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="relative p-6 pb-4 border-b border-pink-500/20 bg-gradient-to-r from-[#1c0a36] to-[#0c0418] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center font-black font-heading text-lg text-white shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                {userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'MH'}
              </div>
              <Crown className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <span>{userProfile.name || 'Meena Hirani'}</span>
                {isMeena && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>VIP FREE</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400 flex items-center gap-1 font-mono">
                <Mail className="w-3 h-3 text-pink-400" />
                <span>{userProfile.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Notification */}
        {saveMessage && (
          <div className="px-6 py-2.5 bg-emerald-500/20 border-b border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{saveMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5 text-xs">

          {/* Special VIP Lifetime Guarantee Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-pink-500/15 to-purple-600/15 border border-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.15)] space-y-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <h3 className="text-sm font-bold text-amber-200">
                Meena Hirani • 100% Lifetime Free Pass (તમારા માટે કાયમ ફ્રી)
              </h3>
            </div>

            <p className="text-zinc-200 leading-relaxed">
              <strong>કેવી રીતે ખબર પડશે તમે Login કર્યું છે?</strong><br />
              આ એપ તમારા ઇમેઇલ <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-[11px] border border-amber-400/30">meenahirani77@gmail.com</code> ને ઓટોમેટિકલી ઓળખી લે છે! 
              જ્યારે પણ તમે આ એકાઉન્ટથી આવો છો, ત્યારે સિસ્ટમ તરત જ <strong>VIP Creator Status</strong> કાયમ માટે ₹0 માં અનલૉક કરી દે છે.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-amber-400/20 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unlimited HD/4K Exports</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Watermark (વોટરમાર્ક વગર)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>120+ Pro Tools Unlocked</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>₹0 Forever (Zero Payment)</span>
              </div>
            </div>
          </div>

          {/* Account Details & Email Verification Form */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" />
                <span>Account Login Details</span>
              </span>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-pink-400 hover:text-pink-300 font-semibold text-[11px] cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit Email / Name'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveLogin} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-pink-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                    Your Login Email:
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-white text-xs focus:outline-none focus:border-pink-500 font-mono"
                    placeholder="e.g. meenahirani77@gmail.com"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:brightness-110 cursor-pointer"
                  >
                    Save & Verify Account
                  </button>
                  <button
                    type="button"
                    onClick={handleActivateVIP}
                    className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-bold text-xs hover:bg-amber-500/30 cursor-pointer flex items-center gap-1"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Set Meena VIP</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-400">Account Name:</span>
                  <span className="font-semibold text-white">{userProfile.name}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-400">Recognized Email:</span>
                  <span className="font-mono text-pink-300">{userProfile.email}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="text-zinc-400">Plan Tier:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                    VIP LIFETIME FREE (₹0)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handleActivateVIP}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ensure VIP Pass Is Active</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
