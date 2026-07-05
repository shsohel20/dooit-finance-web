"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import Stepper from "@/components/ui/Stepper";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import PersonalInfo from "@/views/customer-registration/individual/PersonalInfo";
import OtherInfo from "@/views/customer-registration/individual/OtherInfo";
import DocumentsStep from "./DocumentsStep";
import StaffAttestation from "./StaffAttestation";
import ReviewStep from "./ReviewStep";
import { manualImportCustomer } from "@/app/dashboard/client/onboarding/customer-queue/actions";
import { getLoggedInUser } from "@/app/actions";

const selectOption = z
  .object({
    id: z.string().optional(),
    value: z.string().optional(),
    label: z.string().optional(),
    sides: z.number().optional(),
  })
  .nullable()
  .optional();

const addressSchema = z.object({
  address: z.string().optional(),
  street: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  zip_code: z.string().optional(),
  country: selectOption,
});

const manualImportSchema = z.object({
  doc_country: selectOption,
  document_type: selectOption,
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
    .max(2, "You can only upload 2 document sides"),
  selfie: z
    .object({
      name: z.string().optional(),
      url: z.string().optional(),
      mimeType: z.string().optional(),
    })
    .nullable()
    .optional(),
  identificationNo: z.string().optional(),
  customer_details: z.object({
    given_name: z.string().min(1, "First name is required"),
    middle_name: z.string().optional(),
    surname: z.string().optional(),
    date_of_birth: z.string().optional(),
  }),
  contact_details: z
    .object({
      email: z.string().email("Invalid email address").or(z.literal("")).optional(),
      phone: z.string().optional(),
    })
    .refine((value) => value.email || value.phone, {
      message: "At least one of email or phone is required",
      path: ["email"],
    }),
  employment_details: z.object({
    occupation: z.string().optional(),
    employer_name: z.string().optional(),
    industry: z.string().optional(),
  }),
  residential_address: addressSchema,
  mailing_same_as_residential: z.boolean().optional(),
  mailing_address: addressSchema,
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
      business_name: z.string().optional(),
      trading_name: z.string().optional(),
      business_registration_number: z.string().optional(),
      nature_of_business: z.string().optional(),
    }),
  }),
  authorized: z.object({
    agent_name: z.string().min(1, "Agent name is required"),
    company_name: z.string().optional(),
    title_relationship: z.string().optional(),
    documents_attested: z
      .boolean()
      .refine((value) => value === true, "You must attest the documents"),
  }),
  consentToScreen: z.boolean().optional(),
  notes: z.string().optional(),
  runSumsubCheck: z.boolean().optional(),
  // OCR extraction captured on the Documents step — forwarded so the details
  // page can render it; not a user-editable field.
  ocr: z.any().optional().nullable(),
});

const defaultValues = {
  doc_country: null,
  document_type: null,
  documents: [],
  selfie: null,
  identificationNo: "",
  customer_details: { given_name: "", middle_name: "", surname: "", date_of_birth: "" },
  contact_details: { email: "", phone: "" },
  employment_details: { occupation: "", employer_name: "", industry: "" },
  residential_address: {
    address: "",
    street: "",
    suburb: "",
    state: "",
    postcode: "",
    zip_code: "",
    country: null,
  },
  mailing_same_as_residential: false,
  mailing_address: {
    address: "",
    street: "",
    suburb: "",
    state: "",
    postcode: "",
    zip_code: "",
    country: null,
  },
  funds_wealth: {
    source_of_funds: "",
    source_of_wealth: "",
    account_purpose: "",
    estimated_trading_volume: "",
  },
  sole_trader: {
    is_sole_trader: false,
    business_details: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      phone_number: "",
      id_number: "",
      business_name: "",
      trading_name: "",
      business_registration_number: "",
      nature_of_business: "",
    },
  },
  authorized: {
    agent_name: "",
    company_name: "",
    title_relationship: "",
    documents_attested: false,
  },
  consentToScreen: false,
  notes: "",
  runSumsubCheck: true,
  ocr: null,
};

const STEPS = [
  "Identification Documents",
  "Personal Information",
  "Other Information & Attestation",
  "Review & Submit",
];
const TOTAL_STEPS = STEPS.length;

// Fields validated when leaving each step, so errors surface where they belong
// instead of only on final submit.
const STEP_FIELDS = {
  2: ["customer_details.given_name", "contact_details"],
  3: ["authorized"],
};

// Country labels come as "🇦🇺 Australia" — strip the flag for the API payload.
const cleanCountryName = (label) =>
  String(label || "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "")
    .trim();

const flattenErrors = (node, path = []) => {
  if (!node || typeof node !== "object") return [];
  if (typeof node.message === "string" && node.message) {
    return [{ path: path.join(" / "), message: node.message }];
  }
  return Object.entries(node).flatMap(([key, value]) =>
    key === "ref" ? [] : flattenErrors(value, [...path, key]),
  );
};

const buildPayload = (data) => {
  const documents = (data.documents || []).filter((d) => d?.url);
  if (data.selfie?.url) {
    documents.push({
      name: data.selfie.name || "selfie",
      url: data.selfie.url,
      mimeType: data.selfie.mimeType || "",
      type: "selfie",
      docType: "selfie",
    });
  }

  return {
    personalKyc: {
      personal_form: {
        customer_details: data.customer_details,
        contact_details: data.contact_details,
        employment_details: data.employment_details,
        residential_address: {
          ...data.residential_address,
          country: data.residential_address?.country?.value || "",
        },
        mailing_address: {
          ...data.mailing_address,
          country: data.mailing_address?.country?.value || "",
        },
        identificationNo: data.identificationNo || "",
      },
      funds_wealth: data.funds_wealth,
      sole_trader: data.sole_trader,
    },
    documents,
    authorized: { ...data.authorized, agent_date: new Date().toISOString() },
    country:
      cleanCountryName(data.doc_country?.label) || data.residential_address?.country?.value || "",
    notes: data.notes || "",
    consentToScreen: !!data.consentToScreen,
    runSumsubCheck: data.runSumsubCheck !== false,
    ocr: data.ocr?.fields ? data.ocr : null,
  };
};

const ManualImportView = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [duplicate, setDuplicate] = useState(null);
  const [errorSummary, setErrorSummary] = useState([]);

  const form = useForm({
    defaultValues,
    resolver: zodResolver(manualImportSchema),
    mode: "onChange",
  });
  const {
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    setValue,
  } = form;

  // Pre-fill the staff attestation from the logged-in user — agent name from
  // the account, company from the client, title from the active role. Fields
  // stay editable; only empty ones are filled.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await getLoggedInUser();
        const me = response?.data;
        if (!me || cancelled) return;
        const { getValues } = form;
        if (me.name && !getValues("authorized.agent_name")) {
          setValue("authorized.agent_name", me.name);
        }
        if (me.client?.name && !getValues("authorized.company_name")) {
          setValue("authorized.company_name", me.client.name);
        }
        const title = me.role
          ? String(me.role).charAt(0).toUpperCase() + String(me.role).slice(1)
          : "";
        if (title && !getValues("authorized.title_relationship")) {
          setValue("authorized.title_relationship", title);
        }
      } catch (error) {
        console.error("Failed to prefill staff attestation", error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form, setValue]);

  const handleNextStep = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate) {
      const valid = await trigger(fieldsToValidate);
      if (!valid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS));
  };
  const handlePreviousStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data) => {
    setSubmitting(true);
    setDuplicate(null);
    setErrorSummary([]);
    try {
      const response = await manualImportCustomer(buildPayload(data));
      if (response?.success) {
        toast.success(
          response.data?.relationAdded
            ? "Existing customer linked to this client/branch"
            : "Customer imported successfully",
        );
        router.push(
          `/dashboard/client/onboarding/customer-queue/details?id=${response.data?.customerId}`,
        );
      } else if (response?.data?.customerId) {
        setDuplicate(response.data);
        toast.error("Customer already exists for this client/branch");
      } else {
        toast.error(response?.message || response?.error || "Failed to import customer");
      }
    } catch (error) {
      console.error("Manual import error", error);
      toast.error("Failed to import customer");
    } finally {
      setSubmitting(false);
    }
  };

  const onInvalid = (validationErrors) => {
    setErrorSummary(flattenErrors(validationErrors));
    toast.error("Please fix the highlighted fields before submitting");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader>
          <PageTitle>Add Customer</PageTitle>
          <PageDescription>
            Manually import an individual customer onboarded in-branch
          </PageDescription>
        </PageHeader>
        <Button size="sm" variant="outline" className="text-xs" asChild>
          <Link href="/dashboard/client/onboarding/customer-queue">
            <ArrowLeft /> Back to Queue
          </Link>
        </Button>
      </div>

      <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} handleStep={setCurrentStep} />
      <h3 className="font-semibold text-lg">{STEPS[currentStep - 1]}</h3>

      {duplicate && (
        <div className="mt-4">
          <Alert variant="destructive">
            <AlertTitle>Customer already exists</AlertTitle>
            <AlertDescription>
              A customer with these details is already registered for this client/branch
              {duplicate.uid ? ` (${duplicate.uid})` : ""}.{" "}
              <Link
                className="underline font-medium"
                href={`/dashboard/client/onboarding/customer-queue/details?id=${duplicate.customerId}`}
              >
                Open the existing record
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {errorSummary.length > 0 && (
        <div className="mt-4">
          <Alert variant="destructive">
            <AlertTitle>Please complete the form</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {errorSummary.map((item) => (
                  <li key={item.path} className="capitalize">
                    {item.path.replaceAll("_", " ")}: {item.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="min-h-[360px]">
        {currentStep === 1 && (
          <DocumentsStep form={form} onExtracted={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <PersonalInfo control={control} errors={errors} setValue={setValue} />
        )}
        {currentStep === 3 && (
          <div className="mt-4">
            <OtherInfo
              control={control}
              errors={errors}
              setValue={setValue}
              showDeclaration={false}
            />
            <StaffAttestation control={control} errors={errors} />
          </div>
        )}
        {currentStep === 4 && <ReviewStep form={form} />}
      </div>

      <div className="flex justify-end gap-2 my-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={handlePreviousStep} className="w-[200px]">
            Previous
          </Button>
        )}
        {currentStep < TOTAL_STEPS && (
          <Button onClick={handleNextStep} className="w-[200px]">
            Next
          </Button>
        )}
        {currentStep === TOTAL_STEPS && (
          <Button
            onClick={handleSubmit(onSubmit, onInvalid)}
            disabled={submitting}
            className="w-[200px]"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" /> Importing...
              </span>
            ) : (
              "Import Customer"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ManualImportView;
