import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
  const faqs = [
    {
      q: "How does Aivora handle data privacy?",
      a: "We prioritize enterprise-grade security. Your data is encrypted at rest and in transit. We offer SOC2 compliance and guarantee that your proprietary data is never used to train public models.",
    },
    {
      q: "Which AI models power Aivora?",
      a: "Aivora integrates with the latest LLMs from OpenAI, Anthropic, and specialized open-source models, allowing you to choose the best intelligence for your specific task.",
    },
    {
      q: "Can I collaborate with my entire team?",
      a: "Yes, Aivora is built for collaboration. You can invite team members to boards, use real-time multi-player editing, and share AI-generated insights across your workspace.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-[#0F172A] text-center mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className="bg-[#f7f9fb] rounded-xl border border-slate-200/50 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex justify-between items-center p-6 text-left cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <span className="text-base sm:text-lg font-semibold font-display text-[#0F172A]">
                    {faq.q}
                  </span>
                  <ChevronDown 
                    className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed font-body-sm text-left">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
