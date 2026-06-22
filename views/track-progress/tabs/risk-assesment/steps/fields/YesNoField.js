"use client";
import React from "react";

export default function YesNoField({ value, onChange, options = ["Yes", "No"] }) {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(selected ? "" : option)}
            className={`px-6 py-2 rounded-full border text-sm transition-colors ${
              selected
                ? "bg-primary border-primary text-white font-medium"
                : "bg-white border-gray-300 text-gray-700 hover:border-teal-500"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
