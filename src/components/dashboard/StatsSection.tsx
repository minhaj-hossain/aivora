import React from "react";
import { FolderKanban, Zap, CheckCircle2 } from "lucide-react";
import WidgetCard from "./WidgetCard";

interface StatsSectionProps {
  activeProjects: number;
  tokensUsed: number;
  completedTasks: number;
}

export default function StatsSection({
  activeProjects,
  tokensUsed,
  completedTasks,
}: StatsSectionProps) {
  // Format numbers with commas (e.g. 125,450)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const stats = [
    {
      title: "Active Workspaces",
      value: formatNumber(activeProjects),
      subtext: "Thinking scopes configured",
      icon: FolderKanban,
      color: "text-blue-600",
      bg: "bg-blue-50/50 border-blue-100",
    },
    {
      title: "AI Tokens Utilized",
      value: formatNumber(tokensUsed),
      subtext: "Synthesized character words",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-50/50 border-amber-100",
    },
    {
      title: "Completed Syntheses",
      value: formatNumber(completedTasks),
      subtext: "MCDA briefs & roadmaps",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50/50 border-emerald-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <WidgetCard key={idx} className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display">
                  {stat.title}
                </p>
                <p className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] font-normal text-slate-400 font-sans">
                  {stat.subtext}
                </p>
              </div>

              <div className={`p-3 rounded-2xl border shrink-0 ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </WidgetCard>
        );
      })}
    </div>
  );
}
