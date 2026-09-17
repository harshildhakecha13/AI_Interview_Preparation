"use client";
import React, { useEffect, useState } from "react";
import { Award, Trophy, MessageSquare, Briefcase, TrendingUp, Sparkles } from "lucide-react";

export default function DashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dashboard/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-900/50 rounded-2xl border border-slate-800/60"></div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: "Interviews Conducted",
      value: stats.totalInterviews,
      sub: "Total unique sessions",
      icon: Briefcase,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Answers Evaluated",
      value: stats.totalQuestionsAnswered,
      sub: "AI evaluated responses",
      icon: MessageSquare,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Average Score",
      value: stats.averageScore > 0 ? `${stats.averageScore}/10` : "N/A",
      sub: "Across all evaluated answers",
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Peak Performance",
      value: stats.highestScore > 0 ? `${stats.highestScore}/10` : "N/A",
      sub: "Your highest scoring answer",
      icon: Trophy,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border bg-slate-900/60 backdrop-blur-md shadow-lg flex items-center justify-between hover:scale-[1.01] transition-transform duration-300 ${card.bg}`}
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {card.title}
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight">
                {card.value}
              </h3>
              <p className="text-[11px] text-slate-400">
                {card.sub}
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-slate-950/80 border border-slate-800 shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
          </div>
        ))}
      </div>

      {stats.rolesBreakdown && stats.rolesBreakdown.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400" /> Focus Domains & Frequency
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {stats.rolesBreakdown.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between"
              >
                <span className="text-xs text-slate-300 font-bold line-clamp-1">{item.role}</span>
                <span className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {item.count} {item.count === 1 ? "Session" : "Sessions"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
