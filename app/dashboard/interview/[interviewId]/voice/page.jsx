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
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function VoiceInterviewRoom({ params }) {
  const { interviewId } = params;
  const router = useRouter();

  // State
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Conversation state
  const [conversation, setConversation] = useState([]); // [{ sender: 'ai' | 'user', text: string }]
  const [sessionState, setSessionState] = useState("idle"); // 'idle' | 'ai_speaking' | 'listening' | 'evaluating' | 'completed'
  const [turnCount, setTurnCount] = useState(0); // Max ~5 exchanges

  // Audio / Speech state
  const [interimTranscript, setInterimTranscript] = useState("");
  
  // Refs
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fullUserAnswerRef = useRef("");
  const silenceTimerRef = useRef(null);
  const handleDoneSpeakingRef = useRef(null);
  const isComponentMounted = useRef(true);

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
    } catch (err) {
      toast.error(err.message || "Failed to load interview details");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Speech Synthesis (TTS)
  const speakAI = useCallback((text, onEndCallback) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Browser does not support Speech Synthesis");
      if (onEndCallback) onEndCallback();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha")));
    if (englishVoice) utterance.voice = englishVoice;

    utterance.onstart = () => {
      if (isComponentMounted.current) setSessionState("ai_speaking");
    };

    utterance.onend = () => {
      if (isComponentMounted.current && onEndCallback) {
        onEndCallback();
      }
    };

    utterance.onerror = (e) => {
      console.error("TTS Error:", e);
      if (isComponentMounted.current && onEndCallback) onEndCallback();
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeechSynthesis = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Helper: Speech Recognition (STT) with VAD Silence Detection
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    fullUserAnswerRef.current = "";
    setInterimTranscript("");

    const resetSilenceTimer = () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      // Auto-respond when user stops speaking for 2.5 seconds
      silenceTimerRef.current = setTimeout(() => {
        if (fullUserAnswerRef.current.trim().length > 3) {
          handleDoneSpeakingRef.current?.();
        }
      }, 2500);
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
        console.warn("Speech Rec Error:", err);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (err) {
        console.warn("Rec start err:", err);
      }
    }

    // Audio stream recording fallback
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
  }, []);

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

  // 2. Start Real 1-on-1 Dynamic Unscripted Conversation
  const startConversation = () => {
    setTurnCount(1);
    setConversation([]);
    
    const openingLine = `Hello! Welcome to your 1-on-1 interview for the ${interviewData?.jobPosition || "Software Engineer"} position. To start off, could you introduce yourself and tell me a bit about your experience?`;
    
    setConversation([{ sender: "ai", text: openingLine }]);

    speakAI(openingLine, () => {
      startSpeechRecognition();
    });
  };

  // 3. Candidate Spoke -> Send to Dynamic Gemini Conversational Engine
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
        console.error("Transcription fallback error:", err);
      }
    }

    if (!finalAnswer) {
      finalAnswer = "Candidate provided a brief or silent response.";
    }

    // Append user answer to conversation log
    const updatedHistory = [...conversation, { sender: "user", text: finalAnswer }];
    setConversation(updatedHistory);

    const currentTurn = turnCount + 1;
    setTurnCount(currentTurn);

    // Call dynamic conversational API
    try {
      const res = await fetch(`/api/interviews/${interviewId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition: interviewData?.jobPosition,
          jobDesc: interviewData?.jobDesc,
          jobExperience: interviewData?.jobExperience,
          conversationHistory: updatedHistory,
          lastUserAnswer: finalAnswer
        })
      });

      if (!res.ok) throw new Error("Chat request failed");
      const chatData = await res.json();

      const aiReply = chatData.aiSpeech || "That makes sense. Can you tell me more about how you solve complex technical challenges in your work?";
      
      // Append AI response
      setConversation(prev => [...prev, { sender: "ai", text: aiReply }]);

      // Check if interview reached 5 turns or AI completed session
      if (currentTurn >= 6 || chatData.isInterviewComplete) {
        setSessionState("completed");
        speakAI(`Thank you so much! That completes our 1-on-1 voice conversation. Redirecting you to your evaluation report now.`, () => {
          router.push(`/dashboard/interview/${interviewId}/feedback`);
        });
      } else {
        // Speak AI follow-up and automatically start listening for candidate's next response!
        speakAI(aiReply, () => {
          startSpeechRecognition();
        });
      }

    } catch (err) {
      console.error("Conversational error:", err);
      toast.error("Failed to generate AI follow-up.");
      setSessionState("idle");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Initializing Real 1-on-1 Voice Room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 relative overflow-hidden flex flex-col justify-between">
      {/* Background Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Unscripted 1-on-1 Voice Interview
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live Conversation</span>
            </h1>
            <p className="text-xs text-slate-400">
              Target Role: <strong className="text-slate-200">{interviewData?.jobPosition}</strong> ({interviewData?.jobExperience} Yrs Exp)
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => {
            stopSpeechSynthesis();
            stopSpeechRecognition();
            router.push("/dashboard");
          }}
          className="bg-slate-900 border-slate-800 text-slate-400 hover:text-white text-xs rounded-xl"
        >
          <PhoneOff className="w-4 h-4 mr-2 text-rose-400" /> End Interview
        </Button>
      </header>

      {/* Main Grid: AI Avatar Video + Candidate Video + Live Subtitles */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6 flex-1 relative z-10">
        
        {/* Left Column: Avatars + Subtitles */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* AI Avatar */}
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden h-64 flex flex-col items-center justify-center shadow-xl">
              <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <Bot className="w-3.5 h-3.5 text-indigo-400" /> AI Interivewer
              </div>

              <div className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${sessionState === "ai_speaking" ? "ring-4 ring-indigo-500/50 bg-indigo-600/20 scale-105 shadow-2xl shadow-indigo-500/40" : "bg-slate-800"}`}>
                <Bot className={`w-14 h-14 ${sessionState === "ai_speaking" ? "text-indigo-400 animate-pulse" : "text-slate-400"}`} />
                {sessionState === "ai_speaking" && (
                  <span className="absolute -bottom-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider animate-bounce">
                    Speaking...
                  </span>
                )}
              </div>
            </div>

            {/* Candidate Live Webcam */}
            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden h-64 flex items-center justify-center shadow-xl">
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-semibold text-slate-300">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Candidate (You)
              </div>

              <Webcam
                audio={false}
                mirrored={true}
                className="w-full h-full object-cover"
              />

              {sessionState === "listening" && (
                <div className="absolute bottom-3 left-3 right-3 z-20 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-xl flex items-center justify-between backdrop-blur-md">
                  <span className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Mic Listening... Speak freely!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Subtitles */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl min-h-[100px] flex flex-col justify-center space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Live Conversation Stream
            </span>
            <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed italic">
              {sessionState === "ai_speaking" && conversation.length > 0 && (
                <span className="text-indigo-300">"{conversation[conversation.length - 1]?.text}"</span>
              )}
              {sessionState === "listening" && (
                <span className="text-emerald-300">"{interimTranscript || fullUserAnswerRef.current || "Listening to your spoken answer..."}"</span>
              )}
              {sessionState === "evaluating" && (
                <span className="text-amber-300 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> AI is evaluating your response and formulating a natural follow-up...
                </span>
              )}
              {sessionState === "idle" && (
                <span className="text-slate-400">Click "Start 1-on-1 Conversation" below to begin talking with the AI interviewer.</span>
              )}
            </p>
          </div>

        </div>

        {/* Right Column: Live Chat History */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col justify-between backdrop-blur-xl h-[480px]">
          <h3 className="text-sm font-bold text-slate-200 pb-3 border-b border-slate-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Real-time Dialogue Log
          </h3>

          <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 text-xs">
            {conversation.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-center p-4">
                Your live 1-on-1 dialogue will appear here in real-time.
              </div>
            ) : (
              conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl space-y-1 ${
                    msg.sender === "ai"
                      ? "bg-indigo-950/40 border border-indigo-900/50 text-indigo-200"
                      : "bg-slate-800/80 border border-slate-700/80 text-slate-200 ml-4"
                  }`}
                >
                  <div className="flex justify-between items-center font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                    <span>{msg.sender === "ai" ? "AI Interviewer" : "You"}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            {sessionState === "idle" && (
              <Button
                onClick={startConversation}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl py-5 font-bold shadow-lg shadow-indigo-600/30"
              >
                Start 1-on-1 Conversation <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {sessionState === "listening" && (
              <Button
                onClick={handleDoneSpeaking}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-5 font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <Mic className="w-4 h-4 animate-pulse" /> Done Speaking (Submit Answer)
              </Button>
            )}

            {(sessionState === "ai_speaking" || sessionState === "evaluating") && (
              <Button disabled className="w-full bg-slate-800 text-slate-400 rounded-xl py-5">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {sessionState === "ai_speaking" ? "AI Speaking..." : "Formulating Follow-up..."}
              </Button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
