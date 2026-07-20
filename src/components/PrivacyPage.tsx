import React from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-left">
      <div className="space-y-6 animate-fadeIn bg-white rounded-xl border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
          <Shield className="h-5.5 w-5.5 text-slate-700" />
          <h1 className="font-display text-xl font-extrabold text-[#0F172A]">Privacy & Data Shield</h1>
        </div>

        <div className="space-y-4 text-xs text-slate-500 leading-relaxed font-body-sm">
          <h3 className="font-display font-bold text-[#0F172A] text-sm">1. Secure Platform Architecture</h3>
          <p>
            Aivora prioritizes user privacy. All authentication passwords are encrypted using multi-round bcrypt hashing. Session indicators are sealed with JSON Web Tokens (JWT) signed by a server-only secret, guarding against session interception.
          </p>

          <h3 className="font-display font-bold text-[#0F172A] text-sm">2. Server-Side Key Masking</h3>
          <p>
            We implement lazy, on-demand loading of the official <code>@google/genai</code> SDK. Your <code>GEMINI_API_KEY</code> is NEVER exposed to client browsers or network request headers. All requests are routed through safe server-side API proxy controllers.
          </p>

          <h3 className="font-display font-bold text-[#0F172A] text-sm">3. Google OAuth & Account Safety</h3>
          <p>
            When utilizing Google Sign-In, we fetch only required identity scopes (email, name, openid). Your OAuth credentials are handled via a popup exchange mechanism that immediately sends JWT keys through verified origin channels (<code>window.opener.postMessage</code>) and self-destructs the callback window.
          </p>

          <h3 className="font-display font-bold text-[#0F172A] text-sm">4. Data Processing Agreements</h3>
          <p>
            Conversational histories and contextual descriptions used to guide the co-thinking process are transmitted to Gemini 2.5-Flash solely for processing, and are not utilized by Google to retrain foundations.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-150 flex gap-4 text-[11px] text-slate-400">
          <Link to="/about" className="hover:text-slate-600 underline">About</Link>
          <span>•</span>
          <Link to="/terms" className="hover:text-slate-600 underline">Terms of Service</Link>
        </div>
      </div>
    </div>
  );
}
