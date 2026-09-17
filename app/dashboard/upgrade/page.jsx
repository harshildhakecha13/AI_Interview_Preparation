"use client";
import React from "react";
import PricingPlan from "../_components/PricingPlan";
import { useUser } from "@/components/AuthProvider";
import { Check, Sparkles, Shield, Zap, BadgeAlert } from "lucide-react";

const Upgrade = () => {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Premium AI Capabilities
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
            Choose Your Prep Plan
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Get unlimited access to advanced real-time voice synthesis, extended answer feedback, and mock company-targeted questionnaires.
          </p>
        </div>

        {/* Informative Note */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20 max-w-2xl mx-auto text-xs text-indigo-300">
          <BadgeAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Sandbox Testing Environment:</span> These are simulated premium options designed to demonstrate subscription workflows. Do not submit real payment credentials.
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-4">
          {PricingPlan.map((item, index) => {
            const isYearly = item.duration.toLowerCase() === "yearly";
            return (
              <div
                key={index}
                className={`relative rounded-3xl p-6 md:p-8 bg-slate-900/60 backdrop-blur-md border ${
                  isYearly
                    ? "border-indigo-500/40 shadow-indigo-500/5 ring-1 ring-indigo-500/20"
                    : "border-slate-800"
                } flex flex-col justify-between space-y-6 hover:scale-[1.01] transition-transform duration-300`}
              >
                {isYearly && (
                  <span className="absolute -top-3 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Best Value
                  </span>
                )}

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-200">{item.duration} Premium</h3>
                    {isYearly ? (
                      <Zap className="w-5 h-5 text-indigo-400" />
                    ) : (
                      <Shield className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl md:text-5xl font-black text-white tracking-tight">${item.price}</span>
                    <span className="text-xs text-slate-400 font-medium">/ {isYearly ? "year" : "month"}</span>
                  </div>

                  <p className="text-xs text-slate-400">
                    {isYearly
                      ? "Unrestricted study toolkit for serious practitioners looking to advance."
                      : "Flexible month-to-month plan with immediate automated feedback access."}
                  </p>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited AI interview simulations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time speech-to-text evaluations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Expert AI-reviewed scoring & detailed reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Company-targeted question packs generation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority model answers guidance</span>
                  </li>
                </ul>

                <a
                  href={
                    item.link +
                    "?prefilled_email=" +
                    user?.primaryEmailAddress?.emailAddress
                  }
                  target="_blank"
                  className={`block text-center text-xs font-bold py-3.5 px-6 rounded-xl transition-all duration-300 ${
                    isYearly
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/20"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700"
                  }`}
                >
                  Subscribe to {item.duration}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
