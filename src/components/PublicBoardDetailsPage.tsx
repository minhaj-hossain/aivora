import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Calendar, Tag, Layers, Share2, ClipboardCopy, ArrowLeft, Play, Sparkles } from "lucide-react";

export default function PublicBoardDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token, user } = useAuth();

  // Fetch single board details
  const { data, isLoading, error } = useQuery({
    queryKey: ["publicBoard", id],
    queryFn: async () => {
      const res = await fetch(`/api/boards/${id}`);
      if (!res.ok) {
        throw new Error("Failed to load template board details.");
      }
      return res.json() as Promise<{ board: any; messages: any[] }>;
    },
    enabled: !!id,
  });

  // Fetch all templates to display related boards in the same category
  const { data: templatesData } = useQuery({
    queryKey: ["templatesList"],
    queryFn: async () => {
      const res = await fetch("/api/boards");
      if (!res.ok) return { templates: [], boards: [] };
      return res.json();
    },
  });

  const board = data?.board;
  const messages = data?.messages || [];

  // Related boards: templates in the same category, excluding current
  const relatedBoards = (templatesData?.templates || [])
    .filter((b: any) => b.category === board?.category && b._id !== board?._id)
    .slice(0, 3);

  // Clone template mutation
  const cloneMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("unauthorized");
      }
      const res = await fetch(`/api/boards/${board._id}/clone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to clone workspace");
      }
      return res.json();
    },
    onSuccess: (newClonedBoard) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      // Redirect straight into the workspace!
      navigate(`/dashboard/boards/${newClonedBoard._id}`);
    },
    onError: (err: any) => {
      if (err.message === "unauthorized") {
        // Redirect to login with redirect path
        navigate(`/login?redirect=/boards/${id}`);
      } else {
        alert("Failed to clone this board. Please try again.");
      }
    },
  });

  const handleCloneClick = () => {
    if (!user) {
      navigate(`/login?redirect=/boards/${id}`);
    } else {
      cloneMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50/20">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="text-xs text-slate-500 font-mono">Loading intellectual structure...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Board Not Found</h2>
        <p className="text-xs text-slate-500 font-body-sm">The template you requested might be unavailable or private.</p>
        <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/40 min-h-screen text-slate-800 antialiased pb-20">
      
      {/* Hero Banner Section */}
      <div className="bg-[#0b0f19] text-slate-100 py-12 md:py-16 px-6 relative overflow-hidden">
        {/* Subtle mesh background design */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0b0f19] to-[#0b0f19]" />
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-6">
          <Link to="/explore" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to templates library
          </Link>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase font-mono ${
                board.category === "Decision" ? "bg-amber-500/15 text-amber-300 border border-amber-500/20" :
                board.category === "Plan" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" :
                "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
              }`}>
                <Tag className="h-3 w-3" />
                {board.category} template
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-slate-300 bg-slate-800 border border-slate-700 font-mono uppercase">
                Public Access
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-white max-w-3xl">
              {board.title}
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
              {board.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Split Grid */}
      <div className="max-w-5xl mx-auto px-6 mt-8 grid gap-8 md:grid-cols-12">
        
        {/* Left: Detailed Information (8 cols) */}
        <div className="md:col-span-8 space-y-8">
          
          {/* Starting Context Section */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm text-left space-y-4">
            <h2 className="font-display text-lg font-extrabold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="h-5 w-5 text-indigo-600" />
              Starting Core Context
            </h2>
            <div className="text-xs text-slate-600 leading-relaxed space-y-3 whitespace-pre-wrap font-body-sm bg-slate-50 p-4 rounded-lg border border-slate-200/50">
              {board.context}
            </div>
          </div>

          {/* Seeded Dialogue Preview */}
          {messages.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm text-left space-y-5">
              <h2 className="font-display text-lg font-extrabold text-[#0F172A] flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                Session Conversation Preview
              </h2>
              <div className="space-y-4">
                {messages.slice(0, 2).map((msg: any, idx: number) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    msg.role === "user" 
                      ? "bg-slate-50 border-slate-200/60 ml-4" 
                      : "bg-indigo-50/40 border-indigo-100/60 mr-4"
                  }`}>
                    <p className="text-[10px] font-bold uppercase font-mono tracking-wider text-slate-400 mb-1">
                      {msg.role === "user" ? "User Context" : "Aivora Strategist"}
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-body-sm whitespace-pre-line">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Quick Actions & Sidebar (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* CTA Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-left space-y-4 relative overflow-hidden">
            {/* Elegant side bar border */}
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-600" />
            
            <h3 className="font-display font-bold text-slate-900 text-sm">Clone & Co-Think</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-body-sm">
              Deploy this strategic structure immediately as your own private board. Start chatting with Gemini 2.5-Flash to generate custom documents.
            </p>

            <button
              onClick={handleCloneClick}
              disabled={cloneMutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-3 text-xs font-bold text-white shadow-sm transition-all cursor-pointer hover:shadow disabled:opacity-50"
            >
              {cloneMutation.isPending ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Cloning Board...
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Use This Template
                </>
              )}
            </button>

            {!user && (
              <p className="text-[10px] text-center text-slate-400">
                You will be asked to log in or try the demo first.
              </p>
            )}
          </div>

          {/* Metadata Sidebar details */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-left space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">
              Template Info
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Category</span>
                <span className="font-semibold text-slate-800">{board.category}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Type</span>
                <span className="font-semibold text-slate-800">Public Scaffolding</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-medium">Created</span>
                <span className="font-semibold text-slate-800">{new Date(board.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Related Boards Section */}
          {relatedBoards.length > 0 && (
            <div className="space-y-3 text-left">
              <h4 className="font-display font-extrabold text-slate-900 text-sm">
                Related Templates
              </h4>
              <div className="space-y-3">
                {relatedBoards.map((b: any) => (
                  <Link
                    key={b._id}
                    to={`/boards/${b._id}`}
                    className="block p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-400/60 shadow-sm hover:shadow transition-all"
                  >
                    <p className="text-[10px] font-bold text-indigo-600 uppercase font-mono tracking-wider mb-1">
                      {b.category}
                    </p>
                    <h5 className="font-display font-bold text-slate-800 text-xs line-clamp-1">
                      {b.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {b.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
