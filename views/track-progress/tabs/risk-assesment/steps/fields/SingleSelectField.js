"use client";
import React from "react";

export default function SingleSelectField({ value, onChange, options = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(selected ? "" : option)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              selected
                ? "bg-teal-700 border-teal-700 text-white font-medium"
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
