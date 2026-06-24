import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import { onboardingPrimaryButtonClass } from "../../onboardingStyles";

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
    setStep(3);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Before you start</Question>
        <QuestionDescription preset="individual">
          Follow these tips so your liveness check goes smoothly.
        </QuestionDescription>
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-4">
          <ul className="list-disc space-y-2.5 pl-5">
            {requirements.map((req, i) => (
              <li key={i} className="text-sm leading-relaxed text-neutral-500">
                {req}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Button variant="onboarding" onClick={handleNext} className={onboardingPrimaryButtonClass}>
        Continue
      </Button>
    </div>
  );
}
