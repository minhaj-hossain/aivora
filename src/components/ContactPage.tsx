import React, { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");

    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="grid gap-8 md:grid-cols-12 animate-fadeIn text-left">
        {/* Info Column */}
        <div className="md:col-span-5 space-y-5">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-[#0F172A]">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F172A]">
            Connect with Aivora
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed font-body-sm">
            Have questions about MONGODB_URI secrets setup, custom prompt tuning, or enterprise licenses? Drop us a line. Our support desk is constantly monitoring.
          </p>
          
          <div className="space-y-3 pt-3 text-xs text-slate-600 font-body-sm">
            <p>
              <strong>Email</strong>: <a href="mailto:support@aivora.app" className="text-slate-800 hover:underline font-semibold">support@aivora.app</a>
            </p>
            <p>
              <strong>SLA Responses</strong>: Immediate AI classification, 24h human escalation.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
            <Link to="/about" className="hover:text-slate-900 underline">About Us</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-900 underline">Terms</Link>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7">
          <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            
            {submitted && (
              <div className="mb-6 flex items-start gap-2.5 rounded-md border border-emerald-100 bg-emerald-50 p-4 text-xs text-emerald-800 leading-normal animate-fadeIn">
                <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-bold">Message Dispatched successfully!</p>
                  <p className="mt-0.5 text-[11px] text-emerald-700">Our support dispatch system is processing your inquiry.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 font-display tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marie Curie"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A] font-body-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 font-display tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@curie.org"
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A] font-body-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1.5 font-display tracking-wider">How can we help?</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry or feature suggestion..."
                  className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F172A] focus:border-[#0F172A] font-body-sm min-h-[110px]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-[#0F172A] py-3 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
                Dispatch Inquiry
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
