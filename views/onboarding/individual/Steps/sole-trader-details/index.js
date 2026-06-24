import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";
import { onboardingInputClass, onboardingPrimaryButtonClass } from "../../onboardingStyles";

export default function SoleTraderDetails({ form }) {
  const { setStep } = useCustomerRegisterStore();
  const handleContinue = () => {
    form.setValue("business_name", form.watch("business_name"));
    form.setValue("trading_name", form.watch("trading_name"));
    form.setValue("business_registration_number", form.watch("business_registration_number"));
    form.setValue("nature_of_business", form.watch("nature_of_business"));
    setStep(14);
  };

  const businessName = form.watch("business_name");
  const nature = form.watch("nature_of_business");

  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Your sole trader business</Question>
        <QuestionDescription preset="individual">
          We need a few details about your business for verification and compliance.
        </QuestionDescription>
        <div className="space-y-3">
          <Input
            className={onboardingInputClass}
            placeholder="Registered / legal business name"
            value={form.watch("business_name") ?? ""}
            onChange={(e) => form.setValue("business_name", e.target.value)}
          />
          <Input
            className={onboardingInputClass}
            placeholder="Trading name (if different, optional)"
            value={form.watch("trading_name") ?? ""}
            onChange={(e) => form.setValue("trading_name", e.target.value)}
          />
          <Input
            className={onboardingInputClass}
            placeholder="Business / tax registration number (if applicable)"
            value={form.watch("business_registration_number") ?? ""}
            onChange={(e) => form.setValue("business_registration_number", e.target.value)}
          />
          <Input
            className={onboardingInputClass}
            placeholder="Nature of business (e.g. consulting, retail)"
            value={form.watch("nature_of_business") ?? ""}
            onChange={(e) => form.setValue("nature_of_business", e.target.value)}
          />
        </div>
      </div>
      <Button
        variant="onboarding"
        onClick={handleContinue}
        disabled={!businessName?.trim() || !nature?.trim()}
        className={onboardingPrimaryButtonClass}
      >
        Continue
      </Button>
    </div>
  );
}
