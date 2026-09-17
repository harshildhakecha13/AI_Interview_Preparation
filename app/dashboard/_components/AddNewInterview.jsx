"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  LoaderCircle,
  PlusCircle,
  Sparkles,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Sliders,
  UploadCloud,
  FileCheck,
  Video,
  Mic,
  ShieldCheck,
  Building,
  Target
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  // Step 1: Role Setup
  const [jobPosition, setJobPosition] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [seniorityLevel, setSeniorityLevel] = useState("Mid-Level");

  // Step 2: Interview Type
  const [interviewType, setInterviewType] = useState("Technical");

  // Step 3: Difficulty & Parameters
  const [difficulty, setDifficulty] = useState("Medium");
  const [duration, setDuration] = useState("20 min");
  const [questionsCount, setQuestionsCount] = useState(5);

  // Step 4: Resume Integration
  const [useResume, setUseResume] = useState(true);
  const [storedResume, setStoredResume] = useState(null);

  // Step 5: Job Description
  const [useJD, setUseJD] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("3");

  // Step 6: Interview Mode & Audio/Video
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [interviewerTone, setInterviewerTone] = useState("Professional & Challenging");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (openDialog) {
      fetchResumeStatus();
    }
  }, [openDialog]);

  const fetchResumeStatus = async () => {
    try {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setStoredResume(data.resume);
        if (data.resume) {
          setUseResume(true);
          if (!jobPosition && data.resume.professional?.currentRole) {
            setJobPosition(data.resume.professional.currentRole);
          }
        }
      }
    } catch {
      // Resume check silent fallback
    }
  };

  const interviewTypes = [
    { id: "Technical", label: "Technical Deep-Dive", desc: "Core architecture, frameworks, databases, and problem solving" },
    { id: "Behavioral", label: "Behavioral (STAR)", desc: "Leadership, conflict resolution, ownership, and communication" },
    { id: "System Design", label: "System Design", desc: "High concurrency, distributed caching, databases & microservices" },
    { id: "Coding", label: "Coding & Algorithms", desc: "Data structures, algorithmic trade-offs, and clean code" },
    { id: "HR", label: "Cultural & HR", desc: "Career goals, motivation, team collaboration, and background" },
    { id: "Mixed", label: "Comprehensive Full Loop", desc: "Mixed technical depth, behavioral scenarios, and architecture" }
  ];

  const handleNext = () => {
    if (step === 1) {
      if (!jobPosition.trim()) {
        setError("Please enter a Target Job Role / Position");
        return;
      }
    }
    if (step === 5 && useJD && !jobDesc.trim()) {
      setError("Please paste the Job Description or disable JD mode");
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrev = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const techStackPayload = jobDesc.trim() || `${jobPosition} with ${seniorityLevel} engineering expectations`;

      const payload = {
        jobPosition,
        jobDesc: techStackPayload,
        jobExperience: jobExperience || "3",
        interviewType,
        difficulty,
        duration,
        questionsCount,
        resumeUsed: useResume && !!storedResume,
        jdUsed: useJD,
        jobDescriptionFull: useJD ? jobDesc : "",
        voiceEnabled,
        cameraEnabled,
        interviewerTone
      };

      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create personalized interview.");
        return;
      }

      setOpenDialog(false);
      toast.success("AI Mock Interview created successfully!");
      router.push("/dashboard/interview/" + data.mockId);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Card */}
      <div
        className="group relative p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 hover:from-indigo-500 hover:to-purple-700 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-center items-center text-center border border-indigo-400/30"
        onClick={() => {
          setStep(1);
          setOpenDialog(true);
        }}
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <PlusCircle className="w-10 h-10 mb-3 text-indigo-100 group-hover:scale-110 transition-transform" />
        <h2 className="text-lg font-bold tracking-wide text-white">+ Create New Interview</h2>
        <p className="text-xs text-indigo-100/80 mt-1 max-w-[220px]">
          Multi-step personalized setup with Resume & JD intelligence
        </p>
      </div>

      {/* Multi-Step Creation Modal */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 p-6 md:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <div className="flex justify-between items-center w-full mb-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Step {step} of {totalSteps}
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {step === 1 && "Role Setup"}
                {step === 2 && "Interview Track"}
                {step === 3 && "Difficulty & Length"}
                {step === 4 && "Resume Intelligence"}
                {step === 5 && "Job Description"}
                {step === 6 && "Audio & Persona"}
              </span>
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              {step === 1 && "Target Role & Seniority"}
              {step === 2 && "Select Interview Track"}
              {step === 3 && "Difficulty & Question Depth"}
              {step === 4 && "Resume Personalization"}
              {step === 5 && "Target Job Description (JD)"}
              {step === 6 && "Interview Mode & Environment"}
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs">
              {step === 1 && "Define the specific position and target company so questions mirror the actual team."}
              {step === 2 && "Choose the primary focus or mix for this interview session."}
              {step === 3 && "Calibrate the rigor, duration, and question count."}
              {step === 4 && "Anchor the AI interviewer to your actual background and claims."}
              {step === 5 && "Align questions against the exact job description requirements."}
              {step === 6 && "Configure voice, camera, and interviewer demeanor."}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-slate-800 rounded-full my-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* STEP 1: ROLE SETUP */}
          {step === 1 && (
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Target Job Role / Title *
                </label>
                <Input
                  className="bg-slate-950/80 border-slate-800 text-slate-100 focus:border-indigo-500 rounded-xl"
                  placeholder="e.g. Senior Full Stack Engineer, Cloud Architect"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-purple-400" /> Target Company (Optional)
                </label>
                <Input
                  className="bg-slate-950/80 border-slate-800 text-slate-100 focus:border-indigo-500 rounded-xl"
                  placeholder="e.g. Google, Stripe, Datadog, Early-Stage Startup"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" /> Seniority Level
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {["Entry / Junior", "Mid-Level", "Senior", "Staff / Lead"].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSeniorityLevel(lvl)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        seniorityLevel === lvl
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Total Experience (Years)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  className="bg-slate-950/80 border-slate-800 text-slate-100 rounded-xl"
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: INTERVIEW TYPE */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
              {interviewTypes.map((type) => (
                <div
                  key={type.id}
                  onClick={() => setInterviewType(type.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    interviewType === type.id
                      ? "bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold text-white">{type.label}</h4>
                    {interviewType === type.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{type.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* STEP 3: DIFFICULTY & PARAMETERS */}
          {step === 3 && (
            <div className="space-y-5 py-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Interview Difficulty
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "Easy", desc: "Foundational concepts" },
                    { id: "Medium", desc: "Standard industry bar" },
                    { id: "Hard", desc: "Rigorous trade-offs & edge cases" },
                    { id: "Expert", desc: "Principal / Architect level" }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficulty(d.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        difficulty === d.id
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="text-xs font-bold">{d.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{d.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Session Duration
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["10 min", "20 min", "30 min", "45 min"].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setDuration(dur)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          duration === dur
                            ? "bg-indigo-600/30 border-indigo-500 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Planned Question Depth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 8, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionsCount(num)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          questionsCount === num
                            ? "bg-indigo-600/30 border-indigo-500 text-white"
                            : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {num} Qs
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: RESUME INTEGRATION */}
          {step === 4 && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Incorporate Candidate Resume</h4>
                  <p className="text-[11px] text-slate-400">
                    Personalize questions to test your claimed technologies, project achievements, and background.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseResume(!useResume)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    useResume ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      useResume ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {storedResume ? (
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Active Resume Loaded
                  </div>
                  <p className="text-xs text-slate-300">
                    <strong>{storedResume.fileName}</strong> ({storedResume.personal?.name || "Candidate"})
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Extracted {storedResume.projects?.length || 0} projects, {storedResume.experience?.length || 0} work experiences, and {storedResume.insights?.interviewWorthyClaims?.length || 0} interview-worthy claims.
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-950/40 border border-dashed border-slate-800 text-center space-y-2">
                  <p className="text-xs text-slate-400">No resume uploaded yet.</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push("/dashboard/resume")}
                    className="text-xs border-slate-700 bg-slate-900 text-indigo-400 hover:text-white"
                  >
                    Upload Resume in Resume Studio →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: JOB DESCRIPTION */}
          {step === 5 && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-white">Target Specific Job Description</h4>
                  <p className="text-[11px] text-slate-400">
                    Paste the target job qualifications or requirements to align question vectors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUseJD(!useJD)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    useJD ? "bg-indigo-600" : "bg-slate-800"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      useJD ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {useJD ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Job Description / Key Requirements
                  </label>
                  <Textarea
                    rows={6}
                    placeholder="Paste the target job description or requirements here..."
                    className="bg-slate-950/80 border-slate-800 text-slate-100 rounded-xl text-xs"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Key Tech Stack & Description
                  </label>
                  <Textarea
                    rows={3}
                    placeholder="e.g. React, Next.js, Node.js, TypeScript, PostgreSQL, Distributed Systems"
                    className="bg-slate-950/80 border-slate-800 text-slate-100 rounded-xl text-xs"
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 6: INTERVIEW MODE & PERSONA */}
          {step === 6 && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    voiceEnabled ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-slate-950/60 border-slate-800 text-slate-400"
                  }`}
                >
                  <Mic className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Voice / Audio</div>
                    <div className="text-[10px] text-slate-400">{voiceEnabled ? "Enabled" : "Muted (Text Only)"}</div>
                  </div>
                </div>

                <div
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                    cameraEnabled ? "bg-indigo-600/20 border-indigo-500 text-white" : "bg-slate-950/60 border-slate-800 text-slate-400"
                  }`}
                >
                  <Video className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-xs font-bold text-white">Camera Check</div>
                    <div className="text-[10px] text-slate-400">{cameraEnabled ? "Enabled" : "Off"}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  AI Interviewer Persona
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { id: "Professional & Challenging", desc: "Probing follow-ups, tests edge cases" },
                    { id: "Supportive Coach", desc: "Encouraging, guides when stuck" },
                    { id: "FAANG Bar Raiser", desc: "Rigorous, high standard, strict STAR metrics" }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setInterviewerTone(p.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        interviewerTone === p.id
                          ? "bg-indigo-600/30 border-indigo-500 text-white"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{p.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary badge */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-white">Configured Interview Blueprint:</div>
                <div className="text-[11px] text-slate-400">
                  {jobPosition} ({seniorityLevel}) • {interviewType} Track • {difficulty} Difficulty • {duration} • {useResume ? "Resume claims active" : "Standard profile"}
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800/80 mt-2">
            {step > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrev}
                className="border-slate-700 bg-slate-950 text-slate-300 hover:text-white text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpenDialog(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                type="button"
                size="sm"
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={loading}
                onClick={onSubmit}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Generating Personalized Interview...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                    Launch AI Interview
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
