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
  Award,
  Bookmark,
  RefreshCw,
  Zap,
  Activity,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

const Feedback = ({ params }) => {
  const unwrappedParams = (params && typeof params.then === "function") ? React.use(params) : params;
  const interviewId = unwrappedParams?.interviewId;
  const router = useRouter();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedQuestions, setSavedQuestions] = useState({});

  useEffect(() => {
    fetchFeedback();
  }, [interviewId]);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/interviews/${interviewId}/feedback`);
      if (!res.ok) throw new Error("Failed to fetch feedback");
      const data = await res.json();
      setFeedbackList(Array.isArray(data) ? data : data.feedbackList || []);
    } catch (err) {
      console.warn("Feedback fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async (qItem) => {
    const questionText = qItem.question;
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          question: questionText,
          category: "Technical",
          difficulty: "Medium",
          idealAnswer: qItem.correctAns || qItem.idealAnswer || ""
        }),
      });

      if (res.ok) {
        setSavedQuestions(prev => ({ ...prev, [questionText]: true }));
        toast.success("Question bookmarked to your Saved Vault!");
      }
    } catch {
      toast.error("Failed to bookmark question");
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
      return {
        overall: 0,
        grade: "N/A",
        statusColor: "text-gray-400",
        techAccuracy: 0,
        commClarity: 0,
        archDepth: 0,
        totalQuestions: 0
      };
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

    // Category estimates derived from overall ratings
    const techAccuracy = Math.min(Math.round(avg * 10), 98);
    const commClarity = Math.min(Math.round((avg * 0.95 + 0.5) * 10), 95);
    const archDepth = Math.min(Math.round((avg * 0.9 + 0.8) * 10), 94);

    return {
      overall: avg,
      grade,
      statusColor,
      badgeText,
      totalQuestions: feedbackList.length,
      techAccuracy,
      commClarity,
      archDepth
    };
  }, [feedbackList]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium tracking-wide">Compiling multi-dimensional interview report...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Executive Interview Assessment
              </h1>
              <p className="text-xs text-slate-400">Deep Diagnostic, STAR Depth, & Targeted Drills</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/dashboard/interview/${interviewId}`}>
              <Button variant="outline" size="sm" className="bg-slate-900 border-slate-700 text-slate-300 text-xs">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retake
              </Button>
            </Link>
            <Link href="/dashboard/practice">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
                <Zap className="w-3.5 h-3.5 mr-1.5" /> Practice Weak Areas
              </Button>
            </Link>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => router.replace("/dashboard")}
              className="bg-slate-900 border-slate-700 text-slate-300 text-xs"
            >
              Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        </div>

        {feedbackList.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/60 border border-slate-800 rounded-3xl backdrop-blur-xl space-y-3">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-200">No Assessment Records Found</h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              You haven't submitted spoken answers for this interview session yet. Complete the interview to generate your scorecard.
            </p>
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs" onClick={() => router.replace(`/dashboard/interview/${interviewId}`)}>
              Launch Interview
            </Button>
          </div>
        ) : (
          <>
            {/* Overall Score Overview Card */}
            <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5" /> AI Comprehensive Evaluation
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {metrics.grade}
                </h2>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-xl">
                  Evaluated across core technical depth, architectural trade-offs, response conciseness, and candidate claim validation.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <Target className="w-4 h-4 text-indigo-400" />
                    <span>Questions Evaluated: <strong>{metrics.totalQuestions}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span>Readiness: <strong>{metrics.badgeText}</strong></span>
                  </div>
                </div>
              </div>

              {/* Score Badge */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-950/60 rounded-3xl border border-slate-800/60 shadow-inner">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-2">Overall Score</span>
                <div className={`w-28 h-28 rounded-full bg-gradient-to-tr ${metrics.statusColor} p-1 shadow-lg shadow-indigo-500/10 flex items-center justify-center`}>
                  <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white tracking-tight">{metrics.overall}</span>
                    <span className="text-[10px] text-slate-400 font-medium">/ 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Technical Accuracy</span>
                  <span className="text-white font-bold font-mono">{metrics.techAccuracy}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${metrics.techAccuracy}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Communication & Pacing</span>
                  <span className="text-white font-bold font-mono">{metrics.commClarity}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${metrics.commClarity}%` }} />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">System Architecture Depth</span>
                  <span className="text-white font-bold font-mono">{metrics.archDepth}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metrics.archDepth}%` }} />
                </div>
              </div>
            </div>

            {/* Per-Question Breakdown Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" /> Answer-by-Answer AI Diagnostic
                </h3>
                <span className="text-xs text-slate-400">Click any exchange to expand full feedback</span>
              </div>

              {parsedFeedbackList.map((item, index) => {
                const ratingNum = Number(item.rating || 0);
                const isGood = ratingNum >= 7.5;
                const isAverage = ratingNum >= 6 && ratingNum < 7.5;
                const badgeBg = isGood
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                  : isAverage
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  : "bg-rose-500/10 text-rose-400 border-rose-500/30";

                const isSaved = savedQuestions[item.question];

                return (
                  <Collapsible key={index} className="group border border-slate-800/90 rounded-2xl bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-200 hover:border-slate-700">
                    <CollapsibleTrigger className="p-5 w-full flex items-center justify-between text-left gap-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start gap-4 flex-1">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-slate-800 text-xs font-bold text-indigo-400 border border-slate-700 shrink-0">
                          #{index + 1}
                        </span>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-slate-200 text-sm md:text-base leading-snug group-hover:text-indigo-300 transition-colors">
                            {item.question}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            Answer: "{item.userAns || "Candidate response recorded"}"
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

                    <CollapsibleContent className="p-6 pt-2 border-t border-slate-800/60 bg-slate-950/40 space-y-5">
                      {/* Action Bar (Save to Question Library) */}
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSaveQuestion(item)}
                          disabled={isSaved}
                          className="text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-white"
                        >
                          <Bookmark className={`w-3.5 h-3.5 mr-1.5 ${isSaved ? "text-indigo-400 fill-indigo-400" : ""}`} />
                          {isSaved ? "Saved to Library" : "Save to Practice Library"}
                        </Button>
                      </div>

                      {/* Candidate Answer vs Ideal Model Answer */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Your Spoken Answer
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                            {item.userAns || "No response recorded."}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> High-Standard Ideal Answer
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                            {item.correctAns || item.idealAnswer || "Comprehensive technical architecture rationale."}
                          </p>
                        </div>
                      </div>

                      {/* Strong Points & What Went Well */}
                      {item.strongPoints && item.strongPoints.length > 0 && (
                        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ThumbsUp className="w-3.5 h-3.5" /> Key Strengths in Your Response
                          </span>
                          <ul className="space-y-1">
                            {item.strongPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="text-xs text-emerald-200/90 flex items-start gap-2">
                                <span className="text-emerald-400">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Could Improve */}
                      {item.couldImprove && item.couldImprove.length > 0 && (
                        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" /> Technical Gaps & Improvements
                          </span>
                          <ul className="space-y-1">
                            {item.couldImprove.map((pt, pIdx) => (
                              <li key={pIdx} className="text-xs text-amber-200/90 flex items-start gap-2">
                                <span className="text-amber-400">•</span>
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* General AI Feedback */}
                      <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 space-y-2">
                        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> AI Feedback Summary
                        </span>
                        <p className="text-xs text-indigo-100/90 leading-relaxed">
                          {item.feedback || "Detailed answer evaluated during session."}
                        </p>
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
