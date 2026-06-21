"use client";
import React, { useState } from "react";
import CompanyProgress from "./company-info";
import Stepper from "./tabs/stepper";
import RiskAssessmentTab from "./tabs/risk-assesment";
import TrainingTab from "./tabs/training";
import TemplatesList from "../knowledge-hub/policy-hub/list/TemplatesList";
import PolicyStep from "./tabs/policy";
import StaffOnboardingTab from "./tabs/staff-onboarding";

export default function TrackProgress() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      key: "stuffs_add",
      label: "Team Setup",
      component: <CompanyProgress setCurrentStep={setCurrentStep} />,
    },
    {
      key: "risk_assessment",
      label: "Risk Assessment",
      component: <RiskAssessmentTab setCurrentStep={setCurrentStep} />,
    },
    {
      key: "policy_review",
      label: "Policy Review",
      component: <PolicyStep setCurrentStep={setCurrentStep} />,
    },
    {
      key: "training",
      label: "Training",
      component: <TrainingTab setCurrentStep={setCurrentStep} />,
    },
    {
      key: "staff_onboarding",
      label: "Staff Onboarding",
      component: <StaffOnboardingTab setCurrentStep={setCurrentStep} />,
    },
  ];

  const activeStep = steps[currentStep - 1];
  console.log("currentStep", currentStep);
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Stepper steps={steps} currentStep={currentStep} onStepChange={setCurrentStep} />
      {activeStep?.component}
    </div>
  );
}
