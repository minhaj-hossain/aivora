import React from "react";
import { motion } from "motion/react";
import { LayoutGrid, Brain, Network } from "lucide-react";

export default function Workflow() {
  const steps = [
    {
      icon: LayoutGrid,
      title: "1. Create a Board",
      desc: "Start with any problem or project. Our infinite canvas adapts to your specific mental model.",
    },
    {
      icon: Brain,
      title: "2. Reason with AI",
      desc: "Chat to analyze, iterate, and refine ideas. Our models understand context across your history.",
    },
    {
      icon: Network,
      title: "3. Execute with Structure",
      desc: "Turn insights into actionable frameworks. Export directly to docs, project boards, or code.",
    },
  ];

  return (
    <section className="py-20 bg-[#f7f9fb]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-[#0F172A] mb-4">
            Sophisticated Simplicity
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-body-lg">
            Streamline your decision-making process with our three-step intelligent workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-white border border-slate-200/60 rounded-xl p-10 flex flex-col items-center text-center group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center mb-8 text-[#0F172A] group-hover:bg-[#0F172A] group-hover:text-white transition-all duration-300 shadow-sm">
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-display text-[#0F172A] mb-4">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 font-body-sm leading-relaxed max-w-xs">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
