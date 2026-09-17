"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, PlusCircle, Sparkles, Briefcase, FileText, Clock, Target, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AddQuestions = () => {
  const [openDailog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [typeQuestion, setTypeQuestion] = useState("");
  const [company, setCompany] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (setState) => (e) => {
    setState(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobPosition,
          jobDesc,
          typeQuestion,
          company,
          jobExperience,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate questions");
      }

      if (data.mockId) {
        setOpenDialog(false);
        router.push("/dashboard/pyq/" + data.mockId);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "There was an error processing the data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Trigger Card */}
      <div
        className="group relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-center items-center text-center border border-indigo-400/20"
        onClick={() => setOpenDialog(true)}
      >
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        <PlusCircle className="w-10 h-10 mb-3 text-indigo-100 group-hover:scale-110 transition-transform" />
        <h2 className="text-lg font-bold tracking-wide text-white">+ Create Question Pack</h2>
        <p className="text-xs text-indigo-100/80 mt-1 max-w-[200px]">Generate mock company & domain question lists</p>
      </div>

      {/* Creation Modal */}
      <Dialog open={openDailog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-xl bg-slate-900 border border-slate-800 text-slate-100 p-6 md:p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mb-2">
              <Sparkles className="w-3.5 h-3.5" /> AI Question Suite Setup
            </div>
            <DialogTitle className="text-2xl font-bold tracking-tight text-white">
              Configure Question Pack
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm">
              Provide target roles and companies to generate curated lists of study questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Job Role / Position
              </label>
              <Input
                className="bg-slate-950/80 border-slate-800 text-slate-100 focus:border-indigo-500 placeholder:text-slate-500 rounded-xl"
                value={jobPosition}
                placeholder="Ex. Senior Full Stack Developer"
                required
                onChange={handleInputChange(setJobPosition)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Tech Stack & Topics
              </label>
              <Textarea
                className="bg-slate-950/80 border-slate-800 text-slate-100 focus:border-indigo-500 placeholder:text-slate-500 rounded-xl min-h-[70px]"
                value={jobDesc}
                placeholder="Ex. React, Next.js, Node.js, TypeScript, System Design"
                required
                onChange={handleInputChange(setJobDesc)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-teal-400" /> Focus Type
                </label>
                <Input
                  className="bg-slate-950/80 border-slate-800 text-slate-100 focus:border-indigo-500 placeholder:text-slate-500 rounded-xl"
                  value={typeQuestion}
                  placeholder="Ex. Leetcode, Domain-specific"
                  required
                  onChange={handleInputChange(setTypeQuestion)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" /> Target Company
                </label>
                <Input
                  className="bg-slate-950/80 border-slate-800 text-slate-100 focus:border-indigo-500 placeholder:text-slate-500 rounded-xl"
                  value={company}
                  placeholder="Ex. Google, Stripe, Microsoft"
                  required
                  onChange={handleInputChange(setCompany)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" /> Years of Experience
              </label>
              <Input
                className="bg-slate-950/80 border-slate-800 text-slate-100 focus:border-indigo-500 placeholder:text-slate-500 rounded-xl"
                placeholder="Ex. 3"
                value={jobExperience}
                max="50"
                type="number"
                required
                onChange={handleInputChange(setJobExperience)}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 rounded-xl px-6"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                    Generating Questions...
                  </>
                ) : (
                  "Create Library"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddQuestions;
