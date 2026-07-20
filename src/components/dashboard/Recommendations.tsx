import React from "react";
import { ArrowUpRight, Zap, Target, BookOpen } from "lucide-react";
import WidgetCard from "./WidgetCard";
import { ActiveView } from "../../types";

interface RecommendationsProps {
  setView: (view: ActiveView) => void;
}

export default function Recommendations({ setView }: RecommendationsProps) {
  const recommendations = [
    {
      title: "Automated MCDA Decision matrix",
      description: "Map complex choices mathematically with weighted multi-criteria tradeoffs.",
      icon: Target,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      type: "Decision",
    },
    {
      title: "6-Week Agile Launch Plan",
      description: "Break down SaaS mvp launch into granular weekly thematic roadmaps.",
      icon: Zap,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      type: "Plan",
    },
    {
      title: "Hypothesis Proof Constructor",
      description: "Formulate research topics into academic hypotheses and methodologies.",
      icon: BookOpen,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      type: "Idea",
    },
  ];

  return (
    <WidgetCard
      title="Suggested Co-Thinking Objectives"
      subtitle="Strategically generated recommendations based on expert frameworks"
      className="h-full"
    >
      <div className="flex-grow flex flex-col gap-4">
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon;
          return (
            <div
              key={idx}
              onClick={() => setView("explore")}
              className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 cursor-pointer text-left"
            >
              <div className={`p-2 rounded-lg border shrink-0 ${rec.color}`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0 space-y-0.5 leading-tight">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-[11px] font-bold text-slate-900 truncate">
                    {rec.title}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 group-hover:text-slate-900 transition-colors uppercase font-display shrink-0 flex items-center gap-0.5">
                    Explore
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
                  {rec.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </WidgetCard>
  );
}
