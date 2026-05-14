"use client";

import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { getOnboardingPhase } from "./onboardingPhase";
import { ONBOARDING_GREEN } from "./onboardingStyles";

const SEGMENTS = 14;

export default function OnboardingChrome({ onBack, showBack = true }) {
  const { step } = useCustomerRegisterStore();
  const phase = step;

  return (
    <header className="shrink-0 pt-2 pb-6">
      <div className="flex h-10 items-center">
        {/* {showBack && Number(step) > 1 ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex size-10 items-center justify-center rounded-full text-neutral-800 transition-colors hover:bg-neutral-100"
            aria-label="Go back"
          >
            <ChevronLeft className="size-6" strokeWidth={2} />
          </button>
        ) : (
          <div className="size-10" aria-hidden />
        )} */}
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
