"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormProgress({ steps, currentStep, onStepClick }) {
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="flex items-center justify-between min-w-max px-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <button
              onClick={() => onStepClick(index)}
              className={cn(
                "flex flex-col items-center gap-2 transition-all group",
                index <= currentStep
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              )}
              disabled={index > currentStep}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all",
                  index < currentStep &&
                    "bg-primary border-primary text-primary-foreground",
                  index === currentStep &&
                    "bg-accent border-accent text-accent-foreground scale-110",
                  index > currentStep &&
                    "bg-background border-muted text-muted-foreground"
                )}
              >
                {index < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium text-center max-w-[100px]",
                  index === currentStep && "text-primary font-bold",
                  index < currentStep && "text-primary",
                  index > currentStep && "text-muted-foreground"
                )}
              >
                Part {step.id}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mx-2 transition-all",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
