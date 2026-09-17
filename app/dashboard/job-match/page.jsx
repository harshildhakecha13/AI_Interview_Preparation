"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Layers,
  Cpu,
  TrendingUp,
  FileCheck,
  Building,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function JobMatchPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [rawJD, setRawJD] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [previousMatches, setPreviousMatches] = useState([]);
  const [hasResume, setHasResume] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [matchRes, resumeRes] = await Promise.all([
        fetch("/api/job-match"),
        fetch("/api/resume")
      ]);

      if (matchRes.ok) {
        const data = await matchRes.json();
        setPreviousMatches(data.matches || []);
        if (data.matches && data.matches.length > 0) {
          setMatchResult(data.matches[0]);
        }
      }

      if (resumeRes.ok) {
        const rData = await resumeRes.json();
        setHasResume(!!rData.resume);
      }
    } catch (err) {
      console.warn("Failed to load initial job match data:", err);
    }
  };

  const handleAnalyzeJD = async (e) => {
    e.preventDefault();
    if (!rawJD.trim() || rawJD.length < 30) {
      toast.error("Please paste the job description text (minimum 30 characters)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/job-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: jobTitle || "Software Engineer",
          company: company || "",
          rawJD
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze Job Description");
      }

      const data = await res.json();
      setMatchResult(data.jobMatch);
      setPreviousMatches(prev => [data.jobMatch, ...prev]);
      toast.success("Job Description analyzed and matched with resume!");
    } catch (err) {
      toast.error(err.message || "Failed to analyze Job Description");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Target className="w-3.5 h-3.5" /> Resume vs. Job Description Intelligence
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Job Match & Requirements Breakdown
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Compare target Job Descriptions against your candidate resume to pinpoint skill gaps, critical interview topics, and expected question vectors.
          </p>
        </div>

        {!hasResume && (
          <Link href="/dashboard/resume">
            <Button size="sm" className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Upload Resume for Match %
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Input JD */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleAnalyzeJD} className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-400" /> Analyze Target Role
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Target Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full mt-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Company (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Google / Stripe / Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full mt-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Paste Job Description</label>
              <textarea
                rows={8}
                placeholder="Paste the full job description, qualifications, and required tech stack..."
                value={rawJD}
                onChange={(e) => setRawJD(e.target.value)}
                className="w-full mt-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Job Alignment...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Compare Resume vs. JD
                </>
              )}
            </Button>
          </form>

          {/* History of Matches */}
          {previousMatches.length > 1 && (
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous Role Matches</h3>
              <div className="space-y-2">
                {previousMatches.slice(0, 5).map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMatchResult(m)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex justify-between items-center transition-all text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{m.jobTitle}</div>
                      <div className="text-[10px] text-slate-400">{m.company || "Company"}</div>
                    </div>
                    <span className="font-bold text-indigo-400 font-mono text-sm">
                      {m.match?.overallMatch || 75}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Analysis & Match Visualization */}
        <div className="lg:col-span-7 space-y-6">
          {!matchResult ? (
            <div className="h-full min-h-[400px] border border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <Target className="w-12 h-12 text-slate-600" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-300">No Job Description Analyzed</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Paste a Job Description on the left to view skill matches, missing requirements, and high-frequency interview topics.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Overall Match Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-purple-950/30 border border-indigo-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">{matchResult.jobTitle}</h2>
                    {matchResult.company && (
                      <span className="text-xs text-indigo-300 bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-500/20">
                        {matchResult.company}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">
                    Seniority Level: <span className="font-semibold text-white">{matchResult.analysis?.seniority || "Mid-Senior"}</span> • Experience Req: <span className="font-semibold text-white">{matchResult.analysis?.experienceReq || "3+ Years"}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-3xl font-black text-white font-mono">{matchResult.match?.overallMatch || 80}%</div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Candidate Match</div>
                  </div>
                </div>
              </div>

              {/* Match Category Progress Bars */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Skills Match", value: matchResult.match?.skillsMatch || 82, color: "bg-indigo-500" },
                  { label: "Experience", value: matchResult.match?.experienceMatch || 78, color: "bg-purple-500" },
                  { label: "Tech Stack", value: matchResult.match?.technologyMatch || 85, color: "bg-emerald-500" },
                  { label: "Responsibilities", value: matchResult.match?.responsibilityMatch || 75, color: "bg-blue-500" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400 font-medium">{item.label}</span>
                      <span className="text-white font-bold font-mono">{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Strong Matches & Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strong Matches */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Strong Matches in Resume
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(matchResult.match?.strongMatches || []).map((skill, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 rounded-lg text-xs bg-emerald-950/40 text-emerald-300 border border-emerald-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Missing / Unmentioned Skills
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {(matchResult.match?.missingSkills || []).map((skill, mIdx) => (
                      <span key={mIdx} className="px-2.5 py-1 rounded-lg text-xs bg-amber-950/40 text-amber-300 border border-amber-500/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Important Interview Topics */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Predicted Interview Topics for this Role
                </h3>
                <ul className="space-y-2">
                  {(matchResult.match?.interviewTopics || []).map((topic, tIdx) => (
                    <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-indigo-400 font-bold font-mono">0{tIdx + 1}</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Launch CTA */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/40 to-purple-900/30 border border-indigo-500/30 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <h4 className="text-sm font-bold text-white">Ready to test yourself for this job?</h4>
                  <p className="text-xs text-indigo-200">
                    Launch an AI mock interview specifically customized to this Job Description and your resume claims.
                  </p>
                </div>
                <Link href="/dashboard">
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 shadow-lg shadow-indigo-600/30">
                    Start Mock Interview <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
