"use client";
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { FormField } from "@/components/ui/FormField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import SelectCustomerList from "@/components/ui/SelectCustomerList";
import { toast } from "sonner";
import { createTransaction, getTransactionById } from "@/app/dashboard/client/transactions/actions";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { updateTransaction } from "@/app/dashboard/client/transactions/actions";

const initialTransactionData = {
  type: "",
  subtype: "",
  amount: 0,
  currency: "",
  reference: "",
  narrative: "",
  status: "",
  channel: "",
  sender: {
    id: {
      label: "",
      value: "",
    }, //Customer Id
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
    id: {
      label: "",
      value: "",
    }, //Customer Id//can be
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

const TransactionForm = ({ id }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const data = useSession();
  console.log("user data", data);

  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: initialTransactionData,
  });

  const fetchTransactionById = async () => {
    setIsFetching(true);
    try {
      const response = await getTransactionById(id);
      console.log("response by id", response?.data);
      if (response.success) {
        const data = response.data;
        const formData = {
          type: data.type,
          subtype: data.subtype,
          amount: data.amount,
          currency: data.currency,
          reference: data.reference,
          narrative: data.narrative,
          status: data.status,
          channel: data.channel,
          sender: {
            ...data.sender,
            id: {
              label: data.sender.name,
              value: data.sender.id,
            },
          },
          receiver: {
            ...data.receiver,
            id: {
              label: data.receiver.name,
              value: data.receiver.id,
            },
          },
          beneficiary: data.beneficiary,
          purpose: data.purpose,
          remittancePurposeCode: data.remittancePurposeCode,
          metadata: data.metadata,
        };
        console.log("formData", formData);
        form.reset(formData);
      } else {
        toast.error("Failed to fetch transaction by id");
      }
    } catch (error) {
      console.error("Failed to fetch transaction by id", error);
    } finally {
      setIsFetching(false);
    }
    // console.log("response by id", response);
    //  form.reset(response?.data);
  };
  useEffect(() => {
    if (id) {
      fetchTransactionById(id);
    }
  }, [id]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const data = form.getValues();

    console.log("submittedData", data);
    const customer = data?.user?.id;
    try {
      const submittedData = {
        ...data,
        customer,
        sender: {
          ...data.sender,
          id: data.sender.id.value,
          name: data.sender.id.label,
        },
        receiver: {
          ...data.receiver,
          id: data.receiver.id.value,
          name: data.receiver.id.label,
        },
      };
      console.log("submittedData", submittedData);
      console.log("submittedData", JSON.stringify(submittedData, null, 2));
      const action = id ? updateTransaction : createTransaction;
      const response = await action(submittedData);
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
      setIsSubmitting(false);
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
                loading={isFetching}
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
                loading={isFetching}
              />
              <FormField
                form={form}
                name="amount"
                label="Amount"
                type="number"
                loading={isFetching}
              />
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
                loading={isFetching}
              />
              <FormField
                form={form}
                name="Reference"
                label="Reference"
                type="text"
                loading={isFetching}
              />
              <FormField
                form={form}
                name="Narrative"
                label="Narrative"
                type="text"
                loading={isFetching}
              />
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
                loading={isFetching}
              />
            </div>
          </div>
          <div className="border p-4 rounded-lg space-y-4">
            <h4 className="text-base font-bold ">Transaction Participants</h4>
            <div className="">
              <div className="space-y-8">
                {/* receiver */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border p-4 rounded-lg">
                  <SelectCustomerList
                    form={form}
                    name="receiver.id"
                    label="Receiver"
                    type="text"
                    loading={isFetching}
                    onChange={(value) => {
                      form.setValue("receiver.id", value);
                      // form.setValue("receiver.name", value.label);
                    }}
                    value={form.watch("receiver.id")}
                  />
                  <FormField
                    form={form}
                    name="receiver.account"
                    label="Receiver Account"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="receiver.institution"
                    label="Receiver Institution"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="receiver.institutionCountry"
                    label="Receiver Institution Country"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="receiver.bic"
                    label="Receiver BIC"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="receiver.address"
                    label="Receiver Address"
                    type="text"
                    loading={isFetching}
                  />
                </div>
                {/* sender */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border p-4 rounded-lg">
                  <SelectCustomerList
                    form={form}
                    name="sender.id"
                    label="Sender"
                    value={form.watch("sender.id")}
                    onChange={(value) => {
                      form.setValue("sender.id", value);
                      // form.setValue("sender.name", value.label);
                    }}
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="sender.account"
                    label="Sender Account"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="sender.institution"
                    label="Sender Institution"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="sender.institutionCountry"
                    label="Sender Institution Country"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="sender.bic"
                    label="Sender BIC"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="sender.address"
                    label="Sender Address"
                    type="text"
                    loading={isFetching}
                  />
                </div>
                {/* beneficiary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 border p-4 rounded-lg">
                  <FormField
                    form={form}
                    name="beneficiary.name"
                    label="Beneficiary"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="beneficiary.account"
                    label="Beneficiary Account"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="beneficiary.institution"
                    label="Beneficiary Institution"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="beneficiary.institutionCountry"
                    label="Beneficiary Institution Country"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="beneficiary.bic"
                    label="Beneficiary BIC"
                    type="text"
                    loading={isFetching}
                  />
                  <FormField
                    form={form}
                    name="beneficiary.address"
                    label="Beneficiary Address"
                    type="text"
                    loading={isFetching}
                  />
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
              loading={isFetching}
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
              loading={isFetching}
            />
            <FormField
              form={form}
              name="Metadata"
              label="Metadata"
              type="text"
              loading={isFetching}
            />
          </div>
          <div className="flex ">
            <Button
              disabled={isSubmitting}
              className={"w-full"}
              onClick={handleSubmit}
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
