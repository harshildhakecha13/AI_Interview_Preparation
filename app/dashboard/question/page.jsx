import React from "react";
import AddQuestions from "../_components/AddQuestions";
import QuestionList from "../_components/QuestionList";
import { Sparkles, HelpCircle } from "lucide-react";

const Questions = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Block */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-950/60 border border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Curated Question Library
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Targeted Question Playgrounds
            </h1>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Generate curated mock company questionnaires, domain concepts, or technical topic collections with automated expert-designed explanations and model responses.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0">
            <AddQuestions />
          </div>
        </div>

        {/* Previous Questions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-400" /> Prepared Question Libraries
              </h2>
              <p className="text-xs text-slate-400 mt-1">Review, expand, and practice company-specific mock cards</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 backdrop-blur-md">
            <QuestionList />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Questions;