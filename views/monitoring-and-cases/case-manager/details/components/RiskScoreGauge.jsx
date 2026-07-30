"use client";

import { cn } from "@/lib/utils";

function scoreColor(score) {
  if (score >= 80) return "var(--danger)";
  if (score >= 50) return "var(--warning)";
  return "var(--success)";
}

export default function RiskScoreGauge({ score = 0, size = 56, strokeWidth = 5, className, label }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = scoreColor(clamped);

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-heading">{clamped}</span>
        </div>
      </div>
      {label && (
        <div className="flex flex-col leading-tight">
          <span className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="text-xs font-semibold" style={{ color }}>
            {clamped >= 80 ? "Critical Risk" : clamped >= 50 ? "Elevated Risk" : "Low Risk"}
          </span>
        </div>
      )}
    </div>
  );
}
