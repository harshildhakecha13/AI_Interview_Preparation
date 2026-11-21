"use client";

import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Target,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Trash2,
  Loader2,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PracticeNowButton from "@/app/dashboard/_components/PracticeNowButton";

const difficultyConfig = {
  Hard: { color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)", dot: "bg-rose-400" },
  Medium: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)", dot: "bg-amber-400" },
  Easy: { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)", dot: "bg-emerald-400" },
};

const categoryConfig = {
  "System Design": { color: "#818cf8", bg: "rgba(129,140,248,0.1)", border: "rgba(129,140,248,0.25)" },
  "Technical": { color: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)" },
  "Coding & Architecture": { color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.25)" },
  "Behavioral": { color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.25)" },
};

export default function PracticePage() {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPracticeData();
  }, []);

  const fetchPracticeData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/practice");
      if (res.ok) {
        const data = await res.json();
        setModules(data.practiceModules || []);
        setSavedQuestions(data.savedQuestions || []);
      }
    } catch (err) {
      console.warn("Error fetching practice data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (question) => {
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove", question }),
      });
      if (res.ok) {
        setSavedQuestions((prev) => prev.filter((q) => q.question !== question));
        toast.success("Question removed from saved library");
      }
    } catch (err) {
      toast.error("Failed to remove question");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-spin border-t-indigo-500" />
          <div className="absolute inset-3 rounded-full border border-purple-500/20 animate-spin border-t-purple-500" style={{ animationDirection: "reverse" }} />
          <BrainCircuit className="absolute inset-0 m-auto w-5 h-5 text-indigo-400" />
        </div>
        <p className="text-sm font-medium text-slate-400">Loading Adaptive Practice Recommendations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-12 space-y-10" style={{ backgroundColor: "#020817" }}>

      {/* ===== HEADER ===== */}
      <div
        className="relative p-6 md:p-8 rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(109,40,217,0.06) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-40 animate-glow-pulse"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <BrainCircuit className="w-3.5 h-3.5" /> Adaptive Growth & Weak Areas
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              Personalized{" "}
              <span className="gradient-text">Targeted Practice</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
              Drill packs dynamically synthesized from your previous mock interview answer ratings, missing resume claims, and system weaknesses.
            </p>
          </div>

          <Link href="/dashboard">
            <Button
              size="sm"
              className="shrink-0 font-bold text-xs transition-all"
              style={{
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
                border: "1px solid rgba(99,102,241,0.3)",
                color: "white",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Create New Mock Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* ===== RECOMMENDED MODULES ===== */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Recommended Practice Modules
          </h2>
          <span className="text-xs text-slate-500">Targeted to your performance gaps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {modules.map((mod) => {
            const diff = difficultyConfig[mod.difficulty] || difficultyConfig.Medium;
            const cat = categoryConfig[mod.category] || categoryConfig["Technical"];
            return (
              <div
                key={mod.id}
                className="group relative p-5 rounded-3xl flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
              >
                {/* Subtle top gradient accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${cat.color}40, transparent)` }}
                />
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity"
                  style={{ background: `radial-gradient(circle, ${cat.color} 0%, transparent 70%)` }}
                />

                <div className="space-y-3 relative z-10">
                  {/* Category + count */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                        style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}
                      >
                        {mod.category}
                      </span>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors leading-snug">
                        {mod.title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <div className="text-xs font-black text-slate-300 font-mono">{mod.questionsCount} Qs</div>
                      <div
                        className="flex items-center justify-end gap-1 mt-0.5"
                        style={{ color: diff.color }}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                        <span className="text-[10px] font-bold">{mod.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>

                  {/* AI Trigger */}
                  <div
                    className="p-3 rounded-xl flex items-start gap-2 text-[11px]"
                    style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)", color: "#a5b4fc" }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong className="text-indigo-300">AI Trigger:</strong> {mod.reason}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {mod.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium transition-colors"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer row */}
                <div
                  className="flex justify-between items-center pt-3 border-t relative z-10"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    Target: 8.5+ score
                  </div>
                  <PracticeNowButton module={mod} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== SAVED QUESTIONS VAULT ===== */}
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            Saved Question Vault
            {savedQuestions.length > 0 && (
              <span
                className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                {savedQuestions.length}
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-500">Bookmarked for spaced repetition</span>
        </div>

        {savedQuestions.length === 0 ? (
          <div
            className="p-10 rounded-2xl text-center space-y-3"
            style={{ background: "rgba(255,255,255,0.015)", border: "1px dashed rgba(255,255,255,0.07)" }}
          >
            <Bookmark className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-500 font-medium">No saved questions yet</p>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              When reviewing interview reports or the question library, click "Save Question" to practice them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedQuestions.map((sq, idx) => {
              const cat = categoryConfig[sq.category] || categoryConfig["Technical"];
              const diff = difficultyConfig[sq.difficulty] || difficultyConfig.Medium;
              return (
                <div
                  key={idx}
                  className="group p-5 rounded-2xl flex flex-col justify-between space-y-3 transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ background: cat.color }} />

                  <div className="pl-2 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ background: cat.bg, color: cat.color, border: `1px solid ${cat.border}` }}
                      >
                        {sq.category} · {sq.difficulty}
                      </span>
                      <button
                        onClick={() => handleRemoveSaved(sq.question)}
                        className="p-1 rounded-lg transition-all text-slate-600 hover:text-rose-400 hover:bg-rose-500/10"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-relaxed">{sq.question}</h4>
                    {sq.idealAnswer && (
                      <div
                        className="p-2.5 rounded-lg text-[11px] text-slate-400"
                        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <strong className="text-indigo-300">Key Focus:</strong> {sq.idealAnswer}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs pt-2 border-t pl-2" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#64748b" }}
                    >
                      {sq.technology || "General"}
                    </span>
                    <Link href="/dashboard/question">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs p-0 h-auto font-semibold transition-colors"
                        style={{ color: "#a5b4fc" }}
                      >
                        Test Yourself →
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
