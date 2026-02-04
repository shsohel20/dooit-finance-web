"use client";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/ui/Stepper";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCustomerRegisterStore } from "@/app/store/useCustomerRegister";
import IdentificationDocuments from "@/views/customer-registration/common/IdentificationDocuments";
import PersonalInfo from "@/views/customer-registration/individual/PersonalInfo";
import OtherInfo from "@/views/customer-registration/individual/OtherInfo";
import CheckLiveness from "@/views/customer-registration/common/CheckLiveness";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { IconRefresh } from "@tabler/icons-react";

const personalInfoSchema = z.object({
  customer_details: z.object({
    given_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    surname: z.string().optional(),
  }),
  document_type: z.object({
    value: z.string().min(1, "Document type is required"),
    label: z.string().min(1, "Document type is required"),
  }),
  contact_details: z.object({
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
  }),
  employment_details: z.object({
    occupation: z.string().min(1, "Occupation is required"),
    industry: z.string().min(1, "Industry is required"),
  }),
  residential_address: z.object({
    address: z.string().min(1, "Address is required"),
    suburb: z.string().optional(),
    state: z.string(),
    postcode: z.string().optional(),
    country: z
      .object({
        value: z.string(),
        label: z.string(),
      })
      .optional()
      .nullable(),
  }),
  documents: z
    .array(
      z.object({
        name: z.string().optional(),
        url: z.string().optional(),
        mimeType: z.string().optional(),
        type: z.enum(["front", "back"]),
        docType: z.string().optional(),
      }),
    )
    .max(2, "You can only upload 2 documents"),
  declaration: z.object({
    declarations_accepted: z.boolean().optional(),
    signatory_name: z.string().optional(),
    signature: z.string().optional(),
    date: z.string().optional(),
  }),
  funds_wealth: z.object({
    source_of_funds: z.string().optional(),
    source_of_wealth: z.string().optional(),
    account_purpose: z.string().optional(),
    estimated_trading_volume: z.string().optional(),
  }),
  sole_trader: z.object({
    is_sole_trader: z.boolean().optional(),
    business_details: z.object({
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      date_of_birth: z.string().optional(),
      phone_number: z.string().optional(),
      id_number: z.string().optional(),
    }),
  }),
  mailing_address: z.object({
    address: z.string().optional(),
    suburb: z.string().optional(),
    state: z.string().optional(),
    postcode: z.string().optional(),
    country: z
      .object({
        value: z.string().optional(),
        label: z.string().optional(),
      })
      .nullable()
      .optional(),
  }),
  declaration: z.object({
    declarations_accepted: z
      .boolean()
      .refine((val) => val === true, "You must accept the declarations"),
    signatory_name: z
      .string()
      .min(1, "Signatory name is required")
      .min(2, "Signatory name must be at least 2 characters"),
    signature: z.string().optional(),
    date: z.string().optional(),
  }),
});
const TOTAL_STEPS = 2;
const CustomerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { customerRegisterData, setCustomerRegisterData, registerType, country } =
    useCustomerRegisterStore();
  const [verifyingStatus, setVerifyingStatus] = useState("idle");
  const [verifiedMsg, setVerifiedMsg] = useState(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: customerRegisterData,
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
  });
  console.log("errors", errors);
  const onSubmit = (data) => {
    setCustomerRegisterData(data);
    router.push("/customer/registration/individual/preview");
  };
  const router = useRouter();

  const handleNextStep = () => {
    setCurrentStep((prev) => {
      if (prev === TOTAL_STEPS) {
        return TOTAL_STEPS;
      }
      return prev + 1;
    });
  };
  const handlePreviousStep = () => {
    setCurrentStep((prev) => {
      if (prev === 1) {
        return prev;
      }
      return prev - 1;
    });
  };
  const handleStep = (step) => {
    setCurrentStep(step);
  };
  return (
    <div className="container">
      {/* stepper */}

      {/* content */}
      {verifyingStatus === "idle" && (
        <div>
          <IdentificationDocuments
            control={control}
            errors={errors}
            setValue={setValue}
            setVerifyingStatus={setVerifyingStatus}
            setVerifiedMsg={setVerifiedMsg}
          />
        </div>
      )}

      {/* {verifyingStatus === "verifying" && (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[500px]">
          <IconRefresh className="size-20 animate-spin" />
          Verifying documents...
        </div>
      )} */}
      {verifiedMsg && (
        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{verifiedMsg}</AlertDescription>
          </Alert>
        </div>
      )}
      {verifyingStatus === "verified" && (
        <>
          {errors && Object.keys(errors).length > 0 && (
            <div className="flex flex-col gap-2">
              {Object.keys(errors).map((key) => {
                if (errors[key].message) {
                  return <div key={key}>{errors[key].message}</div>;
                } else {
                  return (
                    <>
                      {Object.keys(errors[key]).map((subKey) => {
                        return (
                          <div key={subKey + key}>
                            <Alert variant="destructive">
                              {" "}
                              <AlertTitle className={"capitalize"}>
                                {key}/{subKey}
                              </AlertTitle>
                              <AlertDescription>Is required</AlertDescription>
                            </Alert>
                          </div>
                        );
                      })}
                    </>
                  );
                }
              })}
            </div>
          )}
          <div>
            <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} handleStep={handleStep} />
          </div>
          <div>
            {/* {currentStep === 1 && (
              <IdentificationDocuments
                control={control}
                errors={errors}
                setValue={setValue}
                setVerifyingStatus={setVerifyingStatus}
                setVerifiedMsg={setVerifiedMsg}
              />
            )} */}
            {currentStep === 1 && <PersonalInfo control={control} errors={errors} />}
            {currentStep === 2 && (
              <OtherInfo control={control} errors={errors} setValue={setValue} />
            )}
          </div>
          <div className="flex justify-end gap-2 my-8">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handlePreviousStep} className={"w-[200px]"}>
                Previous
              </Button>
            )}
            {currentStep < TOTAL_STEPS && (
              <Button onClick={handleNextStep} className={"w-[200px]"}>
                Next
              </Button>
            )}
            {currentStep === TOTAL_STEPS && (
              <Button onClick={handleSubmit(onSubmit)} className={"w-[200px]"}>
                Preview
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerRegistration;
