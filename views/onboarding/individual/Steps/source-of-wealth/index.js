import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import {
  onboardingPrimaryButtonClass,
  onboardingSelectControlStyles,
} from "../../onboardingStyles";

const sourceOfWealthOptions = [
  { label: "Employment income", value: "employment_income" },
  { label: "Business profits", value: "business_profits" },
  { label: "Investments", value: "investments" },
  { label: "Property or real estate", value: "property_real_estate" },
  { label: "Inheritance or gift", value: "inheritance_gift" },
  { label: "Savings", value: "savings" },
  { label: "Other", value: "other" },
];

export default function SourceOfWealth({ form }) {
  const { setStep, step } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("source_of_wealth", form.watch("source_of_wealth"));
    setStep(Number(step) + 1);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">What is your source of wealth?</Question>
        <QuestionDescription preset="individual">
          We need to understand how your overall wealth was built to meet regulatory requirements.
        </QuestionDescription>
        <CustomSelect
          options={sourceOfWealthOptions}
          value={form.watch("source_of_wealth")}
          onChange={(value) => form.setValue("source_of_wealth", value)}
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
