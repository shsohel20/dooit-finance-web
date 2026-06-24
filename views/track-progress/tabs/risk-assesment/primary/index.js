"use client";
import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

function ProgressSidebar({ steps, currentStep }) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-border p-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Progress
      </p>
      <ul className="space-y-3">
        <li className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span className="text-sm text-foreground">Sector information</span>
        </li>

        {steps.map((step, index) => {
          const done = index < currentStep;
          const active = index === currentStep;
          return (
            <li key={step.key} className="flex items-center gap-2.5">
              {done ? (
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              ) : active ? (
                <div className="w-5 h-5 rounded-full border-2 border-teal-600 bg-teal-600 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
              <span
                className={
                  active
                    ? "text-sm font-semibold text-foreground"
                    : done
                      ? "text-sm text-foreground"
                      : "text-sm text-muted-foreground"
                }
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default function RiskAssessmentPrimary({
  steps,
  currentStep,
  onNext,
  onBack,
  renderStep,
}) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProgressSidebar steps={steps} currentStep={currentStep} />

      <main className="flex-1 p-8 max-w-4xl flex flex-col">
        <div className="flex-1">{renderStep()}</div>

        <div className="flex items-center gap-3 mt-8">
          {!isFirst && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={onNext}
          >
            {isLast ? "Finish" : "Next"}
          </Button>
        </div>
      </main>
    </div>
  );
}
