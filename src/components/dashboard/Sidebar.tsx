import React from "react";
import { LayoutDashboard, FolderKanban, Compass, PlusCircle, HelpCircle, LogOut, Settings, Home } from "lucide-react";
import { ActiveView } from "../../types";

interface SidebarProps {
  currentView: ActiveView;
  setView: (view: ActiveView) => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

export default function Sidebar({
  currentView,
  setView,
  onLogout,
  userName = "Alex",
  userEmail = "alex@aivora.ai",
}: SidebarProps) {
  const menuItems = [
    {
      id: "home" as ActiveView,
      label: "Home",
      icon: Home,
      description: "Back to Platform",
    },
    {
      id: "dashboard" as ActiveView,
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Executive Summary",
    },
    {
      id: "manage_boards" as ActiveView,
      label: "My Workspaces",
      icon: FolderKanban,
      description: "Manage Co-Thinking",
    },
    {
      id: "explore" as ActiveView,
      label: "Explore Templates",
      icon: Compass,
      description: "Expert Frameworks",
    },
    {
      id: "add_board" as ActiveView,
      label: "New Board",
      icon: PlusCircle,
      description: "Create Custom Prompts",
    },
    {
      id: "settings" as ActiveView,
      label: "Settings",
      icon: Settings,
      description: "Preferences & Profile",
    },
  ];

  return (
    <aside
      id="sidebar"
      className="hidden lg:flex w-64 border-r border-slate-200 bg-white flex-col h-screen overflow-y-auto sticky top-0 shrink-0"
    >
      {/* Brand / Home */}
      <div className="p-4 pb-0">
        <button
          onClick={() => setView("home")}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50 cursor-pointer"
        >
          <div className="h-8 w-8 rounded-md bg-slate-900 text-white flex items-center justify-center text-[11px] font-extrabold uppercase font-display border border-slate-200 shadow-sm shrink-0">
            A
          </div>
          <div className="leading-none">
            <span className="text-sm font-bold text-slate-900 font-display block">Aivora</span>
            <span className="text-[9px] text-slate-400 font-sans block">Home Platform</span>
          </div>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow p-4 space-y-1.5">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
            Aivora Core
          </p>
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                  isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                }`}
              />
              <div className="leading-none">
                <span className="text-xs font-bold font-display block">
                  {item.label}
                </span>
                <span
                  className={`text-[9px] font-normal block mt-0.5 ${
                    isActive ? "text-slate-300" : "text-slate-400"
                  }`}
                >
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer Navigation */}
      <div className="p-4 border-t border-slate-100 space-y-1.5 bg-slate-50/50">
        <button
          onClick={() => setView("about")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors text-xs font-bold font-display cursor-pointer"
        >
          <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
          <span>Help & Support</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-xs font-bold font-display cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5 text-red-400" />
          <span>Sign Out</span>
        </button>

        {/* User Identity Banner */}
        <div className="flex items-center gap-2.5 px-3 pt-3 mt-2 border-t border-slate-200">
          <div className="h-7 w-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-[10px] font-extrabold uppercase font-display border border-slate-200 shadow-sm shrink-0">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1 text-left leading-none">
            <span className="text-[11px] font-bold text-slate-900 block truncate font-display">
              {userName}
            </span>
            <span className="text-[9px] font-normal text-slate-400 block truncate font-sans">
              {userEmail}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
