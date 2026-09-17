"use client";

import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  Bookmark,
  CheckCircle2,
  Trash2,
  Zap,
  TrendingUp,
  Loader2,
  ShieldAlert,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PracticePage() {
  const router = useRouter();
  const [modules, setModules] = useState([]);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

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
        setSavedQuestions(prev => prev.filter(q => q.question !== question));
        toast.success("Question removed from saved library");
      }
    } catch (err) {
      toast.error("Failed to remove question");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading Adaptive Practice Recommendations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <BrainCircuit className="w-3.5 h-3.5" /> Adaptive Growth & Weak Areas
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Personalized Targeted Practice
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Targeted drill packs dynamically synthesized from your previous mock interview answer ratings, missing resume claims, and system weaknesses.
          </p>
        </div>

        <Link href="/dashboard">
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Create New Mock Interview
          </Button>
        </Link>
      </div>

      {/* Recommended Practice Modules Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" /> Recommended Practice Modules
          </h2>
          <span className="text-xs text-slate-400">Targeted to your performance gaps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {mod.category}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {mod.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 font-mono">{mod.questionsCount} Questions</span>
                    <div className="text-[10px] font-semibold text-amber-400">{mod.difficulty}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {mod.description}
                </p>

                {/* Why recommended */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2 text-[11px] text-indigo-200">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>AI Trigger:</strong> {mod.reason}</span>
                </div>

                {/* Key tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {mod.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/90 text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
                <span className="text-xs text-slate-400">Target score goal: 8.5+</span>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20">
                    Practice Now <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Questions Library */}
      <div className="space-y-4 pt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              Saved Question Vault ({savedQuestions.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400">Questions bookmarked for spaced repetition</span>
        </div>

        {savedQuestions.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900/30 border border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">You haven't bookmarked any specific questions yet.</p>
            <p className="text-[11px] text-slate-500">
              When reviewing your interview reports or question library, click "Save Question" to practice them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedQuestions.map((sq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {sq.category} • {sq.difficulty}
                    </span>
                    <button
                      onClick={() => handleRemoveSaved(sq.question)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-relaxed">
                    {sq.question}
                  </h4>
                  {sq.idealAnswer && (
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300">
                      <strong className="text-indigo-300">Key Focus:</strong> {sq.idealAnswer}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-400">{sq.technology || "General"}</span>
                  <Link href="/dashboard">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-400 hover:text-indigo-300 p-0 h-auto">
                      Test Yourself →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
