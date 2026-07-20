import React from "react";
import { Search, Bell, Database, CloudLightning, ShieldAlert } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isLocalDb?: boolean;
  userName?: string;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  isLocalDb = false,
  userName = "Alex",
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search projects, categories, prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all duration-200 font-sans"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Real-time DB Connection Badge */}
        <div
          title={
            isLocalDb
              ? "Running in offline JSON sandbox mode"
              : "Connected to Cloud MongoDB Atlas cluster"
          }
          className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold font-display ${
            isLocalDb
              ? "bg-amber-50 text-amber-800 border border-amber-100"
              : "bg-emerald-50 text-emerald-800 border border-emerald-100"
          }`}
        >
          {isLocalDb ? (
            <>
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span>Sandbox Engine</span>
            </>
          ) : (
            <>
              <CloudLightning className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Atlas Live</span>
            </>
          )}
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </button>

        <div className="h-px w-4 bg-slate-200 hidden md:block" />

        {/* Quick Avatar */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 font-display shadow-sm">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
