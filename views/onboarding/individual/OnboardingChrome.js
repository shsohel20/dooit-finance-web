"use client";

import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { ONBOARDING_GREEN, onboardingBackButtonClass } from "./onboardingStyles";
import { Button } from "@/components/ui/button";

const SEGMENTS = 14;

export default function OnboardingChrome({ onBack, showBack = true }) {
  const { step } = useCustomerRegisterStore();
  const phase = step;

  return (
    <header className="shrink-0 pt-2 pb-6">
      <div className="flex h-12 items-center justify-between gap-3">
        {showBack && Number(step) > 1 ? (
          <Button
            type="button"
            onClick={onBack}
            // className={''}
            size="sm"
            variant="outline"
            // className="gap-2 bg-transparent"
            aria-label="Go back to previous step"
          >
            <ChevronLeft className="size-5 shrink-0" strokeWidth={2.5} />
            Back
          </Button>
        ) : (
          <div className="h-11" aria-hidden />
        )}
        {Number(step) > 1 && (
          <span className="text-sm font-medium tabular-nums text-neutral-400">
            Step {step} of {SEGMENTS}
          </span>
        )}
      </div>
      <div
        className="mt-1 flex gap-1.5"
        role="progressbar"
        aria-valuenow={phase}
        aria-valuemin={1}
        aria-valuemax={SEGMENTS}
      >
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const index = i + 1;
          const filled = index <= phase;
          return (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-colors duration-300"
              style={{
                backgroundColor: filled ? ONBOARDING_GREEN : "#e5e5e5",
              }}
            />
          );
        })}
      </div>
    </header>
  );
}
