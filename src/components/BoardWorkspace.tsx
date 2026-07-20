import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Sparkles, Send, FileText, Settings, RefreshCw, ChevronLeft, ChevronDown, 
  CheckCircle2, AlertTriangle, Lightbulb, Compass, Database, Trash2, Printer, Wand2, Activity
} from "lucide-react";
import { IBoard, IMessage, IGeneratedOutput, IRecommendation } from "../types";

interface BoardWorkspaceProps {
  boardId: string;
  token: string | null;
  setView: (view: string) => void;
}

type DocType = "decision_brief" | "outline" | "plan" | "draft";

export default function BoardWorkspace({ boardId, token, setView }: BoardWorkspaceProps) {
  const [board, setBoard] = useState<IBoard | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [outputs, setOutputs] = useState<IGeneratedOutput[]>([]);
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [inputMsg, setInputMsg] = useState("");
  const [sendingChat, setSendingChat] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Document Generator State
  const [selectedDocType, setSelectedDocType] = useState<DocType>("decision_brief");
  const [selectedLength, setSelectedLength] = useState<"short" | "medium" | "long">("medium");
  const [generatingDoc, setGeneratingDoc] = useState(false);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Initialize board categories on mount
  useEffect(() => {
    if (board) {
      if (board.category === "Decision") {
        setSelectedDocType("decision_brief");
      } else if (board.category === "Plan") {
        setSelectedDocType("plan");
      } else {
        setSelectedDocType("outline");
      }
    }
  }, [board]);

  useEffect(() => {
    if (boardId && token) {
      loadBoardDetails();
    }
  }, [boardId, token]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sendingChat]);

  const loadBoardDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load Board workspace details.");
      }

      setBoard(data.board);
      setMessages(data.messages || []);
      setOutputs(data.outputs || []);
      
      setFollowUps(getDefaultPromptChips(data.board.category));
      fetchSmartRecommendations();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred loading your workspace.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSmartRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const response = await fetch(`/api/boards/${boardId}/recommendations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRecommendations(data.recommendations || []);
      }
    } catch (err) {
      console.error("Could not fetch co-thinking recommendations:", err);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleSendChat = async (textToSend: string) => {
    if (!textToSend.trim() || sendingChat) return;

    setSendingChat(true);
    setError(null);
    setInputMsg("");

    const tempUserMsg: IMessage = {
      _id: `temp_user_${Date.now()}`,
      boardId,
      role: "user",
      content: textToSend.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const response = await fetch(`/api/boards/${boardId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: textToSend.trim() }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        // Server may have returned a non-JSON error page (e.g. gateway timeout).
        const text = await response.text().catch(() => "");
        throw new Error(text || `Request failed (${response.status}). Check your connection and retry.`);
      }

      if (!response.ok) {
        throw new Error(data.error || "Failed to send chat payload.");
      }

      setMessages(prev => {
        const filtered = prev.filter(m => m._id !== tempUserMsg._id);
        return [...filtered, data.userMessage, data.modelMessage];
      });

      setFollowUps(data.suggestions || []);
      fetchSmartRecommendations();
    } catch (err: any) {
      const msg = err?.message || "AI co-thinker timed out or refused packages.";
      const quotaHint = /429|quota|rate.?limit|resource exhausted/i.test(msg)
        ? " (Gemini API quota exceeded — wait a moment or raise limits in Google AI Studio)."
        : "";
      setError(msg + quotaHint);
    } finally {
      setSendingChat(false);
    }
  };

  const handleCompileDoc = async () => {
    setGeneratingDoc(true);
    setError(null);

    try {
      const response = await fetch(`/api/boards/${boardId}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: selectedDocType,
          length: selectedLength,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to compile document.");
      }

      setOutputs(prev => [data, ...prev]);
      setSelectedVersionIndex(0);
    } catch (err: any) {
      setError(err.message || "Failed to generate structured documentation.");
    } finally {
      setGeneratingDoc(false);
    }
  };

  const getDefaultPromptChips = (cat: "Decision" | "Idea" | "Plan"): string[] => {
    if (cat === "Decision") {
      return [
        "Let's write down Option A and B constraints",
        "Explain how to model exit costs",
        "Generate a draft tradeoff brief",
      ];
    } else if (cat === "Plan") {
      return [
        "Outline day-by-day launch goals",
        "What are our top tech deployment risks?",
        "Help me draft the initial launch announcement",
      ];
    } else {
      return [
        "Let's brainstorm the core methodology steps",
        "Help me refine my primary research question",
        "Outline Chapter 1 objectives",
      ];
    }
  };

  const filteredOutputs = outputs.filter(o => o.type === selectedDocType);
  const activeDocument = filteredOutputs[selectedVersionIndex] || null;

  const docTypeLabels = {
    decision_brief: "Decision Brief",
    outline: "Chapter Outline",
    plan: "Launch Roadmap",
    draft: "Document Draft",
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      
      {/* Workspace Header banner */}
      {board && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5 mb-6 text-left">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("dashboard")}
              className="rounded-md border border-slate-200 bg-white p-2.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
            </button>
            <div>
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-display mb-1.5">
                <button 
                  onClick={() => setView("dashboard")} 
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Dashboard
                </button>
                <span>&gt;</span>
                <button 
                  onClick={() => setView("manage_boards")} 
                  className="hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Boards
                </button>
                <span>&gt;</span>
                <span className="text-slate-600 truncate max-w-[140px] md:max-w-[240px]">{board.title}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 uppercase font-display">
                  {board.category} Mode
                </span>
                <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase font-display">
                  Workspace Open
                </span>
              </div>
              <h1 className="font-display text-xl font-extrabold tracking-tight text-slate-900 mt-0.5">
                {board.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5 font-semibold">
              <Database className="h-4 w-4 text-slate-500" />
              <span>MongoDB Cloud Sync</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-md border border-red-100 bg-red-50 p-4 text-xs text-red-700 leading-normal text-left animate-fadeIn">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <span className="font-body-sm">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="h-[550px] w-full rounded-xl border border-slate-200 bg-white p-12 text-center flex flex-col justify-center items-center animate-pulse space-y-4">
          <RefreshCw className="h-10 w-10 text-[#0F172A] animate-spin" />
          <p className="text-sm font-semibold text-slate-500 font-display">Initializing co-thinking workspace controls...</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12 h-[calc(100vh-180px)] min-h-[580px]">
          
          {/* LEFT PANEL: Chat Co-thinker */}
          <div className="lg:col-span-5 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full text-left">
            
            {/* Panel Header */}
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4.5 py-3.5">
              <MessageSquare className="h-5 w-5 text-slate-700" />
              <span className="font-display text-sm font-bold text-slate-900">Co-Thinking Chat</span>
              <div className="ml-auto flex items-center gap-1.5 rounded-full bg-slate-200/60 px-2.5 py-0.5 font-mono text-[9px] font-bold text-slate-800">
                <Sparkles className="h-3 w-3 text-amber-500 fill-amber-500" />
                Gemini Active
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-grow overflow-y-auto p-4.5 space-y-4 scrollbar-thin bg-slate-50/20">
              {/* Context Prompt Anchor */}
              {board && (
                <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 leading-relaxed mb-4">
                  <p className="font-bold uppercase text-[9px] tracking-wider text-slate-500 font-mono mb-1 font-display">
                    Core Context Anchor
                  </p>
                  <p className="italic font-body-sm">"{board.context}"</p>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-3 h-full flex flex-col justify-center items-center">
                  <MessageSquare className="h-12 w-12 text-slate-300" />
                  <p className="text-xs font-bold text-slate-700 font-display">No Dialogue History Yet</p>
                  <p className="text-[11px] text-slate-400 max-w-xs leading-normal font-body-sm">
                    Select a follow-up chip below or write down your core question to start refining targets with Aivora.
                  </p>
                </div>
              ) : (
                messages.map((m) => (
                  <div 
                    key={m._id} 
                    className={`flex flex-col max-w-[85%] ${
                      m.role === "user" ? "ml-auto items-end" : "mr-auto items-start animate-fadeIn"
                    }`}
                  >
                    <span className="text-[9px] text-slate-400 font-mono mb-1 px-1">
                      {m.role === "user" ? "User" : "Aivora"}
                    </span>
                    <div 
                      className={`rounded-xl p-4 text-xs leading-relaxed shadow-sm ${
                        m.role === "user" 
                          ? "bg-[#0F172A] text-white rounded-tr-none" 
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-sans"
                      }`}
                    >
                      <div className="markdown-body text-xs font-body-sm" dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, "<br />") }} />
                    </div>
                  </div>
                ))
              )}

              {sendingChat && (
                <div className="mr-auto items-start max-w-[85%] flex flex-col">
                  <span className="text-[9px] text-slate-400 font-mono mb-1 px-1">Aivora thinking...</span>
                  <div className="rounded-xl bg-white border border-slate-200 p-4 text-xs shadow-sm rounded-tl-none flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 bg-[#0F172A] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-1.5 w-1.5 bg-[#0F172A] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-1.5 w-1.5 bg-[#0F172A] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Prompt suggestions Chips */}
            {followUps.length > 0 && !sendingChat && (
              <div className="px-4.5 py-3 border-t border-slate-200 bg-white">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1 font-display">
                  <Lightbulb className="h-3 w-3 text-amber-500 fill-amber-500" />
                  Suggested Co-Thinking chips
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto">
                  {followUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChat(chip)}
                      className="rounded-md border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-[10px] font-semibold text-slate-700 text-left hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer leading-tight font-display"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input form */}
            <div className="border-t border-slate-200 bg-white">
              <form 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  handleSendChat(inputMsg); 
                }} 
                className="p-3 flex gap-2 items-center"
              >
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder="Ask Aivora to analyze a detail / refine tradeoffs..."
                  disabled={sendingChat}
                  className="flex-grow rounded-md border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0F172A] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] disabled:opacity-60 font-body-sm"
                />
                <button
                  type="submit"
                  disabled={sendingChat || !inputMsg.trim()}
                  className="rounded-md bg-[#0F172A] p-3 text-white shadow-sm hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT PANEL: Document Workspace */}
          <div className="lg:col-span-7 flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-full text-left">
            
            {/* Panel Tab Controls */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2 gap-3">
              <div className="flex gap-1.5">
                {board && board.category === "Decision" ? (
                  <button
                    onClick={() => { setSelectedDocType("decision_brief"); setSelectedVersionIndex(0); }}
                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer font-display ${
                      selectedDocType === "decision_brief" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Decision Brief
                  </button>
                ) : board && board.category === "Plan" ? (
                  <button
                    onClick={() => { setSelectedDocType("plan"); setSelectedVersionIndex(0); }}
                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer font-display ${
                      selectedDocType === "plan" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Launch Roadmap
                  </button>
                ) : (
                  <button
                    onClick={() => { setSelectedDocType("outline"); setSelectedVersionIndex(0); }}
                    className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer font-display ${
                      selectedDocType === "outline" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Chapter Outline
                  </button>
                )}
                <button
                  onClick={() => { setSelectedDocType("draft"); setSelectedVersionIndex(0); }}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition cursor-pointer font-display ${
                    selectedDocType === "draft" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Document Draft
                </button>
              </div>

              {/* Version Picker */}
              {filteredOutputs.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Version</span>
                  <div className="relative">
                    <select
                      value={selectedVersionIndex}
                      onChange={(e) => setSelectedVersionIndex(Number(e.target.value))}
                      className="rounded-md border border-slate-200 bg-white pl-2 pr-6 py-1 text-xs font-mono font-bold focus:outline-none cursor-pointer appearance-none text-slate-700"
                    >
                      {filteredOutputs.map((out, idx) => (
                        <option key={out._id} value={idx}>
                          v{out.version} - {new Date(out.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Document Content Workspace */}
            <div className="flex-grow overflow-y-auto p-6 scrollbar-thin bg-white">
              
              {generatingDoc ? (
                <div className="py-24 text-center space-y-4 flex flex-col justify-center items-center h-full">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
                  <p className="text-xs font-extrabold text-slate-900 font-display">Compiling Dialectics into Structured Markdown...</p>
                  <p className="text-[11px] text-slate-400 max-w-sm leading-normal font-body-sm">
                    This takes about 10 seconds. We are scanning conversation threads, weighing variables, and structuring risk mitigations.
                  </p>
                </div>
              ) : activeDocument ? (
                <div className="animate-fadeIn">
                  
                  {/* PDF Actions Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest">Actionable Synthesis</span>
                    <button
                      type="button"
                      onClick={() => {
                        window.print();
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer font-display"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Export PDF Report
                    </button>
                  </div>

                  {/* Markdown Display */}
                  <div className="markdown-body font-body-sm text-slate-700 leading-relaxed text-xs">
                    <div dangerouslySetInnerHTML={{ 
                      __html: activeDocument.content
                        .replace(/# (.*)/g, '<h1 class="text-xl font-bold font-display mt-4 mb-2 text-slate-900 border-b border-slate-100 pb-1">$1</h1>')
                        .replace(/## (.*)/g, '<h2 class="text-lg font-bold font-display mt-3 mb-2 text-slate-900">$1</h2>')
                        .replace(/### (.*)/g, '<h3 class="text-sm font-semibold font-display mt-2 mb-1 text-slate-800">$1</h3>')
                        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                        .replace(/\* (.*)/g, '<li class="list-disc ml-5 my-1">$1</li>')
                        .replace(/\n\n/g, '<p class="my-2"></p>')
                        .replace(/> ⚠️ (.*)/g, '<blockquote class="border-l-4 border-slate-400 pl-4 my-2 italic text-slate-600 bg-slate-50 p-2 rounded-md"><strong>Demo:</strong> $1</blockquote>')
                    }} />
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center py-16 text-center space-y-5">
                  <div className="h-12 w-12 rounded-md bg-slate-100 text-slate-800 flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-slate-950">
                      Compile {docTypeLabels[selectedDocType]}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-normal mt-1 font-body-sm">
                      Convert your co-thinking logs into a highly detailed, executive, and actionable markdown document.
                    </p>
                  </div>

                  {/* Options select */}
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Target Length</span>
                      <select
                        value={selectedLength}
                        onChange={(e: any) => setSelectedLength(e.target.value)}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none font-display cursor-pointer"
                      >
                        <option value="short">Short (~500w)</option>
                        <option value="medium">Medium (~1200w)</option>
                        <option value="long">Long (~2000w+)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleCompileDoc}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#0F172A] px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer font-display"
                  >
                    <Sparkles className="h-4 w-4" />
                    Compile {docTypeLabels[selectedDocType]}
                  </button>
                </div>
              )}

            </div>

            {/* Smart Recommendations drawer / footer block */}
            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-display">
                  <Compass className="h-4.5 w-4.5 text-slate-500" />
                  Aivora Core: Suggested Next Steps
                </span>
                <span className="text-[9px] text-slate-400 font-mono font-semibold tracking-wider uppercase">
                  Real-time analysis
                </span>
              </div>

              {loadingRecs ? (
                <div className="flex items-center justify-center py-6">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-800 border-t-transparent" />
                </div>
              ) : recommendations.length === 0 ? (
                <p className="text-[10px] text-slate-400 font-medium font-body-sm">
                  Chat more to build a baseline and surface intelligent recommendations.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-3">
                  {recommendations.slice(0, 3).map((rec, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSendChat(`Let's explore: ${rec.title}`)}
                      className="rounded-md border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-400 transition-all cursor-pointer group text-left"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-display font-bold text-[11px] text-slate-900 line-clamp-1 group-hover:text-[#0F172A]">
                          {rec.title}
                        </span>
                        <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider shrink-0 ${
                          rec.actionType === "generate" ? "bg-emerald-50 text-emerald-800" :
                          rec.actionType === "chat" ? "bg-slate-100 text-slate-800" : "bg-amber-50 text-amber-800"
                        }`}>
                          {rec.actionType}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 font-body-sm">
                        {rec.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Sticky Floating AI Toolbox */}
      <div className="fixed right-6 bottom-20 lg:bottom-6 z-40">
        <button
          type="button"
          onClick={() => setIsToolsOpen(!isToolsOpen)}
          className="h-12 w-12 rounded-full bg-slate-900 text-white shadow-xl flex items-center justify-center hover:bg-slate-850 transition-all active:scale-95 cursor-pointer border border-slate-700 hover:rotate-12 duration-200"
          title="Aivora Quick AI Tools"
        >
          <Settings className="h-5 w-5 animate-spin-slow" />
        </button>

        {isToolsOpen && (
          <div className="absolute right-0 bottom-14 w-72 bg-white rounded-2xl border border-slate-200 p-4.5 shadow-2xl space-y-4 animate-slideUp text-left z-50">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-display text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                <Activity className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                Aivora Co-Thinker Tools
              </span>
              <button 
                type="button"
                onClick={() => setIsToolsOpen(false)} 
                className="text-slate-400 hover:text-slate-900 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setInputMsg("Optimize this context prompt for absolute strategic precision and corporate readiness.");
                  setIsToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <Wand2 className="h-4 w-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold font-display block text-slate-800">Optimize Context Prompt</span>
                  <span className="text-[9px] text-slate-400 block font-sans">Enhance board parameters using Gemini</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleSendChat("Synthesize and summarize our dialogue into actionable decision targets.");
                  setIsToolsOpen(false);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-slate-50 transition border border-transparent hover:border-slate-100 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold font-display block text-slate-800">Summarize Thread Dialogues</span>
                  <span className="text-[9px] text-slate-400 block font-sans">Extract strategic recommendations instantly</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
