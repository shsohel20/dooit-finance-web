import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React from "react";

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
    <div className="min-w-full space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>Tell us about your sole trader business</Question>
        <QuestionDescription>
          We need a few details about your business for verification and compliance.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <Input
          placeholder="Registered / legal business name"
          value={form.watch("business_name") ?? ""}
          onChange={(e) => form.setValue("business_name", e.target.value)}
        />
        <Input
          placeholder="Trading name (if different, optional)"
          value={form.watch("trading_name") ?? ""}
          onChange={(e) => form.setValue("trading_name", e.target.value)}
        />
        <Input
          placeholder="Business / tax registration number (if applicable)"
          value={form.watch("business_registration_number") ?? ""}
          onChange={(e) => form.setValue("business_registration_number", e.target.value)}
        />
        <Input
          placeholder="Nature of business (e.g. consulting, retail)"
          value={form.watch("nature_of_business") ?? ""}
          onChange={(e) => form.setValue("nature_of_business", e.target.value)}
        />
        <Button
          onClick={handleContinue}
          disabled={!businessName?.trim() || !nature?.trim()}
          className="w-full mt-4"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
