"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

const SECTOR_OPTIONS = [
  { value: "conveyancing", label: "Conveyancing" },
  { value: "accounting", label: "Accounting" },
  { value: "legal", label: "Legal" },
  { value: "financial_services", label: "Financial Services" },
  { value: "real_estate", label: "Real Estate" },
];

const PERSON_OPTIONS = [
  { value: "steve_short", label: "Steve Short" },
  { value: "jack_guthrie", label: "Jack Guthrie" },
  { value: "michael_manager", label: "Michael Manager" },
  { value: "sarah_jones", label: "Sarah Jones" },
];

const ROLES = [
  {
    key: "governing_body",
    title: "Governing body",
    description:
      "Typically the practice owner, they appoint key roles, and provide the compliance officer with necessary authority and resources.",
    required: true,
  },
  {
    key: "compliance_officer",
    title: "Compliance officer",
    description:
      "Usually an influential team member, they manage daily compliance, enforce policies, and resolve complex matters escalated by staff.",
    required: true,
  },
  {
    key: "senior_managers",
    title: "Senior managers",
    description:
      "Often a senior leader, they approve the policy and process, and decide whether to engage with high-risk clients.",
    required: false,
  },
];

function RoleSection({ form, roleKey, title, description, required }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: roleKey,
  });

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end gap-2">
            <div className="flex-1">
              <FormField
                form={form}
                name={`${roleKey}.${index}.person`}
                label="Person in role"
                type="select"
                placeholder="Select a person"
                required={required && index === 0}
                options={PERSON_OPTIONS}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="mb-0.5 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-teal-600 hover:text-teal-700 font-medium"
          onClick={() => append({ person: "" })}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add person
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CompanyInfo({ setInitialized }) {
  const form = useForm({
    defaultValues: {
      sector: "",
      governing_body: [{ person: "" }],
      compliance_officer: [{ person: "" }],
      senior_managers: [{ person: "" }],
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    setInitialized(true);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Step 01 - Select your sector */}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
            01
          </div>
        </div>
        <div className="flex-1 space-y-3 pt-0.5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Select your sector</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Get a tailored experience to help you meet your AML/CTF obligations throughout the
              client onboarding process.
            </p>
          </div>
          <div className="max-w-xs">
            <FormField
              form={form}
              name="sector"
              label="Your sector"
              type="select"
              placeholder="Select a sector"
              required
              options={SECTOR_OPTIONS}
            />
          </div>
        </div>
      </div>

      {/* Step 02 - Assign roles */}
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-semibold">
            02
          </div>
        </div>
        <div className="flex-1 space-y-4 pt-0.5">
          <div>
            <h2 className="text-base font-semibold text-foreground">Assign roles</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Record the AML/CTF roles within your business. Select from profiles within your
              account.
            </p>
          </div>
          {ROLES.map((role) => (
            <RoleSection
              key={role.key}
              form={form}
              roleKey={role.key}
              title={role.title}
              description={role.description}
              required={role.required}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white">
          Save &amp; Continue
        </Button>
      </div>
    </form>
  );
}
