import React from "react";
import { MessageSquare, ArrowRight, Brain, Sparkles, User, ChevronRight } from "lucide-react";
import WidgetCard from "./WidgetCard";
import { ActiveView } from "../../types";

interface RecentThreadItem {
  _id: string;
  boardId: string;
  boardTitle: string;
  role: "user" | "model";
  content: string;
  createdAt: string | Date;
}

interface RecentThreadsProps {
  threads: RecentThreadItem[];
  setView: (view: ActiveView) => void;
  setSelectedBoardId: (id: string | null) => void;
}

export default function RecentThreads({
  threads,
  setView,
  setSelectedBoardId,
}: RecentThreadsProps) {
  const handleLaunch = (boardId: string) => {
    setSelectedBoardId(boardId);
    setView("board_workspace");
  };

  return (
    <WidgetCard
      title="Recent AI Interactive Threads"
      subtitle="The latest co-thinking discussions and decision logs"
      headerAction={
        <button
          onClick={() => setView("manage_boards")}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-display"
        >
          <span>All Threads</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      }
      className="h-full"
    >
      {threads.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <MessageSquare className="h-8 w-8 text-slate-400 mb-3 animate-bounce" />
          <h4 className="font-display text-xs font-bold text-slate-900 mb-1">
            No Discussion Threads
          </h4>
          <p className="text-[10px] text-slate-400 max-w-xs mx-auto mb-4 font-sans leading-relaxed">
            Start a conversational dialogue with Aivora inside any of your workspaces to see active co-thinking threads!
          </p>
          <button
            onClick={() => setView("manage_boards")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[10px] font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer font-display"
          >
            Launch Board Workspace
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex-grow divide-y divide-slate-100">
          {threads.map((thread) => {
            const isUser = thread.role === "user";
            const updatedTime = new Date(thread.createdAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            });

            return (
              <div
                key={thread._id}
                onClick={() => handleLaunch(thread.boardId)}
                className="group py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50/30 rounded-xl px-2 -mx-2 transition-all duration-200 text-left"
              >
                {/* Role Icon */}
                <div
                  className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${
                    isUser
                      ? "bg-slate-50 border-slate-200 text-slate-600"
                      : "bg-emerald-50 border-emerald-100 text-emerald-700"
                  }`}
                >
                  {isUser ? (
                    <User className="h-3.5 w-3.5" />
                  ) : (
                    <Brain className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Content Snippet */}
                <div className="space-y-1 min-w-0 flex-1 leading-tight">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-500 block truncate font-display group-hover:text-slate-900 transition-colors">
                      {thread.boardTitle}
                    </span>
                    <span className="text-[9px] font-normal text-slate-400 block shrink-0 font-mono">
                      {updatedTime}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider font-display text-[9px]">
                    {isUser ? "User Thought" : "Aivora System"}
                  </p>

                  <p className="text-[11px] text-slate-400 font-normal line-clamp-2 leading-relaxed">
                    {thread.content.replace(/>\s*⚠️\s*Demo Note:.*?\n\n/s, "")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WidgetCard>
  );
}
