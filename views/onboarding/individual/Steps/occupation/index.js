import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";

export default function Occupation({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("occupation", form.watch("occupation"));
    setStep(8);
  };
  return (
    <div className="min-w-full space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>What is your occupation?</Question>
        <QuestionDescription>
          We need to know your occupation to verify your identity.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <Input
          placeholder="Enter your occupation"
          value={form.watch("occupation")}
          onChange={(e) => form.setValue("occupation", e.target.value)}
        />
        <Button onClick={handleContinue} className="w-full mt-4">
          Continue
        </Button>
      </div>
    </div>
  );
}
