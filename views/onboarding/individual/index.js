"use client";
import React, { useEffect } from "react";
// import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import dynamic from "next/dynamic";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { useForm } from "react-hook-form";
import Occupation from "./Steps/occupation";
import SourceOfFunds from "./Steps/source-of-funds";
import SourceOfWealth from "./Steps/source-of-wealth";
import ReasonForOpeningAccount from "./Steps/reason-for-opening-account";
import EstimatedTradingVolume from "./Steps/estimated-trading-volume";
import SoleTrader from "./Steps/sole-trader";
import SoleTraderDetails from "./Steps/sole-trader-details";
import OnboardingComplete from "./Steps/onboarding-complete";
import OnboardingChrome from "./OnboardingChrome";
const Country = dynamic(() => import("./Steps/country"), { ssr: false });
const VerificationProcess = dynamic(() => import("./Steps/verification-process"), { ssr: false });
const LivenessInstructions = dynamic(() => import("./Steps/liveness-instructions"), { ssr: false });
const FrontProfile = dynamic(() => import("./Steps/front-profile"), { ssr: false });
const RightProfile = dynamic(() => import("./Steps/right-profile"), { ssr: false });
const IdentificationDocuments = dynamic(
  () => import("@/views/customer-registration/common/IdentificationDocuments"),
  { ssr: false },
);
const OcrData = dynamic(() => import("./Steps/ocr-data"), { ssr: false });
export default function IndividualOnboarding() {
  const { step, setStep } = useCustomerRegisterStore();
  const form = useForm();

  useEffect(() => {
    const saved = localStorage.getItem("step");
    if (saved) {
      const n = Number(saved);
      if (n >= 1 && n <= 14) setStep(n);
    }
  }, [setStep]);

  const handleBack = () => {
    if (Number(step) <= 1) return;
    setStep(Number(step) - 1);
  };

  return (
    <div className="min-h-[100svh] bg-white text-neutral-900">
      <div className="mx-auto flex min-h-[100svh] w-full max-w-lg flex-col px-5 pb-10 pt-4">
        <OnboardingChrome onBack={handleBack} />
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex w-full flex-1 flex-col">
            {step === 1 && <Country form={form} />}
            {/* {step === 2 && <VerificationProcess />} */}
            {step === 2 && <LivenessInstructions />}
            {step === 3 && <FrontProfile />}
            {step === 4 && <RightProfile />}
            {step === 5 && <IdentificationDocuments form={form} individualPresentation />}
            {step === 6 && <OcrData form={form} />}
            {step === 7 && <Occupation form={form} />}
            {step === 8 && <SourceOfFunds form={form} />}
            {step === 9 && <SourceOfWealth form={form} />}
            {step === 10 && <ReasonForOpeningAccount form={form} />}
            {step === 11 && <EstimatedTradingVolume form={form} />}
            {step === 12 && <SoleTrader form={form} />}
            {step === 13 && <SoleTraderDetails form={form} />}
            {step === 14 && <OnboardingComplete form={form} />}
          </div>
        </div>
      </div>
    </div>
  );
}
