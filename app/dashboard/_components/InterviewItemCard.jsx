"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar, Award, ArrowRight, BrainCircuit, Sparkles, FileText, CheckCircle2 } from "lucide-react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };
  const onFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  return (
    <div className="group relative p-5 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-xl shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden">
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-block">
              {interview?.interviewType || "Technical"}
            </span>
            <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors truncate">
              {interview?.jobPosition}
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-800 text-slate-300 px-2 py-1 rounded-lg border border-slate-700/80 shrink-0">
            <Award className="w-3 h-3 text-indigo-400" /> {interview?.jobExperience} Yrs
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400">
          {interview?.resumeUsed && (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Resume Probing
            </span>
          )}
          {interview?.difficulty && (
            <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px]">
              {interview?.difficulty}
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-slate-500" /> {interview?.createdAt || "Recent Session"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80">
        <Button
          onClick={onFeedback}
          variant="outline"
          className="bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs rounded-xl h-9"
        >
          Scorecard
        </Button>
        <Button
          onClick={onStart}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs rounded-xl h-9 font-medium shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1"
        >
          Enter Room <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;
