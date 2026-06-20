"use client";
import React from "react";
import { Check } from "lucide-react";

export default function MultiSelectField({ value, onChange, options = [] }) {
  const selected = Array.isArray(value) ? value : [];

  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter((v) => v !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm transition-colors ${
              isSelected
                ? "bg-primary border-primary text-white font-medium"
                : "bg-white border-gray-300 text-gray-700 hover:border-teal-500"
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}
