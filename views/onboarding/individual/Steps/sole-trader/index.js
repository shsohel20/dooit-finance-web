import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import {
  onboardingPrimaryButtonClass,
  onboardingSelectControlStyles,
} from "../../onboardingStyles";

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
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Are you operating as a sole trader?</Question>
        <QuestionDescription preset="individual">
          A sole trader is an individual running a business in their own name (self-employed), not
          as a separate company.
        </QuestionDescription>
        <CustomSelect
          options={soleTraderOptions}
          value={selection}
          onChange={(value) => form.setValue("sole_trader_status", value)}
          styles={onboardingSelectControlStyles()}
          className="!rounded-full"
        />
      </div>
      <Button onClick={handleContinue} disabled={!selection} className={onboardingPrimaryButtonClass}>
        Continue
      </Button>
    </div>
  );
}
