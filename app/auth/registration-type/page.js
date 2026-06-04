"use client";

import React from "react";
import dynamic from "next/dynamic";

const RegistrationType = dynamic(() => import("@/views/onboarding/reg-type"), { ssr: false });

const RegistrationTypePage = () => {
  return <RegistrationType />;
};

export default RegistrationTypePage;
