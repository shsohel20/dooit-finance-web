"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Building2, MapPin, UserRound, Users, Landmark, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import { FormField } from "@/views/customer-registration/common/FormField";
import { countriesData } from "@/constants";

const addressSchema = z.object({
  street: z.string().optional(),
  suburb: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
});

const addCompanySchema = z.object({
  general_information: z.object({
    legal_name: z.string().min(1, "Legal name is required"),
    trading_names: z.string().optional(),
    registration_number: z.string().min(1, "Registration number is required"),
    country_of_incorporation: z.string().min(1, "Country is required"),
    contact_email: z.string().email("Invalid email address").or(z.literal("")).optional(),
    phone_number: z.string().optional(),
    industry: z.string().optional(),
    nature_of_business: z.string().optional(),
    annual_income: z.string().optional(),
    company_type: z.object({
      type: z.string().optional(),
      is_listed: z.boolean().optional(),
    }),
    account_purpose: z.object({
      digital_currency_exchange: z.boolean().optional(),
      peer_to_peer: z.boolean().optional(),
      fx: z.boolean().optional(),
      other: z.boolean().optional(),
      other_details: z.string().optional(),
    }),
    estimated_trading_volume: z.string().optional(),
    registered_address: addressSchema,
    business_address: addressSchema.extend({
      different_from_registered: z.boolean().optional(),
    }),
    local_agent: z.object({
      name: z.string().optional(),
      address: addressSchema,
    }),
  }),
  directors: z.array(
    z.object({
      given_name: z.string().min(1, "Given name is required"),
      surname: z.string().min(1, "Surname is required"),
    }),
  ),
  beneficial_owners: z.array(
    z.object({
      full_name: z.string().min(1, "Full name is required"),
      date_of_birth: z.string().optional(),
      residential_address: addressSchema,
    }),
  ),
});

const emptyAddress = { street: "", suburb: "", state: "", postcode: "", country: "" };

const defaultValues = {
  general_information: {
    legal_name: "",
    trading_names: "",
    registration_number: "",
    country_of_incorporation: "",
    contact_email: "",
    phone_number: "",
    industry: "",
    nature_of_business: "",
    annual_income: "",
    company_type: { type: "", is_listed: false },
    account_purpose: {
      digital_currency_exchange: false,
      peer_to_peer: false,
      fx: false,
      other: false,
      other_details: "",
    },
    estimated_trading_volume: "",
    registered_address: { ...emptyAddress },
    business_address: { different_from_registered: false, ...emptyAddress },
    local_agent: { name: "", address: { ...emptyAddress } },
  },
  directors: [{ given_name: "", surname: "" }],
  beneficial_owners: [
    { full_name: "", date_of_birth: "", residential_address: { ...emptyAddress } },
  ],
};

const companyTypeOptions = [
  { label: "Private Company", value: "private_company" },
  { label: "Public Company", value: "public_company" },
  { label: "Regulated / Licensed Company", value: "regulated_company" },
  { label: "Other", value: "other" },
];

function AddressFields({ form, basePath }) {
  return (
    <>
      <FormField form={form} name={`${basePath}.street`} label="Street" placeholder="Enter Street" />
      <FormField form={form} name={`${basePath}.suburb`} label="Suburb" placeholder="Enter Suburb" />
      <FormField form={form} name={`${basePath}.state`} label="State" placeholder="Enter State" />
      <FormField form={form} name={`${basePath}.postcode`} label="Postcode" placeholder="Enter Postcode" />
      <FormField
        form={form}
        name={`${basePath}.country`}
        label="Country"
        type="select"
        options={countriesData}
        placeholder="Select Country"
      />
    </>
  );
}

export default function AddCompany() {
  const router = useRouter();
  const form = useForm({
    defaultValues,
    resolver: zodResolver(addCompanySchema),
    mode: "onChange",
  });

  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector,
  } = useFieldArray({ control: form.control, name: "directors" });

  const {
    fields: ownerFields,
    append: appendOwner,
    remove: removeOwner,
  } = useFieldArray({ control: form.control, name: "beneficial_owners" });

  const onSubmit = (data) => {
    // Payload shaped to match the CompanyKyc model so it can be wired to a
    // POST endpoint once one exists (only the invite/dummy flows create
    // CompanyKyc records today).
    const payload = {
      general_information: data.general_information,
      directors_beneficial_owner: {
        directors: data.directors,
        beneficial_owners: data.beneficial_owners,
      },
    };
    console.log("Add company payload", payload);
    toast.success(`${data.general_information.legal_name} saved (visual only — API wiring pending)`);
    router.push("/dashboard/client/companies");
  };

  return (
    <div className="space-y-6">
      <PageHeader className="flex-row items-start justify-between">
        <div>
          <PageTitle>Add New Company</PageTitle>
          <PageDescription>
            Capture the company profile, addresses, directors and beneficial owners
          </PageDescription>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/client/companies">
            <ArrowLeft /> Back to Companies
          </Link>
        </Button>
      </PageHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* General information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" /> General Information
            </CardTitle>
            <CardDescription>Legal identity and registration details</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              form={form}
              name="general_information.legal_name"
              label="Legal Name"
              placeholder="Enter Legal Name"
              required
            />
            <FormField
              form={form}
              name="general_information.trading_names"
              label="Trading Names"
              placeholder="Enter Trading Names"
            />
            <FormField
              form={form}
              name="general_information.registration_number"
              label="Registration Number (ACN / ARBN)"
              placeholder="Enter Registration Number"
              required
            />
            <FormField
              form={form}
              name="general_information.country_of_incorporation"
              label="Country of Incorporation"
              type="select"
              options={countriesData}
              placeholder="Select Country"
              required
            />
            <FormField
              form={form}
              name="general_information.company_type.type"
              label="Company Type"
              type="select"
              options={companyTypeOptions}
              placeholder="Select Company Type"
            />
            <div className="flex items-end pb-2">
              <FormField
                form={form}
                name="general_information.company_type.is_listed"
                label="Listed Company?"
                type="checkbox"
              />
            </div>
            <FormField
              form={form}
              name="general_information.contact_email"
              label="Contact Email"
              type="email"
              placeholder="Enter Contact Email"
            />
            <FormField
              form={form}
              name="general_information.phone_number"
              label="Phone Number"
              placeholder="Enter Phone Number"
            />
            <FormField
              form={form}
              name="general_information.industry"
              label="Industry"
              placeholder="Enter Industry"
            />
            <FormField
              form={form}
              name="general_information.nature_of_business"
              label="Nature of Business"
              placeholder="Enter Nature of Business"
            />
            <FormField
              form={form}
              name="general_information.annual_income"
              label="Annual Income"
              placeholder="Enter Annual Income"
            />
            <FormField
              form={form}
              name="general_information.estimated_trading_volume"
              label="Estimated Trading Volume"
              placeholder="Enter Estimated Trading Volume"
            />
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" /> Addresses
            </CardTitle>
            <CardDescription>Registered office, business address and local agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">Registered Address</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AddressFields form={form} basePath="general_information.registered_address" />
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <FormField
                form={form}
                name="general_information.business_address.different_from_registered"
                label="Business address is different from registered address"
                type="checkbox"
              />
              {form.watch("general_information.business_address.different_from_registered") && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AddressFields form={form} basePath="general_information.business_address" />
                </div>
              )}
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-3">Local Agent</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  form={form}
                  name="general_information.local_agent.name"
                  label="Agent Name"
                  placeholder="Enter Agent Name"
                />
                <AddressFields form={form} basePath="general_information.local_agent.address" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account purpose */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="size-4 text-muted-foreground" /> Account Purpose
            </CardTitle>
            <CardDescription>Intended use of the account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <FormField
                form={form}
                name="general_information.account_purpose.digital_currency_exchange"
                label="Digital Currency Exchange"
                type="checkbox"
              />
              <FormField
                form={form}
                name="general_information.account_purpose.peer_to_peer"
                label="Peer to Peer"
                type="checkbox"
              />
              <FormField
                form={form}
                name="general_information.account_purpose.fx"
                label="FX"
                type="checkbox"
              />
              <FormField
                form={form}
                name="general_information.account_purpose.other"
                label="Other"
                type="checkbox"
              />
            </div>
            {form.watch("general_information.account_purpose.other") && (
              <div className="max-w-md">
                <FormField
                  form={form}
                  name="general_information.account_purpose.other_details"
                  label="Other Details"
                  placeholder="Describe other purpose"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Directors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-4 text-muted-foreground" /> Directors
            </CardTitle>
            <CardDescription>All current directors of the company</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {directorFields.map((field, index) => (
              <div key={field.id} className="flex flex-wrap items-end gap-4 rounded-lg border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-w-0">
                  <FormField
                    form={form}
                    name={`directors.${index}.given_name`}
                    label="Given Name"
                    placeholder="Enter Given Name"
                    required
                  />
                  <FormField
                    form={form}
                    name={`directors.${index}.surname`}
                    label="Surname"
                    placeholder="Enter Surname"
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={directorFields.length === 1}
                  onClick={() => removeDirector(index)}
                >
                  <Trash />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendDirector({ given_name: "", surname: "" })}
            >
              <Plus /> Add Director
            </Button>
          </CardContent>
        </Card>

        {/* Beneficial owners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" /> Beneficial Owners
            </CardTitle>
            <CardDescription>
              Individuals who ultimately own or control the company
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {ownerFields.map((field, index) => (
              <div key={field.id} className="space-y-4 rounded-lg border p-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium">Beneficial Owner {index + 1}</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={ownerFields.length === 1}
                    onClick={() => removeOwner(index)}
                  >
                    <Trash />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    form={form}
                    name={`beneficial_owners.${index}.full_name`}
                    label="Full Name"
                    placeholder="Enter Full Name"
                    required
                  />
                  <FormField
                    form={form}
                    name={`beneficial_owners.${index}.date_of_birth`}
                    label="Date of Birth"
                    type="date"
                  />
                  <AddressFields
                    form={form}
                    basePath={`beneficial_owners.${index}.residential_address`}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendOwner({
                  full_name: "",
                  date_of_birth: "",
                  residential_address: { ...emptyAddress },
                })
              }
            >
              <Plus /> Add Beneficial Owner
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pb-10">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/client/companies">Cancel</Link>
          </Button>
          <Button type="submit">Save Company</Button>
        </div>
      </form>
    </div>
  );
}
