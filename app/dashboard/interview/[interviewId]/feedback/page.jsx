"use client";
import React, { useEffect, useState, useMemo } from "react";
import {
  ChevronDown,
  Trophy,
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Award
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Feedback = ({ params }) => {
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/interviews/${params.interviewId}/feedback`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbackList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parsedFeedbackList = useMemo(() => {
    return feedbackList.map((item) => {
      let parsed = null;
      try {
        if (item.feedback && item.feedback.trim().startsWith("{")) {
          parsed = JSON.parse(item.feedback);
        }
      } catch {
        parsed = null;
      }
      return {
        ...item,
        parsedDetails: parsed,
      };
    });
  }, [feedbackList]);

  const metrics = useMemo(() => {
    if (!feedbackList || feedbackList.length === 0) {
      return { overall: 0, grade: "N/A", statusColor: "text-gray-400" };
    }
    const total = feedbackList.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    const avg = Number((total / feedbackList.length).toFixed(1));
    
    let grade = "Needs Improvement";
    let statusColor = "from-red-500 to-rose-600";
    let badgeText = "Keep Practicing";

    if (avg >= 8) {
      grade = "Excellent Mastery";
      statusColor = "from-emerald-400 to-teal-500";
      badgeText = "Interview Ready!";
    } else if (avg >= 6) {
      grade = "Good Performance";
      statusColor = "from-blue-500 to-indigo-600";
      badgeText = "Solid Foundation";
    } else if (avg >= 4) {
      grade = "Fair Effort";
      statusColor = "from-amber-400 to-orange-500";
      badgeText = "Room for Growth";
    }

    return { overall: avg, grade, statusColor, badgeText, totalQuestions: feedbackList.length };
  }, [feedbackList]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium tracking-wide">Analyzing your interview performance with AI...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background Subtle Glowing Gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                AI Interview Evaluation
              </h1>
              <p className="text-xs text-slate-400">Detailed Feedback & Scoring Report</p>
            </div>
          </div>
          <Button 
            onClick={() => router.replace("/dashboard")}
            className="bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 shadow-md"
          >
            Back to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {feedbackList.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-xl">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-200">No Assessment Records Found</h2>
            <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
              You haven't submitted answers for this interview yet. Complete your interview to generate an AI evaluation report.
            </p>
            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-6" onClick={() => router.replace("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        ) : (
          <>
            {/* Overall Score Overview Card */}
            <div className="relative p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> AI Comprehensive Evaluation
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {metrics.grade}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                  We evaluated your answers across technical accuracy, communication clarity, problem-solving, and response structure. Here is your overall interview score breakdown.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span>Questions Evaluated: <strong>{metrics.totalQuestions}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Status: <strong>{metrics.badgeText}</strong></span>
                  </div>
                </div>
              </div>

              {/* Big Score Radial Badge */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-2xl border border-slate-800/60 shadow-inner">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">Overall Score</span>
                <div className="relative flex items-center justify-center">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-tr ${metrics.statusColor} p-1 shadow-lg shadow-indigo-500/10 flex items-center justify-center`}>
                    <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-white tracking-tight">{metrics.overall}</span>
                      <span className="text-xs text-slate-400 font-medium">/ 10</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Question Breakdown Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" /> Per-Question Performance & Analysis
                </h3>
                <span className="text-xs text-slate-400">Click any question to view AI feedback</span>
              </div>

              {parsedFeedbackList.map((item, index) => {
                const ratingNum = Number(item.rating || 0);
                const isGood = ratingNum >= 7;
                const isAverage = ratingNum >= 5 && ratingNum < 7;
                const badgeBg = isGood
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : isAverage
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30";

                const details = item.parsedDetails;

                return (
                  <Collapsible key={index} className="group border border-slate-800/90 rounded-2xl bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-slate-700">
                    <CollapsibleTrigger className="p-5 w-full flex items-center justify-between text-left gap-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 text-xs font-bold text-indigo-400 border border-slate-700 shrink-0">
                          #{index + 1}
                        </span>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-slate-200 text-base leading-snug group-hover:text-indigo-300 transition-colors">
                            {item.question}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            Your answer: "{item.userAns || "No answer recorded"}"
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${badgeBg}`}>
                          Score: {ratingNum}/10
                        </span>
                        <ChevronDown className="w-5 h-5 text-slate-400 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="p-6 pt-2 border-t border-slate-800/60 bg-slate-950/40 space-y-6">
                      
                      {/* Metric Scores if detailed JSON exists */}
                      {details && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">Technical Accuracy</span>
                            <div className="text-lg font-bold text-indigo-400">{details.technicalScore || item.rating}/10</div>
                          </div>
                          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">Communication Clarity</span>
                            <div className="text-lg font-bold text-purple-400">{details.communicationScore || item.rating}/10</div>
                          </div>
                          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                            <span className="text-xs text-slate-400">Problem Solving</span>
                            <div className="text-lg font-bold text-teal-400">{details.problemSolvingScore || item.rating}/10</div>
                          </div>
                        </div>
                      )}

                      {/* Your Answer vs Ideal Answer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Candidate Answer
                          </span>
                          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                            {item.userAns || "No response provided."}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ideal Model Answer
                          </span>
                          <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                            {item.correctAns || "No benchmark answer recorded."}
                          </p>
                        </div>
                      </div>

                      {/* AI Feedback & Actionable Recommendations */}
                      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-2">
                        <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> AI Feedback & Key Recommendations
                        </span>
                        <p className="text-sm text-indigo-100/90 leading-relaxed">
                          {details?.feedback || item.feedback || "Detailed analysis recorded."}
                        </p>
                        {details?.strengths && (
                          <div className="pt-2 text-xs text-emerald-400">
                            <strong>Key Strengths:</strong> {details.strengths}
                          </div>
                        )}
                        {details?.areasForImprovement && (
                          <div className="pt-1 text-xs text-amber-400">
                            <strong>Areas to Improve:</strong> {details.areasForImprovement}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Feedback;
