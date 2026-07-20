import React from "react";
import { Sparkles, ArrowRight, Play } from "lucide-react";
import { ActiveView } from "../../types";

interface WelcomeHeroProps {
  userName: string;
  recentBoardId: string | null;
  recentBoardTitle: string | null;
  setView: (view: ActiveView) => void;
  setSelectedBoardId: (id: string | null) => void;
}

export default function WelcomeHero({
  userName,
  recentBoardId,
  recentBoardTitle,
  setView,
  setSelectedBoardId,
}: WelcomeHeroProps) {
  const handleResume = () => {
    if (recentBoardId) {
      setSelectedBoardId(recentBoardId);
      setView("board_workspace");
    } else {
      setView("add_board");
    }
  };

  return (
    <div className="relative rounded-3xl bg-slate-950 p-6 md:p-8 text-white overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6 text-left">
      {/* Decorative Blur Background Elements */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-slate-800 opacity-20 blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#515f74] opacity-20 blur-2xl pointer-events-none" />

      {/* Main Text Section */}
      <div className="space-y-2 max-w-xl relative z-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-[10px] font-bold text-slate-300 uppercase tracking-wider font-display">
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>Executive System Active</span>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
          Good morning, {userName}
        </h1>
        <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-sans font-light">
          Your Aivora intelligent system has synthesized your context. Select an active co-thinking space to resume your intellectual session.
        </p>
      </div>

      {/* Dynamic Action Buttons */}
      <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 relative z-10 shrink-0">
        {recentBoardId ? (
          <button
            onClick={handleResume}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950 shadow-sm hover:bg-slate-50 transition-all duration-200 cursor-pointer font-display font-semibold hover:translate-x-0.5"
          >
            <Play className="h-4 w-4 fill-current text-slate-950 shrink-0" />
            Resume Recent: "{recentBoardTitle}"
          </button>
        ) : (
          <button
            onClick={() => setView("add_board")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-slate-950 shadow-sm hover:bg-slate-50 transition-all duration-200 cursor-pointer font-display font-semibold hover:translate-x-0.5"
          >
            Create Your First Board
            <ArrowRight className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={() => setView("manage_boards")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer font-display font-semibold"
        >
          View All Workspaces
        </button>
      </div>
    </div>
  );
}
