"use client";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import { Camera, File } from "lucide-react";
import React from "react";
import { onboardingPrimaryButtonClass } from "../../onboardingStyles";

export default function VerificationProcess() {
  const { setStep } = useCustomerRegisterStore();
  const verificationSteps = [
    {
      title: "Liveness Check",
      description: "Verify your identity by taking a selfie",
      icon: <Camera className="size-5 text-[#1B4332]" />,
    },
    {
      title: "Document Verification",
      description: "Verify your identity by uploading your documents",
      icon: <File className="size-5 text-[#1B4332]" />,
    },
  ];

  const handleNext = () => {
    setStep(3);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Ready to get verified?</Question>
        <QuestionDescription preset="individual">
          You&apos;re almost there. Follow these steps to complete verification.
        </QuestionDescription>
        <div className="grid gap-3 pt-2">
          {verificationSteps.map((item, index) => (
            <div key={item.title} className="flex items-center gap-3">
              <div>
                <span className="text-2xl font-bold">{index + 1}</span>
              </div>
              <div className="flex items-center gap-3 rounded-full   px-4 py-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
                  {item.icon}
                </span>
                <div className="min-w-0 text-left">
                  <h5 className="text-sm font-semibold text-neutral-900">{item.title}</h5>
                  <p className="text-xs leading-snug text-neutral-500">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handleNext} className={onboardingPrimaryButtonClass}>
        Continue
      </Button>
    </div>
  );
}
