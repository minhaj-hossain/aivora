import React from "react";
import { ArrowRight, MessageSquare, FileText, ChevronRight, Sparkles } from "lucide-react";
import WidgetCard from "./WidgetCard";
import { ActiveView } from "../../types";

interface RecentBoardItem {
  _id: string;
  title: string;
  description: string;
  category: "Decision" | "Idea" | "Plan";
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  messageCount: number;
  outputCount: number;
}

interface RecentBoardsProps {
  boards: RecentBoardItem[];
  setView: (view: ActiveView) => void;
  setSelectedBoardId: (id: string | null) => void;
}

export default function RecentBoards({
  boards,
  setView,
  setSelectedBoardId,
}: RecentBoardsProps) {
  const handleLaunch = (id: string) => {
    setSelectedBoardId(id);
    setView("board_workspace");
  };

  const getCategoryStyles = (cat: string) => {
    switch (cat) {
      case "Decision":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "Plan":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Idea":
      default:
        return "bg-amber-50 text-amber-700 border-amber-100";
    }
  };

  return (
    <WidgetCard
      title="Recent Co-Thinking Workspaces"
      subtitle="Launch interactive sessions or manage your strategic boards"
      headerAction={
        <button
          onClick={() => setView("manage_boards")}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-display"
        >
          <span>View All</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      }
      className="h-full"
    >
      {boards.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Sparkles className="h-8 w-8 text-slate-400 mb-3 animate-bounce" />
          <h4 className="font-display text-xs font-bold text-slate-900 mb-1">
            No Workspaces Initialized
          </h4>
          <p className="text-[10px] text-slate-400 max-w-xs mx-auto mb-4 font-sans leading-relaxed">
            Create a blank board or copy one of our expert templates to initialize your decision canvas!
          </p>
          <button
            onClick={() => setView("add_board")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[10px] font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer font-display"
          >
            Create Your First Board
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex-grow divide-y divide-slate-100">
          {boards.map((b) => {
            const hasMessages = b.messageCount > 0;
            const hasOutputs = b.outputCount > 0;
            const updatedDate = new Date(b.updatedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={b._id}
                onClick={() => handleLaunch(b._id)}
                className="group py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-6 cursor-pointer hover:bg-slate-50/30 rounded-xl px-2 -mx-2 transition-all duration-200 text-left"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex rounded-md border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider font-display shrink-0 ${getCategoryStyles(
                        b.category
                      )}`}
                    >
                      {b.category}
                    </span>

                    {hasMessages ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider font-display shrink-0">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                        AI Analyzed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider font-display shrink-0">
                        Idle
                      </span>
                    )}

                    {hasOutputs && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider font-display shrink-0">
                        <FileText className="h-2.5 w-2.5 text-blue-500 shrink-0" />
                        Outputs ({b.outputCount})
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm group-hover:text-slate-950 transition-colors truncate">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-normal line-clamp-1">
                    {b.description}
                  </p>
                </div>

                {/* Date & Trigger Arrow */}
                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="hidden sm:block leading-none">
                    <span className="text-[9px] font-normal text-slate-400 block">
                      Last Saved
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 block mt-0.5 font-sans">
                      {updatedDate}
                    </span>
                  </div>

                  <div className="h-7 w-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-200 shrink-0">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}
