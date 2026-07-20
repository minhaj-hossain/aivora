import React from "react";
import { motion } from "motion/react";
import { ActiveView } from "../../types";

interface HeroSectionProps {
  setView: (view: ActiveView) => void;
}

export default function HeroSection({ setView }: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-[#dae2fd]/20 via-[#f7f9fb] to-[#f7f9fb] py-16 md:py-24">
      {/* Decorative radial background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[600px] h-[600px] bg-[#dae2fd]/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left column: Headings */}
        <div className="space-y-8 text-left max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200/60 px-4 py-1.5 text-xs font-semibold text-[#515f74] uppercase tracking-wider"
          >
            <span className="flex h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
            Next-Gen Co-Thinking Platform
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.1] md:leading-[1.05]"
          >
            Think Smarter.<br />
            Create Faster.<br />
            Decide with Confidence.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed font-body-lg"
          >
            Aivora is your intelligent workspace for complex reasoning. Organize ideas into Boards, collaborate with advanced AI, and transform raw thoughts into structured decisions.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            <button
              onClick={() => setView("register")}
              className="bg-[#0F172A] text-white px-8 py-4 rounded-md text-base font-semibold hover:bg-slate-800 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Start Free
            </button>
            <button
              onClick={() => setView("explore")}
              className="border border-slate-300 text-[#0F172A] bg-white px-8 py-4 rounded-md text-base font-semibold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Explore Templates
            </button>
          </motion.div>
        </div>

        {/* Right column: Image preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative lg:h-[500px] flex items-center justify-center w-full"
        >
          <div className="absolute -z-10 w-4/5 h-4/5 bg-[#dae2fd]/25 blur-[100px] rounded-full pointer-events-none" />
          <img 
            alt="Product Dashboard Preview" 
            referrerPolicy="no-referrer"
            className="w-full max-w-2xl rounded-xl border border-slate-200/80 shadow-2xl transform hover:scale-[1.01] transition-transform duration-700 ease-out object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMo3ueRjgydCjDGbwPgHN5xNRSlVFT5vkeKpjQ4FX45OpjgGNIb0rgcktyp5zNE230L_umYnqGAAH34-DwSBB6p6TsiGxepfIELIcvbmq1TggTdTYlCtf7Np--6jY7DWTWC_lX_ht-Ixr59BtLREqcPQ6eefZjmnP1MD10jRZ7pUMbgQ2nhWNRUk2e359vf8VRckteGUVI7pLkboCYV6csZZuaQzdZvCARqOGkXzVRzRkphJXQJYq-pA"
          />
        </motion.div>
      </div>
    </section>
  );
}
