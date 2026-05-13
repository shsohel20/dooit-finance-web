import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";

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
  const { setStep } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("source_of_wealth", form.watch("source_of_wealth"));
    setStep(10);
  };
  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>What is your source of wealth?</Question>
        <QuestionDescription>
          We need to understand how your overall wealth was built to meet regulatory requirements.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <CustomSelect
          options={sourceOfWealthOptions}
          value={form.watch("source_of_wealth")}
          onChange={(value) => form.setValue("source_of_wealth", value)}
        />
        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
