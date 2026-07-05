"use client";
import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";

import LabelDetails from "@/components/LabelDetails";
import CustomInput from "@/components/ui/CustomInput";
import FormTitle from "@/views/customer-registration/common/FormTitle";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ReviewStep = ({ form }) => {
  const { control } = form;
  const errors = form.formState.errors;
  const data = useWatch({ control });

  const documents = [
    ...(data.documents || []),
    ...(data.selfie?.url ? [{ ...data.selfie, type: "selfie" }] : []),
  ].filter((d) => d?.url);

  const runSumsubCheck = data.runSumsubCheck !== false;

  return (
    <div className="mt-4 space-y-8">
      <div>
        <FormTitle>Review &amp; Submit</FormTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 py-6">
          <LabelDetails label="First Name" value={data.customer_details?.given_name} />
          <LabelDetails label="Middle Name" value={data.customer_details?.middle_name} />
          <LabelDetails label="Last Name" value={data.customer_details?.surname} />
          <LabelDetails label="Date of Birth" value={data.customer_details?.date_of_birth} />
          <LabelDetails label="Email" value={data.contact_details?.email} />
          <LabelDetails label="Phone" value={data.contact_details?.phone} />
          <LabelDetails label="Document Type" value={data.document_type?.label} />
          <LabelDetails label="Document / ID Number" value={data.identificationNo} />
          <LabelDetails label="Occupation" value={data.employment_details?.occupation} />
          <LabelDetails label="Employer" value={data.employment_details?.employer_name} />
          <LabelDetails label="Industry" value={data.employment_details?.industry} />
          <LabelDetails label="Residential Address" value={data.residential_address?.address} />
          <LabelDetails label="Suburb" value={data.residential_address?.suburb} />
          <LabelDetails label="State" value={data.residential_address?.state} />
          <LabelDetails label="Postcode" value={data.residential_address?.postcode} />
          <LabelDetails label="Country" value={data.residential_address?.country?.value} />
          <LabelDetails label="Source of Funds" value={data.funds_wealth?.source_of_funds} />
          <LabelDetails label="Source of Wealth" value={data.funds_wealth?.source_of_wealth} />
          <LabelDetails
            label="Reason Of Opening Account"
            value={data.funds_wealth?.account_purpose}
          />
          <LabelDetails
            label="Estimated Trading Volume"
            value={data.funds_wealth?.estimated_trading_volume}
          />
          <LabelDetails
            label="Sole Trader"
            value={data.sole_trader?.is_sole_trader ? "Yes" : "No"}
          />
          <LabelDetails label="Attested By" value={data.authorized?.agent_name} />
        </div>
      </div>

      {documents.length > 0 && (
        <div>
          <h4 className="text-md font-bold tracking-tighter">Documents</h4>
          <div className="flex flex-wrap py-4 gap-2">
            {documents.map((document, index) => (
              <div key={document.url + index} className="space-y-1">
                <div className={cn("h-[160px] aspect-3/4 rounded-md overflow-hidden border")}>
                  <img
                    src={document.url}
                    alt={document.name || document.type}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center capitalize">
                  {document.type}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 max-w-2xl">
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <CustomInput
              label="Notes"
              type="textarea"
              rows={3}
              placeholder="Internal notes about this import (stored on the customer relation)"
              {...field}
              error={errors.notes?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="runSumsubCheck"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="run-sumsub-check"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="run-sumsub-check" className="mb-0">
                Run identity verification after import
              </Label>
            </div>
          )}
        />

        {runSumsubCheck && documents.length === 0 && (
          <Alert>
            <AlertTitle>No documents uploaded</AlertTitle>
            <AlertDescription>
              The identity check will be skipped — the customer will stay in Pending until
              documents are added and verification is run from the customer&apos;s detail page.
            </AlertDescription>
          </Alert>
        )}
        {runSumsubCheck && documents.length > 0 && !data.selfie?.url && (
          <Alert>
            <AlertTitle>No selfie uploaded</AlertTitle>
            <AlertDescription>
              The identity check may stay incomplete without a customer photo. You can add one
              later from the customer&apos;s detail page.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
