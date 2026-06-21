"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

function StepCircle({ isCompleted, isActive }) {
  if (isCompleted) {
    return (
      <div className="size-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
        <Check className="size-4 text-white" strokeWidth={3} />
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="size-8 shrink-0 rounded-full bg-white border-2 border-primary flex items-center justify-center">
        <div className="size-2 rounded-full bg-primary" />
      </div>
    );
  }

  return <div className="size-8 shrink-0 rounded-full bg-white border-2 border-primary-gray" />;
}

export default function Stepper({ steps = [], currentStep = 1, onStepChange }) {
  return (
    <div className="w-full rounded-xl bg-gray-50 px-4 py-6">
      <div className="flex w-full ">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;
          const isClickable = Boolean(onStepChange) && isCompleted;

          return (
            <div key={step.key} className="flex flex-1 flex-col items-center relative ">
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-4 left-0 right-1/2 h-0.5 -translate-y-px transition-colors",
                    currentStep > index ? "bg-primary" : "bg-primary-gray",
                  )}
                />
              )}

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 right-0 h-0.5 -translate-y-px transition-colors",
                    currentStep > index + 1 ? "bg-primary" : "bg-primary-gray",
                  )}
                />
              )}

              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepChange(stepNumber)}
                className={cn(
                  "shrink-0 relative z-10",
                  isClickable ? "cursor-pointer" : "cursor-default",
                )}
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.label}${isCompleted ? ", completed" : isActive ? ", current" : ""}`}
              >
                <StepCircle isCompleted={isCompleted} isActive={isActive} />
              </button>

              <span
                className={cn(
                  "mt-3 text-sm text-center leading-tight px-1",
                  isCompleted || isActive ? "text-gray-800 font-medium" : "text-primary-gray",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
