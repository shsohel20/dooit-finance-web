"use client";

import { customerOnboarding } from "@/app/customer/registration/actions";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { onboardingPrimaryButtonClass } from "../../onboardingStyles";

function selectValue(field) {
  if (field == null) return "";
  if (typeof field === "object" && "value" in field) return field.value;
  return field;
}

export default function OnboardingComplete({ form }) {
  const router = useRouter();
  const { customerRegisterData, setCustomerRegisterData } = useCustomerRegisterStore();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("invite_token");
  const cid = localStorage.getItem("invite_cid");
  const handleContinue = async () => {
    setLoading(true);
    const v = form.getValues();
    const payload = {
      token,
      cid,
      requestedType: "individual",
      country: v.country?.value,
      ...v.customer_details,
      personalKyc: {
        personal_form: {
          customer_details: v.customer_details,
          employment_details: {
            ...(customerRegisterData.employment_details || {}),
            occupation: v.occupation ?? customerRegisterData.employment_details?.occupation ?? "",
          },
          residential_address: {
            ...(customerRegisterData.residential_address || {}),
            address: v.address ?? customerRegisterData.residential_address?.address ?? "",
            country: v.country?.value,
          },
          mailing_address: {
            ...(customerRegisterData.mailing_address || {}),
            address: v.mailing_address ?? customerRegisterData.mailing_address?.address ?? "",
            country: v.country?.value,
          },
        },
        funds_wealth: {
          ...(customerRegisterData.funds_wealth || {}),
          source_of_funds: selectValue(v.source_of_funds),
          source_of_wealth: selectValue(v.source_of_wealth),
          account_purpose: selectValue(v.account_purpose),
          estimated_trading_volume: selectValue(v.estimated_trading_volume),
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
      },

      documents: v.documents,
      declaration: customerRegisterData.declaration,
    };
    console.log("payload", JSON.stringify(payload, null, 2));
    const response = await customerOnboarding(payload);
    setLoading(false);
    console.log("response", response);
    if (response.success) {
      router.push("/customer/dashboard");
      localStorage.removeItem("invite_token");
      localStorage.removeItem("invite_cid");
      toast.success("We hope you enjoy your journey with us!");
      localStorage.removeItem("live_photo");
      localStorage.removeItem("liveness_verdict");
    } else {
      toast.error("Failed to save your application");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">You&apos;re all set</Question>
        <QuestionDescription preset="individual">
          Continue to save your application and head to your dashboard when you are ready.
        </QuestionDescription>
      </div>
      <Button disabled={loading} onClick={handleContinue} className={onboardingPrimaryButtonClass}>
        {loading ? "Saving..." : "Save and continue"}
      </Button>
    </div>
  );
}
