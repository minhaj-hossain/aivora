import React from "react";
import { useQuery } from "@tanstack/react-query";
import WidgetCard from "./WidgetCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Layers } from "lucide-react";

export default function TemplateDistribution() {
  const { data, isLoading } = useQuery({
    queryKey: ["publicStats"],
    queryFn: async () => {
      const res = await fetch("/api/boards/public-stats");
      if (!res.ok) {
        throw new Error("Failed to load template statistics.");
      }
      return res.json() as Promise<{
        totalTemplates: number;
        categoryStats: Array<{ name: string; value: number }>;
      }>;
    },
  });

  if (isLoading || !data) {
    return (
      <WidgetCard
        title="Public Scaffold Templates"
        subtitle="Distribution of expert frameworks across category lines"
        className="h-full"
      >
        <div className="h-48 flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
        </div>
      </WidgetCard>
    );
  }

  // Map backend stats to recharts pie format
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];
  const chartData = data.categoryStats || [];

  return (
    <WidgetCard
      title="Public Scaffold Templates"
      subtitle="Distribution of expert frameworks across category lines"
      headerAction={
        <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full font-display">
          <Layers className="h-3.5 w-3.5" />
          <span>{data.totalTemplates} Loaded</span>
        </div>
      }
      className="h-full"
    >
      <div className="flex-grow flex flex-col justify-center min-h-[220px]">
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No active template metadata compiled.
          </div>
        ) : (
          <div className="h-44 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0b0f19",
                    borderRadius: "8px",
                    border: "none",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={32}
                  iconSize={8}
                  tickFormatter={(val) => val}
                  wrapperStyle={{ fontSize: "10px", fontWeight: "600", color: "#64748b" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </WidgetCard>
  );
}
