import React from "react";
import { Shield, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-left">
      <div className="space-y-6 animate-fadeIn bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <BookOpen className="h-5.5 w-5.5 text-slate-700" />
          <h1 className="font-display text-xl font-extrabold text-[#0F172A]">Terms of Service</h1>
        </div>

        <div className="space-y-4 text-xs text-slate-500 leading-relaxed font-body-sm">
          <h3 className="font-display font-bold text-[#0F172A] text-sm">1. Acceptance of Terms</h3>
          <p>
            By accessing or using the Aivora co-thinking platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our software and API endpoints.
          </p>

          <h3 className="font-display font-bold text-[#0F172A] text-sm">2. Data Sovereignty & Storage</h3>
          <p>
            Aivora operates directly against your specified MongoDB cluster. All records, including board structures, messages, and document versions, are stored exclusively within your data storage layer. We are not liable for any local or hosted database downtime or loss of records.
          </p>

          <h3 className="font-display font-bold text-[#0F172A] text-sm">3. Co-Thinking Output Disclaimer</h3>
          <p>
            The analysis, MCDA matrices, chapter outlines, and decision roadmaps compiled by Aivora's integrated Gemini intelligence represent brainstorming aids and co-thinking recommendations. They do not constitute formal legal, financial, architectural, or professional advisory actions.
          </p>

          <h3 className="font-display font-bold text-[#0F172A] text-sm">4. Secure API Usage</h3>
          <p>
            You are responsible for keeping your <code>GEMINI_API_KEY</code> and Google OAuth configurations secure. Do not share or embed credentials in client code. We process all intelligence server-side to protect keys from leakage.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-150 flex gap-4 text-[11px] text-slate-400">
          <Link to="/about" className="hover:text-slate-600 underline">About</Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-slate-600 underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
