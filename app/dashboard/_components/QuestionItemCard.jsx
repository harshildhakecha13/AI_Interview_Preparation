import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Calendar, Award, ArrowRight, BookOpen } from "lucide-react";

const QuestionItemCard = ({ question }) => {
  const router = useRouter();
  
  const onStart = () => {
    router.push("/dashboard/pyq/" + question?.mockId);
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 backdrop-blur-xl shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 overflow-hidden">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-lg text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {question?.jobPosition}
          </h3>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded-md border border-purple-500/20 shrink-0">
            <Award className="w-3 h-3" /> {question?.jobExperience} Yrs Exp
          </span>
        </div>

        <div className="space-y-1">
          {question?.company && (
            <p className="text-xs text-slate-400 font-medium">
              Target Company: <span className="text-indigo-400 font-semibold">{question.company}</span>
            </p>
          )}
          <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Created: {question?.createdAt}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80">
        <Button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs rounded-xl h-9 font-medium shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
        >
          <BookOpen className="w-3.5 h-3.5" /> View Questions <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default QuestionItemCard;
