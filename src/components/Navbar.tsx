import React, { useState } from "react";
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, Settings, HelpCircle, Compass, Home } from "lucide-react";
import { ActiveView, IUser } from "../types";

interface NavbarProps {
  currentView: ActiveView;
  setView: (view: ActiveView) => void;
  user: IUser | null;
  onLogout: () => void;
}

export default function Navbar({ currentView, setView, user, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: ActiveView) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/40">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-12 py-4 h-16">
        
        {/* Left Side: Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-12">
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
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => handleNav("home")}
              className={`text-sm font-medium font-display transition-colors hover:text-[#0F172A] ${
                currentView === "home" ? "text-[#0F172A] font-semibold" : "text-slate-500"
              }`}
            >
              Platform
            </button>
            
            <button
              onClick={() => handleNav("explore")}
              className={`text-sm font-medium font-display transition-colors hover:text-[#0F172A] ${
                currentView === "explore" || currentView === "board_detail" ? "text-[#0F172A] font-semibold" : "text-slate-500"
              }`}
            >
              Solutions
            </button>

            {user && (
              <>
                <button
                  onClick={() => handleNav("dashboard")}
                  className={`flex items-center gap-1.5 text-sm font-medium font-display transition-colors hover:text-[#0F172A] ${
                    currentView === "dashboard" || currentView === "board_workspace" ? "text-[#0F172A] font-semibold" : "text-slate-500"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav("add_board")}
                  className={`flex items-center gap-1.5 text-sm font-medium font-display transition-colors hover:text-[#0F172A] ${
                    currentView === "add_board" ? "text-[#0F172A] font-semibold" : "text-slate-500"
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  New Board
                </button>
                <button
                  onClick={() => handleNav("manage_boards")}
                  className={`flex items-center gap-1.5 text-sm font-medium font-display transition-colors hover:text-[#0F172A] ${
                    currentView === "manage_boards" ? "text-[#0F172A] font-semibold" : "text-slate-500"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Manage
                </button>
              </>
            )}

            <button
              onClick={() => handleNav("about")}
              className={`text-sm font-medium font-display transition-colors hover:text-[#0F172A] ${
                currentView === "about" ? "text-[#0F172A] font-semibold" : "text-slate-500"
              }`}
            >
              Resources
            </button>

            <button
              onClick={() => handleNav("about")}
              className={`text-sm font-medium font-display transition-colors hover:text-[#0F172A] ${
                currentView === "contact" ? "text-[#0F172A] font-semibold" : "text-slate-500"
              }`}
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right Side: Auth Actions / Profile Info */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-900 font-display">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
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
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
                currentView === "home" ? "bg-slate-100 text-[#0F172A]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Platform (Home)
            </button>
            <button
              onClick={() => handleNav("explore")}
              className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                currentView === "explore" ? "bg-slate-100 text-[#0F172A]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Solutions (Explore)
            </button>

            {user && (
              <>
                <button
                  onClick={() => handleNav("dashboard")}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                    currentView === "dashboard" || currentView === "board_workspace" ? "bg-slate-100 text-[#0F172A]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </button>
                <button
                  onClick={() => handleNav("add_board")}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                    currentView === "add_board" ? "bg-slate-100 text-[#0F172A]" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <PlusCircle className="h-5 w-5" />
                  New Board
                </button>
                <button
                  onClick={() => handleNav("manage_boards")}
                  className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base font-semibold font-display ${
                    currentView === "manage_boards" ? "bg-slate-100 text-[#0F172A]" : "text-slate-600 hover:bg-slate-50"
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
                currentView === "about" ? "bg-slate-100 text-[#0F172A]" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              Resources (About)
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                <div className="px-4">
                  <p className="text-sm font-semibold text-slate-900 font-display">{user.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{user.email}</p>
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
