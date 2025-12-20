"use client";
import React from "react";
import { PageHeader, PageTitle, PageDescription } from "@/components/common";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import SelectCustomerList from "@/components/ui/SelectCustomerList";
import { toast } from "sonner";
import { createTransaction } from "@/app/dashboard/client/transactions/actions";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

const initialTransactionData = {
  customer: "6906cf020acf10ef6ab1ffd3",
  client: "68fe70605a026bb521a8ae28",
  branch: "690023e27106f190b5d1cd12",
  type: "",
  subtype: "",
  amount: 0,
  currency: "",
  reference: "",
  narrative: "",
  status: "",
  channel: "",
  sender: {
    id: "", //Customer Id
    name: "",
    account: "",
    institution: "",
    institutionCountry: "",
    bic: "",
    address: "",
    extra: {
      customerRef: "",
    },
  },
  receiver: {
    id: "", //Customer Id//can be
    name: "",
    account: "",
    institution: "",
    institutionCountry: "",
    bic: "",
    address: "",
  },
  beneficiary: {
    name: "",
    account: "",
    institution: "",
    institutionCountry: "",
    address: "",
  },
  purpose: "",
  remittancePurposeCode: "",
  metadata: {
    ip: "203.0.113.5",
    deviceId: "device-abc-123",
  },
};

const TransactionForm = () => {
  const [formData, setFormData] = useState(initialTransactionData);
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();
  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: formData,
  });
  const handleSubmit = async () => {
    setIsSubmitting(true)
    const data = form.getValues();

    console.log("submittedData", data);
    try {
      const response = await createTransaction(data);
      console.log("response", response);
      if (response.success) {
        toast.success("Transaction created successfully!");
        localStorage.setItem("newId", response.data?._id);
        router.push(`/dashboard/client/transactions`);
      } else {
        toast.error("Failed to create transaction!");
      }
    } catch (error) {
      toast.error("Failed to create transaction!");
    } finally {
      setIsSubmitting(false)
    }
  };
  return (
    <div className="mb-8">
      <Card>
        <CardContent className="space-y-6">

          <div className="space-y-4 border p-4 rounded-lg">
            <h4 className="text-base font-bold">Transaction Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
              <FormField
                form={form}
                name="type"
                label="Transaction Type"
                type="select"
                options={[
                  { label: "Deposit", value: "deposit" },
                  { label: "Withdrawal", value: "withdrawal" },
                  { label: "Transfer", value: "transfer" },
                  { label: "Exchange", value: "exchange" },
                  { label: "Other", value: "other" },
                ]}
              />
              <FormField
                form={form}
                name="subtype"
                label="Transaction Subtype"
                type="select"
                options={[
                  { label: "Wire Transfer", value: "wire" },
                  { label: "Spot FX", value: "spotfx" },
                  { label: "OTC", value: "otc" },
                ]}
              />
              <FormField form={form} name="amount" label="Amount" type="number" />
              <FormField
                form={form}
                name="currency"
                label="Currency"
                type="select"
                options={[
                  { label: "AUD", value: "AUD" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                  { label: "GBP", value: "GBP" },
                  { label: "Other", value: "other" },
                ]}
              />
              <FormField form={form} name="Reference" label="Reference" type="text" />
              <FormField form={form} name="Narrative" label="Narrative" type="text" />
              <FormField
                form={form}
                name="status"
                label="Status"
                type="select"
                options={[
                  { label: "Pending", value: "pending" },
                  { label: "Completed", value: "completed" },
                  { label: "Failed", value: "failed" },
                  { label: "Cancelled", value: "cancelled" },
                ]}
              />
              <FormField
                form={form}
                name="channel"
                label="Channel"
                type="select"
                placeholder="Select channel"
                options={[
                  { label: "Mobile App", value: "Mobile App" },
                  { label: "Branch", value: "Branch" },
                  { label: "Online", value: "online" },
                ]}
              />
            </div>
          </div>
          <div className="border p-4 rounded-lg space-y-4">
            <h4 className="text-base font-bold ">Transaction Participants</h4>
            <div className="">
              <div className="space-y-8">
                {/* receiver */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border p-4 rounded-lg">
                  <SelectCustomerList form={form} name="receiver.id" label="Receiver" type="text" onChange={(value) => {
                    const personalDetails = value.personalKyc.personal_form?.customer_details;
                    const name = personalDetails?.given_name + " " + personalDetails?.surname;
                    form.setValue("receiver.id", value._id);
                    form.setValue("receiver.name", name);
                  }} />
                  <FormField form={form} name="receiver.account" label="Receiver Account" type="text" />
                  <FormField form={form} name="receiver.institution" label="Receiver Institution" type="text" />
                  <FormField form={form} name="receiver.institutionCountry" label="Receiver Institution Country" type="text" />
                  <FormField form={form} name="receiver.bic" label="Receiver BIC" type="text" />
                  <FormField form={form} name="receiver.address" label="Receiver Address" type="text" />
                </div>
                {/* sender */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border p-4 rounded-lg">
                  <SelectCustomerList
                    form={form}
                    name="sender.id"
                    label="Sender"
                    onChange={(value) => {
                      const personalDetails = value.personalKyc.personal_form?.customer_details;
                      const name = personalDetails?.given_name + " " + personalDetails?.surname;
                      form.setValue("sender.id", value._id);
                      form.setValue("sender.name", name);
                    }}
                  />
                  <FormField form={form} name="sender.account" label="Sender Account" type="text" />
                  <FormField form={form} name="sender.institution" label="Sender Institution" type="text" />
                  <FormField form={form} name="sender.institutionCountry" label="Sender Institution Country" type="text" />
                  <FormField form={form} name="sender.bic" label="Sender BIC" type="text" />
                  <FormField form={form} name="sender.address" label="Sender Address" type="text" />
                </div>
                {/* beneficiary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border p-4 rounded-lg">
                  <FormField form={form} name="beneficiary.name" label="Beneficiary" type="text" />
                  <FormField form={form} name="beneficiary.account" label="Beneficiary Account" type="text" />
                  <FormField form={form} name="beneficiary.institution" label="Beneficiary Institution" type="text" />
                  <FormField form={form} name="beneficiary.institutionCountry" label="Beneficiary Institution Country" type="text" />
                  <FormField form={form} name="beneficiary.bic" label="Beneficiary BIC" type="text" />
                  <FormField form={form} name="beneficiary.address" label="Beneficiary Address" type="text" />
                </div>
              </div>

            </div>
          </div>
          <div className="border p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FormField
              form={form}
              name="Purpose"
              label="Purpose"
              type="select"
              options={[
                { label: "Supplier Payment", value: "supplier_payment" },
                { label: "Customer Payment", value: "customer_payment" },
                { label: "Other", value: "other" },
              ]}
            />
            <FormField
              form={form}
              name="Remittance Purpose Code"
              label="Remittance Purpose Code"
              type="text"
            />
            <FormField form={form} name="Metadata" label="Metadata" type="text" />

          </div>
          <div className="flex ">
            <Button disabled={isSubmitting} className={'w-full'} onClick={handleSubmit} type="submit">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {isSubmitting ? 'Saving...' : "Save"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
