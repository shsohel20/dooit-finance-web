"use client";
import { Button } from "@/components/ui/button";

import { countriesData } from "@/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getLoggedInCustomer, getLoggedInUser } from "../actions";
import dynamic from "next/dynamic";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
const CustomSelect = dynamic(() => import("@/components/ui/CustomSelect"), { ssr: false });

const RegistrationType = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [country, setCountry] = useState(null);
  const [user, setUser] = useState(null);
  const { setRegisterType, setCountry: setCountryStore } = useCustomerRegisterStore();
  const handleGetLoggedInUser = async () => {
    const user = await getLoggedInCustomer();
    setUser(user?.data?.customer);
  };
  useEffect(() => {
    handleGetLoggedInUser();
  }, []);
  const router = useRouter();
  const types = [
    {
      type: "Individual",
      desc: "Register as an individual user",
      value: "individual",
    },
    {
      type: "Business",
      desc: "Register as a business entity",
      value: "business",
    },
    {
      type: "Trust",
      desc: "Register as a trust",
      value: "trust",
    },
    {
      type: "Partnership",
      desc: "Register as a partnership",
      value: "partnership",
    },
    {
      type: "Government Body",
      desc: "Register as a government body",
      value: "government-body",
    },
    {
      type: "Association",
      desc: "Register as an association",
      value: "association",
    },
    {
      type: "Cooperative",
      desc: "Register as a cooperative",
      value: "cooperative",
    },
  ];
  const handleSelectType = (type) => {
    setSelectedType(type);
  };
  const handleContinue = () => {
    if (selectedType && country) {
      // localStorage.setItem('registration_type', selectedType?.value);
      // localStorage.setItem('country', country?.value?.toLowerCase());
      setRegisterType(selectedType?.value);
      setCountryStore(country?.value?.toLowerCase());

      if (user?.kycStatus === "pending" && selectedType?.value === "individual") {
        //TODO:Will add additional logic later.
        router.push(`/customer/registration/individual/liveness-detection`);
      } else {
        router.push(`/customer/registration/${selectedType?.value}`);
      }
    }
  };
  return (
    <div className="container grid place-items-center min-h-[80vh] py-8 ">
      <div className="min-w-[500px]">
        <h1 className="text-2xl font-bold tracking-tighter text-center">
          Choose Registration Type
        </h1>
        <p className="text-center">Select the option that best describes you to get started.</p>
        <div className="py-8  flex flex-col gap-4 items-center justify-center">
          {types.map((type, index) => (
            <div
              onClick={() => handleSelectType(type)}
              role="button"
              aria-label={type.type}
              aria-pressed={selectedType === index}
              key={index}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectType(type);
                }
              }}
              tabIndex={index + 1}
              className={cn(
                "flex items-center gap-4 py-2.5 px-4 border rounded-lg cursor-pointer transition-all duration-300 w-[400px] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
                {
                  "border-yellow-500 w-[460px]  px-6": selectedType?.type === type.type,
                },
              )}
            >
              <div
                className={cn("size-4 rounded-full border", {
                  "border-yellow-500 bg-yellow-500": selectedType?.type === type?.type,
                })}
              />
              <div>
                <h2 className="font-semibold text-sm">{type.type}</h2>
                <p className="text-neutral-500">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="my-4 flex justify-center ">
          <div className="w-[400px] max-w-full">
            <CustomSelect
              placeholder="Select Country"
              value={country}
              onChange={(data, e) => setCountry(data)}
              options={countriesData}
            />
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={handleContinue}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationType;
