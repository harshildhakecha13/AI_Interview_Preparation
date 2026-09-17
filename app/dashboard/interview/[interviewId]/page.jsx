"use client";
import { Lightbulb, WebcamIcon, Bot, Mic, Sparkles, Video, ArrowRight } from "lucide-react";
import React, { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import Link from "next/link";
import { WebCamContext } from "../../layout";

const Interview = ({ params }) => {
  const unwrappedParams = (params && typeof params.then === "function") ? React.use(params) : params;
  const interviewId = unwrappedParams?.interviewId;
  const { webCamEnabled, setWebCamEnabled } = useContext(WebCamContext);
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewDetails();
  }, [interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      const res = await fetch(`/api/interviews/${interviewId}`);
      if (!res.ok) throw new Error("Failed to fetch interview");
      const data = await res.json();
      setInterviewData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium">Loading interview details...</p>
      </div>
    );
  }

  if (!interviewData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-rose-400 gap-2">
        <h2 className="text-xl font-bold">Interview Not Found</h2>
        <p className="text-xs text-slate-400">The requested mock interview record could not be located.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Interview Room Readiness
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Prepare For Your Interview
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Check your audio and webcam feed before starting your 1-on-1 voice conversation with the AI interviewer.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Interview Metadata Card */}
          <div className="flex flex-col justify-between space-y-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
                <Bot className="w-5 h-5 text-indigo-400" /> Target Position Details
              </h2>
              
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Job Position / Role</span>
                  <p className="text-base font-bold text-slate-100 mt-0.5">{interviewData.jobPosition}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Tech Stack & Description</span>
                  <p className="text-sm text-slate-300 mt-0.5 leading-relaxed">{interviewData.jobDesc}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-xs text-slate-400 font-semibold block uppercase">Years of Experience Required</span>
                  <p className="text-sm font-bold text-indigo-400 mt-0.5">{interviewData.jobExperience} Years</p>
                </div>
              </div>
            </div>

            {/* Note box */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <Lightbulb className="w-4 h-4 shrink-0" /> Note & Instructions
              </div>
              <p className="text-amber-200/80 leading-relaxed">
                Make sure your microphone is unmuted. In 1-on-1 mode, the AI interviewer will speak the questions out loud and listen to your answers live.
              </p>
            </div>
          </div>

          {/* Webcam & Mode Selection Card */}
          <div className="flex flex-col justify-between space-y-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-xl">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-100 pb-3 border-b border-slate-800 flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" /> Device & Camera Check
              </h2>

              <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden h-60 flex items-center justify-center shadow-inner">
                {webCamEnabled ? (
                  <Webcam
                    onUserMedia={() => setWebCamEnabled(true)}
                    onUserMediaError={() => setWebCamEnabled(false)}
                    mirrored={true}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 space-y-2">
                    <WebcamIcon className="w-16 h-16 text-slate-600" />
                    <span className="text-xs">Webcam Disabled</span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs rounded-xl"
                onClick={() => setWebCamEnabled((prev) => !prev)}
              >
                {webCamEnabled ? "Disable Camera Feed" : "Enable Camera Feed"}
              </Button>
            </div>

            {/* Launch Buttons */}
            <div className="space-y-3 pt-2">
              <Link href={`/dashboard/interview/${interviewId}/voice`} className="block">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl py-6 font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm">
                  <Mic className="w-4 h-4 animate-pulse text-emerald-400" /> Start 1-on-1 Live Voice Call <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/dashboard/interview/${interviewId}/start`} className="block">
                <Button variant="outline" className="w-full bg-slate-950/80 border-slate-800 hover:bg-slate-800 text-slate-300 rounded-2xl py-5 text-xs font-semibold flex items-center justify-center gap-2">
                  <Video className="w-3.5 h-3.5 text-indigo-400" /> Self-Paced Step-by-Step Mode
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Interview;
