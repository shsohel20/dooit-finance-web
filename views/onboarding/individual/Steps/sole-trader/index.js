import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";

const soleTraderOptions = [
  { label: "No", value: "no" },
  { label: "Yes", value: "yes" },
];

export default function SoleTrader({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const selection = form.watch("sole_trader_status");

  const handleContinue = () => {
    const isSole = selection?.value === "yes";
    form.setValue("is_sole_trader", isSole);
    if (!isSole) {
      form.setValue("business_name", "");
      form.setValue("trading_name", "");
      form.setValue("business_registration_number", "");
      form.setValue("nature_of_business", "");
      setStep(14);
      return;
    }
    setStep(13);
  };

  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>Are you operating as a sole trader?</Question>
        <QuestionDescription>
          A sole trader is an individual running a business in their own name (self-employed), not
          as a separate company.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <CustomSelect
          options={soleTraderOptions}
          value={selection}
          onChange={(value) => form.setValue("sole_trader_status", value)}
        />
        <Button onClick={handleContinue} disabled={!selection} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
