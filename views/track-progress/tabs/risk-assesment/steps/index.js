"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import SectionStep from "./SectionStep";

function isSectionValid(section, formValues) {
  return (section?.fields ?? [])
    .filter((f) => f.required)
    .every((f) => {
      const val = formValues[f.key];
      if (val == null || val === "") return false;
      if (Array.isArray(val)) return val.length > 0;
      return true;
    });
}

export default function RiskAssessmentSteps({ questions, form }) {
  console.log("questions", questions);
  const [currentStep, setCurrentStep] = useState(0);

  const sections = Array.isArray(questions) ? questions : (questions?.sections ?? []);

  if (!sections.length) return null;

  const totalSteps = sections.length;
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;

  const formValues = form.watch();
  const canProceed = isSectionValid(sections[currentStep], formValues);

  const goNext = () => {
    if (!isLast) setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
  };

  const handleFinish = () => {
    form.handleSubmit((data) => {
      console.log("Form submitted with data:", data);
      // TODO: dispatch submit action with form.getValues()
    })();
  };

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator totalSteps={totalSteps} currentStep={currentStep} />

      <SectionStep section={sections[currentStep]} form={form} />

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={isFirst} className="text-gray-600 gap-1">
          ‹ Back
        </Button>
        <Button
          onClick={isLast ? handleFinish : goNext}
          disabled={!canProceed}
          className="bg-teal-700 hover:bg-teal-800 text-white px-8 gap-1"
        >
          {isLast ? "Finish" : "Continue ›"}
        </Button>
      </div>
    </div>
  );
}
