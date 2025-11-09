import React from "react";

const Stepper = ({ currentStep, totalSteps }) => {
  const percent = Math.round((currentStep / totalSteps) * 100);
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium ">
          Step {currentStep} of {totalSteps}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="w-full h-2 relative mt-2 bg-gray-200 rounded-md overflow-hidden">
        <div
          className="absolute top-0 left-0 bg-primary h-full rounded-md transition-[width] duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Stepper;
