"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  LoaderCircle,
  CheckCircle2,
  Target,
  Zap,
  BrainCircuit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const categoryToInterviewType = {
  "System Design": "System Design",
  "Technical": "Technical",
  "Coding & Architecture": "Coding",
  "Behavioral": "Behavioral",
};

const difficultyStyle = {
  Hard: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
  Easy: { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
};

export default function PracticeNowButton({ module }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const interviewType = categoryToInterviewType[module.category] || "Technical";
  const diff = difficultyStyle[module.difficulty] || difficultyStyle.Medium;

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const payload = {
        jobPosition: module.title,
        jobDesc: `Practice drill: ${module.description} Key skills: ${module.skills.join(", ")}`,
        jobExperience: "3",
        interviewType,
        difficulty: module.difficulty,
        duration: "20 min",
        questionsCount: module.questionsCount,
        resumeUsed: false,
        jdUsed: false,
        jobDescriptionFull: "",
        voiceEnabled: true,
        cameraEnabled: true,
        interviewerTone: "Professional & Challenging",
      };

      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to start practice session.");
        return;
      }

      setOpen(false);
      toast.success("Practice session created! Starting now...");
      router.push("/dashboard/interview/" + data.mockId);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        className="font-bold text-xs transition-all hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          boxShadow: "0 4px 15px rgba(99,102,241,0.25)",
          border: "1px solid rgba(99,102,241,0.3)",
          color: "white",
        }}
      >
        Practice Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl"
          style={{
            background: "rgba(8,15,30,0.98)",
            border: "1px solid rgba(99,102,241,0.15)",
            boxShadow: "0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)",
            backdropFilter: "blur(40px)",
          }}
        >
          {/* Colored top bar */}
          <div
            className="h-1 w-full"
            style={{ background: "linear-gradient(90deg, #4f46e5, #7c3aed, #a855f7)" }}
          />

          {/* Header */}
          <div className="p-6 pb-0 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div
                className="p-2.5 rounded-2xl"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
              </div>
              <div
                className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                Practice Drill
              </div>
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-tight">{module.title}</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{module.description}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Questions", value: module.questionsCount, valueColor: "#818cf8" },
                { label: "Difficulty", value: module.difficulty, valueColor: diff.color },
                { label: "Track", value: interviewType, valueColor: "#a78bfa" },
              ].map(({ label, value, valueColor }) => (
                <div
                  key={label}
                  className="p-3 rounded-2xl text-center"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="text-base font-black font-mono" style={{ color: valueColor }}>
                    {value}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div
              className="p-3.5 rounded-2xl space-y-2"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <Target className="w-3 h-3 text-indigo-400" /> Focus Areas
              </div>
              <div className="flex flex-wrap gap-1.5">
                {module.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-medium"
                    style={{ background: "rgba(99,102,241,0.08)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.15)" }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Trigger */}
            <div
              className="p-3.5 rounded-2xl flex items-start gap-2.5 text-[11px]"
              style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.12)" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span style={{ color: "#a5b4fc" }}>
                <strong className="text-indigo-300">Why this drill:</strong> {module.reason}
              </span>
            </div>

            {/* What happens */}
            <div className="space-y-2">
              {[
                "AI generates targeted questions for this specific drill",
                "Voice-enabled real-time interview session",
                "Full STAR performance report after completion",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "#34d399" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-6 pb-6 pt-2 flex gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 text-xs font-semibold rounded-xl"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "#94a3b8",
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleLaunch}
              disabled={loading}
              className="flex-[2] text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: loading ? "rgba(99,102,241,0.3)" : "linear-gradient(135deg, #4f46e5, #7c3aed)",
                boxShadow: loading ? "none" : "0 8px 25px rgba(99,102,241,0.35)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "white",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="w-3.5 h-3.5 animate-spin" />
                  Launching Session...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  Start Practice
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
