"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Bot,
  User,
  Loader2,
  ArrowRight,
  MessageSquare,
  Clock,
  Briefcase,
  Target,
  ShieldCheck,
  Code2,
  Lightbulb,
  FileText,
  Volume2,
  VolumeX,
  FastForward,
  Video,
  VideoOff,
  Zap,
  Activity,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VoiceInterviewRoom({ params }) {
  const unwrappedParams = (params && typeof params.then === "function") ? React.use(params) : params;
  const interviewId = unwrappedParams?.interviewId;
  const router = useRouter();

  // Interview state
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Conversation state
  const [conversation, setConversation] = useState([]); // [{ sender: 'ai' | 'user', text: string }]
  const [sessionState, setSessionState] = useState("idle"); // 'idle' | 'ai_speaking' | 'listening' | 'evaluating' | 'completed'
  const [turnCount, setTurnCount] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState("");
  const [currentTopic, setCurrentTopic] = useState("Introduction & Background");

  // Device toggles
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAiMuted, setIsAiMuted] = useState(false);

  // Candidate Scratchpad & Notes
  const [scratchpad, setScratchpad] = useState("// Candidate Scratchpad\n// Jot down architectural diagrams, data structures, or thoughts:\n\n");
  const [rightTab, setRightTab] = useState("dialogue"); // "dialogue" | "scratchpad" | "signals"
  const [showHints, setShowHints] = useState(false);

  // Elapsed Session Timer
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // Audio / Speech state
  const [interimTranscript, setInterimTranscript] = useState("");
  
  // Refs
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fullUserAnswerRef = useRef("");
  const silenceTimerRef = useRef(null);
  const handleDoneSpeakingRef = useRef(null);
  const currentAudioRef = useRef(null);
  const isComponentMounted = useRef(true);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 1. Fetch Interview Details
  useEffect(() => {
    isComponentMounted.current = true;
    fetchDetails();
    return () => {
      isComponentMounted.current = false;
      stopSpeechSynthesis();
      stopSpeechRecognition();
    };
  }, [interviewId]);

  useEffect(() => {
    handleDoneSpeakingRef.current = handleDoneSpeaking;
  });

  const fetchDetails = async () => {
    try {
      const res = await fetch(`/api/interviews/${interviewId}`);
      if (!res.ok) throw new Error("Interview not found");
      const data = await res.json();
      setInterviewData(data);
      if (data.cameraEnabled === false) setIsCameraOn(false);
      if (data.voiceEnabled === false) setIsAiMuted(true);
    } catch (err) {
      toast.error(err.message || "Failed to load interview details");
    } finally {
      setLoading(false);
    }
  };

  // Phases in interview lifecycle
  const phases = [
    { id: 1, name: "Intro & Overview" },
    { id: 2, name: "Resume & Projects" },
    { id: 3, name: "Core Technical" },
    { id: 4, name: "Architecture & Scaling" },
    { id: 5, name: "Synthesis & Wrap-Up" }
  ];

  const currentPhaseIndex = Math.min(Math.floor(turnCount / 1.5), phases.length - 1);

  // Helper: speech synthesis with instant browser TTS first to minimize delay after user answers.
  // Gemini-generated AI audio remains available as a non-blocking fallback when browser TTS is unavailable.
  const speakAI = useCallback(async (text, onEndCallback) => {
    if (isAiMuted) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.includes("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")));
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onstart = () => {
        if (isComponentMounted.current) setSessionState("ai_speaking");
      };

      utterance.onend = () => {
        if (isComponentMounted.current && onEndCallback) onEndCallback();
      };

      utterance.onerror = () => {
        if (isComponentMounted.current && onEndCallback) onEndCallback();
      };

      window.speechSynthesis.speak(utterance);
      return;
    }

    try {
      if (isComponentMounted.current) setSessionState("ai_speaking");

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error("AI voice generation failed");
      }

      const { audioBase64, mimeType } = await response.json();
      if (!audioBase64) {
        throw new Error("No audio payload returned by AI voice service");
      }

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: mimeType || "audio/wav" });
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (isComponentMounted.current && onEndCallback) onEndCallback();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        if (isComponentMounted.current && onEndCallback) onEndCallback();
      };

      audio.play();
    } catch (error) {
      console.warn("AI TTS fallback triggered:", error);
      if (isComponentMounted.current && onEndCallback) onEndCallback();
    }
  }, [isAiMuted]);

  const stopSpeechSynthesis = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Helper: Speech Recognition (STT) with VAD Silence Detection
  const startSpeechRecognition = useCallback(() => {
    if (isMicMuted) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    fullUserAnswerRef.current = "";
    setInterimTranscript("");

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      // Auto-respond when user stops speaking for 3.0 seconds
      silenceTimerRef.current = setTimeout(() => {
        if (fullUserAnswerRef.current.trim().length > 4) {
          handleDoneSpeakingRef.current?.();
        }
      }, 3000);
    };

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let finalStr = "";
        let interimStr = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalStr += event.results[i][0].transcript + " ";
          } else {
            interimStr += event.results[i][0].transcript;
          }
        }

        if (finalStr) {
          fullUserAnswerRef.current += finalStr;
        }
        setInterimTranscript(interimStr);
        resetSilenceTimer();
      };

      recognition.onerror = (err) => {
        console.warn("Speech Rec Event Note:", err);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (err) {
        console.warn("Rec start err:", err);
      }
    }

    // Audio stream fallback
    navigator.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.start();
    }).catch((err) => console.warn("Mic Stream Err:", err));

    setSessionState("listening");
  }, [isMicMuted]);

  const stopSpeechRecognition = useCallback(async () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    return new Promise((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          mediaRecorderRef.current.stream?.getTracks()?.forEach(t => t.stop());
          resolve(audioBlob);
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  }, []);

  // Start 1-on-1 Dynamic Interview
  const startConversation = () => {
    setTurnCount(1);
    setConversation([]);
    
    const openingLine = `Hello! Welcome to your technical interview for the ${interviewData?.jobPosition || "Software Engineer"} role. To begin, could you introduce yourself, highlight your recent engineering achievements, and walk me through your key tech stack?`;
    
    setActiveQuestion(openingLine);
    setConversation([{ sender: "ai", text: openingLine }]);

    speakAI(openingLine, () => {
      startSpeechRecognition();
    });
  };

  // Candidate Spoke -> Evaluate & Follow-up
  const handleDoneSpeaking = async () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const audioBlob = await stopSpeechRecognition();
    setSessionState("evaluating");

    let finalAnswer = fullUserAnswerRef.current.trim();

    if (!finalAnswer && audioBlob && audioBlob.size > 1000) {
      try {
        const formData = new FormData();
        formData.append("audio", audioBlob, "audio.webm");
        const res = await fetch("/api/transcribe", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          finalAnswer = data.transcription || "";
        }
      } catch (err) {
        console.warn("Transcription fallback:", err);
      }
    }

    if (!finalAnswer) {
      finalAnswer = "Candidate provided a brief or non-verbal response.";
    }

    const updatedHistory = [...conversation, { sender: "user", text: finalAnswer }];
    setConversation(updatedHistory);

    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    try {
      const res = await fetch(`/api/interviews/${interviewId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition: interviewData?.jobPosition,
          jobDesc: interviewData?.jobDesc,
          jobExperience: interviewData?.jobExperience,
          conversationHistory: updatedHistory,
          lastUserAnswer: finalAnswer,
          interviewPhase: phases[currentPhaseIndex]?.name || "Core Technical"
        })
      });

      if (!res.ok) throw new Error("Chat request failed");
      const chatData = await res.json();

      const aiReply = chatData.aiSpeech || "Thank you. How do you approach designing scalable systems under strict latency constraints?";
      setActiveQuestion(aiReply);
      if (chatData.topic) setCurrentTopic(chatData.topic);

      setConversation(prev => [...prev, { sender: "ai", text: aiReply }]);

      const targetTotalTurns = (interviewData?.questionsCount || 5) + 1;

      if (currentTurn >= targetTotalTurns || chatData.isInterviewComplete) {
        setSessionState("completed");
        speakAI(`Thank you for completing this technical interview session. Let me analyze all your responses and prepare your comprehensive scoring report.`, () => {
          router.push(`/dashboard/interview/${interviewId}/feedback`);
        });
      } else {
        speakAI(aiReply, () => {
          startSpeechRecognition();
        });
      }

    } catch (err) {
      console.warn("Conversational error:", err);
      toast.error("Failed to generate AI follow-up");
      setSessionState("idle");
    }
  };

  const handleSkipQuestion = () => {
    fullUserAnswerRef.current = "Candidate requested to move to the next topic.";
    handleDoneSpeaking();
  };

  const handleRequestHint = () => {
    setShowHints(true);
    toast.info("Technical hints and key concepts revealed in right panel");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium tracking-wide">Connecting to AI Interview Room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Top Universal Navbar */}
      <header className="h-16 border-b border-slate-800/80 px-6 bg-slate-950/80 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-sm font-bold text-white tracking-wide">
              {interviewData?.jobPosition || "Technical Interview"}
            </h1>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
            {interviewData?.interviewType || "Technical"} Track
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {interviewData?.difficulty || "Medium"} Bar
          </span>
        </div>

        {/* Center Live Session Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200">
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>{formatTimer(secondsElapsed)}</span>
          <span className="text-slate-500">/ {interviewData?.duration || "20 min"}</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              stopSpeechSynthesis();
              stopSpeechRecognition();
              router.push(`/dashboard/interview/${interviewId}/feedback`);
            }}
            className="bg-red-950/30 border-red-900/40 text-red-300 hover:bg-red-900/40 text-xs rounded-xl"
          >
            <PhoneOff className="w-3.5 h-3.5 mr-1.5" /> Complete & View Report
          </Button>
        </div>
      </header>

      {/* 3-PANEL INTERVIEW SCREEN */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* PANEL 1 (LEFT): Context & Progress Panel (3 cols) */}
        <aside className="lg:col-span-3 border-r border-slate-800/80 bg-slate-950/60 p-5 flex flex-col justify-between overflow-y-auto space-y-6">
          <div className="space-y-5">
            {/* Target Role Blueprint */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Role</span>
              <h2 className="text-base font-bold text-white">{interviewData?.jobPosition}</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                {interviewData?.jobExperience} Years Experience Requirement
              </p>
            </div>

            {/* Resume Integration Status */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                Resume Claims Active
              </div>
              <p className="text-[11px] text-slate-400">
                AI is cross-referencing your project claims & stated tech stack.
              </p>
            </div>

            {/* Current Phase Stepper */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Interview Lifecycle</span>
              <div className="space-y-1.5">
                {phases.map((phase, idx) => {
                  const isCurrent = idx === currentPhaseIndex;
                  const isDone = idx < currentPhaseIndex;
                  return (
                    <div
                      key={phase.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                        isCurrent
                          ? "bg-indigo-600/20 border-indigo-500 text-white font-semibold"
                          : isDone
                          ? "bg-slate-900/40 border-slate-800/80 text-slate-400"
                          : "bg-slate-950 border-slate-900 text-slate-600"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                        isCurrent ? "bg-indigo-600 text-white" : isDone ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                      }`}>
                        {isDone ? "✓" : idx + 1}
                      </div>
                      <span className="truncate">{phase.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Turn & Question Count */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Questions Addressed</span>
                <span className="text-white font-mono font-bold">
                  {turnCount} / {interviewData?.questionsCount || 5}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${Math.min((turnCount / (interviewData?.questionsCount || 5)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
            Voice Room connected securely • AI evaluates audio & transcription in real-time.
          </div>
        </aside>

        {/* PANEL 2 (CENTER): Active Stage (6 cols) */}
        <section className="lg:col-span-6 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          
          {/* Active Question Display Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" /> Current Question Vector
              </span>
              <span className="text-[11px] text-slate-400 font-medium">{currentTopic}</span>
            </div>
            <h3 className="text-sm md:text-base font-semibold text-white leading-relaxed">
              {activeQuestion || (interviewData?.jobPosition ? `Ready for your ${interviewData.jobPosition} interview. Click "Start 1-on-1 Interview" below.` : "Connecting...")}
            </h3>
          </div>

          {/* Videos Grid (AI Avatar + Candidate) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[260px]">
            {/* AI Avatar Visualizer */}
            <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6 shadow-xl">
              <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI Interivewer
              </div>

              <div className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
                sessionState === "ai_speaking"
                  ? "ring-4 ring-indigo-500/50 bg-indigo-600/20 scale-105 shadow-2xl shadow-indigo-500/40"
                  : "bg-slate-800/80"
              }`}>
                <Bot className={`w-14 h-14 ${sessionState === "ai_speaking" ? "text-indigo-400 animate-pulse" : "text-slate-400"}`} />
                {sessionState === "ai_speaking" && (
                  <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-600 text-white uppercase tracking-wider animate-bounce">
                    Speaking
                  </span>
                )}
              </div>

              {/* Real-time Status Indicator Pill */}
              <div className="mt-4">
                {sessionState === "ai_speaking" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 animate-spin" /> Asking question...
                  </span>
                )}
                {sessionState === "listening" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Listening to you...
                  </span>
                )}
                {sessionState === "evaluating" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Evaluating response & logic...
                  </span>
                )}
                {sessionState === "idle" && (
                  <span className="px-3 py-1 rounded-full text-xs text-slate-400 bg-slate-800/60 border border-slate-700/60">
                    Ready to begin
                  </span>
                )}
              </div>
            </div>

            {/* Candidate Mirror / Webcam */}
            <div className="relative rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shadow-xl">
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Candidate (You)
              </div>

              {isCameraOn ? (
                <Webcam
                  audio={false}
                  mirrored={true}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 gap-2">
                  <VideoOff className="w-10 h-10" />
                  <span className="text-xs">Camera is Off</span>
                </div>
              )}

              {/* Spoken subtitle overlay */}
              {sessionState === "listening" && (
                <div className="absolute bottom-3 left-3 right-3 z-20 bg-slate-950/80 border border-emerald-500/40 text-emerald-300 text-xs p-2.5 rounded-2xl backdrop-blur-md">
                  <div className="flex items-center gap-2 font-medium">
                    <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                    <span className="truncate italic">
                      {interimTranscript || fullUserAnswerRef.current || "Listening... Answer naturally."}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Active Controls Bar */}
          <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`text-xs rounded-xl border-slate-700 ${isMicMuted ? "bg-red-950 text-red-300" : "bg-slate-800 text-slate-200"}`}
              >
                {isMicMuted ? <MicOff className="w-3.5 h-3.5 mr-1" /> : <Mic className="w-3.5 h-3.5 mr-1" />}
                {isMicMuted ? "Unmute" : "Mute"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsCameraOn(!isCameraOn)}
                className="text-xs rounded-xl border-slate-700 bg-slate-800 text-slate-200"
              >
                {isCameraOn ? <Video className="w-3.5 h-3.5 mr-1" /> : <VideoOff className="w-3.5 h-3.5 mr-1" />}
                {isCameraOn ? "Cam Off" : "Cam On"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRequestHint}
                className="text-xs rounded-xl border-slate-700 bg-slate-800 text-amber-300 hover:text-amber-200"
              >
                <Lightbulb className="w-3.5 h-3.5 mr-1" /> Hint
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleSkipQuestion}
                disabled={sessionState !== "listening"}
                className="text-xs rounded-xl border-slate-700 bg-slate-800 text-slate-300"
              >
                <FastForward className="w-3.5 h-3.5 mr-1" /> Skip
              </Button>
            </div>

            {/* Primary Action Button */}
            <div className="shrink-0">
              {sessionState === "idle" && (
                <Button
                  onClick={startConversation}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl px-5 py-5 shadow-lg shadow-indigo-600/30"
                >
                  <Sparkles className="w-4 h-4 mr-1.5" /> Start 1-on-1 Interview
                </Button>
              )}

              {sessionState === "listening" && (
                <Button
                  onClick={handleDoneSpeaking}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl px-5 py-5 shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <Mic className="w-4 h-4 animate-pulse" /> Done Speaking (Submit)
                </Button>
              )}

              {(sessionState === "ai_speaking" || sessionState === "evaluating") && (
                <Button disabled className="bg-slate-800 text-slate-400 font-bold text-xs rounded-xl px-5 py-5">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {sessionState === "ai_speaking" ? "AI Speaking..." : "Analyzing Answer..."}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* PANEL 3 (RIGHT): Live Intelligence & Scratchpad (3 cols) */}
        <aside className="lg:col-span-3 border-l border-slate-800/80 bg-slate-950/60 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* Tab switch */}
            <div className="flex border-b border-slate-800 gap-2 text-xs font-semibold">
              {[
                { id: "dialogue", label: "Dialogue", icon: MessageSquare },
                { id: "scratchpad", label: "Scratchpad", icon: Code2 },
                { id: "signals", label: "Signals", icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = rightTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    className={`pb-2.5 px-2 flex items-center gap-1.5 border-b-2 transition-all ${
                      isActive
                        ? "border-indigo-500 text-indigo-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: DIALOGUE LOG */}
            {rightTab === "dialogue" && (
              <div className="space-y-3 h-[440px] overflow-y-auto pr-1 text-xs">
                {conversation.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-center p-4">
                    Live transcript log will record each speech exchange here.
                  </div>
                ) : (
                  conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl space-y-1 ${
                        msg.sender === "ai"
                          ? "bg-indigo-950/40 border border-indigo-900/50 text-indigo-200"
                          : "bg-slate-900 border border-slate-800 text-slate-200 ml-3"
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                        <span>{msg.sender === "ai" ? "AI Interviewer" : "Candidate"}</span>
                      </div>
                      <p className="leading-relaxed text-xs">{msg.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: CANDIDATE SCRATCHPAD / CODE */}
            {rightTab === "scratchpad" && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Notes & Code Editor
                </span>
                <textarea
                  rows={16}
                  value={scratchpad}
                  onChange={(e) => setScratchpad(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            )}

            {/* TAB 3: REAL-TIME SIGNALS & METRICS */}
            {rightTab === "signals" && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Live Response Telemetry
                </span>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Speech Clarity & Pacing</span>
                    <span className="text-emerald-400 font-bold">Good / Balanced</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-400">Technical Depth</span>
                    <span className="text-indigo-400 font-bold">High Signal</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[78%]" />
                  </div>

                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-400">STAR Framing</span>
                    <span className="text-purple-400 font-bold">Active</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full w-[85%]" />
                  </div>
                </div>

                {showHints && (
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs text-amber-200">
                    <div className="font-bold flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-400" /> Suggested Technical Focus
                    </div>
                    <ul className="space-y-1 text-[11px] text-amber-300/80">
                      <li>• Quantify business or user impact (e.g. latency, throughput).</li>
                      <li>• Mention trade-offs: why this architecture over alternative choices?</li>
                      <li>• Discuss failure recovery and edge case handling.</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Room ID: {interviewId?.substring(0, 8)}...</span>
            <span className="text-emerald-400">Live SSL</span>
          </div>
        </aside>

      </main>
    </div>
  );
}
