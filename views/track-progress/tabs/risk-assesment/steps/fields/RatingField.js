"use client";
import React from "react";

export default function RatingField({ value, onChange, min = 1, max = 5, ratingLabels = [] }) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const selectedLabel = value != null ? ratingLabels[value] : null;

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        {steps.map((n) => {
          const filled = value != null && n <= value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(value === n ? null : n)}
              className={`w-9 h-9 rounded-full border text-sm font-semibold transition-colors ${
                filled
                  ? "bg-primary border-primary text-white"
                  : "bg-white border-gray-300 text-gray-400 hover:border-teal-500"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      <span className="text-xs text-muted-foreground h-4">{selectedLabel ?? ""}</span>
    </div>
  );
}
