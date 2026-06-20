"use client";
import React from "react";
import { Check } from "lucide-react";

export default function StepIndicator({ totalSteps, currentStep }) {
  return (
    <div className="flex items-center w-full">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const done = index < currentStep;
        const active = index === currentStep;
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <div
                className={`flex-1 h-px mx-1 ${done ? "bg-teal-600" : "bg-gray-200"}`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors ${
                done
                  ? "bg-teal-600 text-white"
                  : active
                    ? "bg-teal-700 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
              }`}
            >
              {done ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
