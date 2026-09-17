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
  TrendingUp,
  CheckCircle2,
  Calendar,
  Layers
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

  return (
    <div className="space-y-8 relative">
      {/* Top Hub Bar: Readiness & Quick Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Target Role & Readiness */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Target Role</span>
            <h3 className="text-base font-bold text-white truncate max-w-[200px]">
              {profile?.targetRole || "Software Engineer"}
            </h3>
            <p className="text-xs text-slate-400">
              {profile?.experienceLevel || "Mid-Level"} • {profile?.preferredInterviewType || "Technical"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-indigo-400 font-mono">
              {profile?.readinessScore || 72}%
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Readiness Score</span>
          </div>
        </div>

        {/* Resume Studio Quick Card */}
        <Link href="/dashboard/resume" className="group">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all flex items-center justify-between h-full">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    Resume Intelligence
                  </h4>
                  {hasResume ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded-md font-medium">Setup</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {hasResume ? (resumeFileName || "Active Resume Loaded") : "Upload to tailor questions"}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Job Match & Targeted Practice */}
        <Link href="/dashboard/job-match" className="group">
          <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/40 transition-all flex items-center justify-between h-full">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                  Job Description Match
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compare resume against target JD
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>

      {/* Dashboard Hero Banner with Add Interview Trigger */}
      <div className="relative p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/60 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Production AI Interview Platform
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            Adaptive 1-on-1 Voice Technical Interviews
          </h1>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
            Experience dynamic AI interrogation that remembers your resume claims, probes edge cases in real-time, and generates multi-metric performance breakdowns.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
            <Link href="/dashboard/practice">
              <span className="inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer text-indigo-300">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" /> Targeted Drill Packs
              </span>
            </Link>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Bot className="w-3.5 h-3.5 text-purple-400" /> Real-time Spoken Evaluation
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> STAR & Architecture Scoring
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <AddNewInterview />
        </div>
      </div>

      {/* Dynamic Analytics & Stats Dashboard */}
      <DashboardStats />

      {/* Previous Interviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" /> Recent Mock Interviews
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Review past attempts, scores, and feedback reports</p>
          </div>
        </div>

        <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
          <InterviewList />
        </div>
      </div>
    </div>
  );
}
