import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Compass, Eye, RefreshCw, ArrowUpDown, Copy, AlertCircle, Sparkles } from "lucide-react";
import { IBoard } from "../types";

export default function ExplorePage() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/boards");
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to load board templates.");
      }
      
      setTemplates(data.templates || []);
    } catch (err: any) {
      setError(err.message || "Unable to reach Aivora core template server.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates
    .filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                            t.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "alphabetical") {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#515f74] uppercase tracking-wider font-display">
            <Compass className="h-4.5 w-4.5" />
            Public Libraries
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950">
            Thinking Templates
          </h1>
          <p className="text-sm text-slate-500 font-body-sm">
            Browse expertly configured context boards to jump-start your research, decision, or plan.
          </p>
        </div>
        <button
          onClick={fetchTemplates}
          className="self-start inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer font-display"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh Templates
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-md border border-red-100 bg-red-50 p-4 text-xs text-red-700 leading-normal text-left">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span className="font-body-sm">{error}</span>
        </div>
      )}

      {/* Filter and Search controls */}
      <div className="space-y-6">
        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-2.5 pb-2">
          {[
            { id: "All", label: "All Boards", count: templates.length },
            { id: "Decision", label: "Decisions", count: templates.filter(t => t.category === "Decision").length },
            { id: "Idea", label: "Ideas & Creative", count: templates.filter(t => t.category === "Idea").length },
            { id: "Plan", label: "Plans & Roadmaps", count: templates.filter(t => t.category === "Plan").length },
          ].map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => setCategoryFilter(chip.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 cursor-pointer border ${
                categoryFilter === chip.id
                  ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{chip.label}</span>
              <span className={`inline-flex rounded-full px-1.5 py-0.5 text-[9px] font-mono font-semibold leading-none ${
                categoryFilter === chip.id ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {chip.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search controls panel */}
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-md border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:border-[#0F172A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-body-sm"
            />
          </div>

          <div className="flex w-full sm:w-auto items-center gap-2 sm:ml-auto">
            <ArrowUpDown className="h-4 w-4 text-slate-400 shrink-0" />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full sm:w-auto rounded-md border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:border-[#0F172A] font-display"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="alphabetical">Sort by: A-Z</option>
            </select>
          </div>
        </div>

        {/* Templates grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="rounded-xl border border-slate-100 bg-white p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-16 rounded bg-slate-200" />
                  <div className="h-4 w-20 rounded bg-slate-200" />
                </div>
                <div className="h-6 w-3/4 rounded bg-slate-200" />
                <div className="h-12 w-full rounded bg-slate-200" />
                <div className="h-9 w-full rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center rounded-xl border border-dashed border-slate-200 bg-white py-16 px-4">
            <Compass className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="font-display text-lg font-bold text-slate-950 mb-1">No Templates Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto font-body-sm">
              No templates matched your criteria. Let's adjust the search filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredTemplates.map((t) => (
              <div 
                key={t._id} 
                className="flex flex-col justify-between rounded-xl border border-slate-200/60 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-indigo-200"
              >
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold font-display ${
                      t.category === "Decision" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                      t.category === "Plan" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                      "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    }`}>
                      {t.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">
                      Public Scaffold
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-slate-950 line-clamp-1">
                    {t.title}
                  </h3>
                  
                  <p className="text-xs leading-relaxed text-slate-500 line-clamp-3 font-body-sm">
                    {t.description}
                  </p>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/boards/${t._id}`)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 py-2.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer font-display"
                  >
                    <Eye className="h-4 w-4" />
                    Inspect Details & Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
