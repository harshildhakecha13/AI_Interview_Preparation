"use client";

import React, { useState, useEffect } from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import DashboardStats from "./_components/DashboardStats";
import {
  Sparkles,
  Bot,
  Target,
  ShieldCheck,
  Zap,
  FileText,
  BrainCircuit,
  ArrowRight,
  CheckCircle2,
  Layers,
  TrendingUp,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [hasResume, setHasResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setHasResume(data.hasResume);
        setResumeFileName(data.resumeFileName);
      }
    } catch {
      // Non-blocking fallback
    }
  };

  const readiness = profile?.readinessScore || 72;

  return (
    <div className="space-y-6 pb-8">

      {/* ===== HERO BANNER ===== */}
      <div
        className="relative rounded-3xl overflow-hidden p-6 md:p-8"
        style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(109,40,217,0.08) 50%, rgba(99,102,241,0.04) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
        }}
      >
        {/* Ambient orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-40 animate-glow-pulse"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-12 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)" }} />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
            >
              <Flame className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Production AI Interview Platform
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
              Adaptive 1-on-1 Voice{" "}
              <span className="gradient-text">Technical Interviews</span>
            </h1>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              AI interrogation that remembers your resume claims, probes edge cases in real-time, and generates multi-metric performance breakdowns.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { icon: BrainCircuit, label: "Practice Drills", href: "/dashboard/practice", color: "text-indigo-400" },
                { icon: Bot, label: "Real-time Voice Eval", color: "text-purple-400" },
                { icon: ShieldCheck, label: "STAR Scoring", color: "text-emerald-400" },
              ].map(({ icon: Icon, label, href, color }) =>
                href ? (
                  <Link key={label} href={href}>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all hover:-translate-y-0.5"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#a5b4fc" }}
                    >
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      {label}
                    </span>
                  </Link>
                ) : (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}
                  >
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <AddNewInterview />
          </div>
        </div>
      </div>

      {/* ===== QUICK STATS ROW ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Readiness Score */}
        <div
          className="p-5 rounded-2xl flex items-center justify-between group hover:-translate-y-0.5 transition-transform"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Interview Readiness
            </span>
            <h3 className="text-sm font-bold text-white truncate max-w-[160px]">
              {profile?.targetRole || "Software Engineer"}
            </h3>
            <p className="text-[11px] text-slate-500">
              {profile?.experienceLevel || "Mid-Level"} · {profile?.preferredInterviewType || "Technical"}
            </p>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-black font-mono"
              style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {readiness}%
            </div>
            <div className="flex items-center gap-1 mt-1 justify-end">
              <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${readiness}%`, background: "linear-gradient(90deg, #6366f1, #a78bfa)" }} />
              </div>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Readiness Score</span>
          </div>
        </div>

        {/* Resume Intelligence */}
        <Link href="/dashboard/resume" className="group">
          <div
            className="p-5 rounded-2xl flex items-center justify-between h-full cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="p-3 rounded-2xl group-hover:scale-110 transition-transform"
                style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Resume Intelligence
                  </h4>
                  {hasResume ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider"
                      style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}
                    >
                      Setup
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {hasResume ? (resumeFileName || "Active Resume Loaded") : "Upload to tailor questions"}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Practice Drills */}
        <Link href="/dashboard/practice" className="group">
          <div
            className="p-5 rounded-2xl flex items-center justify-between h-full cursor-pointer hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
          >
            <div className="flex items-center gap-3.5">
              <div
                className="p-3 rounded-2xl group-hover:scale-110 transition-transform"
                style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
              >
                <Target className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  Practice Drills
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  AI-targeted weak area modules
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* ===== ANALYTICS ===== */}
      <DashboardStats />

      {/* ===== RECENT INTERVIEWS ===== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              Recent Mock Interviews
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Review past attempts, scores, and feedback reports</p>
          </div>
          <Link href="/dashboard/interview">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-white"
            >
              View All <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        <div
          className="p-6 rounded-3xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <InterviewList />
        </div>
      </div>
    </div>
  );
}
