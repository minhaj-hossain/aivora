import React from "react";
import { motion } from "motion/react";
import { Activity, Eye, Layers, List } from "lucide-react";

export default function CoreCapabilities() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-[#0F172A] mb-12">
          Core Capabilities
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Bento item 1: Large Personalized Pulse item */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 bg-[#0F172A] p-10 md:p-12 rounded-2xl text-white flex flex-col justify-between h-[360px] relative overflow-hidden group shadow-md"
          >
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-semibold tracking-wider text-slate-300 uppercase">
                <Activity className="h-4 w-4 text-[#dae2fd]" />
                Personalized Pulse
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-display leading-tight text-white max-w-md">
                Proactive Project Monitoring
              </h3>
              <p className="text-sm md:text-base text-slate-300/90 max-w-md leading-relaxed">
                Real-time intelligence that monitors your project data, updates timelines automatically, and proactively suggests structural optimizations before you even ask.
              </p>
            </div>
            
            {/* Visual indicator watermark */}
            <div className="absolute bottom-[-50px] right-[-30px] opacity-[0.04] text-white group-hover:scale-105 transition-transform duration-700 pointer-events-none">
              <Activity className="h-[280px] w-[280px]" />
            </div>
          </motion.div>

          {/* Bento item 2: Context Awareness */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="bg-white border border-slate-200/60 rounded-2xl p-10 h-[360px] flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center mb-8 group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0F172A] mb-4">
                Context Awareness
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-body-sm">
                Deep semantic understanding of your previous workspace interactions, documents, and historical co-thinking threads.
              </p>
            </div>
          </motion.div>

          {/* Bento item 3: Multi-Model Selection */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white border border-slate-200/60 rounded-2xl p-10 h-[360px] flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div>
              <div className="w-14 h-14 rounded-xl bg-slate-100 text-[#0F172A] flex items-center justify-center mb-8 group-hover:bg-[#0F172A] group-hover:text-white transition-colors">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-[#0F172A] mb-4">
                Multi-Model Selection
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-body-sm">
                Toggle seamlessly between industry-leading models for specific tasks: heavy reasoning, creative formulation, or ultra-fast summaries.
              </p>
            </div>
          </motion.div>

          {/* Bento item 4: Large Structured Output */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2 bg-[#f2f4f6] p-10 md:p-12 rounded-2xl border border-slate-200 h-[360px] flex flex-col md:flex-row items-center gap-8 group shadow-sm overflow-hidden"
          >
            <div className="flex-1 space-y-4">
              <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#0F172A]">
                <List className="h-6 w-6" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-display text-[#0F172A]">
                Structured Output
              </h3>
              <p className="text-sm md:text-base text-slate-600 leading-relaxed font-body-sm">
                Receive answers formatted directly as clean Markdown tables, JSON documents, or interactive flowcharts. No more parsing conversational fluff.
              </p>
            </div>
            
            {/* Elegant visual mock list */}
            <div className="hidden md:flex flex-1 flex-col gap-4 py-4 pr-4 pl-8 border-l border-slate-300/40 select-none">
              <div className="h-2 w-3/4 bg-slate-400/20 rounded-full animate-pulse" />
              <div className="h-2 w-full bg-slate-400/20 rounded-full" />
              <div className="h-2 w-1/2 bg-[#0F172A] rounded-full" />
              <div className="h-2 w-2/3 bg-slate-400/20 rounded-full" />
              <div className="h-2 w-5/6 bg-slate-400/20 rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
