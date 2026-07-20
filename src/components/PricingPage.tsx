import React from "react";
import { Check, Sparkles, ArrowRight, Zap, Building2, Infinity, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  icon: React.ReactNode;
}

const tiers: PricingTier[] = [
  {
    name: "Explorer",
    tagline: "For casual co-thinkers",
    price: "$0",
    period: "/ forever",
    description:
      "Start reasoning with Aivora at no cost. Perfect for exploring templates and running a few focused Boards.",
    features: [
      "Up to 3 active Boards",
      "Full Co-Thinking Chat (Gemini 2.0 Flash)",
      "Decision Brief & Outline generation",
      "Public template library access",
      "7-day message history",
    ],
    cta: "Start for free",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    name: "Strategist",
    tagline: "For power users & builders",
    price: "$12",
    period: "/ month",
    description:
      "Unlimited structured thinking with deeper generation, version history, and priority intelligence throughput.",
    features: [
      "Unlimited Boards",
      "All document types (briefs, plans, drafts)",
      "Version history & regeneration",
      "Smart recommendations engine",
      "Priority AI throughput (no free-tier queue)",
      "Export to Markdown / PDF",
    ],
    cta: "Upgrade to Strategist",
    highlighted: true,
    icon: <Zap className="h-5 w-5" />,
  },
  {
    name: "Enterprise",
    tagline: "For teams & organizations",
    price: "Custom",
    period: "",
    description:
      "Collaborative workspaces, admin controls, and dedicated support for organizations that think at scale.",
    features: [
      "Everything in Strategist",
      "Shared team Boards & roles",
      "SSO / Google Workspace integration",
      "Higher rate limits & custom models",
      "Dedicated onboarding & SLA",
    ],
    cta: "Talk to sales",
    icon: <Building2 className="h-5 w-5" />,
  },
];

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade at any time. Changes take effect on your next billing cycle and your Boards remain intact.",
  },
  {
    q: "What AI model powers the co-thinking chat?",
    a: "Aivora uses Google Gemini (gemini-2.0-flash) with automatic fallbacks. Strategist and Enterprise plans get priority throughput to avoid free-tier rate limits.",
  },
  {
    q: "Is my data private?",
    a: "Your Boards, messages, and generated documents are stored in your own MongoDB datastore. We never train on your content, and all AI calls are made server-side to protect your keys.",
  },
  {
    q: "Do you offer a free trial of paid plans?",
    a: "The Explorer plan is free forever. Paid plans include a 14-day money-back guarantee so you can evaluate without risk.",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-slate-50/40 min-h-screen text-slate-800 antialiased pb-20">
      {/* Hero Banner */}
      <div className="bg-[#0b0f19] text-slate-100 py-16 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0b0f19] to-[#0b0f19]" />
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-indigo-300 font-mono">
            <Crown className="h-3.5 w-3.5" />
            Pricing
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            Thinking at scale shouldn't cost clarity
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-body-sm">
            Start free, upgrade when your decisions get serious. Every plan includes the full co-thinking workspace — chat, structured generation, and smart recommendations.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl border bg-white p-8 shadow-sm flex flex-col ${
                tier.highlighted
                  ? "border-indigo-500 ring-2 ring-indigo-500/20 lg:-mt-4 lg:mb-4"
                  : "border-slate-200"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white font-mono">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-2 text-[#0F172A]">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${
                  tier.highlighted ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                }`}>
                  {tier.icon}
                </span>
                <h3 className="font-display text-lg font-extrabold">{tier.name}</h3>
              </div>

              <p className="mt-2 text-xs text-slate-400 font-body-sm">{tier.tagline}</p>

              <div className="mt-5 flex items-end gap-1">
                <span className="font-display text-4xl font-extrabold text-[#0F172A]">{tier.price}</span>
                <span className="text-xs text-slate-400 mb-1.5 font-body-sm">{tier.period}</span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-500 font-body-sm min-h-[40px]">
                {tier.description}
              </p>

              <Link
                to="/register"
                className={`mt-6 inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-3 text-xs font-bold shadow-sm transition-all cursor-pointer font-display ${
                  tier.highlighted
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-[#0F172A] hover:bg-slate-800 text-white"
                }`}
              >
                {tier.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <ul className="mt-7 space-y-3 text-left">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-600 font-body-sm">
                    <Check className={`h-4 w-4 shrink-0 mt-0.5 ${
                      tier.highlighted ? "text-indigo-600" : "text-emerald-600"
                    }`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Feature comparison strip */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm text-left">
          <h2 className="font-display text-xl font-extrabold text-[#0F172A] flex items-center gap-2">
            <Infinity className="h-5 w-5 text-indigo-600" />
            What every plan includes
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { t: "Co-Thinking Chat", d: "Context-aware conversations that remember every turn of your Board." },
              { t: "Structured Generation", d: "Decision briefs, outlines, roadmaps, and drafts at your chosen length." },
              { t: "Smart Recommendations", d: "AI-surfaced next steps based on your live session history." },
              { t: "Template Library", d: "Curated public Boards you can clone into your workspace instantly." },
              { t: "Responsive Workspace", d: "A polished experience across mobile, tablet, and desktop." },
              { t: "Secure by Design", d: "JWT auth, Google OAuth, and server-side key handling." },
            ].map((item) => (
              <div key={item.t} className="space-y-1.5">
                <h4 className="font-display text-sm font-bold text-[#0F172A]">{item.t}</h4>
                <p className="text-xs leading-relaxed text-slate-500 font-body-sm">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-6 mt-16">
        <h2 className="font-display text-2xl font-extrabold text-[#0F172A] text-center mb-8">
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm text-left">
              <h3 className="font-display text-sm font-bold text-[#0F172A] mb-2">{faq.q}</h3>
              <p className="text-xs leading-relaxed text-slate-500 font-body-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-5xl mx-auto px-6 mt-16">
        <div className="rounded-2xl border border-indigo-500/30 bg-[#0b0f19] px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#0b0f19] to-[#0b0f19]" />
          <div className="relative z-10 space-y-5">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white">
              Ready to think in tandem?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto font-body-sm">
              Create a Board in under a minute. No credit card required to start.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-6 py-3 text-xs font-bold text-white shadow-sm transition-all cursor-pointer font-display"
            >
              Get started free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="max-w-5xl mx-auto px-6 mt-10 flex flex-wrap justify-center gap-4 text-xs text-slate-400">
        <Link to="/about" className="hover:text-slate-700 underline">About</Link>
        <span>•</span>
        <Link to="/terms" className="hover:text-slate-700 underline">Terms</Link>
        <span>•</span>
        <Link to="/privacy" className="hover:text-slate-700 underline">Privacy</Link>
        <span>•</span>
        <Link to="/contact" className="hover:text-slate-700 underline">Contact</Link>
      </div>
    </div>
  );
}
