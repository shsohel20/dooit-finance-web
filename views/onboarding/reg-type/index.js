"use client";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Question, { QuestionDescription } from "../Question";

const types = [
  {
    type: "Individual",
    desc: "Register as an individual user",
    value: "individual",
    emoji: "👤",
  },
  {
    type: "Business",
    desc: "Register as a business entity",
    value: "business",
    emoji: "🏢",
  },
  {
    type: "Trust",
    desc: "Register as a trust",
    value: "trust",
    emoji: "🛡️",
  },
  {
    type: "Partnership",
    desc: "Register as a partnership",
    value: "partnership",
    emoji: "🤝",
  },
  {
    type: "Govt. Body",
    desc: "Register as a government body",
    value: "government-body",
    emoji: "🏛️",
  },
  {
    type: "Association",
    desc: "Register as an association",
    value: "association",
    emoji: "👥",
  },
  {
    type: "Cooperative",
    desc: "Register as a cooperative",
    value: "cooperative",
    emoji: "🔑",
  },
];

export default function RegistrationType() {
  const [selectedType, setSelectedType] = useState(null);
  const { setRegisterType } = useCustomerRegisterStore();
  const router = useRouter();

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (selectedType) {
      setRegisterType(selectedType?.value);
      router.push(`/customer/onboarding?type=${selectedType?.value}`);
    }
  };

  return (
    <div className="min-h-[80vh] w-full bg-white px-5 pb-10 pt-8 md:pt-12">
      <div className="mx-auto flex w-full max-w-lg flex-col">
        <Question preset="individual" className="text-balance">
          How would you like to register?
        </Question>
        <QuestionDescription preset="individual" className="text-pretty">
          Choose the option that best describes you. This helps us customize your experience.
        </QuestionDescription>

        <div className="mt-8 flex flex-wrap gap-2">
          {types.map((type, index) => {
            const isSelected = selectedType?.value === type.value;
            return (
              <button
                type="button"
                key={type.value}
                onClick={() => handleSelectType(type)}
                aria-label={type.type}
                aria-pressed={isSelected}
                tabIndex={index + 1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectType(type);
                  }
                }}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border bg-white px-4 py-2 text-left text-[0.9375rem] font-medium text-neutral-900 transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4301] focus-visible:ring-offset-2",
                  isSelected
                    ? "border-[#1B4301] bg-[#1B4301]/[0.06] shadow-sm"
                    : "border-neutral-200 hover:border-neutral-300",
                )}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {type.emoji}
                </span>
                <span>{type.type}</span>
              </button>
            );
          })}
        </div>

        <Button
          disabled={!selectedType}
          onClick={handleNext}
          className={cn(
            "mt-10 h-12 w-full rounded-full text-base font-semibold text-white shadow-none",
            "bg-[#1B4301] hover:bg-[#153601] disabled:bg-neutral-300 disabled:text-neutral-500",
          )}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
