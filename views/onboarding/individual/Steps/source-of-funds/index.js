import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import {
  onboardingPrimaryButtonClass,
  onboardingSelectControlStyles,
} from "../../onboardingStyles";

const sourceOfFundsOptions = [
  { label: "Employment", value: "employment" },
  { label: "Business", value: "business" },
  { label: "Investment", value: "investment" },
  { label: "Other", value: "other" },
];

export default function SourceOfFunds({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("source_of_funds", form.watch("source_of_funds"));
    setStep(9);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">What is your source of funds?</Question>
        <QuestionDescription preset="individual">
          We need to know your source of funds to verify your identity.
        </QuestionDescription>
        <CustomSelect
          options={sourceOfFundsOptions}
          value={form.watch("source_of_funds")}
          onChange={(value) => form.setValue("source_of_funds", value)}
          styles={onboardingSelectControlStyles()}
          className="!rounded-full"
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
