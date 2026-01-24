"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
const EditorForm = dynamic(() => import("./Editor"), { ssr: false });
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  compliance_officer: z.string().min(1, "Compliance Officer is required"),
  industry: z.string().min(1, "Industry is required"),
  registration_date: z.string().min(1, "Registration Date is required"),
  services: z.array(z.string()).min(1, "Services is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email"),
  llm_model: z.string().min(1, "LLM Model is required"),
});
export default function PolicyForm() {
  const initialData = {
    name: "",
    address: "",
    compliance_officer: "",
    industry: "",
    registration_date: "",
    services: ["Payment Processing"],
    phone: "",
    email: "",
    llm_model: "",
  };
  const form = useForm({
    defaultValues: initialData,
    mode: "onChange",
    resolver: zodResolver(schema),
  });
  const [content, setContent] = useState(null);

  const llmModelOptions = [
    {
      label: "PHI4:Latest",
      value: "phi4:latest",
    },
    {
      label: "LLama:Latest",
      value: "llama:latest",
    },
    {
      label: "DeepSeek:7B",
      value: "deepseek-r1:7b",
    },
  ];
  const industryOptions = [
    {
      label: "Fintech",
      value: "fintech",
    },
    {
      label: "Accounting",
      value: "accounting",
    },
    {
      label: "Legal",
      value: "legal",
    },
    {
      label: "Real Estate",
      value: "real_estate",
    },
    {
      label: "Precious Metals",
      value: "precious_metals",
    },
    {
      label: "VASP",
      value: "vasp",
    },
  ];
  const services = useFieldArray({
    control: form.control,
    name: "services",
  });

  const onSubmit = (data) => {
    console.log("run");
    console.log(data);
  };
  console.log("errors", form.formState.errors);
  return (
    <div className="pb-8">
      <PageHeader>
        <PageTitle>Policy Form</PageTitle>
        <PageDescription>Create a new policy using AI</PageDescription>
      </PageHeader>
      <div className="space-y-4 max-w-xl">
        <FormField form={form} name="name" label="Name" />
        <FormField form={form} name="address" label="Address" type="textarea" />
        <FormField form={form} name="compliance_officer" label="Compliance Officer" />
        <FormField form={form} name="registration_date" label="Registration Date" type="date" />
        <div className="flex flex-col items-start gap-2">
          {services.fields.map((service, index) => {
            return (
              <div key={index} className="w-full">
                {index === 0 && <Label>Services</Label>}
                <div className="flex items-end gap-2 w-full ">
                  <Controller
                    control={form.control}
                    name={`services.${index}`}
                    render={({ field }) => <Input {...field} label="Service" className="w-full" />}
                  />
                  {index !== 0 && (
                    <Button size="icon" variant={"ghost"} onClick={() => services.remove(index)}>
                      <Trash />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          <Button variant="outline" size="sm" onClick={() => services.append("")}>
            <Plus size={14} />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField form={form} name="phone" label="Phone" />
          <FormField form={form} name="email" label="Email" />
          <FormField
            form={form}
            name="industry"
            type="select"
            options={industryOptions}
            label="Industry"
          />
          <FormField
            form={form}
            name="llm_model"
            type="select"
            options={llmModelOptions}
            label="LLM Model"
          />
        </div>
        <Button type="submit" className={"w-full"} onClick={form.handleSubmit(onSubmit)}>
          Save
        </Button>
      </div>
    </div>
  );
}
