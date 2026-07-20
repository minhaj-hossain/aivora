import React from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { ActiveView } from "../../types";

interface UseCasesProps {
  setView: (view: ActiveView) => void;
}

export default function UseCases({ setView }: UseCasesProps) {
  const cases = [
    {
      title: "Product Strategy",
      desc: "Analyze market gaps and define roadmaps with competitive intelligence.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTDM-MVn_a8xkLNyxyMJWMRRAYIZJmAxIuOFcOF4zF0BejB1wWKCMU155_6mxyBBMlEW7kjGhpOqQxeyZuEuZ8Izmh80RrCiRPwsVTaDGXqeLsvy5uvCvM9RD-A6S73zVmhK-fb5xEqmJ-pQDOeoJ2DZpxiFahOJcQeTkrLdcyZmtHU_Zo-SnqENXbJA-vDv3Wf1UUim9Bxp3t3BbQSzSWipySa2RfHjo2VlsoxKFGQ5bLPrYvb5qmtw",
    },
    {
      title: "Market Research",
      desc: "Synthesize thousands of data points into coherent trend reports instantly.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwr8wtgjOR4SB-1iTuzMlBTnA7yUw0_fUp_DXuKzX6Yap0m-cnZPYsIkYeXx74b1tmUOKOK-7pgK5myZfF5KfK0weMS0zE7q0AOaXVvga3CPoMWB6PaKgWUSJPJKSKz-4sdRTuarwU6BCJNqbQ7YtjnBKhWGsmjukrgNDJLbV9C4R_ed_UP6_IL2mAsNL1Jea7Sg7Q_Zex4lAC2iIctT58KvS3ngvWALZhyMhCL7gh_x1qpRGJo5tfdQ",
    },
    {
      title: "Engineering Docs",
      desc: "Maintain living technical documentation that updates as your code evolves.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvZlWtoa8n4rF_qSKPC0vO2Oxq-Z4rOCoOlWIxvgtYxeOi31FaiWun4ergDQn9-uWMiFpUcPXjsU_Ld82Ko5ws713q3NbSwHLjNeup2vJQVj6VRCEFXhXjdNKApQi8bhK6X8Hyi05oncdH7txnPhJU3UAvCNDJ539RSTlClHs5h2IVhRXwn2O-diK_J8InHAj6CQowNB4x0lVvhtM07NhZpr00CQzU3dqWC2ZYKBweSVJApVfCWuI-BQ",
    },
    {
      title: "Strategic Planning",
      desc: "Model long-term scenarios and financial impacts with iterative reasoning.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrzUvSHVxBchClBPBttH_MTmYyiXYqal0HgKJQFbWQKpz4_BC37IXAmXDcZr3zmWV3WJCEs_ktePjUjf-8J-XTlvCV0sLHO9xV1It29BmrgfOLaAWLvtafC_LaNc8QC9KRCAETJ3_p34CvigyruCI8ogqCGNEPCyDhaBnZaAOTSrqA9pcpqT_4YU532_AYld75fR6M2cpnbOUmj7D32hZxNqEzZbn59-AXgPIsdjuFLQnXiH3kLIcEZA",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl text-left">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-[#0F172A] mb-4">
              Built for Professionals
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-body-lg leading-relaxed">
              From vision to execution, Aivora powers the world's most demanding cognitive workflows.
            </p>
          </div>
          <button
            onClick={() => setView("explore")}
            className="text-[#0F172A] font-semibold flex items-center gap-2 hover:gap-3 transition-all group self-start cursor-pointer"
          >
            View all templates <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-slate-200/60 rounded-xl p-8 flex flex-col justify-between group hover:shadow-md transition-all duration-300"
            >
              <div>
                <h4 className="text-lg font-bold font-display text-[#0F172A] mb-3">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed font-body-sm h-12 overflow-hidden">
                  {item.desc}
                </p>
              </div>
              <div className="rounded-lg overflow-hidden h-36 w-full border border-slate-100 shadow-inner">
                <img
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out"
                  src={item.img}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
