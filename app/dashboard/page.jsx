"use client";
import React from "react";
import AddNewInterview from "./_components/AddNewInterview";
import InterviewList from "./_components/InterviewList";
import { Sparkles, Bot, Target, ShieldCheck, Zap } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        {/* Dashboard Hero Banner */}
        <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/60 border border-slate-800 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Interview Suite
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Practice & Master Your Next Technical Interview
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Create customized AI mock interviews tailored to your job role, record voice answers, and receive instant multi-metric evaluation & feedback.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Bot className="w-4 h-4 text-indigo-400" /> Real-time Speech Analysis
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Target className="w-4 h-4 text-purple-400" /> Role-Specific Questioning
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Detailed Scoring Report
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <AddNewInterview />
          </div>
        </div>

        {/* Previous Interviews Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" /> Recent Mock Interviews
              </h2>
              <p className="text-xs text-slate-400 mt-1">Review past attempts, scores, and feedback reports</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <InterviewList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
