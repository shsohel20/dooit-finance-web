import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import {
  onboardingPrimaryButtonClass,
  onboardingSelectControlStyles,
} from "../../onboardingStyles";

const accountPurposeOptions = [
  { label: "Personal investment", value: "personal_investment" },
  { label: "Business transactions", value: "business_transactions" },
  { label: "International payments", value: "international_payments" },
  { label: "Savings", value: "savings" },
  { label: "Trading", value: "trading" },
  { label: "Other", value: "other" },
];

export default function ReasonForOpeningAccount({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("account_purpose", form.watch("account_purpose"));
    setStep(11);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Why are you opening this account?</Question>
        <QuestionDescription preset="individual">
          This helps us offer the right services and meet compliance obligations.
        </QuestionDescription>
        <CustomSelect
          options={accountPurposeOptions}
          value={form.watch("account_purpose")}
          onChange={(value) => form.setValue("account_purpose", value)}
          styles={onboardingSelectControlStyles()}
          className="!rounded-full"
        />
      </div>
      <Button onClick={handleContinue} className={onboardingPrimaryButtonClass}>
        Continue
      </Button>
    </div>
  );
}
