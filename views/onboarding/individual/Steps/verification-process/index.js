"use client";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import Question from "@/views/onboarding/Question";
import { Camera, File } from "lucide-react";
import React from "react";

export default function VerificationProcess() {
  const { setStep } = useCustomerRegisterStore();
  const verificationSteps = [
    {
      title: "Liveness Check",
      description: "Verify your identity by taking a selfie",
      icon: <Camera />,
    },
    {
      title: "Document Verification",
      description: "Verify your identity by uploading your documents",
      icon: <File />,
    },
  ];

  const handleNext = () => {
    setStep(3);
  };
  return (
    <div>
      <Question>Ready to get verified?</Question>
      <p className="text-sm text-gray-500 text-center">
        You&apos;re almost there! Just follow these steps to get verified.
      </p>
      <div className="grid  gap-2 pt-8">
        {verificationSteps.map((step) => (
          <div key={step.title}>
            <div className="flex items-center gap-2 border p-4 rounded-lg">
              <span className="text-2xl">{step.icon}</span>
              <div>
                <h5 className=" font-semibold">{step.title}</h5>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleNext} className="w-full mt-4">
        Yeah! Let&apos;s do this
      </Button>
    </div>
  );
}
