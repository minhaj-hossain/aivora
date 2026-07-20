import React from "react";
import { PlusCircle, Compass, FolderKanban, Sparkles } from "lucide-react";
import { ActiveView } from "../../types";

interface QuickActionsProps {
  setView: (view: ActiveView) => void;
}

export default function QuickActions({ setView }: QuickActionsProps) {
  const actions = [
    {
      label: "New Board",
      description: "Initialize blank custom thinking container",
      icon: PlusCircle,
      color: "bg-slate-900 text-white hover:bg-slate-800",
      iconColor: "text-white",
      onClick: () => setView("add_board"),
    },
    {
      label: "Explore Templates",
      description: "Launch expert co-thinking presets",
      icon: Compass,
      color: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200",
      iconColor: "text-slate-500 group-hover:text-slate-700",
      onClick: () => setView("explore"),
    },
    {
      label: "My Workspaces",
      description: "Audit existing boards and outputs",
      icon: FolderKanban,
      color: "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200",
      iconColor: "text-slate-500 group-hover:text-slate-700",
      onClick: () => setView("manage_boards"),
    },
  ];

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center gap-1.5 px-1">
        <Sparkles className="h-4 w-4 text-slate-500 shrink-0" />
        <h2 className="font-display text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">
          Accelerated Channels
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.onClick}
              className={`group flex items-start gap-4 p-4 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md cursor-pointer text-left ${action.color}`}
            >
              <div className="p-2 bg-slate-50/10 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                <Icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <div className="space-y-0.5 leading-tight">
                <span className="font-display text-sm font-bold block">
                  {action.label}
                </span>
                <span className="text-[10px] opacity-75 font-normal block max-w-[200px]">
                  {action.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
