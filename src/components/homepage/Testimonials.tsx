import React from "react";
import { motion } from "motion/react";

export default function Testimonials() {
  const list = [
    {
      quote: "Aivora has fundamentally changed how our leadership team approaches quarterly planning. The ability to reason through scenarios with AI is a superpower.",
      name: "Sarah Jenkins",
      role: "VP Product, TechNexus",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBu83ltooDE_ehLq_JaQcFAAQPqGD3z4ICZkJrFImPEoek-Ftt0WhTn3HXoisGkNJxW4DIOJUKpRwvCTrWcvx_ybjEvXNksMMk-Bx1vHdaHDdV34yfxwzK3_f23MLl0Ofhz-RY0tmXxE7iI_Bt-3dP0QRgtEAU9MOCqOlFGpzjY8UXPHyNosdfv7EJB7BhQwm08qFAR6M49344g3foR2FkObKr_7CM-lfm17aQX5fnmqqwyViJtg64wEQ",
    },
    {
      quote: "The structured outputs are a game-changer. We no longer spend hours formatting meeting notes into JIRA tickets—Aivora does it in seconds.",
      name: "Marcus Chen",
      role: "CTO, CloudScale",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-N-mTUCZoz57VSQf1WG0npBzAL67N1920GC0CGGftuDFt4JWn22E8snw__kBKOjaj6zCjw-O5rj9ZosFON0auahVAv3tuD4UbPI__vY-PfF-2QtZ3TBvREXikuQnHa_Cih168_kzIVILtIcaz8HVJw4Xw2uH5mbVaWkJnKJlfuFKuAWCqNyIV596EjXaprSe_uPCSWStvkZVBBLezpMoeBS03aZNcoge9AytTIBwq0b47AUWu_7YVmw",
    },
    {
      quote: "Spacious, minimal, and highly functional. It's the first AI tool that feels like it belongs in a serious enterprise stack.",
      name: "Elena Rodriguez",
      role: "Director Research, InsightIQ",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCy4cHNccaInKrQ1uc1I7WRv5VUVii-3VL57utUCZptmXI0ka-9GjjCFIl-OaB1xT0vQxsagAu8ZBAAqQPKmAgxrbWXLJQy7YgZso5GyADNnSAMqZbcyzAoo5TcEv_nn7Z9yv8E2_LiyQiFI-MzwWd6xYjp_foCTHt7tMQYce2pzp5LUQgh59egPZUGxiA41niGT-uwVCW_p1LzMcx7juOXCq6BS8Ht47lV8nh4oDdUJFrpjvJ7ROVBLQ",
    },
  ];

  return (
    <section className="py-20 bg-[#f7f9fb] border-t border-slate-200/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-[#0F172A] text-center mb-16">
          Trusted by Industry Leaders
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {list.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="bg-white border border-slate-200/60 rounded-xl p-8 md:p-10 flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <p className="text-base text-slate-700 italic mb-8 leading-relaxed font-body-lg text-left">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                  src={item.img}
                />
                <div className="text-left">
                  <p className="font-bold text-[#0F172A] text-base font-display">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 font-body-sm">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
