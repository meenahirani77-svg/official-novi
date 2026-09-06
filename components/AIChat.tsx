/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Wand2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: '⚡ Welcome to NoviCut AI Studio! I am your AI Video Director. Ask me for viral reel hooks, script ideas, color grading presets, or transition tips.' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(scrollToBottom, 50);

    const responseText = await sendMessageToGemini(textToSend);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const quickPrompts = [
    "Viral hooks for 15s reel",
    "How to make smooth beat cuts?",
    "Best color preset for night shots",
    "Cyberpunk speed ramp tips"
  ];

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end pointer-events-auto">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-3 w-[92vw] max-w-sm bg-[#0e041d]/95 backdrop-blur-2xl border border-pink-500/40 rounded-3xl overflow-hidden shadow-[0_0_45px_rgba(217,70,239,0.35)] flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-900/60 to-purple-900/60 p-3.5 px-4 flex justify-between items-center border-b border-pink-500/30">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm tracking-wider flex items-center gap-1.5">
                    <span>NOVICUT AI</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-pink-500/30 text-pink-300 font-mono">COPILOT</span>
                  </h3>
                  <p className="text-[10px] text-zinc-400">Real-time Video & Script Director</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={chatContainerRef}
              className="h-72 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-tr-none'
                        : 'bg-white/[0.06] text-zinc-200 rounded-tl-none border border-pink-500/20'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-2.5 px-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
              {quickPrompts.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-2 py-1 rounded-lg bg-white/5 hover:bg-pink-500/20 hover:border-pink-500/40 border border-white/10 text-[10px] text-zinc-300 whitespace-nowrap cursor-pointer transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/40">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask for hooks, color advice, speed curves..."
                  className="flex-1 bg-[#16062a] border border-pink-500/30 rounded-xl px-3 py-2 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-pink-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shadow-[0_0_10px_#ec4899]"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button with Glowing Ring */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 md:w-13 md:h-13 rounded-2xl bg-gradient-to-tr from-pink-600 via-fuchsia-600 to-purple-600 flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.7)] border border-pink-300/40 z-50 cursor-pointer"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#0e041d] animate-pulse" />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
