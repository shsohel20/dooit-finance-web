import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import { onboardingInputClass, onboardingPrimaryButtonClass } from "../../onboardingStyles";

export default function Occupation({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("occupation", form.watch("occupation"));
    setStep(8);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">What is your occupation?</Question>
        <QuestionDescription preset="individual">
          We need to know your occupation to verify your identity.
        </QuestionDescription>
        <Input
          className={onboardingInputClass}
          placeholder="Enter your occupation"
          value={form.watch("occupation")}
          onChange={(e) => form.setValue("occupation", e.target.value)}
        />
      </div>
      <Button
        variant="onboarding"
        onClick={handleContinue}
        className={onboardingPrimaryButtonClass}
      >
        Continue
      </Button>
    </div>
  );
}
