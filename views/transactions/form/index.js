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

const initialTransactionData = {
  customer: "6906cf020acf10ef6ab1ffd3",
  client: "68fe70605a026bb521a8ae28",
  branch: "690023e27106f190b5d1cd12",
  type: "transfer",
  subtype: "wire",
  amount: 15000,
  currency: "AUD",
  reference: "INV-2025-0001",
  narrative: "Payment for invoice #2025-0001",
  status: "pending",
  channel: "Branch",
  sender: {
    id: "6906cf020acf10ef6ab1ffd3", //Customer Id
    name: "Acme Pty Ltd",
    account: "AU123456789",
    institution: "Big Bank",
    institutionCountry: "Australia",
    bic: "BIGBAU2S",
    address: "1 Bank St, Sydney",
    extra: {
      customerRef: "CUST-001",
    },
  },
  receiver: {
    id: "6906cf020acf10ef6ab1ffd3", //Customer Id//can be
    name: "Nurul Islam",
    account: "6325322",
    institution: "AB Bank",
    institutionCountry: "Bangladesh",
    bic: "B62254",
    address: "Golshan ,Dhaka",
  },
  beneficiary: {
    name: "NextTech Solutions",
    account: "AU987654321",
    institution: "Local Bank",
    institutionCountry: "Australia",
    address: "10 Pitt Street, Sydney",
  },
  purpose: "supplier_payment",
  remittancePurposeCode: "S01",
  metadata: {
    ip: "203.0.113.5",
    deviceId: "device-abc-123",
  },
};

const TransactionForm = () => {
  const [formData, setFormData] = useState(initialTransactionData);
  const form = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: formData,
  });
  return (
    <div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FormField
              form={form}
              name="Type"
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
              name="Subtype"
              label="Transaction Subtype"
              type="select"
              options={[
                { label: "Wire Transfer", value: "wire" },
                { label: "Spot FX", value: "spotfx" },
                { label: "OTC", value: "otc" },
              ]}
            />
            <FormField form={form} name="Amount" label="Amount" type="number" />
            <FormField
              form={form}
              name="Currency"
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
              name="Status"
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
              name="Channel"
              label="Channel"
              type="select"
              placeholder="Select channel"
              options={[
                { label: "Mobile App", value: "Mobile App" },
                { label: "Branch", value: "Branch" },
                { label: "Online", value: "online" },
              ]}
            />
            <FormField form={form} name="Sender" label="Sender" type="text" />
            <SelectCustomerList form={form} name="receiver" label="Receiver" type="text" />
            <SelectCustomerList form={form} name="sender" label="Sender" />

            <FormField form={form} name="Beneficiary" label="Beneficiary" type="text" />
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
            <Button type="submit">Submit</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionForm;
