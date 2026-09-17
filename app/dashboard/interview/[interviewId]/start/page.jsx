"use client";
import React, { useState, useEffect } from "react";
import QuestionSection from "./_components/QuestionSection";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Award, Mic, BrainCircuit } from "lucide-react";

const StartInterview = ({ params }) => {
  const unwrappedParams = (params && typeof params.then === "function") ? React.use(params) : params;
  const interviewId = unwrappedParams?.interviewId;
  const [interviewData, setInterviewData] = useState(null);
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interviews/${interviewId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMockInterviewQuestion(JSON.parse(data.jsonMockResp));
      setInterviewData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono">Loading interview session questions...</p>
      </div>
    );
  }

  const handleAnswerSaved = () => {
    if (activeQuestionIndex < (mockInterviewQuestion?.length || 0) - 1) {
      setActiveQuestionIndex((prev) => prev + 1);
    } else {
      window.location.href = `/dashboard/interview/${interviewData?.mockId}/feedback`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Session Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/interview/${interviewId}`}>
            <Button size="icon" variant="outline" className="w-9 h-9 rounded-xl bg-slate-900 border-slate-800 text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white">
                {interviewData?.jobPosition || "Technical Interview"}
              </h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Step-by-Step Mode
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Question {activeQuestionIndex + 1} of {mockInterviewQuestion?.length || 5}
            </p>
          </div>
        </div>

        <Link href={`/dashboard/interview/${interviewId}/voice`}>
          <Button size="sm" variant="outline" className="bg-indigo-950/40 border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/40 text-xs rounded-xl flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-emerald-400" /> Switch to Real-Time Voice Call
          </Button>
        </Link>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          onAnswerSaved={handleAnswerSaved}
        />
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div>
          {activeQuestionIndex > 0 ? (
            <Button
              variant="outline"
              onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
              className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs rounded-xl h-10 flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Question
            </Button>
          ) : <div />}
        </div>

        <div className="flex items-center gap-3">
          {activeQuestionIndex < (mockInterviewQuestion?.length || 0) - 1 ? (
            <Button
              onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-xl h-10 font-medium px-4 shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
            >
              Next Question <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Link href={"/dashboard/interview/" + interviewData?.mockId + "/feedback"}>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs rounded-xl h-10 font-bold px-5 shadow-lg shadow-emerald-600/20 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Finish & View Diagnostic Scorecard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StartInterview;

