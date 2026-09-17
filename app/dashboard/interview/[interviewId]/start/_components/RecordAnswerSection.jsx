"use client";

import { Button } from "@/components/ui/button";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Mic, MicOff, Video, VideoOff, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { WebCamContext } from "@/app/dashboard/layout";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
  onAnswerSaved,
}) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Reset answer when question changes
  useEffect(() => {
    setUserAnswer("");
  }, [activeQuestionIndex]);

  const saveAnswer = useCallback(async (answerToSave) => {
    const text = answerToSave || userAnswer;
    if (!text || text.trim().length <= 5) {
      toast.error("Please speak or write a response before submitting.");
      return;
    }
    if (!interviewData?.mockId || !mockInterviewQuestion?.[activeQuestionIndex]) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/interviews/${interviewData.mockId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: mockInterviewQuestion[activeQuestionIndex].Question,
          correctAns: mockInterviewQuestion[activeQuestionIndex].Answer,
          userAns: text,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save answer");
      }

      toast.success("Answer recorded and evaluated successfully!");
      setUserAnswer("");
      if (onAnswerSaved) {
        onAnswerSaved();
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while saving your answer.");
    } finally {
      setLoading(false);
    }
  }, [activeQuestionIndex, interviewData, mockInterviewQuestion, onAnswerSaved, userAnswer]);

  const transcribeAudio = useCallback(async (audioBlob) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed");

      const { transcription } = await res.json();
      const updatedAnswer = (userAnswer + " " + transcription).trim();
      setUserAnswer(updatedAnswer);
      await saveAnswer(updatedAnswer);
    } catch {
      toast.error("Error transcribing audio. Please try again or type your answer.");
    } finally {
      setLoading(false);
    }
  }, [userAnswer, saveAnswer]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        await transcribeAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info("Listening... speak your answer aloud.");
    } catch {
      toast.error("Could not access microphone. Please check browser permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col justify-between p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
      
      {/* Video Stream / Avatar Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-purple-400" /> Candidate Video & Mic Feed
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
            webCamEnabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400"
          }`}>
            {webCamEnabled ? "Live" : "Standby"}
          </span>
        </div>

        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden h-64 flex items-center justify-center shadow-inner">
          {webCamEnabled ? (
            <Webcam
              mirrored={true}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
              <VideoOff className="w-12 h-12 text-slate-600" />
              <span className="text-xs text-slate-400">Webcam Inactive</span>
            </div>
          )}

          {isRecording && (
            <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span> Recording Audio...
            </div>
          )}
        </div>
      </div>

      {/* Answer Transcript or Manual Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Your Spoken or Typed Response
          </span>
          {userAnswer && (
            <span className="text-[10px] text-slate-400 font-mono">
              {userAnswer.length} characters
            </span>
          )}
        </label>
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Speak into your microphone or type your technical answer here..."
          rows={3}
          className="w-full rounded-2xl bg-slate-950/70 border border-slate-800 p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Control Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setWebCamEnabled((prev) => !prev)}
          className="bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs rounded-xl h-10"
        >
          {webCamEnabled ? <VideoOff className="w-3.5 h-3.5 mr-1.5" /> : <Video className="w-3.5 h-3.5 mr-1.5" />}
          {webCamEnabled ? "Disable Camera" : "Enable Camera"}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isRecording ? "destructive" : "outline"}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={loading}
            className={`text-xs rounded-xl h-10 font-medium ${
              !isRecording ? "bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300" : ""
            }`}
          >
            {isRecording ? (
              <span className="flex items-center gap-1.5 font-bold">
                <MicOff className="w-4 h-4" /> Stop & Evaluate
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Mic className="w-4 h-4" /> Record Voice
              </span>
            )}
          </Button>

          <Button
            size="sm"
            onClick={() => saveAnswer(userAnswer)}
            disabled={loading || isRecording || !userAnswer.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs rounded-xl h-10 font-bold px-4 shadow-md shadow-indigo-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Submit Answer
              </span>
            )}
          </Button>
        </div>
      </div>

    </div>
  );
};

export default RecordAnswerSection;

