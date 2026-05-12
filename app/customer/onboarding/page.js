"use client";
import IndividualOnboarding from "@/views/onboarding/individual";
import React from "react";
import { useSearchParams } from "next/navigation";

const IndividualOnboardingPage = () => {
  const type = useSearchParams().get("type");
  if (type === "individual") {
    return <IndividualOnboarding />;
  }
  return <div></div>;
};

export default IndividualOnboardingPage;
