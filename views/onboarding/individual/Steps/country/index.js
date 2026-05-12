"use client";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { countriesData } from "@/constants";
import Question from "@/views/onboarding/Question";
import React, { useState } from "react";

export default function Country() {
  const [country, setCountry] = useState(null);
  const {
    setRegisterType,
    setCountry: setCountryStore,
    step,
    setStep,
  } = useCustomerRegisterStore();

  const handleNext = () => {
    if (country) {
      setCountryStore(country?.value?.toLowerCase());
      setStep(2);
    }
  };
  return (
    <div className="space-y-4">
      <Question>Which country are you joining us from? 🌍</Question>
      <CustomSelect
        placeholder="Select Country"
        value={country}
        onChange={(data, e) => setCountry(data)}
        options={countriesData}
      />
      <Button disabled={!country} onClick={handleNext} className="w-full">
        Next
      </Button>
    </div>
  );
}
