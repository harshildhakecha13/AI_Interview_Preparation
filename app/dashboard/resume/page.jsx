"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Trash2,
  Edit3,
  Save,
  Plus,
  X,
  ExternalLink,
  Loader2,
  RefreshCw,
  Building,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  Cpu,
  Layers,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

export default function ResumePage() {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("insights"); // "insights" | "profile" | "skills" | "experience" | "projects"
  const [isEditing, setIsEditing] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [showPasteModal, setShowPasteModal] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setResumeData(data.resume);
      }
    } catch (err) {
      console.warn("Failed to fetch resume:", err);
      toast.error("Failed to load resume details");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze resume");
      }

      const data = await res.json();
      setResumeData(data.resume);
      toast.success("Resume analyzed and structured successfully!");
    } catch (err) {
      console.warn("Upload error:", err);
      toast.error(err.message || "Resume upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pastedText.trim() || pastedText.length < 50) {
      toast.error("Please paste at least a paragraph of resume content");
      return;
    }
    setUploading(true);
    setShowPasteModal(false);
    const formData = new FormData();
    formData.append("text", pastedText);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze resume text");
      }

      const data = await res.json();
      setResumeData(data.resume);
      setPastedText("");
      toast.success("Resume content analyzed with AI successfully!");
    } catch (err) {
      console.warn("Paste error:", err);
      toast.error(err.message || "Failed to process pasted resume");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm("Are you sure you want to remove your resume? This will clear extracted claims.")) return;
    try {
      const res = await fetch("/api/resume", { method: "DELETE" });
      if (res.ok) {
        setResumeData(null);
        toast.success("Resume removed");
      }
    } catch (err) {
      toast.error("Failed to delete resume");
    }
  };

  const handleSaveEdits = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/resume", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      toast.success("Resume profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to save edits");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-sm font-medium">Loading AI Resume Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Resume Intelligence & AI Profiler
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Candidate Resume & Claims Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
            Upload your resume so the AI interviewer understands your actual background, verifies your claims, and conducts realistic, role-tailored technical interviews.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {resumeData && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 text-xs"
              >
                <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                {isEditing ? "Done Editing" : "Edit Extracted Info"}
              </Button>
              {isEditing && (
                <Button
                  size="sm"
                  onClick={handleSaveEdits}
                  disabled={saving}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                  Save Corrections
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteResume}
                className="border-red-900/50 text-red-400 hover:bg-red-950/40 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs shadow-lg shadow-indigo-600/20"
          >
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <UploadCloud className="w-3.5 h-3.5 mr-1.5" />}
            {resumeData ? "Replace Resume" : "Upload Resume (PDF)"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
        </div>
      </div>

      {/* If No Resume Uploaded Yet */}
      {!resumeData ? (
        <div className="max-w-3xl mx-auto py-12">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 bg-slate-900/40 rounded-3xl p-10 text-center space-y-5 transition-all group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Upload Your Resume</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Drag and drop your resume PDF or document here. Our AI will automatically parse your skills, engineering projects, and interview-worthy claims.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                PDF / DOCX
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                Instant AI Extraction
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">
                Fully Editable
              </span>
            </div>
            <div className="pt-4 flex items-center justify-center gap-4 text-xs text-indigo-400">
              <span className="underline" onClick={(e) => { e.stopPropagation(); setShowPasteModal(true); }}>
                Or paste resume text manually
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Resume Extracted View */
        <div className="space-y-6">
          {/* Top Quick Status Banner */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{resumeData.fileName || "Uploaded Resume"}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    AI Analyzed
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {resumeData.personal?.name || "Candidate"} • {resumeData.professional?.currentRole || "Engineer"} • {resumeData.professional?.totalExperience || "Experience Extracted"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/dashboard/job-match">
                <Button size="sm" variant="outline" className="text-xs border-slate-700 bg-slate-900 text-slate-300 hover:text-white">
                  Match Against Job Description <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
            {[
              { id: "insights", label: "AI Resume Insights", icon: Sparkles },
              { id: "profile", label: "Personal & Summary", icon: Briefcase },
              { id: "skills", label: "Technical Skills", icon: Cpu },
              { id: "experience", label: "Work Experience", icon: Building },
              { id: "projects", label: "Key Projects", icon: Layers },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                    isActive
                      ? "border-indigo-500 text-indigo-400"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: AI RESUME INSIGHTS */}
          {activeTab === "insights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interview-Worthy Claims (Crucial for AI Interrogation) */}
              <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-500/20 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  Interview-Worthy Claims Detected
                </div>
                <p className="text-xs text-slate-300">
                  Our AI extracted high-impact claims from your resume. The AI interviewer will specifically interrogate these achievements during your mock sessions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {(resumeData.insights?.interviewWorthyClaims || []).map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-900/80 border border-indigo-500/30 space-y-2">
                      <div className="text-xs font-bold text-white flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>"{item.claim}"</span>
                      </div>
                      <p className="text-[11px] text-indigo-300/80 bg-indigo-950/40 p-2 rounded-lg border border-indigo-500/20">
                        <strong>AI Probe Warning:</strong> {item.warning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Resume Strengths
                </h3>
                <ul className="space-y-2">
                  {(resumeData.insights?.strengths || []).map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Potential Weak Areas */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Potential Weak Areas & Gaps
                </h3>
                <ul className="space-y-2">
                  {(resumeData.insights?.weakAreas || []).map((w, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Important Technologies */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> Core Technologies Discovered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(resumeData.insights?.importantTechnologies || []).map((tech, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Focus Areas */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Priority Interview Topics
                </h3>
                <ul className="space-y-2">
                  {(resumeData.insights?.relevantExperience || []).map((exp, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400">→</span>
                      <span>{exp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL & PROFESSIONAL PROFILE */}
          {activeTab === "profile" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                      value={resumeData.personal?.name || ""}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personal: { ...resumeData.personal, name: e.target.value }
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-white mt-1">{resumeData.personal?.name || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                      value={resumeData.personal?.email || ""}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          personal: { ...resumeData.personal, email: e.target.value }
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-white mt-1">{resumeData.personal?.email || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Current Role</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                      value={resumeData.professional?.currentRole || ""}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          professional: { ...resumeData.professional, currentRole: e.target.value }
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-white mt-1">{resumeData.professional?.currentRole || "Not specified"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Total Experience</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full mt-1 p-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white"
                      value={resumeData.professional?.totalExperience || ""}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          professional: { ...resumeData.professional, totalExperience: e.target.value }
                        })
                      }
                    />
                  ) : (
                    <p className="text-sm font-semibold text-white mt-1">{resumeData.professional?.totalExperience || "Not specified"}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Professional Summary</label>
                {isEditing ? (
                  <textarea
                    rows={4}
                    className="w-full mt-1 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                    value={resumeData.professional?.summary || ""}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        professional: { ...resumeData.professional, summary: e.target.value }
                      })
                    }
                  />
                ) : (
                  <p className="text-xs text-slate-300 leading-relaxed mt-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    {resumeData.professional?.summary || "No summary extracted."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS MATRIX */}
          {activeTab === "skills" && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" /> Extracted Skill Taxonomy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(resumeData.skills || {}).map(([category, items]) => (
                  <div key={category} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">{category}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(items || []).map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WORK EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              {(resumeData.experience || []).map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                      <p className="text-xs text-indigo-400 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {exp.duration}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Key Responsibilities & Achievements:</p>
                    <ul className="space-y-1">
                      {(exp.responsibilities || []).map((r, rIdx) => (
                        <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-indigo-400">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: KEY PROJECTS */}
          {activeTab === "projects" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(resumeData.projects || []).map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    {proj.results && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
                        <strong>Outcome:</strong> {proj.results}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
                    {(proj.technologies || []).map((tech, tIdx) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Manual Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Paste Resume Content</h3>
              <button onClick={() => setShowPasteModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              rows={10}
              placeholder="Paste the full text of your resume here (skills, experience, projects, education)..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={() => setShowPasteModal(false)} className="text-xs border-slate-700">
                Cancel
              </Button>
              <Button size="sm" onClick={handlePasteSubmit} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs">
                Analyze Pasted Resume
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
