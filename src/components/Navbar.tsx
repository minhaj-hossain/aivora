import React, { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Settings,
  HelpCircle,
  Compass,
  Home,
  User,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { ActiveView, IUser } from "../types";
import { motion } from "motion/react";

interface NavbarProps {
  currentView: ActiveView;
  setView: (view: ActiveView) => void;
  user: IUser | null;
  onLogout: () => void;
}

const getInitials = (name: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default function Navbar({
  currentView,
  setView,
  user,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: ActiveView) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/40">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-12 py-4 h-16">
        {/* Left Side: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <div
            onClick={() => handleNav("home")}
            className="flex cursor-pointer items-center gap-2.5 transition hover:opacity-90 select-none"
          >
            <img
              alt="Aivora Logo"
              className="h-8 w-8 object-contain"
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida/AP1WRLuHWJcwMtrYHoLGsTp_dOS1kJgs2u3cHrOhtfSkGUsFZrHf9cv-V25TX03BzxTg_0emSq59rcmiSBFYFqqSZATx3_H_4cjttGZQiZO_z4TeOQoU_DZ3EcXMwj7SmWm_VYw6YSQz30QXmbl99_m7pVKx4Z5f8Vk7CuCsDD9wixSQ2rlZGoXGUmY21WfMuDKcEJIzfGBE60Her-4DI-9bfdaJ09oNotW6hpYUhxmbi9Wxmod6Hnwopbds4Qs"
            />
            <span className="font-display text-xl font-bold tracking-tight text-[#0F172A]">
              Aivora
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNav("home")}
              className={`relative px-4 py-2 text-sm font-medium font-display transition-colors rounded-full select-none ${
                currentView === "home"
                  ? "text-[#0F172A] font-semibold"
                  : "text-slate-500 hover:text-[#0F172A]"
              }`}
            >
              {currentView === "home" && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-slate-100/75 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Platform
            </button>

            <button
              onClick={() => handleNav("explore")}
              className={`relative px-4 py-2 text-sm font-medium font-display transition-colors rounded-full select-none ${
                currentView === "explore" || currentView === "board_detail"
                  ? "text-[#0F172A] font-semibold"
                  : "text-slate-500 hover:text-[#0F172A]"
              }`}
            >
              {(currentView === "explore" ||
                currentView === "board_detail") && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-slate-100/75 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Solutions
            </button>

            {user && (
              <>
                <button
                  onClick={() => handleNav("dashboard")}
                  className={`relative px-4 py-2 flex items-center gap-1.5 text-sm font-medium font-display transition-colors rounded-full select-none ${
                    currentView === "dashboard" ||
                    currentView === "board_workspace"
                      ? "text-[#0F172A] font-semibold"
                      : "text-slate-500 hover:text-[#0F172A]"
                  }`}
                >
                  {(currentView === "dashboard" ||
                    currentView === "board_workspace") && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-slate-100/75 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav("add_board")}
                  className={`relative px-4 py-2 flex items-center gap-1.5 text-sm font-medium font-display transition-colors rounded-full select-none ${
                    currentView === "add_board"
                      ? "text-[#0F172A] font-semibold"
                      : "text-slate-500 hover:text-[#0F172A]"
                  }`}
                >
                  {currentView === "add_board" && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-slate-100/75 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <PlusCircle className="h-4 w-4" />
                  New Board
                </button>
                <button
                  onClick={() => handleNav("manage_boards")}
                  className={`relative px-4 py-2 flex items-center gap-1.5 text-sm font-medium font-display transition-colors rounded-full select-none ${
                    currentView === "manage_boards"
                      ? "text-[#0F172A] font-semibold"
                      : "text-slate-500 hover:text-[#0F172A]"
                  }`}
                >
                  {currentView === "manage_boards" && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-slate-100/75 rounded-full -z-10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Settings className="h-4 w-4" />
                  Manage
                </button>
              </>
            )}

            <button
              onClick={() => handleNav("about")}
              className={`relative px-4 py-2 text-sm font-medium font-display transition-colors rounded-full select-none ${
                currentView === "about"
                  ? "text-[#0F172A] font-semibold"
                  : "text-slate-500 hover:text-[#0F172A]"
              }`}
            >
              {currentView === "about" && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-slate-100/75 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Resources
            </button>

            <button
              onClick={() => handleNav("pricing")}
              className={`relative px-4 py-2 text-sm font-medium font-display transition-colors rounded-full select-none ${
                currentView === "pricing"
                  ? "text-[#0F172A] font-semibold"
                  : "text-slate-500 hover:text-[#0F172A]"
              }`}
            >
              {currentView === "pricing" && (
                <motion.span
                  layoutId="activeNavBackground"
                  className="absolute inset-0 bg-slate-100/75 rounded-full -z-10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              Pricing
            </button>
          </nav>
        </div>

        {/* Right Side: Auth Actions / Profile Info */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="relative group/profile py-2">
              <button className="flex items-center gap-3 focus:outline-none cursor-pointer">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-900 font-display transition group-hover/profile:text-indigo-600">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {user.email}
                  </span>
                </div>
                {/* User Image/Avatar */}
                <div className="relative h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] transition-transform duration-300 group-hover/profile:scale-105 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white font-display select-none">
                    {getInitials(user.name)}
                  </div>
                  {/* Status Indicator */}
                  <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
              </button>

              {/* Hover Dropdown Menu */}
              <div className="absolute right-0 top-full mt-1.5 w-56 origin-top-right rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-200/55 transition-all duration-200 opacity-0 invisible translate-y-1 group-hover/profile:opacity-100 group-hover/profile:visible group-hover/profile:translate-y-0 z-50">
                <div className="px-3 py-2.5 border-b border-slate-100 mb-1.5">
                  <p className="text-xs font-semibold text-slate-700 font-display">
                    Account
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <button
                    onClick={() => handleNav("dashboard")}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="h-4 w-4 text-slate-400" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNav("add_board")}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="h-4 w-4 text-slate-400" />
                    New Board
                  </button>
                  <button
                    onClick={() => handleNav("manage_boards")}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    Manage Boards
                  </button>
                </div>

                <div className="my-1.5 border-t border-slate-100" />

                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50/70 hover:text-red-700 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNav("login")}
                className="text-sm font-medium font-display text-slate-600 hover:text-[#0F172A] px-4 py-2 transition-all cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNav("register")}
                className="bg-[#0F172A] text-white px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm cursor-pointer"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Menu Overlay */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-6 pb-6 pt-2 lg:hidden space-y-4 shadow-inner">
          <div className="space-y-2">
            <button
              onClick={() => handleNav("home")}
              className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                currentView === "home"
                  ? "bg-slate-100 text-[#0F172A]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Platform (Home)
            </button>
            <button
              onClick={() => handleNav("explore")}
              className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                currentView === "explore"
                  ? "bg-slate-100 text-[#0F172A]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Solutions (Explore)
            </button>

            {user && (
              <>
                <button
                  onClick={() => handleNav("dashboard")}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                    currentView === "dashboard" ||
                    currentView === "board_workspace"
                      ? "bg-slate-100 text-[#0F172A]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav("add_board")}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                    currentView === "add_board"
                      ? "bg-slate-100 text-[#0F172A]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <PlusCircle className="h-5 w-5" />
                  New Board
                </button>
                <button
                  onClick={() => handleNav("manage_boards")}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                    currentView === "manage_boards"
                      ? "bg-slate-100 text-[#0F172A]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  Manage Boards
                </button>
              </>
            )}

            <button
              onClick={() => handleNav("about")}
              className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                currentView === "about"
                  ? "bg-slate-100 text-[#0F172A]"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Resources (About)
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                <div className="px-4">
                  <p className="text-sm font-semibold text-slate-900 font-display">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-slate-200 bg-white py-3 text-sm font-semibold text-red-600 hover:bg-slate-50"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleNav("login")}
                  className="rounded-md border border-slate-200 bg-white py-3 text-center text-sm font-semibold font-display text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav("register")}
                  className="rounded-md bg-[#0F172A] py-3 text-center text-sm font-semibold font-display text-white hover:bg-slate-800"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
