import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, Bot, ShieldAlert, Sparkles, CheckCircle2, Waves, Trees, Camera, Paperclip, X } from "lucide-react";
import { BotChatMessage } from "../types";

interface BotanyDoctorProps {
  onChallengeProgress: (type: "clipping" | "sharing" | "diagnosing" | "planting" | "purchasing", amount: number) => void;
  chatHistory: BotChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<BotChatMessage[]>>;
}

export default function BotanyDoctor({ onChallengeProgress, chatHistory, setChatHistory }: BotanyDoctorProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("Doctor is online");
  
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedPrompts = [
    { text: "My Rose leaves have powdery white spots. What's the cure?", icon: "🌹" },
    { text: "Suggest organic recipes to drive away leaf mites in summer.", icon: "🍋" },
    { text: "How do I water indoor Money plants without causing root-rot?", icon: "💧" },
    { text: "List 3 gorgeous shade plants needing sparse window sunshine.", icon: "🌿" },
  ];

  const botanicalTips = [
    "🌱 Examining chlorophyll cell density...",
    "🧪 Analyzing foliar moisture saturation...",
    "🌾 Root rhizosphere defense active...",
    "🍂 Comparing viral leaf spot patterns...",
    "🌿 Cultivating premium botanical remedy recipes...",
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  // Rotator tips while loading
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let idx = 0;
      interval = setInterval(() => {
        setStatusText(botanicalTips[idx % botanicalTips.length]);
        idx++;
      }, 2500);
    } else {
      setStatusText("Dr. Gul is ready to consult");
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageBase64(reader.result as string);
        setSelectedImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSend = async (messageText: string, attachedImage: string | null = null) => {
    if ((!messageText.trim() && !attachedImage) || loading) return;

    const currentImage = attachedImage || selectedImageBase64;

    const userMsg: BotChatMessage = {
      id: `usr-${Date.now()}`,
      role: "user",
      text: messageText || "Please analyze this uploaded plant image diagnostic sample.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: currentImage || undefined,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedImageBase64(null);
    setSelectedImageName(null);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText || "Analyze this plant visual pathology diagnostic specimen.",
          image: currentImage ? {
            data: currentImage,
            mimeType: currentImage.match(/data:([^;]+);/)?.[1] || "image/jpeg"
          } : undefined,
          history: chatHistory.map((h) => ({
            role: h.role,
            text: h.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Diagnosis database lookup returned an issue.");
      }

      const data = await response.json();

      const botMsg: BotChatMessage = {
        id: `bot-${Date.now()}`,
        role: "model",
        text: data.text || "I was unable to retrieve a diagnostic reading.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, botMsg]);

      // Complete Botany Doctor challenge increment
      onChallengeProgress("diagnosing", 1);
    } catch (error) {
      console.error(error);
      const errorMsg: BotChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: "model",
        text: "🌸 **Prescription Dispatch Failure**:\n\nMy organic scanner encountered trouble communicating with Dr. Gul. Note that this could be due to network fluctuations. Please check if your `GEMINI_API_KEY` is loaded in the secrets panel or retry shortly!\n\nHere's a standard quick diagnostic guideline for general plant stress:\n* Assess if the container has standing water underneath.\n* Scrape the surface of the stem to verify if it is healthy green.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl py-6 px-4 sm:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Helper Sidebar */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          <div className="rounded-[32px] border-2 border-forest-900/10 bg-cream-50 p-5 shadow-sm">
            <div className="flex items-center space-x-2 pb-3 border-b border-forest-100">
              <Bot className="h-5 w-5 text-sage-500" />
              <h3 className="font-display font-bold text-forest-900 text-sm">Doctor Office</h3>
            </div>
            <p className="text-xs text-forest-700 mt-3 leading-relaxed">
              Dr. Gul is our customized **AI Botanical Expert**. He handles pathology questions, analyzes symptoms, and creates organic home treatments!
            </p>
            <div className="mt-4 flex flex-col space-y-2">
              <div className="flex items-center space-x-2 text-xs text-sage-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5 text-sage-500 shrink-0" />
                <span>Diagnostics free</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-sage-700 font-semibold font-semibold">
                <Waves className="h-3.5 w-3.5 text-sage-500 shrink-0" />
                <span>Eco watering plans</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-sage-700 font-semibold font-semibold">
                <Trees className="h-3.5 w-3.5 text-sage-500 shrink-0" />
                <span>100% Organic remedies</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-sage-700 font-bold text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-xl">
                <Camera className="h-3.5 w-3.5 shrink-0" />
                <span>Visual Check Enabled</span>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="rounded-[32px] border-2 border-gold-400/40 bg-amber-500/5 p-5">
            <h4 className="font-display text-xs font-bold text-gold-600 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Doctor's Tip</span>
            </h4>
            <p className="text-xs text-forest-800 mt-2 italic leading-relaxed">
              "Most home plants don't drown from watering too much volume, but rather watering **too frequently**. Allow oxygen back to the potting loam before drowning it!"
            </p>
          </div>
        </div>

        {/* Core Chat Console */}
        <div className="lg:col-span-3 flex flex-col h-[580px] rounded-[32px] border-2 border-forest-900/10 bg-cream-50 overflow-hidden shadow-sm">
          
          {/* Header Status */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100 bg-forest-900 text-cream-50">
            <div className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-gold-500 border border-white/10">
                <Sparkles className="h-5 w-5 text-gold-500 animate-spin-slow" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-forest-900" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-sm tracking-wide">Dr. Gul, Botanical AI</h4>
                <p className="text-[10px] text-sage-200 font-mono tracking-tight">{statusText}</p>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-gold-400 border border-gold-400/30">
              Vision Mode Active
            </span>
          </div>

          {/* Hidden File Input for Image & Camera */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            capture="environment"
            className="hidden"
          />

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-cream-100/50">
            {chatHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                <div className="h-16 w-16 rounded-full bg-sage-100 flex items-center justify-center text-3xl animate-bounce">
                  🩺
                </div>
                <div className="max-w-md">
                  <h3 className="font-display text-lg font-bold text-forest-900">Consult Dr. Gul</h3>
                  <p className="text-xs text-forest-700 mt-1.5 leading-relaxed">
                    Attach a real picture of your sick plants or select a preset diagnostic starting prompt below:
                  </p>
                </div>

                {/* Quick Start Questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg mt-6">
                  {predefinedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.text)}
                      className="flex items-start text-left p-3 rounded-xl border border-forest-100 bg-cream-50 hover:bg-forest-100/50 hover:border-sage-500 hover:scale-[1.01] transition-all group cursor-pointer animate-fadeIn"
                    >
                      <span className="text-lg mr-2 shrink-0">{p.icon}</span>
                      <span className="text-[11px] font-bold text-forest-900 leading-tight group-hover:text-forest-950">
                        {p.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((msg) => {
                  const isBot = msg.role === "model";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`flex items-start max-w-[85%] space-x-2.5 ${isBot ? "" : "flex-row-reverse space-x-reverse"}`}>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                          isBot ? "bg-forest-900 text-gold-500" : "bg-sage-500 text-cream-50"
                        }`}>
                          {isBot ? <Bot className="h-4 w-4" /> : "👤"}
                        </div>
                        <div className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-2xs leading-relaxed ${
                          isBot
                            ? "bg-cream-50 border border-forest-100 text-forest-950 prose prose-slate max-w-none"
                            : "bg-forest-900 text-cream-50"
                        }`}>
                          {/* Attached visual thumbnail rendering */}
                          {msg.image && (
                            <div className="mb-2.5 overflow-hidden rounded-xl border border-white/20 select-none">
                              <img
                                src={msg.image}
                                alt="Diagnose preview specimen file"
                                referrerPolicy="no-referrer"
                                className="max-h-48 w-full object-cover rounded-xl shadow-xs"
                              />
                            </div>
                          )}

                          <div className="whitespace-pre-line">
                            {msg.text}
                          </div>
                          
                          <div className={`text-[9px] mt-1.5 text-right ${isBot ? "text-sage-500" : "text-cream-200"}`}>
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pulsing bot analyzer block */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-[80%] space-x-2.5 animate-pulse">
                      <div className="h-8 w-8 rounded-lg bg-forest-900 text-gold-500 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-cream-100 border border-sage-200/50 rounded-2xl p-4">
                        <div className="flex items-center space-x-2 flex-wrap gap-2">
                          <div className="flex space-x-1.5">
                            <div className="h-1.5 w-1.5 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                            <div className="h-1.5 w-1.5 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="h-1.5 w-1.5 bg-sage-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span className="text-[11px] font-bold text-sage-600 font-mono italic">
                            {statusText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Attached Image Thumbnail Preview above typing area */}
          {selectedImageBase64 && (
            <div className="px-4 py-2 border-t border-forest-100 bg-[#FAF9F5] flex items-center justify-between gap-1.5 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <img
                  src={selectedImageBase64}
                  alt="upload preview"
                  referrerPolicy="no-referrer"
                  className="h-10 w-10 rounded-lg object-cover border border-[#88A070]"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] text-forest-800 font-bold max-w-[150px] truncate leading-tight">{selectedImageName}</span>
                  <span className="text-[8px] text-sage-500 font-mono">Attachment ready</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedImageBase64(null);
                  setSelectedImageName(null);
                }}
                className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-full transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Typing dock */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-forest-100 bg-cream-50 flex items-center space-x-2"
          >
            {/* Camera / File picker attach button */}
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={loading}
              title="Camera & Picture Diagnostics"
              className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-[#FAF9F5] border border-forest-100 text-[#1B3022] hover:bg-[#88A070]/10 hover:border-[#88A070] disabled:opacity-50 transition-all cursor-pointer"
            >
              <Camera className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query Dr. Gul or choose an attached photo..."
              disabled={loading}
              className="flex-1 rounded-xl border border-forest-100 bg-cream-100/30 px-3 py-2.5 text-xs sm:text-sm text-forest-950 placeholder-sage-400 focus:outline-hidden focus:ring-1 focus:ring-sage-500 focus:border-sage-500 font-semibold"
            />
            <button
              type="submit"
              disabled={(!input.trim() && !selectedImageBase64) || loading}
              className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-forest-900 hover:bg-forest-950 text-cream-50 disabled:bg-sage-200 disabled:text-sage-400 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
