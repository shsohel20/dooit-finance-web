"use client";
import React, { useState } from "react";
import CompanyProgress from "./company-info";
import Stepper from "@/components/ui/Stepper";
import RiskAssessmentTab from "./tabs/risk-assesment";
import TrainingTab from "./tabs/training";

const totalSteps = 3;
export default function TrackProgress() {
  const [initalized, setInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const handleStep = (step) => {
    setCurrentStep(step);
  };
  return (
    <div className="max-w-3xl mx-auto">
      {/* {initalized ? <ProgressTab /> : <CompanyProgress setInitialized={setInitialized} />} */}

      <Stepper currentStep={currentStep} totalSteps={totalSteps} handleStep={handleStep} />
      {currentStep === 1 && <CompanyProgress setCurrentStep={setCurrentStep} />}
      {currentStep === 2 && <RiskAssessmentTab setCurrentStep={setCurrentStep} />}
      {currentStep === 3 && <TrainingTab setCurrentStep={setCurrentStep} />}
    </div>
  );
}
