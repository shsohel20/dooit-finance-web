"use client";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { countries } from "@/lib/country";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import React, { useState } from "react";

export default function Country({ form }) {
  const [country, setCountry] = useState(null);
  const {
    setRegisterType,
    setCountry: setCountryStore,
    step,
    setStep,
  } = useCustomerRegisterStore();

  const handleNext = () => {
    if (country) {
      form.setValue("country", country);
      setCountryStore(country?.value?.toLowerCase());
      setStep(2);
    }
  };
  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <Question>Which country are you joining us from? 🌍</Question>
        <QuestionDescription>
          We need to know your country of residence to verify your identity and comply with
          anti-money laundering regulations.
        </QuestionDescription>
        <CustomSelect
          placeholder="Select Country"
          value={form.watch("country")}
          onChange={(data, e) => setCountry(data)}
          options={countries}
        />
      </div>
      <Button disabled={!country} onClick={handleNext} className="w-full">
        Next
      </Button>
    </div>
  );
}
