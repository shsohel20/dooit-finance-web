"use client";
import React, { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ClientTypesStep from "./client-types";
import DeliveryChannelsStep from "./delivery-channels";
import DesignatedServicesStep from "./designated-services";

const STEPS = [
  { key: "client_types", label: "Client Types", component: <ClientTypesStep /> },
  { key: "delivery_channels", label: "Delivery channels", component: <DeliveryChannelsStep /> },
  { key: "designated_services", label: "Designated services risk factors", component: <DesignatedServicesStep /> },
  { key: "client_risk", label: "Client risk factors", component: null },
  { key: "delivery_risk", label: "Delivery channel risk factors", component: null },
  { key: "country", label: "Country", component: null },
];

function ProgressSidebar({ currentStep }) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-border p-6">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        Progress
      </p>
      <ul className="space-y-3">
        {/* Sector information is always completed before this wizard */}
        <li className="flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
          <span className="text-sm text-foreground">Sector information</span>
        </li>

        {STEPS.map((step, index) => {
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

export default function RiskAssessmentPrimary() {
  const [currentStep, setCurrentStep] = useState(0);

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProgressSidebar currentStep={currentStep} />

      <main className="flex-1 p-8 max-w-4xl flex flex-col">
        <div className="flex-1">
          {STEPS[currentStep].component ?? (
            <p className="text-muted-foreground text-sm">Coming soon…</p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-8">
          {!isFirst && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              Back
            </Button>
          )}
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={() => !isLast && setCurrentStep((s) => s + 1)}
          >
            {isLast ? "Finish" : "Next"}
          </Button>
        </div>
      </main>
    </div>
  );
}
