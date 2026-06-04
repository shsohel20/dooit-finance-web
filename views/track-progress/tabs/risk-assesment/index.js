"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PrimarySelection from "./primary";

const RiskAssessmentTab = () => {
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
  };
  return (
    <div>
      {started ? (
        <PrimarySelection />
      ) : (
        <div className="h-[50vh] grid place-items-center">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2">Start Your Risk Assessment</h1>
            <p className="text-gray-600 mb-6">
              Evaluate and manage risks associated with your financial activities.
            </p>
            <Button onClick={handleStart}>Let&apos;s Begin</Button>
          </div>
        </div>
      )}
      {/* Risk assessment content goes here */}
    </div>
  );
};

export default RiskAssessmentTab;
