import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";

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
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>What is your main reason for opening this account?</Question>
        <QuestionDescription>
          This helps us offer the right services and meet compliance obligations.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <CustomSelect
          options={accountPurposeOptions}
          value={form.watch("account_purpose")}
          onChange={(value) => form.setValue("account_purpose", value)}
        />
        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
