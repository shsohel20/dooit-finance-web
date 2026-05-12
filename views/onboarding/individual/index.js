"use client";
import React, { useEffect, useState } from "react";
// import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import dynamic from "next/dynamic";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
const Country = dynamic(() => import("./Steps/country"), { ssr: false });
const VerificationProcess = dynamic(() => import("./Steps/verification-process"), { ssr: false });
const LivenessInstructions = dynamic(() => import("./Steps/liveness-instructions"), { ssr: false });
const FrontProfile = dynamic(() => import("./Steps/front-profile"), { ssr: false });
const RightProfile = dynamic(() => import("./Steps/right-profile"), { ssr: false });
const IdentificationDocuments = dynamic(
  () => import("@/views/company-registration/IdentificationDocuments"),
  { ssr: false },
);

export default function IndividualOnboarding() {
  const { step, setStep } = useCustomerRegisterStore();

  useEffect(() => {
    const step = localStorage.getItem("step");
    if (step) {
      setStep(Number(step));
    }
  }, []);
  return (
    <div className="grid place-items-center h-screen">
      <div className="max-w-xl md:w-full w-[90%] mx-auto grid place-items-center min-h-[50vh] justify-center border mt-10 rounded-lg px-2 md:px-6">
        <div className=" w-full ">
          {/* {step === 1 && <RegistrationType setStep={setStep} />} */}
          {step === 1 && <Country />}
          {step === 2 && <VerificationProcess />}
          {step === 3 && <LivenessInstructions />}
          {step === 4 && <FrontProfile />}
          {step === 5 && <RightProfile />}
          {step === 6 && <IdentificationDocuments />}
        </div>
      </div>
    </div>
  );
}
