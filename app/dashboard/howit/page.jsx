import React from "react";
import { Sparkles, HelpCircle, ArrowRight, Settings, Mic, Award, Zap } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Set Your Parameters",
      description: "Define your target job position, required skills, technology stack, and years of experience. Our system supports everything from junior developers to lead architects.",
      icon: Settings,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      step: "02",
      title: "Real-time AI Interviewing",
      description: "The AI conducts a dynamic five-question interview based exactly on your parameters. Respond verbally using your microphone or type your answer directly in the editor.",
      icon: Mic,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      step: "03",
      title: "Granular Feedback Reports",
      description: "Our advanced model evaluates each answer, comparing your responses to ideal candidate profiles. Get graded (1-10), list your strengths, and review explicit model improvements.",
      icon: Award,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Zap className="w-3.5 h-3.5 animate-pulse" /> Advanced Neural Evaluation
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            How the System Works
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Our platform integrates high-precision speech-to-text models with Gemini AI to simulate enterprise mock interview cycles seamlessly.
          </p>
        </div>

        {/* Dynamic Timeline Steps */}
        <div className="space-y-6 pt-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-6 md:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-slate-700/80 transition-all`}
            >
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-4xl md:text-5xl font-black text-indigo-500/20 tracking-tighter font-mono">
                  {step.step}
                </span>
                <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${step.color}`}>
                  <step.icon className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-2 flex-1">
                <h3 className="text-lg md:text-xl font-bold text-slate-200">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:flex shrink-0 text-slate-700">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Closing card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-500/20 text-center space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Ready to accelerate your career?
          </h3>
          <p className="text-xs text-indigo-200 max-w-lg mx-auto leading-relaxed">
            Create your first mock interview, practice in real time with high fidelity feedback, and get ready to land your dream offer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
