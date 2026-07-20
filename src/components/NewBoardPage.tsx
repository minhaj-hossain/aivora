import React, { useState } from "react";
import { Sparkles, ArrowRight, HelpCircle, AlertCircle, FileText, FolderPlus, Lightbulb } from "lucide-react";
import { ActiveView, IBoard } from "../types";

interface NewBoardPageProps {
  token: string | null;
  setView: (view: ActiveView) => void;
  onCreateSuccess: (board: IBoard) => void;
}

export default function NewBoardPage({ token, setView, onCreateSuccess }: NewBoardPageProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [category, setCategory] = useState<"Decision" | "Idea" | "Plan">("Decision");
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setView("login");
      return;
    }

    if (!title.trim() || !description.trim() || !context.trim()) {
      setError("Please complete all requested form fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          context: context.trim(),
          category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to establish new co-thinking board.");
      }

      onCreateSuccess(data);
    } catch (err: any) {
      setError(err.message || "An unexpected network error interrupted Board setup.");
    } finally {
      setLoading(false);
    }
  };

  const loadSamplePrompt = (type: "Decision" | "Idea" | "Plan") => {
    setCategory(type);
    if (type === "Decision") {
      setTitle("Relocating to London vs. Staying in Austin");
      setDescription("Weigh salary changes, flight costs, cultural growth, and family considerations for relocating.");
      setContext("I received an internal transfer offer to relocate from our office in Austin, Texas, to our London office. The salary will adjust to GBP with a 10% cost-of-living increment. I love Texas BBQ, high heat, and low taxes. I want to experience Europe, train transit, and historic architecture. My parents live in Texas. I need help weighing financial, cultural, and career tradeoffs.");
    } else if (type === "Plan") {
      setTitle("Personal Portfolios launch campaign");
      setDescription("A 4-week execution roadmap to compile, build, audit, and launch my portfolio site.");
      setContext("I am launching my personal portfolio website next month. The tech stack is Vite React + Tailwind. I have three main case studies. I need a weekly execution roadmap that coordinates custom domain registration, portfolio writeups, testing on mobile, and launching on Twitter and Product Hunt.");
    } else {
      setTitle("AI Journaling App brainstorming");
      setDescription("Brainstorming a secure, offline-first journaling application that suggests cognitive reflections.");
      setContext("I have a raw concept for an offline-first journal application that uses localized AI processing to suggest cognitive-behavioral reflections on daily summaries. I need a solid chapter-like outline breaking down feasibility, tech stack, data privacy schemes, and key features.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      
      {/* Split grid */}
      <div className="grid gap-8 md:grid-cols-12 text-left">
        
        {/* Left Side: Creation Form */}
        <div className="md:col-span-8">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-slate-200/60 pb-5 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-800">
                <FolderPlus className="h-5.5 w-5.5" />
              </div>
              <div>
                <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900">
                  New Thinking Board
                </h1>
                <p className="text-xs text-slate-400 font-body-sm">
                  Establish a container for co-thinking, chat, and compiled markdown.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2.5 rounded-md border border-red-100 bg-red-50 p-4 text-xs text-red-700 leading-normal">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                <span className="font-body-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2.5 font-display">
                  Thinking Mode / Category
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setCategory("Decision")}
                    className={`rounded-md border p-3 text-xs text-center font-semibold transition cursor-pointer font-display ${
                      category === "Decision" 
                        ? "border-[#0F172A] bg-slate-50 text-[#0F172A]" 
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🎯 Decision
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("Plan")}
                    className={`rounded-md border p-3 text-xs text-center font-semibold transition cursor-pointer font-display ${
                      category === "Plan" 
                        ? "border-[#0F172A] bg-slate-50 text-[#0F172A]" 
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    🚀 Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setCategory("Idea")}
                    className={`rounded-md border p-3 text-xs text-center font-semibold transition cursor-pointer font-display ${
                      category === "Idea" 
                        ? "border-[#0F172A] bg-slate-50 text-[#0F172A]" 
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    💡 Idea
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-display">
                  Board Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Relocating to London vs. Austin"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 focus:border-[#0F172A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-body-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-display">
                  Short Description / Pitch
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Weigh financial and family tradeoffs of moving abroad"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 focus:border-[#0F172A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-body-sm"
                  maxLength={150}
                />
              </div>

              {/* Full Context */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 font-display">
                  Baseline Context / Variables & Constraints
                </label>
                <textarea
                  required
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Describe your current situation, variables, preferences, and what you are trying to figure out in detail..."
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-3.5 text-xs leading-relaxed text-slate-800 focus:border-[#0F172A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-body-sm min-h-[160px] resize-y"
                />
                <p className="text-[10px] text-slate-400 font-mono mt-2 leading-normal">
                  Pro-tip: Include raw details. The more constraints (financial limits, milestones, variables) you list here, the higher the co-thinking fidelity.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-[#0F172A] py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer font-display"
              >
                {loading ? (
                  <>
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Initializing Workspace...
                  </>
                ) : (
                  <>
                    Establish Thinking Board
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>

          </div>
        </div>

        {/* Right Side: Tips and Templates Launcher */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Quick-loader panel */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Lightbulb className="h-4.5 w-4.5 text-amber-500 fill-amber-500" />
              Pre-Load Sandbox Samples
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body-sm">
              New to Aivora? Load one of our quick-start prompts to test co-thinking, chat, and markdown generation immediately.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => loadSamplePrompt("Decision")}
                className="w-full text-left rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 hover:bg-slate-100 transition flex items-center justify-between cursor-pointer font-display font-medium"
              >
                <span>🎯 Relocate (Decision)</span>
                <span className="text-[10px] text-[#0F172A] font-bold uppercase tracking-wider">Load</span>
              </button>
              <button
                onClick={() => loadSamplePrompt("Plan")}
                className="w-full text-left rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 hover:bg-slate-100 transition flex items-center justify-between cursor-pointer font-display font-medium"
              >
                <span>🚀 Portfolio (Plan)</span>
                <span className="text-[10px] text-[#0F172A] font-bold uppercase tracking-wider">Load</span>
              </button>
              <button
                onClick={() => loadSamplePrompt("Idea")}
                className="w-full text-left rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-700 hover:bg-slate-100 transition flex items-center justify-between cursor-pointer font-display font-medium"
              >
                <span>💡 Journaling (Idea)</span>
                <span className="text-[10px] text-[#0F172A] font-bold uppercase tracking-wider">Load</span>
              </button>
            </div>
          </div>

          {/* Guidelines info card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 font-display">
              <FileText className="h-4 w-4 text-[#515f74]" />
              Board Specifications
            </h4>
            <div className="space-y-4 text-xs leading-relaxed text-slate-500 font-body-sm">
              <p>
                <strong>Decisions (MCDA)</strong>: Perfect for complex personal or structural tradeoffs. Yields a comprehensive tradeoff brief and risks matrix.
              </p>
              <p>
                <strong>Plans (Roadmaps)</strong>: Tailored for product releases, project launching, or event prep. Yields a 6-week weekly roadmap document.
              </p>
              <p>
                <strong>Ideas (Academic Outlines)</strong>: Best for thesis planning, book structures, and conceptual drafting. Yields a detailed 5-chapter outline.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
