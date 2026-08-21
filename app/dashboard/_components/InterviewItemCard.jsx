"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar, Briefcase, Award, ArrowRight } from "lucide-react";

const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  const onStart = () => {
    router.push("/dashboard/interview/" + interview?.mockId);
  };
  const onFeedback = () => {
    router.push("/dashboard/interview/" + interview?.mockId + "/feedback");
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {interview?.jobPosition}
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-md border border-indigo-500/20">
            <Award className="w-3 h-3" /> {interview?.jobExperience} Yrs Exp
          </span>
        </div>

        <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
          <Calendar className="w-3.5 h-3.5 text-slate-500" /> Created on: {interview?.createdAt}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
        <Button
          onClick={onFeedback}
          variant="outline"
          className="bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs rounded-xl h-9"
        >
          View Feedback
        </Button>
        <Button
          onClick={onStart}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl h-9 font-medium shadow-md shadow-indigo-600/20"
        >
          Start <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default InterviewItemCard;