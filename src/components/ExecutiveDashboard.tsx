import React, { useState, useEffect } from "react";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import WelcomeHero from "./dashboard/WelcomeHero";
import QuickActions from "./dashboard/QuickActions";
import StatsSection from "./dashboard/StatsSection";
import RecentBoards from "./dashboard/RecentBoards";
import RecentThreads from "./dashboard/RecentThreads";
import UsageTrends from "./dashboard/UsageTrends";
import TemplateDistribution from "./dashboard/TemplateDistribution";
import Recommendations from "./dashboard/Recommendations";
import { ActiveView } from "../types";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ExecutiveDashboardProps {
  token: string | null;
  setView: (view: ActiveView) => void;
  setSelectedBoardId: (id: string | null) => void;
  onLogout: () => void;
  user: { name: string; email: string } | null;
}

interface DashboardSummary {
  activeProjectsCount: number;
  completedTasksCount: number;
  tokensUsed: number;
  recentBoards: any[];
  recentThreads: any[];
  dailyTrends: any[];
}

export default function ExecutiveDashboard({
  token,
  setView,
  setSelectedBoardId,
  onLogout,
  user,
}: ExecutiveDashboardProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userName = user?.name || "Alex";
  const userEmail = user?.email || "alex@aivora.ai";

  useEffect(() => {
    if (token) {
      fetchDashboardSummary();
    }
  }, [token]);

  const fetchDashboardSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/boards/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load dashboard metrics.");
      }

      setSummary(data);
    } catch (err: any) {
      setError(err.message || "Failed to reach Aivora enterprise engine.");
    } finally {
      setLoading(false);
    }
  };

  // Filter boards dynamically based on header search query
  const filteredBoards = summary
    ? summary.recentBoards.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const mostRecentBoard = summary?.recentBoards?.[0] || null;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
      {/* Top Header navbar */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isLocalDb={summary ? !token || (summary as any).isLocalDatabaseFallback : false}
        userName={userName}
      />

      {/* Dynamic Bento Layout */}
      <main className="flex-grow p-6 space-y-6 overflow-y-auto max-w-7xl w-full mx-auto">
        {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4.5 text-xs text-red-800 text-left animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
              <div className="space-y-1">
                <span className="font-bold block font-display">System Alignment Offline</span>
                <span className="block font-sans">{error}</span>
                <button
                  onClick={fetchDashboardSummary}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-red-950 underline hover:no-underline cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Retry Connection
                </button>
              </div>
            </div>
          )}

          {loading ? (
            /* Elegant Dashboard Loading Skeletons */
            <div className="space-y-6 text-left animate-pulse">
              <div className="h-40 bg-slate-200/60 rounded-3xl" />
              <div className="h-16 bg-slate-200/60 rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="h-28 bg-slate-200/60 rounded-2xl" />
                <div className="h-28 bg-slate-200/60 rounded-2xl" />
                <div className="h-28 bg-slate-200/60 rounded-2xl" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 h-80 bg-slate-200/60 rounded-2xl" />
                <div className="lg:col-span-4 h-80 bg-slate-200/60 rounded-2xl" />
              </div>
            </div>
          ) : summary ? (
            /* Main Dashboard Content Grid */
            <div className="space-y-6 animate-fadeIn">
              {/* Welcome Banner Card */}
              <WelcomeHero
                userName={userName}
                recentBoardId={mostRecentBoard?._id || null}
                recentBoardTitle={mostRecentBoard?.title || null}
                setView={setView}
                setSelectedBoardId={setSelectedBoardId}
              />

              {/* Quick Actions Bar */}
              <QuickActions setView={setView} />

              {/* Statistical Metrics Counter */}
              <StatsSection
                activeProjects={summary.activeProjectsCount}
                tokensUsed={summary.tokensUsed}
                completedTasks={summary.completedTasksCount}
              />

              {/* Main Bento Grid: Gallery & Conversations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Recent Boards List (Col 1-8) */}
                <div className="lg:col-span-8 flex flex-col">
                  <RecentBoards
                    boards={filteredBoards}
                    setView={setView}
                    setSelectedBoardId={setSelectedBoardId}
                  />
                </div>

                {/* Recent AI Threads (Col 9-12) */}
                <div className="lg:col-span-4 flex flex-col">
                  <RecentThreads
                    threads={summary.recentThreads}
                    setView={setView}
                    setSelectedBoardId={setSelectedBoardId}
                  />
                </div>
              </div>

              {/* Secondary Bento Grid: Usage Chart, Distribution, & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* SVG AI Usage Trends Graph (Col 1-6) */}
                <div className="lg:col-span-6 flex flex-col">
                  <UsageTrends data={summary.dailyTrends} />
                </div>

                {/* Public Template Category Distribution (Col 7-9) */}
                <div className="lg:col-span-3 flex flex-col">
                  <TemplateDistribution />
                </div>

                {/* Intelligent Suggested Frameworks (Col 10-12) */}
                <div className="lg:col-span-3 flex flex-col">
                  <Recommendations setView={setView} />
                </div>
              </div>
            </div>
          ) : null}
        </main>
    </div>
  );
}
