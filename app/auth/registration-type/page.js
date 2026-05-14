"use client";
import { Button } from "@/components/ui/button";

import { countriesData } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getLoggedInCustomer, getLoggedInUser } from "../actions";
import dynamic from "next/dynamic";

const RegistrationType = dynamic(() => import("@/views/onboarding/reg-type"), { ssr: false });
const CustomSelect = dynamic(() => import("@/components/ui/CustomSelect"), { ssr: false });

const RegistrationTypePage = () => {
  // const [selectedType, setSelectedType] = useState(null);
  // const [country, setCountry] = useState(null);
  // const [user, setUser] = useState(null);
  // const { setRegisterType, setCountry: setCountryStore } = useCustomerRegisterStore();
  // const handleGetLoggedInUser = async () => {
  //   const user = await getLoggedInCustomer();
  //   setUser(user?.data?.customer);
  // };
  // useEffect(() => {
  //   handleGetLoggedInUser();
  // }, []);
  // const router = useRouter();
  // const types = [
  //   {
  //     type: "Individual",
  //     desc: "Register as an individual user",
  //     value: "individual",
  //   },
  //   {
  //     type: "Business",
  //     desc: "Register as a business entity",
  //     value: "business",
  //   },
  //   {
  //     type: "Trust",
  //     desc: "Register as a trust",
  //     value: "trust",
  //   },
  //   {
  //     type: "Partnership",
  //     desc: "Register as a partnership",
  //     value: "partnership",
  //   },
  //   {
  //     type: "Government Body",
  //     desc: "Register as a government body",
  //     value: "government-body",
  //   },
  //   {
  //     type: "Association",
  //     desc: "Register as an association",
  //     value: "association",
  //   },
  //   {
  //     type: "Cooperative",
  //     desc: "Register as a cooperative",
  //     value: "cooperative",
  //   },
  // ];
  // const handleSelectType = (type) => {
  //   setSelectedType(type);
  // };
  // const handleContinue = () => {
  //   if (selectedType && country) {
  //     setRegisterType(selectedType?.value);
  //     setCountryStore(country?.value?.toLowerCase());
  //     console.log("user => ", user);

  //     if (!user) {
  //       //TODO:Will add additional logic later.
  //       router.push(`/customer/registration/individual/liveness-detection`);
  //     } else {
  //       router.push(`/customer/registration/${selectedType?.value}`);
  //     }

  //     // router.push(`/customer/registration/${selectedType?.value}`);
  //   }
  // };
  return <RegistrationType />;
};

export default RegistrationTypePage;
