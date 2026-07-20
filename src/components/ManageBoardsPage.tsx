import React, { useState, useEffect } from "react";
import { Settings, Eye, Trash2, Edit, AlertCircle, RefreshCw, Sparkles, ArrowRight, FolderKanban, Plus } from "lucide-react";
import { ActiveView, IBoard } from "../types";

interface ManageBoardsPageProps {
  token: string | null;
  setView: (view: ActiveView) => void;
  setSelectedBoardId: (id: string | null) => void;
}

export default function ManageBoardsPage({ token, setView, setSelectedBoardId }: ManageBoardsPageProps) {
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Context Inline Modal
  const [editingBoard, setEditingBoard] = useState<IBoard | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editContext, setEditContext] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchUserBoards();
    }
  }, [token]);

  const fetchUserBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/boards", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load your personal boards.");
      }

      setBoards(data.boards || []);
    } catch (err: any) {
      setError(err.message || "Unable to reach Aivora core server.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this Board and all its chat history? This action is irreversible.")) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(`/api/boards/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete the selected board.");
      }

      // Remove from state
      setBoards(boards.filter(b => b._id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to complete deletion process.");
    }
  };

  const handleLaunchWorkspace = (id: string) => {
    setSelectedBoardId(id);
    setView("board_workspace");
  };

  const handleOpenEdit = (b: IBoard) => {
    setEditingBoard(b);
    setEditTitle(b.title);
    setEditDesc(b.description);
    setEditContext(b.context);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBoard) return;

    setError(null);
    setUpdatingId(editingBoard._id);

    try {
      const response = await fetch(`/api/boards/${editingBoard._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDesc,
          context: editContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save board updates.");
      }

      // Update state list
      setBoards(boards.map(b => b._id === editingBoard._id ? data : b));
      setEditingBoard(null);
    } catch (err: any) {
      setError(err.message || "Error saving edits.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#515f74] uppercase tracking-wider font-display">
            <FolderKanban className="h-4.5 w-4.5" />
            Dashboard
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-950">
            My Co-Thinking Workspaces
          </h1>
          <p className="text-sm text-slate-500 font-body-sm">
            Inspect, configure, and re-launch your active boards or delete obsolete thinking contexts.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={fetchUserBoards}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer font-display"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setView("add_board")}
            className="inline-flex items-center gap-1.5 rounded-md bg-[#0F172A] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer font-display"
          >
            <Plus className="h-4 w-4" />
            New Board
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-md border border-red-100 bg-red-50 p-4 text-xs text-red-700 leading-normal text-left">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <span className="font-body-sm">{error}</span>
        </div>
      )}

      {/* Main Boards List Table */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center animate-pulse space-y-4">
          <div className="h-8 bg-slate-100 rounded w-1/3 mx-auto" />
          <div className="h-12 bg-slate-100 rounded w-full" />
          <div className="h-12 bg-slate-100 rounded w-full" />
        </div>
      ) : boards.length === 0 ? (
        <div className="text-center rounded-xl border border-dashed border-slate-200 bg-white py-16 px-4">
          <Sparkles className="mx-auto h-12 w-12 text-[#515f74] mb-4 animate-bounce" />
          <h3 className="font-display text-lg font-bold text-slate-950 mb-1">Your Dashboard is Empty</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 font-body-sm">
            You haven't initialized any private co-thinking boards yet. Create a blank board or clone an expert template structure to start!
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setView("add_board")}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#0F172A] px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer font-display"
            >
              Create Board From Scratch
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("explore")}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer font-display"
            >
              Browse Template Gallery
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm text-left">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">
                  <th className="p-4.5 sm:px-6">Board Details</th>
                  <th className="p-4.5">Category</th>
                  <th className="p-4.5">Status</th>
                  <th className="p-4.5 hidden sm:table-cell">Established On</th>
                  <th className="p-4.5 text-right sm:px-6">Workspace Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {boards.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Title & Desc */}
                    <td className="p-4.5 sm:px-6">
                      <div>
                        <button
                          onClick={() => handleLaunchWorkspace(b._id)}
                          className="font-display font-bold text-slate-900 text-sm hover:text-[#0F172A] transition-colors text-left cursor-pointer"
                        >
                          {b.title}
                        </button>
                        <p className="text-xs text-slate-400 font-normal line-clamp-1 mt-0.5 max-w-md font-body-sm">
                          {b.description}
                        </p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4.5">
                      <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-800 font-display">
                        {b.category}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4.5">
                      <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 font-display">
                        {b.status || "Active"}
                      </span>
                    </td>

                    {/* Created date */}
                    <td className="p-4.5 text-xs text-slate-500 hidden sm:table-cell font-mono">
                      {new Date(b.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </td>

                    {/* Actions */}
                    <td className="p-4.5 text-right sm:px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="Launch Co-Thinking Workspace"
                          onClick={() => handleLaunchWorkspace(b._id)}
                          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                        <button
                          title="Edit Context Metadata"
                          onClick={() => handleOpenEdit(b)}
                          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          title="Delete Board"
                          onClick={() => handleDelete(b._id)}
                          className="rounded-md p-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal Overlay */}
      {editingBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-md animate-scaleUp text-left">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
              <h3 className="font-display text-base font-bold text-[#0F172A] flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-[#515f74]" />
                Configure Board Context
              </h3>
              <button
                onClick={() => setEditingBoard(null)}
                className="text-slate-400 hover:text-slate-900 text-sm font-semibold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 font-display tracking-wider">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-body-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 font-display tracking-wider">Short Description</label>
                <input
                  type="text"
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-body-sm"
                  maxLength={150}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 font-display tracking-wider">Core Context Prompt</label>
                <textarea
                  required
                  value={editContext}
                  onChange={(e) => setEditContext(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] font-body-sm min-h-[140px]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingBoard(null)}
                  className="rounded-md border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer font-display"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingId !== null}
                  className="rounded-md bg-[#0F172A] px-4.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors cursor-pointer font-display"
                >
                  {updatingId ? "Saving..." : "Save Updates"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
