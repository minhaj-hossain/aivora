import React from "react";
import { motion } from "motion/react";

export default function Stats() {
  const stats = [
    { value: "10x", label: "Faster Decisions" },
    { value: "85%", label: "Less Research Time" },
    { value: "40k+", label: "Active Power Users" },
  ];

  return (
    <section className="py-20 bg-[#0F172A] text-white overflow-hidden relative">
      {/* Absolute grid background overlay for rich texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <div 
          className="absolute top-0 left-0 w-full h-full" 
          style={{ 
            backgroundImage: "radial-gradient(circle at 2px 2px, white 1.5px, transparent 0)", 
            backgroundSize: "40px 40px" 
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="space-y-3"
            >
              <div className="text-6xl md:text-7xl lg:text-8xl font-extrabold font-display leading-none text-[#eff1f3] tracking-tight">
                {stat.value}
              </div>
              <p className="text-base sm:text-lg text-slate-300 font-medium font-body-sm uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
