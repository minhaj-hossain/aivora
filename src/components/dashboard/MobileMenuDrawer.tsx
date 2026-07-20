import React from "react";
import { X, Settings, HelpCircle, LogOut, ShieldAlert, BadgeCheck, Sparkles } from "lucide-react";
import { ActiveView } from "../../types";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  setView: (view: ActiveView) => void;
  onLogout: () => void;
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  userName,
  userEmail,
  setView,
  onLogout,
}: MobileMenuDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 z-50 transition-opacity duration-300 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Slide-in Drawer Container */}
      <aside className="fixed left-0 top-0 h-full w-80 z-55 bg-white shadow-2xl flex flex-col p-6 gap-6 transform translate-x-0 transition-transform duration-300 ease-in-out">
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
            <h2 className="font-display text-sm font-bold text-slate-900">Aivora Enterprise</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User profile info */}
        <div className="flex items-center gap-3.5 bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100 text-left">
          <div className="h-11 w-11 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-extrabold uppercase font-display border border-slate-200 shadow-sm shrink-0">
            {userName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1 font-display">
              {userName}
              <BadgeCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500 shrink-0" />
            </span>
            <span className="text-[10px] text-slate-400 block truncate font-sans">
              {userEmail}
            </span>
            <span className="inline-flex rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[8px] font-bold text-indigo-700 uppercase font-display mt-1">
              Premium Tier
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 text-left">
          <button
            onClick={() => { setView("about"); onClose(); }}
            className="flex items-center gap-3.5 p-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all cursor-pointer font-display text-xs font-bold"
          >
            <HelpCircle className="h-4.5 w-4.5 text-slate-400" />
            <span>Help & Support Center</span>
          </button>

          <button
            onClick={() => { setView("settings"); onClose(); }}
            className="flex items-center gap-3.5 p-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-all cursor-pointer font-display text-xs font-bold"
          >
            <Settings className="h-4.5 w-4.5 text-slate-400" />
            <span>Account Configurations</span>
          </button>

          <button
            onClick={() => { onLogout(); onClose(); }}
            className="flex items-center gap-3.5 p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all cursor-pointer font-display text-xs font-bold mt-4"
          >
            <LogOut className="h-4.5 w-4.5 text-red-400" />
            <span>Sign Out Session</span>
          </button>
        </nav>

        {/* Version branding block */}
        <div className="mt-auto text-left space-y-1">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-display">
            Aivora Console
          </p>
          <p className="text-[10px] text-slate-400 font-sans font-normal">
            v1.0.4 • SECURE ENTERPRISE LAYER
          </p>
        </div>
      </aside>
    </>
  );
}
