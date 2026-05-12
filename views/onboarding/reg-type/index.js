"use client";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Question from "../Question";
import {
  Building2Icon,
  BuildingIcon,
  HandshakeIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

const types = [
  {
    type: "Individual",
    desc: "Register as an individual user",
    value: "individual",
    icon: <UserIcon className="size-4" />,
  },
  {
    type: "Business",
    desc: "Register as a business entity",
    value: "business",
    icon: <BuildingIcon className="size-4" />,
  },
  {
    type: "Trust",
    desc: "Register as a trust",
    value: "trust",
    icon: <ShieldCheckIcon className="size-4" />,
  },
  {
    type: "Partnership",
    desc: "Register as a partnership",
    value: "partnership",
    icon: <HandshakeIcon className="size-4" />,
  },
  {
    type: "Govt. Body",
    desc: "Register as a government body",
    value: "government-body",
    icon: <Building2Icon className="size-4" />,
  },
  {
    type: "Association",
    desc: "Register as an association",
    value: "association",
    icon: <UsersIcon className="size-4" />,
  },
  {
    type: "Cooperative",
    desc: "Register as a cooperative",
    value: "cooperative",
    icon: <KeyRoundIcon className="size-4" />,
  },
];
export default function RegistrationType() {
  const [selectedType, setSelectedType] = useState(null);
  const { setRegisterType, setCountry: setCountryStore } = useCustomerRegisterStore();
  const router = useRouter();

  const handleSelectType = (type) => {
    setSelectedType(type);
  };
  const handleNext = () => {
    if (selectedType) {
      setRegisterType(selectedType?.value);
      // setCountryStore(country?.value?.toLowerCase());
      router.push(`/customer/onboarding?type=${selectedType?.value}`);
    }
  };
  return (
    <div className="max-w-4xl md:w-full w-[90%] mx-auto grid place-items-center min-h-[80vh] justify-center border mt-10 rounded-lg px-2">
      <div>
        <h2 className="text-center  font-light">
          <span className="text-gray-500 tracking-tight text-sm"> Powered by </span>
          <div>
            <img src="/logo.png" alt="Logo" className=" w-full h-8 object-contain " />
          </div>
        </h2>

        <div className="py-8">
          <Question>How would you like to register?</Question>
          <div className="py-4  grid md:grid-cols-2    md:gap-4 gap-2 items-center justify-center grid-cols-2">
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
                  "flex items-center gap-2 py-2.5 px-4 border rounded-lg cursor-pointer transition-all duration-300 w-full md:w-[400px] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2",
                  {
                    "border-yellow-500   px-6": selectedType?.type === type.type,
                  },
                )}
              >
                <div
                  className={cn("size-3 rounded-full border flex-shrink-0", {
                    "border-yellow-500 bg-yellow-500": selectedType?.type === type?.type,
                  })}
                />
                <div className="flex items-center gap-2 ">
                  <p className="size-4  flex-shrink-0">{type.icon}</p>
                  <p className="font-semibold text-sm text-gray-700">{type.type}</p>
                  {/* <p className="text-neutral-500">{type.desc}</p> */}
                </div>
              </div>
            ))}
          </div>
          <Button disabled={!selectedType} onClick={handleNext} className="w-full">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
