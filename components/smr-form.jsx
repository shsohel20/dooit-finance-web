"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { PartA } from "./smr-parts/part-a";
import { PartB } from "./smr-parts/part-b";
import { PartC } from "./smr-parts/part-c";
import { PartD } from "./smr-parts/part-d";
import { PartE } from "./smr-parts/part-e";
import { PartF } from "./smr-parts/part-f";
import { PartG } from "./smr-parts/part-g";
import { PartH } from "./smr-parts/part-h";
import { FormProgress } from "./form-progress";

const PARTS = [
  { id: "A", title: "Details of the matter", component: PartA },
  { id: "B", title: "Grounds for suspicion", component: PartB },
  { id: "C", title: "Details of the person/organisation", component: PartC },
  { id: "D", title: "Details of any other party", component: PartD },
  { id: "E", title: "Suspicious person(s) unidentified", component: PartE },
  { id: "F", title: "Transactions related to the matter", component: PartF },
  { id: "G", title: "Additional details", component: PartG },
  { id: "H", title: "Details of reporting entity", component: PartH },
];

export function SuspiciousMatterReportForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  const CurrentPartComponent = PARTS[currentStep].component;

  const handleNext = () => {
    if (currentStep < PARTS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSave = () => {
    setLastSaved(new Date());
    // In a real app, this would save to backend
    console.log("[v0] Form data saved:", formData);
  };

  const handleSubmit = () => {
    console.log("[v0] Form submitted:", formData);
    alert("Suspicious Matter Report submitted successfully!");
  };

  const updateFormData = (partData) => {
    setFormData((prev) => ({ ...prev, ...partData }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">
          Suspicious Matter Report
        </h1>
        <p className="text-muted-foreground">
          Complete as much of this form as possible as required under applicable
          law
        </p>
        {lastSaved && (
          <p className="text-sm text-muted-foreground mt-2">
            Last saved: {lastSaved.toLocaleString()}
          </p>
        )}
      </div>

      {/* Progress Indicator */}
      <FormProgress
        steps={PARTS}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      {/* Form Content */}
      <Card className="border-2 border-primary p-6 md:p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              {PARTS[currentStep].id}
            </div>
            <h2 className="text-2xl font-bold text-primary">
              PART {PARTS[currentStep].id} -{" "}
              {PARTS[currentStep].title.toUpperCase()}
            </h2>
          </div>
        </div>

        <CurrentPartComponent data={formData} updateData={updateFormData} />
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
          size="lg"
          className="border-2 border-primary bg-transparent"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleSave}
          variant="outline"
          size="lg"
          className="border-2 border-primary bg-transparent"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Progress
        </Button>

        {currentStep < PARTS.length - 1 ? (
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Submit Report
          </Button>
        )}
      </div>

      {/* Privacy Statement */}
      <Card className="border border-muted p-4 bg-muted/30">
        <h3 className="font-bold text-sm mb-2">Privacy Statement</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Information is being collected as required under applicable law.
          Information reported is made available to certain revenue, law
          enforcement, national security, regulatory and social justice bodies
          and may be disclosed to other Commonwealth and international bodies
          pursuant to relevant legislation.
        </p>
      </Card>
    </div>
  );
}
