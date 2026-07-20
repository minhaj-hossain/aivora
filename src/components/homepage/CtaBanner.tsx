import React from "react";
import { motion } from "motion/react";
import { ActiveView } from "../../types";

interface CtaBannerProps {
  setView: (view: ActiveView) => void;
}

export default function CtaBanner({ setView }: CtaBannerProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-[#0F172A] rounded-2xl p-12 md:p-20 text-center relative overflow-hidden shadow-xl"
        >
          {/* Subtle textured grid overlay */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="none" stroke="white" strokeDasharray="1,2" strokeWidth="0.1" />
            </svg>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white leading-tight">
              Build your next big idea on Aivora.
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-body-sm">
              Join 40,000+ professionals who are transforming how they reason, create, and decide.
            </p>
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setView("register")}
                className="bg-white text-[#0F172A] px-10 py-4 rounded-md text-base font-bold hover:bg-[#f7f9fb] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Get Started for Free
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
