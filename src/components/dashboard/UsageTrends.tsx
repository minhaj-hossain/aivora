import React from "react";
import WidgetCard from "./WidgetCard";
import { TrendingUp, Award } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface TrendItem {
  day: string;
  tokens: number;
}

interface UsageTrendsProps {
  data: TrendItem[];
}

export default function UsageTrends({ data }: UsageTrendsProps) {
  // Format token counts to readable string
  const formatTokens = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const totalTokens = data.reduce((a, b) => a + b.tokens, 0);
  const avgTokens = Math.round(totalTokens / (data.length || 7));

  // Custom tooltips for premium feel
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b0f19] text-white rounded-lg p-3 text-[11px] font-mono shadow-lg border border-slate-800 leading-none">
          <p className="text-slate-400 font-sans text-[10px] mb-1 font-medium">{payload[0].payload.day}</p>
          <p className="font-bold text-slate-100">Tokens: <span className="text-indigo-400 font-extrabold">{formatTokens(payload[0].value)}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <WidgetCard
      title="Intelligence Usage Trends"
      subtitle="Cumulative tokens synthesized over the last 7 calendar days"
      headerAction={
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full font-display">
          <TrendingUp className="h-3.5 w-3.5 shrink-0" />
          <span>+14.2% Growth</span>
        </div>
      }
      className="h-full"
    >
      <div className="flex-grow flex flex-col justify-end min-h-[220px] mt-4 w-full">
        {/* Recharts Area Chart */}
        <div className="w-full h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tokenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: "600" }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94a3b8", fontSize: 10 }} 
                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="tokens" 
                stroke="#4f46e5" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#tokenGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Stats Summary footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Award className="h-4.5 w-4.5 text-amber-500 shrink-0" />
            <span className="font-sans leading-none">
              Daily quota: <strong>5,000,000</strong> max
            </span>
          </div>

          <div className="text-slate-400 font-normal">
            Weekly average:{" "}
            <strong className="text-slate-700 font-mono">
              {formatTokens(avgTokens)}
            </strong>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
}
