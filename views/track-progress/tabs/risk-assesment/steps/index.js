"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import SectionStep from "./SectionStep";
import { useLoggedInUser } from "@/app/store/useLoggedInUser";
import { submitRiskAssessmentAnswers } from "@/views/track-progress/actions";

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
  const [currentStep, setCurrentStep] = useState(0);
  const loggedInUser = useLoggedInUser();
  const clientId = loggedInUser.loggedInUser?.client?._id;

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
    form.handleSubmit(async (data) => {
      console.log("answers", JSON.stringify(data, null, 2));
      const res = await submitRiskAssessmentAnswers(clientId, data);
      console.log("res", res);
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
          // className="bg-primary hover:bg-teal-80 text-white px-8 gap-1"
        >
          {isLast ? "Finish" : "Continue ›"}
        </Button>
      </div>
    </div>
  );
}
