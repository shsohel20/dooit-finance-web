"use client";
import React from "react";

export default function RatingField({
  value,
  onChange,
  min = 1,
  max = 5,
  ratingLabels = [],
}) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const selectedLabel = value != null ? ratingLabels[value] : null;

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex gap-2">
        {steps.map((n) => {
          const active = value === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(active ? null : n)}
              className={`w-10 h-10 rounded-full border text-sm font-semibold transition-colors ${
                active
                  ? "bg-teal-700 border-teal-700 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-teal-500"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
      {selectedLabel && (
        <span className="text-sm text-muted-foreground">{selectedLabel}</span>
      )}
    </div>
  );
}
