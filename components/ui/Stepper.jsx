import { cn } from "@/lib/utils";
import React from "react";

const Stepper = ({ currentStep, totalSteps, handleStep }) => {
  const percent = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium ">
          Step {currentStep} of {totalSteps}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-2 relative mt-2 bg-gray-200 rounded-md overflow-hidden flex gap-2">
        {/* <div
          className="absolute top-0 left-0 bg-primary h-full rounded-md transition-[width] duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        /> */}
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            onClick={() => handleStep(index + 1)}
            className={cn(
              "border h-full cursor-pointer rounded-md transition-[width] duration-300 w-full ",
              {
                "bg-primary ": index + 1 <= currentStep,
              }
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Stepper;
