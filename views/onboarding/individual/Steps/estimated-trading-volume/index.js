import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import {
  onboardingPrimaryButtonClass,
  onboardingSelectControlStyles,
} from "../../onboardingStyles";
import { customerOnboardingStepTracking } from "@/app/customer/onboarding/action";

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
  const handleContinue = async () => {
    const payload = {
      token: localStorage.getItem("invite_token"),
      step: "funds_wealth",
      status: "in_progress",
      data: {
        estimated_trading_volume: form.watch("estimated_trading_volume"),
      },
      note: "",
      rejectionReason: "",
      provider: "internal",
      providerRef: null,
    };
    const response = await customerOnboardingStepTracking(payload);
    console.log("response", response);
    form.setValue("estimated_trading_volume", form.watch("estimated_trading_volume"));
    setStep(12);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">What is your estimated annual trading volume?</Question>
        <QuestionDescription preset="individual">
          An approximate range is fine. We use this for risk assessment only.
        </QuestionDescription>
        <CustomSelect
          options={tradingVolumeOptions}
          value={form.watch("estimated_trading_volume")}
          onChange={(value) => form.setValue("estimated_trading_volume", value)}
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
