import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";

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
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>What is your source of funds?</Question>
        <QuestionDescription>
          We need to know your source of funds to verify your identity.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <CustomSelect
          options={sourceOfFundsOptions}
          value={form.watch("source_of_funds")}
          onChange={(value) => form.setValue("source_of_funds", value)}
        />
        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
