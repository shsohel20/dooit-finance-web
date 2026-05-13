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
const Country = dynamic(() => import("./Steps/country"), { ssr: false });
const VerificationProcess = dynamic(() => import("./Steps/verification-process"), { ssr: false });
const LivenessInstructions = dynamic(() => import("./Steps/liveness-instructions"), { ssr: false });
const FrontProfile = dynamic(() => import("./Steps/front-profile"), { ssr: false });
const RightProfile = dynamic(() => import("./Steps/right-profile"), { ssr: false });
const IdentificationDocuments = dynamic(
  () => import("@/views/customer-registration/common/IdentificationDocuments"),
  { ssr: false },
);

export default function IndividualOnboarding() {
  const { step, setStep } = useCustomerRegisterStore();
  // const [isSuccess, setIsSuccess] = useState(false);
  const form = useForm();

  useEffect(() => {
    const step = localStorage.getItem("step");
    if (step) {
      setStep(Number(step));
    }
  }, []);
  return (
    <div className="grid place-items-center h-[100svh] justify-center items-center w-full relative">
      <div className="max-w-xl md:w-full w-[90%] mx-auto grid place-items-center md:min-h-[50vh] justify-center md:border border-0 mt-10 rounded-lg px-0 md:px-6 min-h-[90svh]">
        <div className=" w-full py-12   h-full">
          {/* {step === 1 && <RegistrationType setStep={setStep} />} */}
          {step === 1 && <Country form={form} />}
          {step === 2 && <VerificationProcess />}
          {step === 3 && <LivenessInstructions />}
          {step === 4 && <FrontProfile />}
          {step === 5 && <RightProfile />}
          {step === 6 && <IdentificationDocuments form={form} />}
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
  );
}
