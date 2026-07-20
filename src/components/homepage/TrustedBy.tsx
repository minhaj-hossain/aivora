import React from "react";
import { motion } from "motion/react";

export default function TrustedBy() {
  const logos = ["VOLT", "QUANTUM", "NEXUS", "SPHERE", "ORBIT"];

  return (
    <section className="py-12 border-y border-slate-200/40 bg-[#f7f9fb]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <p className="text-center font-display text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase mb-8">
          Trusted by modern enterprise teams
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50">
          {logos.map((logo, index) => (
            <motion.div
              key={logo}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-2xl md:text-3xl font-extrabold tracking-wider text-slate-900 font-display select-none"
            >
              {logo}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
