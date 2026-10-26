import React from "react";

interface AivoraLogoProps {
  className?: string;
  withText?: boolean;
  textClassName?: string;
}

export default function AivoraLogo({
  className = "h-8 w-8",
  withText = false,
  textClassName = "font-display text-xl font-bold tracking-tight text-[#0F172A]",
}: AivoraLogoProps) {
  return (
    <div className="inline-flex items-center gap-2.5 select-none shrink-0">
      <svg
        className={className}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Aivora Logo"
      >
        <defs>
          <linearGradient id="aivora_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="inner_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="url(#inner_grad)" />
        <circle cx="16" cy="16" r="11" stroke="url(#aivora_grad)" strokeWidth="2.5" />
        <path
          d="M12 21L16 11L20 21M13.6 18.2H18.4"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="21" cy="11" r="2" fill="url(#aivora_grad)" />
      </svg>
      {withText && <span className={textClassName}>Aivora</span>}
    </div>
  );
}
