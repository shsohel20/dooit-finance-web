"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import SectionStep from "./SectionStep";
import { useLoggedInUser } from "@/app/store/useLoggedInUser";
import { submitRiskAssessmentAnswers } from "@/views/track-progress/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAllEntityTypes } from "@/app/dashboard/actions";

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

export default function RiskAssessmentSteps({ questions, form, setTrackingStep }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const loggedInUser = useLoggedInUser();
  const [entityTypes, setEntityTypes] = useState(null);

  const clientId = loggedInUser.loggedInUser?.client?._id;

  const sections = Array.isArray(questions) ? questions : (questions?.sections ?? []);
  useEffect(() => {
    const fetchEntityType = async () => {
      const res = await getAllEntityTypes();
      setEntityTypes(res.data);
    };
    fetchEntityType();
  }, []);

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

  const handleFinish = async (data) => {
    setIsSubmitting(true);
    const res = await submitRiskAssessmentAnswers(clientId, data);
    if (res.success) {
      toast.success("Risk assessment completed!");
      setTrackingStep((prev) => {
        return prev + 1;
      });
    } else {
      toast.error(res?.error || "Failed to submit risk assessment answers");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <StepIndicator totalSteps={totalSteps} currentStep={currentStep} />

      <SectionStep section={sections[currentStep]} form={form} entityTypes={entityTypes} />

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={goBack} disabled={isFirst} className="text-gray-600 gap-1">
          ‹ Back
        </Button>
        <Button
          onClick={isLast ? form.handleSubmit(handleFinish) : goNext}
          disabled={!canProceed || isSubmitting}
          // className="bg-primary hover:bg-teal-80 text-white px-8 gap-1"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isLast ? (
            "Finish"
          ) : (
            "Continue ›"
          )}
        </Button>
      </div>
    </div>
  );
}
