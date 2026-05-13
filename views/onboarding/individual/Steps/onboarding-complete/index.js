"use client";

import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import { useRouter } from "next/navigation";
import React from "react";

function selectValue(field) {
  if (field == null) return "";
  if (typeof field === "object" && "value" in field) return field.value;
  return field;
}

export default function OnboardingComplete({ form }) {
  const router = useRouter();
  const { customerRegisterData, setCustomerRegisterData } = useCustomerRegisterStore();

  const handleContinue = () => {
    const v = form.getValues();
    setCustomerRegisterData({
      ...customerRegisterData,
      funds_wealth: {
        ...(customerRegisterData.funds_wealth || {}),
        source_of_funds: selectValue(v.source_of_funds),
        source_of_wealth: selectValue(v.source_of_wealth),
        account_purpose: selectValue(v.account_purpose),
        estimated_trading_volume: selectValue(v.estimated_trading_volume),
      },
      employment_details: {
        ...(customerRegisterData.employment_details || {}),
        occupation: v.occupation ?? customerRegisterData.employment_details?.occupation ?? "",
      },
      sole_trader: {
        is_sole_trader: Boolean(v.is_sole_trader),
        business_details: {
          ...(customerRegisterData.sole_trader?.business_details || {}),
          business_name: v.business_name ?? "",
          trading_name: v.trading_name ?? "",
          business_registration_number: v.business_registration_number ?? "",
          nature_of_business: v.nature_of_business ?? "",
        },
      },
    });
    // router.push("/customer/registration/individual");
  };

  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div>
        <Question>You&apos;re all set for this section</Question>
        <QuestionDescription>
          Thank you. Continue to complete your registration details and review your application.
        </QuestionDescription>
      </div>
      <div className="space-y-4">
        <Button onClick={handleContinue} className="w-full">
          Continue to registration
        </Button>
      </div>
    </div>
  );
}
