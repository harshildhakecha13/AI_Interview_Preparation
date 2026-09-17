"use client";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";
import { Skeleton } from "@/components/ui/skeleton";
import { BrainCircuit, Sparkles } from "lucide-react";

const InterviewList = () => {
  const [interviewList, setInterviewList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await fetch("/api/interviews/list");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setInterviewList(data);
    } catch {
      // silently fail — user just won't see the list
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-800/40 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : interviewList.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No Mock Interviews Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "+ Create New Interview" above to launch your first AI-guided voice session.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewList;

