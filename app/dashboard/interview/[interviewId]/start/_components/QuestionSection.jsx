import { Lightbulb, Volume2, Sparkles, BrainCircuit } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

const QuestionSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const textToSpeech = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.95;
      window.speechSynthesis.speak(speech);
    } else {
      console.warn("Sorry, your browser does not support text to speech.");
    }
  };

  React.useEffect(() => {
    if (mockInterviewQuestion && mockInterviewQuestion[activeQuestionIndex]?.Question) {
      textToSpeech(mockInterviewQuestion[activeQuestionIndex].Question);
    }
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeQuestionIndex, mockInterviewQuestion]);

  if (!mockInterviewQuestion) return null;

  return (
    <div className="flex flex-col justify-between p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5" /> Technical Question #{activeQuestionIndex + 1}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
          </span>
        </div>

        {/* Question Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {mockInterviewQuestion.map((_, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                activeQuestionIndex === index
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-800/80 text-slate-400 border border-slate-700/60"
              }`}
            >
              Q{index + 1}
            </span>
          ))}
        </div>

        {/* Question Content */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
          <p className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed">
            {mockInterviewQuestion[activeQuestionIndex]?.Question}
          </p>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.Question)}
            className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-2.5 py-1 rounded-xl flex items-center gap-1.5"
          >
            <Volume2 className="w-4 h-4" /> Replay Spoken Audio
          </Button>
        </div>
      </div>

      {/* Structured Instruction Note */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs space-y-1.5 text-indigo-200">
        <div className="flex items-center gap-1.5 font-bold text-indigo-300">
          <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0" />
          STAR Response Tip
        </div>
        <p className="text-slate-400 leading-relaxed">
          Structure your explanation clearly: outline the technical trade-offs, state the specific architecture or data structures you chose, and conclude with measurable system impact.
        </p>
      </div>
    </div>
  );
};

export default QuestionSection;

