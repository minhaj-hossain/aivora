import React from "react";
import { Globe, Shield, Award, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="space-y-10 animate-fadeIn text-left">
        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-[#0F172A]">
            <Globe className="h-5 w-5" />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#0F172A]">
            Empowering human reasoning through co-thinking AI
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl font-body-sm">
            Aivora is built on the belief that AI's ultimate value isn't to think <em>for</em> us, but to think <em>with</em> us. We build co-thinking sandboxes designed to break down uncertainty and compile structural clarity.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200/60 p-6 bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <Shield className="h-6 w-6 text-slate-700" />
            <h3 className="font-display text-base font-bold text-[#0F172A]">Privacy First</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body-sm">
              All contexts are securely sandboxed inside your MongoDB datastore, guaranteeing that you own and control your strategic thinking assets.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/60 p-6 bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <Award className="h-6 w-6 text-slate-700" />
            <h3 className="font-display text-base font-bold text-[#0F172A]">Rigorous Logic</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body-sm">
              Our model prompts aren't generic. We employ mathematical MCDA weights, first-principles framing, and structure-driven analysis.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/60 p-6 bg-white space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <MapPin className="h-6 w-6 text-slate-700" />
            <h3 className="font-display text-base font-bold text-[#0F172A]">Markdown Ready</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-body-sm">
              Seamlessly export all generated plans, outlines, and briefs in native Markdown for Obsidian, Notion, or Git publishing.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-6 space-y-3">
          <h3 className="font-display text-lg font-bold text-[#0F172A]">Our Vision</h3>
          <p className="text-xs leading-relaxed text-slate-700 font-body-sm">
            We want to eliminate starting paralysis. Every product launch, thesis chapter, and relocation decision is a complex system of nodes. Aivora helps you map those nodes, evaluate edges, and compile beautiful, bulletproof roadmap artifacts.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-200/60 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link to="/contact" className="hover:text-slate-900 font-semibold underline">Contact Support</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-slate-900 font-semibold underline">Terms of Use</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-slate-900 font-semibold underline">Privacy Shield Policy</Link>
        </div>
      </div>
    </div>
  );
}
