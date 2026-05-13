import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";

const tradingVolumeOptions = [
  { label: "Under $10,000 per year", value: "under_10k" },
  { label: "$10,000 – $50,000 per year", value: "10k_to_50k" },
  { label: "$50,000 – $250,000 per year", value: "50k_to_250k" },
  { label: "$250,000 – $1,000,000 per year", value: "250k_to_1m" },
  { label: "Over $1,000,000 per year", value: "over_1m" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
];

export default function EstimatedTradingVolume({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("estimated_trading_volume", form.watch("estimated_trading_volume"));
    setStep(12);
  };
  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>What is your estimated annual trading volume?</Question>
        <QuestionDescription>
          An approximate range is fine. We use this for risk assessment only.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <CustomSelect
          options={tradingVolumeOptions}
          value={form.watch("estimated_trading_volume")}
          onChange={(value) => form.setValue("estimated_trading_volume", value)}
        />
        <Button onClick={handleContinue} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
}
