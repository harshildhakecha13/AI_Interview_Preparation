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
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "MockAI Pro — Enterprise AI Mock Interview Platform",
  description:
    "Master technical, behavioral, and system design interviews with dynamic real-time voice AI simulation, resume probing, and executive-grade feedback.",
};

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Lights */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[45%] -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[65%] -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Global Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                MockAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Interview Room</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-xs font-semibold text-slate-300 hover:text-white hidden sm:block">
              Sign In
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl px-4 py-2 shadow-lg shadow-indigo-600/25 flex items-center gap-1.5">
                Launch Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 md:pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
          Enterprise-Grade 1-on-1 AI Interview Simulation
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Master Technical & Behavioral Interviews with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            Real-Time AI Voice
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Dynamic spoken interrogation that challenges your code reasoning, probes your actual resume claims, matches target job descriptions, and provides comprehensive diagnostic feedback.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto px-8 py-6 text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group">
              <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
              Start Free Mock Interview
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#features" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto px-6 py-6 text-sm font-semibold bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-300 rounded-2xl">
              Explore Platform Capabilities
            </Button>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Real-time Speech-to-Text & TTS
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resume & JD Extraction
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Multi-Metric Scorecard (STAR)
          </div>
        </div>
      </section>

      {/* Interactive Mock Room Preview */}
      <section id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 relative z-10">
        <div className="p-3 md:p-4 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-2xl shadow-2xl">
          <div className="rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden shadow-inner">
            
            {/* Top Bar */}
            <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider">Session Active — Question 3 of 5</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[11px] font-semibold">
                  Senior Full Stack Role
                </span>
                <span className="font-mono text-slate-300">08:42 Elapsed</span>
              </div>
            </div>

            {/* 3-Panel Preview Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 md:p-6 bg-slate-950">
              
              {/* AI Interviewer Avatar Card */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 relative overflow-hidden">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-xl shadow-indigo-500/20 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <BrainCircuit className="w-10 h-10 text-indigo-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Technical Lead</h3>
                  <p className="text-xs text-indigo-400">Speaking question out loud...</p>
                </div>
                {/* Audio Waveform Bars */}
                <div className="flex items-center gap-1 h-6">
                  {[40, 70, 100, 60, 90, 45, 80, 50, 75, 95].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-500 rounded-full animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Candidate Video & Audio Panel */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-center text-center space-y-4 relative">
                <div className="w-full h-36 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-500 space-y-2 relative overflow-hidden">
                  <Video className="w-8 h-8 text-slate-600" />
                  <span className="text-[11px] text-slate-400">Candidate HD Camera Feed</span>
                  <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                    <Mic className="w-3 h-3" /> Mic Unmuted
                  </div>
                </div>
                <div className="w-full text-left space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Live Speech Input</div>
                  <p className="text-xs text-slate-200 line-clamp-2 italic">
                    "When partitioning the PostgreSQL database, we implemented range sharding based on tenant UUID to ensure horizontal read scalability..."
                  </p>
                </div>
              </div>

              {/* Telemetry & Scorecard Diagnostic Panel */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Real-Time Evaluation</span>
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">8.8 / 10</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>Technical Depth</span>
                        <span className="text-slate-200">92%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[92%] h-full bg-indigo-500 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>STAR Structure</span>
                        <span className="text-slate-200">85%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-purple-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300">
                  <span className="font-bold">Resume Link:</span> Verified project bullet on distributed microservices.
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-y border-slate-800/80 bg-slate-900/40 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-white">94%</div>
            <div className="text-xs text-slate-400">Offer Conversion Boost</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">12,000+</div>
            <div className="text-xs text-slate-400">Spoken Questions Evaluated</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400">&lt;850ms</div>
            <div className="text-xs text-slate-400">Voice Synthesis Latency</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400">50+</div>
            <div className="text-xs text-slate-400">Engineering Roles & Tracks</div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-3.5 h-3.5" /> Full-Spectrum Preparation
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Realistic Interview Rigor
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to transform anxiety into structured, compelling articulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Mic className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Spoken 1-on-1 Dialogue</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No multiple-choice tests. Converse aloud with an adaptive AI that asks clarifying follow-ups, pauses when you speak, and mirrors genuine interview pacing.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Resume Claims Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your PDF resume. The system inspects your key projects, claims, and metrics, formulating pointed interrogation questions to verify deep understanding.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Target Job Description Match</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste the exact posting for Google, Meta, or a high-growth startup. Questions tailor directly to the company's tech stack and behavioral values.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">STAR Rubric & Scorecards</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive exhaustive post-interview scorecards rating your Situation, Task, Action, and Result framing, paired with verbatim model answers.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Targeted Practice Drills</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Turn recurring stumbling blocks into strengths. Automatically generated drill packs hone in on weak knowledge domains detected in previous sessions.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 hover:border-slate-700 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">System Design & Architecture</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tackle caching, database partitioning, high concurrency, and distributed resilience with questions calibrated for Staff and Principal engineering levels.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Layers className="w-3.5 h-3.5" /> Structured Workflow
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            From Setup to Offer in Three Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              Step 01
            </span>
            <h4 className="text-base font-bold text-white">Calibrate Session Track</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select your role, seniority level, track (Coding, System Design, Behavioral), and optionally attach your resume and job description.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-purple-400 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
              Step 02
            </span>
            <h4 className="text-base font-bold text-white">Live Voice Interview</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engage in a 5-question spoken call with camera feed. The AI synthesizes questions clearly and captures your spoken answers with high precision.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              Step 03
            </span>
            <h4 className="text-base font-bold text-white">Actionable Feedback</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review line-by-line ratings, strengths, areas of improvement, and perfect model answer comparisons to iterate rapidly.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Trusted by Engineers Interviewing at Top Companies
          </h2>
          <p className="text-xs text-slate-400">Recent candidate success stories</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The resume claims probe asked me about a caching trade-off I made 2 years ago at my previous company. That exact same question came up in my Google L5 interview."
            </p>
            <div className="pt-2 border-t border-slate-800 text-xs">
              <div className="font-bold text-white">Marcus Vance</div>
              <div className="text-[11px] text-slate-400">L5 Backend Engineer at Google</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "Speaking my answers out loud to an AI that doesn't judge gave me the repetitions I needed. My behavioral delivery improved from rambly to crisp STAR structure."
            </p>
            <div className="pt-2 border-t border-slate-800 text-xs">
              <div className="font-bold text-white">Elena Rostova</div>
              <div className="text-[11px] text-slate-400">Staff Architect at Stripe</div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The job description match was eerie in its precision. It caught that I had not practiced distributed tracing questions and drilled me on them."
            </p>
            <div className="pt-2 border-t border-slate-800 text-xs">
              <div className="font-bold text-white">David K.</div>
              <div className="text-[11px] text-slate-400">Senior Full-Stack at Meta</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <Contect />
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm">MockAI Pro</span>
            <span className="text-slate-600">|</span>
            <span>AI-Powered Technical & Behavioral Prep</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard/resume" className="hover:text-white transition-colors">Resume Studio</Link>
            <Link href="/dashboard/job-match" className="hover:text-white transition-colors">Job Match</Link>
            <Link href="/dashboard/practice" className="hover:text-white transition-colors">Practice Drills</Link>
            <Link href="/dashboard/upgrade" className="hover:text-white transition-colors">Pricing</Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} MockAI Pro. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Page;
