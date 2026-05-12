import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import Question from "@/views/onboarding/Question";
import React from "react";
const requirements = [
  "Sit in a bright area with a clean background.",
  "Hold your phone straight at eye level.",
  "Make sure your entire face is visible (remove hats, masks, or glasses).",
  "Keep your face centered inside the frame shown.",
  "When the first 3-second countdown begins, look directly at the camera and remain still.",
  "When the second 3-second countdown starts, slowly turn your head to the right and hold that position.",
];
export default function LivenessInstructions() {
  const { setStep } = useCustomerRegisterStore();
  const handleNext = () => {
    setStep(4);
  };
  return (
    <div>
      <Question>Quick check before you start</Question>
      {/* <p className="text-sm text-gray-500 text-center">
        Please ensure your face is clearly visible and well-lit.
      </p> */}
      <div className=" rounded-lg mt-4">
        <ul className="space-y-2 list-disc pl-5">
          {requirements.map((req, i) => (
            <li key={i} className="text-sm text-gray-500">
              {req}
            </li>
          ))}
        </ul>
      </div>
      <Button onClick={handleNext} className="w-full mt-6">
        Okay, got it!
      </Button>
    </div>
  );
}
