import React from "react";
import { LayoutDashboard, Compass, FolderKanban, HelpCircle, Home } from "lucide-react";
import { ActiveView } from "../../types";

interface BottomNavBarProps {
  currentView: ActiveView;
  setView: (view: ActiveView) => void;
  onLogout: () => void;
  userName?: string;
  onToggleDrawer?: () => void;
}

export default function BottomNavBar({
  currentView,
  setView,
  onLogout,
  userName = "Alex",
  onToggleDrawer,
}: BottomNavBarProps) {
  const tabs = [
    {
      id: "home" as ActiveView,
      label: "Home",
      icon: Home,
    },
    {
      id: "dashboard" as ActiveView,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "explore" as ActiveView,
      label: "Explore",
      icon: Compass,
    },
    {
      id: "manage_boards" as ActiveView,
      label: "AI Boards",
      icon: FolderKanban,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-slate-200/80 flex justify-around items-center px-4 pb-safe z-50 rounded-t-2xl shadow-[0_-4px_16px_rgba(15,23,42,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3.5 rounded-full transition-all duration-200 active:scale-95 cursor-pointer ${
              isActive
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Icon className="h-4.5 w-4.5 shrink-0" />
            <span className="text-[10px] font-bold font-display tracking-wide">
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* Drawer / Help toggle button */}
      <button
        onClick={onToggleDrawer}
        className="flex flex-col items-center justify-center gap-1 py-1.5 px-3.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <div className="h-4.5 w-4.5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[8px] font-extrabold uppercase font-display border border-slate-200 shadow-sm shrink-0">
          {userName.charAt(0)}
        </div>
        <span className="text-[10px] font-bold font-display tracking-wide">
          Menu
        </span>
      </button>
    </nav>
  );
}
