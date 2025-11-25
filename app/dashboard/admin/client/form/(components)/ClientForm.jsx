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
import api from "@/services";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  clientType: z.string().min(1, "Client type is required"),
  contacts: z.array(
    z.object({
      name: z.string(),
      title: z.string(),
      email: z.string(),
      phone: z.string(),
      primary: z.boolean(),
    })
  ),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    zipcode: z.string(),
  }),
  legalRepresentative: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required"),
    designation: z.string().min(1, "Designation is required"),
  }),

  name: z.string().min(1, "Name is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  taxId: z.string().min(1, "Tax ID is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  website: z.string(),

  documents: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      mimeType: z.string(),
      type: z.string(),
    })
  ),
  status: z.string().min(1, "Status is required"),
  settings: z.object({
    billingCycle: z.string().min(1, "Billing cycle is required"),
    currency: z.string().min(1, "Currency is required"),
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
    userName: "",
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
    watch,
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
        const modifiedData = {
          ...response.data,
          userName: response.data?.user?.userName,
        };
        reset(modifiedData);
      };
      fetchClient();
    }
  }, [id]);

  const onSubmit = async (data) => {
    setLoading(true);
    // const submittedData = {
    //   ...data,
    //   contacts: data.contacts.length > 0 ? data.contacts : [],
    //   documents: data.documents.length > 0 ? data.documents : [],
    // }
    const action = id ? updateClient(id, data) : createClient(data);
    const res = await action;
    setLoading(false);
    if (res.success || res.succeed) {
      toast.success(id ? "Client updated" : "Client created");
      if (!id) {
        localStorage.setItem("newId", res.id);
      }
      router.push(`/dashboard/admin/client`);
    } else {
      toast.error(res.error || "Something went wrong");
    }
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs
        defaultValue={currentStep}
        value={currentStep}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-6 mb-8">
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
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <Button onClick={handleNext} disabled={currentStep === tabs.length}>
            Next
          </Button>
        </div>
      )}
    </form>
  );
}
