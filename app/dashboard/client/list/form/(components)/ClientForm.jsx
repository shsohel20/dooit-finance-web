"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyInfoSection } from "./form-sections/company-info-section";
import { ContactsSection } from "./form-sections/contacts-section";
import { AddressSection } from "./form-sections/address-section";
import { LegalSection } from "./form-sections/legal-section";
import { DocumentsSection } from "./form-sections/documents-section";
import { SettingsSection } from "./form-sections/settings-section";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient, getClientById, updateClient } from "../../actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  clientType: z.string().min(1, "Client type is required"),
  contacts: z.array(
    z.object({
      name: z.string(),
      title: z.string(),
      email: z.string(),
      phone: z.string(),
      primary: z.boolean(),
    }),
  ),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipcode: z.string(),
  }),
  legalRepresentative: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    designation: z.string(),
  }),

  name: z.string().min(1, "Company name is required"),
  registrationNumber: z.string(),
  taxId: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string(),

  documents: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      mimeType: z.string(),
      type: z.string(),
    }),
  ),
  status: z.string(),
  settings: z.object({
    billingCycle: z.string(),
    currency: z.string(),
  }),
});

const tabs = [
  {
    label: "Company",
    value: 1,
  },
  {
    label: "Contacts",
    value: 2,
  },
  {
    label: "Address",
    value: 3,
  },
  {
    label: "Legal",
    value: 4,
  },
  {
    label: "Documents",
    value: 5,
  },
  {
    label: "Settings",
    value: 6,
  },
];

export function ClientForm({ id }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    clientType: "",
    registrationNumber: "",
    taxId: "",
    email: "",
    phone: "",
    website: "",
    contacts: [
      {
        name: "",
        title: "",
        email: "",
        phone: "",
        primary: true,
      },
    ],
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
    },
    legalRepresentative: {
      name: "",
      email: "",
      phone: "",
      designation: "",
    },
    documents: [
      {
        name: "",
        url: "",
        mimeType: "application/pdf",
        type: "",
      },
    ],
    status: "",
    settings: {
      billingCycle: "",
      currency: "",
    },
  });
  const [currentStep, setCurrentStep] = useState(1);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });
  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        const response = await getClientById(id);
        if (response?.data) {
          // Merge over defaults so nested controlled inputs never go undefined.
          reset({ ...formData, ...response.data });
        }
      };
      fetchClient();
    }
  }, [id]);

  // Map a form field to the tab it lives on, so validation errors can jump there.
  const FIELD_TAB = {
    name: 1,
    clientType: 1,
    registrationNumber: 1,
    taxId: 1,
    email: 1,
    phone: 1,
    website: 1,
    status: 1,
    contacts: 2,
    address: 3,
    legalRepresentative: 4,
    documents: 5,
    settings: 6,
  };

  const onSubmit = async (data) => {
    setLoading(true);
    // Send only the schema fields — strips populated `user`, `_id`, timestamps
    // etc. that come back from the API in edit mode (sending `user` back would
    // fail the ObjectId cast on the backend).
    const payload = {
      name: data.name,
      clientType: data.clientType,
      registrationNumber: data.registrationNumber,
      taxId: data.taxId,
      email: data.email,
      phone: data.phone,
      website: data.website,
      contacts: data.contacts,
      address: data.address,
      legalRepresentative: data.legalRepresentative,
      documents: data.documents,
      status: data.status,
      settings: data.settings,
    };
    const action = id ? updateClient(id, payload) : createClient(payload);
    const res = await action;
    setLoading(false);
    if (res.success || res.succeed) {
      toast.success(id ? "Client updated" : "Client created");
      if (!id) {
        localStorage.setItem("newId", res.id);
      }
      router.push(`/dashboard/client/list`);
    } else {
      toast.error(res.error || "Something went wrong");
    }
  };

  // Validation can fail on a tab that isn't currently visible — surface it and
  // jump to the first offending tab instead of silently doing nothing.
  const onInvalid = (formErrors) => {
    const firstField = Object.keys(formErrors)[0];
    const tab = FIELD_TAB[firstField];
    if (tab) setCurrentStep(tab);
    toast.error("Please fix the highlighted fields before saving.");
  };
  const handleBack = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };
  const handleNext = () => {
    setCurrentStep((prev) => (prev < tabs.length ? prev + 1 : prev));
  };

  const tabComponents = {
    1: <CompanyInfoSection control={control} errors={errors} id={id} />,
    2: <ContactsSection control={control} errors={errors} />,
    3: <AddressSection control={control} errors={errors} />,
    4: <LegalSection control={control} errors={errors} />,
    5: <DocumentsSection control={control} errors={errors} />,
    6: (
      <>
        {" "}
        <SettingsSection control={control} errors={errors} />
        <div className="flex gap-4 mt-8 justify-end">
          <Button type="reset" variant="outline" size="lg">
            Clear Form
          </Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </>
    ),
  };
  const handleTabChange = (value) => {
    setCurrentStep(value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <Tabs
        defaultValue={currentStep}
        value={currentStep}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="flex mb-8">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            {tabComponents[currentStep.toString()]}
          </TabsContent>
        ))}
      </Tabs>
      {currentStep == tabs.length ? null : (
        <div className="flex gap-4 mt-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button type="button" onClick={handleNext} disabled={currentStep === tabs.length}>
            Next
          </Button>
        </div>
      )}
    </form>
  );
}
