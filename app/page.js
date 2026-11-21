"use client";

import React from "react";
import Contect from "./_components/Contect";
import Link from "next/link";
import {
  BrainCircuit,
  Sparkles,
  Mic,
  Video,
  FileText,
  Target,
  Award,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  Star,
  Shield,
  Clock,
  BarChart3,
  Wand2,
  Users,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Mic,
    color: "indigo",
    title: "Spoken 1-on-1 Dialogue",
    desc: "No multiple-choice. Converse aloud with an adaptive AI that asks probing follow-ups, mirrors real interview pacing, and pauses when you speak.",
  },
  {
    icon: FileText,
    color: "purple",
    title: "Resume Claims Verification",
    desc: "Upload your PDF. The AI extracts every project, metric, and claim — then interrogates you on them exactly as a senior engineer would.",
  },
  {
    icon: Target,
    color: "emerald",
    title: "Job Description Match",
    desc: "Paste the exact posting. Questions align directly to the company's stack, values, and engineering bar — from Google to early-stage startups.",
  },
  {
    icon: Award,
    color: "pink",
    title: "STAR Rubric Scorecards",
    desc: "Post-interview scorecards rate your Situation, Task, Action, and Result framing with verbatim model answers for each question.",
  },
  {
    icon: TrendingUp,
    color: "amber",
    title: "Targeted Practice Drills",
    desc: "Automatically generated drill packs hone in on weak knowledge domains detected across previous sessions. Turn stumbles into strengths.",
  },
  {
    icon: Cpu,
    color: "cyan",
    title: "System Design & Architecture",
    desc: "Distributed caching, database partitioning, high concurrency — calibrated for Staff and Principal engineering levels.",
  },
];

const testimonials = [
  {
    quote: "The resume claims probe asked me about a caching trade-off I made 2 years ago. That exact question came up in my Google L5 interview.",
    name: "Marcus Vance",
    role: "L5 Backend Engineer",
    company: "Google",
    initials: "MV",
    color: "from-blue-600 to-indigo-600",
  },
  {
    quote: "Speaking answers aloud to an AI that doesn't judge gave me the repetitions I needed. My STAR delivery went from rambly to razor-sharp.",
    name: "Elena Rostova",
    role: "Staff Architect",
    company: "Stripe",
    initials: "ER",
    color: "from-purple-600 to-pink-600",
  },
  {
    quote: "The JD match was eerie. It caught that I hadn't practiced distributed tracing and drilled me — the actual interview asked exactly that.",
    name: "David Kim",
    role: "Senior Full-Stack",
    company: "Meta",
    initials: "DK",
    color: "from-emerald-600 to-teal-600",
  },
];

const stats = [
  { value: "94%", label: "Offer Conversion Boost", color: "text-white" },
  { value: "12K+", label: "Voice Sessions", color: "text-indigo-400" },
  { value: "<850ms", label: "AI Latency", color: "text-purple-400" },
  { value: "50+", label: "Role Tracks", color: "text-emerald-400" },
];

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    text: "text-indigo-400",
    glow: "group-hover:shadow-indigo-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "group-hover:shadow-purple-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "group-hover:shadow-emerald-500/20",
  },
  pink: {
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    text: "text-pink-400",
    glow: "group-hover:shadow-pink-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    glow: "group-hover:shadow-amber-500/20",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    text: "text-cyan-400",
    glow: "group-hover:shadow-cyan-500/20",
  },
};

const Page = () => {
  return (
    <div
      className="min-h-screen text-slate-100 flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#020817" }}
    >
      {/* Background ambient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-indigo-600/25 via-purple-600/12 to-transparent rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute top-[30%] -left-56 w-96 h-96 bg-indigo-600/12 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-56 w-96 h-96 bg-purple-600/12 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-violet-600/8 rounded-full blur-3xl" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.8) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ===== HEADER ===== */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04]" style={{ background: "rgba(2,8,23,0.85)", backdropFilter: "blur(24px)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
              <BrainCircuit className="w-5 h-5 text-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                MockAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                PRO
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-sm text-slate-400">
            {[
              ["#features", "Features"],
              ["#preview", "Interview Room"],
              ["#how-it-works", "How It Works"],
              ["#testimonials", "Reviews"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="px-3.5 py-1.5 rounded-xl hover:text-white hover:bg-white/5 transition-all duration-200 text-xs font-medium"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-xs font-semibold text-slate-400 hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs rounded-xl px-4 py-2 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-300 flex items-center gap-1.5 border border-indigo-500/30"
              >
                Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO ===== */}
      <section className="relative z-10 pt-20 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border animate-fade-in"
          style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
          <Flame className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          Enterprise-Grade AI Interview Simulation
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Headline */}
        <div className="space-y-4 animate-slide-up">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Master Interviews with{" "}
            <span className="gradient-text">Real-Time AI Voice</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Dynamic spoken interrogation that challenges your code reasoning, probes your resume claims, matches target job descriptions, and delivers comprehensive diagnostic feedback.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-6 text-sm font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 flex items-center justify-center gap-2.5 group transition-all duration-300 border border-indigo-500/30 animate-gradient-x">
              <Mic className="w-4 h-4 text-emerald-300 animate-pulse" />
              Start Free Mock Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-6 py-6 text-sm font-semibold rounded-2xl transition-all duration-300 border-white/10 hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white"
            >
              Explore Platform
            </Button>
          </a>
        </div>

        {/* Trust badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          {[
            { icon: CheckCircle2, text: "Real-time Speech-to-Text & TTS" },
            { icon: Shield, text: "Resume & JD Intelligence" },
            { icon: BarChart3, text: "Multi-Metric STAR Scorecard" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 hover:text-slate-300 transition-colors">
              <Icon className="w-3.5 h-3.5 text-emerald-400" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* ===== LIVE PREVIEW MOCKUP ===== */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10">
        <div className="p-1 rounded-3xl" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.1), rgba(236,72,153,0.1))" }}>
          <div className="rounded-[22px] overflow-hidden" style={{ background: "#050d1a" }}>
            
            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.04]" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="ml-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 relative" />
                  <span className="text-xs font-mono text-emerald-400 font-bold tracking-wider">LIVE — Q3 of 5</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className="px-2.5 py-1 rounded-lg font-medium" style={{ background: "rgba(99,102,241,0.1)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
                  Senior Full Stack · System Design
                </span>
                <span className="font-mono text-slate-400">08:42</span>
              </div>
            </div>

            {/* 3 panel layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-4">
              
              {/* AI Interviewer */}
              <div className="p-6 rounded-2xl border border-white/[0.05] flex flex-col items-center justify-center text-center space-y-5 relative overflow-hidden group"
                style={{ background: "rgba(99,102,241,0.04)" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent" />
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 animate-spin-slow opacity-60 blur-sm" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "#050d1a" }}>
                      <BrainCircuit className="w-9 h-9 text-indigo-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Technical Lead</h3>
                  <p className="text-xs text-indigo-400 mt-0.5">Speaking question...</p>
                </div>
                {/* Waveform */}
                <div className="flex items-center gap-[3px] h-8">
                  {[30, 60, 90, 50, 80, 40, 70, 55, 85, 45, 75, 35].map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-indigo-400 rounded-full animate-wave"
                      style={{ height: `${h}%`, animationDelay: `${i * 80}ms`, opacity: 0.7 + i * 0.02 }}
                    />
                  ))}
                </div>
              </div>

              {/* Candidate panel */}
              <div className="p-5 rounded-2xl border border-white/[0.05] flex flex-col space-y-4"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex-1 rounded-xl border border-white/[0.04] flex flex-col items-center justify-center relative overflow-hidden min-h-[120px]"
                  style={{ background: "rgba(0,0,0,0.4)" }}>
                  <Video className="w-7 h-7 text-slate-600" />
                  <span className="text-[11px] text-slate-500 mt-1.5">Candidate Camera Feed</span>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono"
                    style={{ background: "rgba(16,185,129,0.15)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <Mic className="w-2.5 h-2.5" /> Mic Active
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Live Transcript</div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "When partitioning the PostgreSQL database, we implemented range sharding based on tenant UUID to ensure horizontal read scalability..."
                  </p>
                </div>
              </div>

              {/* Diagnostics panel */}
              <div className="p-5 rounded-2xl border border-white/[0.05] flex flex-col justify-between space-y-4"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Live Evaluation</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded-lg"
                    style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                    8.8 / 10
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Technical Depth", value: 92, color: "#6366f1" },
                    { label: "STAR Structure", value: 85, color: "#a78bfa" },
                    { label: "Confidence", value: 78, color: "#34d399" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-slate-400">{label}</span>
                        <span className="text-slate-200 font-mono font-semibold">{value}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${value}%`, background: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2.5 rounded-xl text-[11px]"
                  style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)", color: "#a5b4fc" }}>
                  <span className="font-bold">Resume Link:</span> Verified claim on distributed microservices.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="border-y py-12" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(99,102,241,0.03)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label, color }) => (
            <div key={label} className="space-y-1.5 group">
              <div className={`text-3xl sm:text-4xl font-black tracking-tight ${color} group-hover:scale-110 transition-transform duration-300`}>
                {value}
              </div>
              <div className="text-xs text-slate-500 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-14">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
            <Zap className="w-3.5 h-3.5" /> Full-Spectrum Preparation
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Engineered for{" "}
            <span className="gradient-text">Realistic Rigor</span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Everything you need to transform anxiety into structured, compelling articulation that lands offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, color, title, desc }) => {
            const c = colorMap[color];
            return (
              <div
                key={title}
                className={`group relative p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${c.glow} cursor-default`}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.035)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at top left, rgba(99,102,241,0.06) 0%, transparent 70%)" }} />
                <div className={`relative w-11 h-11 rounded-2xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-14">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border"
            style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}>
            <Layers className="w-3.5 h-3.5" /> Structured Workflow
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            From Setup to Offer{" "}
            <span className="gradient-text">in 3 Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[calc(33%-16px)] right-[calc(33%-16px)] h-px"
            style={{ background: "linear-gradient(90deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4), rgba(99,102,241,0.4))" }} />
          
          {[
            {
              step: "01", color: "from-indigo-600 to-violet-600", textColor: "text-indigo-400",
              title: "Calibrate Session",
              desc: "Select role, seniority, track (Technical, System Design, Behavioral) and attach resume + job description."
            },
            {
              step: "02", color: "from-violet-600 to-purple-600", textColor: "text-purple-400",
              title: "Live Voice Interview",
              desc: "Engage in real spoken conversation. AI synthesizes questions and captures your spoken answers with high precision."
            },
            {
              step: "03", color: "from-emerald-600 to-teal-600", textColor: "text-emerald-400",
              title: "Actionable Feedback",
              desc: "Line-by-line STAR ratings, strengths, improvement areas, and model answer comparisons to iterate fast."
            },
          ].map(({ step, color, textColor, title, desc }) => (
            <div
              key={step}
              className="relative p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 group"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-black text-sm mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {step}
              </div>
              <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Trusted by{" "}
            <span className="gradient-text">Top Engineers</span>
          </h2>
          <p className="text-xs text-slate-500">Recent candidate success stories from real interviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quote, name, role, company, initials, color }) => (
            <div
              key={name}
              className="group p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-5"
              style={{ background: "rgba(255,255,255,0.025)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">"{quote}"</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                  {initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{name}</div>
                  <div className="text-[11px] text-slate-500">{role} · {company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
        <div
          className="relative p-10 md:p-14 rounded-3xl text-center space-y-6 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(99,102,241,0.05) 100%)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
              style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}>
              <Sparkles className="w-3.5 h-3.5" /> Ready to land your next role?
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">Start Practicing Today</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Join thousands of engineers who transformed their interview performance with AI-powered simulation.
            </p>
          </div>
          <Link href="/dashboard">
            <Button className="px-8 py-5 text-sm font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 mx-auto transition-all duration-300">
              <Mic className="w-4 h-4 text-emerald-300" />
              Launch Free Interview
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <Contect />
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t py-12 px-4 sm:px-6 lg:px-8" style={{ borderColor: "rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.3)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-sm">MockAI Pro</span>
              <span className="text-slate-700">·</span>
              <span>AI-Powered Technical & Behavioral Prep</span>
            </div>

            <div className="flex items-center gap-6">
              {[
                ["/dashboard", "Dashboard"],
                ["/dashboard/resume", "Resume Studio"],
                ["/dashboard/practice", "Practice Drills"],
                ["/dashboard/upgrade", "Pricing"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            <div>© {new Date().getFullYear()} MockAI Pro. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Page;
