import React from "react";

interface WidgetCardProps {
  id?: string;
  key?: React.Key;
  title?: string;
  subtitle?: string;
  className?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}

export default function WidgetCard({
  id,
  title,
  subtitle,
  className = "",
  headerAction,
  children,
}: WidgetCardProps) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col text-left ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-4 mb-5 pb-1">
          <div>
            {title && (
              <h3 className="font-display text-sm font-bold tracking-tight text-slate-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className="flex-grow flex flex-col">{children}</div>
    </div>
  );
}
