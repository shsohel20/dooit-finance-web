"use client";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { countries } from "@/lib/country";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React, { useState } from "react";
import {
  onboardingPrimaryButtonClass,
  onboardingSelectControlStyles,
} from "../../onboardingStyles";

export default function Country({ form }) {
  const [country, setCountry] = useState(null);
  const { setCountry: setCountryStore, setStep } = useCustomerRegisterStore();

  const handleNext = () => {
    if (country) {
      form.setValue("country", country);
      setCountryStore(country?.value?.toLowerCase());
      setStep(2);
    }
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">Which country are you joining us from?</Question>
        <QuestionDescription preset="individual">
          We need to know your country of residence to verify your identity and comply with
          anti-money laundering regulations.
        </QuestionDescription>
        <CustomSelect
          placeholder="Select Country"
          value={form.watch("country")}
          onChange={(data) => setCountry(data)}
          options={countries}
          styles={onboardingSelectControlStyles()}
          className="!rounded-full"
        />
      </div>
      <Button
        variant="onboarding"
        disabled={!country}
        onClick={handleNext}
        className={onboardingPrimaryButtonClass}
      >
        Continue
      </Button>
    </div>
  );
}
