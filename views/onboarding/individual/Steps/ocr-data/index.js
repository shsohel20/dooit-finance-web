import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import Question, { QuestionDescription } from "@/views/onboarding/Question";
import { Button } from "@/components/ui/button";
import {
  onboardingPrimaryButtonClass,
  onboardingSelectControlStyles,
} from "../../onboardingStyles";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";

export default function OcrData({ form }) {
  const { setStep, step } = useCustomerRegisterStore();
  const handleContinue = () => {
    setStep(step + 1);
  };
  return (
    <div className="flex min-h-[min(70svh,560px)] flex-1 flex-col justify-between gap-8">
      <div className="space-y-5">
        <Question preset="individual">OCR Data</Question>
        {/* <QuestionDescription preset="individual">Confirm your OCR data.</QuestionDescription> */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <FormField form={form} name="customer_details.given_name" label="First Name" />
            <FormField form={form} name="customer_details.middle_name" label="Middle Name" />
            <FormField form={form} name="customer_details.surname" label="Surname" />
          </div>

          <div>
            <FormField
              form={form}
              name="customer_details.date_of_birth"
              label="Date of Birth"
              type="date"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 flex flex-col gap-2">
              <FormField form={form} name="residential_address.address" label="Address" />
              <FormField form={form} name="residential_address.street" label="Street" />
            </div>
            <FormField form={form} name="residential_address.state" label="State" />
            <FormField form={form} name="residential_address.postcode" label="Postcode" />
            <FormField form={form} name="residential_address.country" label="Country" />
          </div>
        </div>
      </div>
      <Button
        variant="onboarding"
        onClick={handleContinue}
        className={onboardingPrimaryButtonClass}
      >
        Continue
      </Button>
    </div>
  );
}
