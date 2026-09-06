/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
}

export interface AIAutoEditResult {
  title: string;
  pacing: string;
  musicGenre: string;
  recommendedFilters: string[];
  captions: { time: number; text: string; highlight: string }[];
  visualEffects: string[];
  tips: string[];
}

export const generateAIAutoEdit = async (
  prompt: string, 
  style: 'Cinematic' | 'Trending' | 'Aesthetic' | 'Cyberpunk'
): Promise<AIAutoEditResult> => {
  const client = getAiClient();
  
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are NoviCut's AI Video Director. Analyze this video request:
User Prompt: "${prompt}"
Editing Style: "${style}"

Generate a structured video editing plan in JSON format with the following keys:
{
  "title": "A catchy video title",
  "pacing": "Fast cut / Smooth cinematic / Dynamic beat sync",
  "musicGenre": "Synthwave / Chill Lo-Fi / Upbeat Pop / Cyberpunk / Ethereal Techno",
  "recommendedFilters": ["3-4 filter names like Cinematic Warm, Cyber Glow, Neon Magenta"],
  "captions": [
    {"time": 0.5, "text": "Short punchy hook sentence", "highlight": "hook word"},
    {"time": 2.5, "text": "Engaging second line", "highlight": "key word"},
    {"time": 5.0, "text": "Climactic moment text", "highlight": "action word"},
    {"time": 8.0, "text": "Closing call to action or outro", "highlight": "outro"}
  ],
  "visualEffects": ["Glitch at drop", "RGB split transition", "Neon light leak", "Subtle zoom in"],
  "tips": ["Two quick pro-tips for the editor on beat drops and color grading"]
}
Return ONLY valid JSON.`,
      });

      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        title: parsed.title || "NoviCut AI Edit",
        pacing: parsed.pacing || "Dynamic Beat Sync",
        musicGenre: parsed.musicGenre || "Cyberpunk Synth",
        recommendedFilters: parsed.recommendedFilters || ["Cyber Glow", "Neon Magenta", "Vibrant Contrast"],
        captions: parsed.captions || [
          { time: 1.0, text: "Unleash the Neon Energy", highlight: "Energy" },
          { time: 3.5, text: "Turn moments into cinematic art", highlight: "Cinematic" }
        ],
        visualEffects: parsed.visualEffects || ["RGB Split", "Neon Glow", "Beat Zoom"],
        tips: parsed.tips || ["Sync your major cut points to the bass drop for maximum impact."]
      };
    } catch (err) {
      console.warn("Gemini API fallback to local intelligent generator:", err);
    }
  }

  // Fallback high-quality structured generator
  const keywords = prompt.toLowerCase();
  let genre = "Cyberpunk Synth";
  let filterList = ["Neon Magenta", "Cyber Glow", "Deep Violet"];
  if (keywords.includes("travel") || keywords.includes("vlog")) {
    genre = "Chill Lo-Fi & Ambient";
    filterList = ["Warm Sunlight", "Cinematic Teal", "Aesthetic Fade"];
  } else if (keywords.includes("birthday") || keywords.includes("party")) {
    genre = "Upbeat Dance & Pop";
    filterList = ["Vibrant Pop", "Golden Glow", "Party Flash"];
  } else if (keywords.includes("love") || keywords.includes("wedding")) {
    genre = "Ethereal Romantic Piano";
    filterList = ["Pastel Soft", "Dreamy Vignette", "Warm Candlelight"];
  }

  return {
    title: prompt ? `NoviCut: ${prompt.slice(0, 30)}...` : "Cinematic Neon Journey",
    pacing: style === 'Cinematic' ? 'Smooth slow-mo with speed ramps' : 'High-energy beat sync cuts',
    musicGenre: genre,
    recommendedFilters: filterList,
    captions: [
      { time: 0.8, text: "Turn ordinary moments into pure magic", highlight: "magic" },
      { time: 3.2, text: "Living in the rhythm of the city lights", highlight: "lights" },
      { time: 6.0, text: "Every frame tells an unforgettable story", highlight: "story" },
      { time: 9.0, text: "Created with NoviCut AI Studio", highlight: "NoviCut" }
    ],
    visualEffects: ["Glitch on beat 1", "RGB Split transition", "Neon edge glow", "Smooth pan & zoom"],
    tips: [
      "Use 0.8s crossfades between landscape shots.",
      "Apply speed curve ramping (2x to 0.5x) right before each transition."
    ]
  };
};

export const generateAICaptionsFromText = async (topic: string): Promise<{ time: number; text: string; highlight: string }[]> => {
  const client = getAiClient();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create 4 short, viral, trendy video captions with timestamps for: "${topic}".
Output JSON array: [{"time": number, "text": string, "highlight": string}] only.`,
      });
      const text = response.text?.trim() || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch {
      // fallback
    }
  }

  return [
    { time: 0.5, text: "Ready to elevate your game?", highlight: "elevate" },
    { time: 2.8, text: "Pushing limits beyond imagination", highlight: "limits" },
    { time: 5.2, text: "Feel the pulse of every heartbeat", highlight: "pulse" },
    { time: 7.8, text: "This is just the beginning", highlight: "beginning" }
  ];
};

export const generateAIVideoIdeas = async (category: string): Promise<{ title: string; hook: string; style: string }[]> => {
  const client = getAiClient();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate 4 creative trending short video ideas for category: "${category}".
Format JSON array: [{"title": string, "hook": string, "style": string}] only.`,
      });
      const text = response.text?.trim() || '';
      const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(clean);
    } catch {
      // fallback
    }
  }

  return [
    { title: "Neon Cyber Glitch Story", hook: "Wait till you see the 3D transition...", style: "Cyberpunk & Fast Cuts" },
    { title: "Aesthetic Day in My Life", hook: "The 3 habits that changed everything", style: "Minimalist Soft Glow" },
    { title: "Speed Ramp Cinematic Reel", hook: "Stop scrolling: you need to try this angle", style: "High Contrast 4K" },
    { title: "Dreamy Photo Dump Recap", hook: "Reminiscing the best moments with loved ones", style: "Vintage VHS & Bokeh" }
  ];
};

export const sendMessageToGemini = async (
  message: string,
  _history?: { role: string; text: string }[]
): Promise<string> => {
  const client = getAiClient();
  if (client) {
    try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are NoviCut AI Video Assistant. You help video creators with viral hooks, scripting, pacing, color grading, and video editing advice.
User question: "${message}"
Provide a helpful, stylish, and direct response with actionable video editing advice in 2-3 concise paragraphs.`,
      });
      return response.text?.trim() || "Here's how to elevate your edit: synchronize your cuts with the drum transients and use a 15% vignette for deeper immersion.";
    } catch (err) {
      console.warn("Gemini chat fallback:", err);
    }
  }

  // Fallback responses
  const q = message.toLowerCase();
  if (q.includes('hook') || q.includes('viral')) {
    return "🔥 Top Viral Hook Ideas for your video:\n1. 'Stop making this video editing mistake in 2025...'\n2. 'Here is the 3-second camera trick that doubled my engagement...'\n3. 'If you want your reels to look like a $10,000 cinema camera, try this filter preset.'\nPair this with a 0.3s fast zoom-in and glitch audio pop!";
  }
  if (q.includes('transition') || q.includes('cut')) {
    return "✨ Pro Transition Tip: Use NoviCut's Speed Curve! Ramp the speed up to 2.5x during the last 0.4s of Clip 1, and start Clip 2 at 2.5x slowing down to 1.0x with an RGB Split flash.";
  }
  if (q.includes('music') || q.includes('song') || q.includes('audio')) {
    return "🎵 Recommended Audio Vibe: For neon aesthetic or cyberpunk edits, use a track with 125-130 BPM featuring deep analog sub-bass and arpeggiated synths. Check out 'Cyber Pulse Resonance' in our Music catalog!";
  }
  return "⚡ NoviCut Studio Tip: To achieve that dreamy cinematic neon look, head over to the Adjust tool, set Brightness to 105%, Contrast to 125%, and add a subtle 20% Vignette with the 'Neon Magenta' preset!";
};
