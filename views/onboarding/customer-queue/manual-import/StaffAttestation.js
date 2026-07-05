"use client";
import React from "react";
import { Controller } from "react-hook-form";

import CustomInput from "@/components/ui/CustomInput";
import FormTitle from "@/views/customer-registration/common/FormTitle";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Staff attestation — fills the Customer schema's `authorized` block
// (company_name, agent_name, title_relationship, documents_attested) instead
// of the customer self-declaration used in the remote onboarding flow.
const StaffAttestation = ({ control, errors }) => {
  return (
    <div className="mt-4 border p-4 rounded-lg space-y-4">
      <FormTitle>Staff Attestation</FormTitle>
      <p className="text-sm text-muted-foreground">
        Pre-filled from your account — adjust if another staff member sighted the documents.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Controller
          control={control}
          name="authorized.agent_name"
          render={({ field }) => (
            <CustomInput
              label="Agent Name"
              placeholder="Name of the staff member"
              {...field}
              error={errors.authorized?.agent_name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="authorized.company_name"
          render={({ field }) => (
            <CustomInput
              label="Company Name"
              {...field}
              error={errors.authorized?.company_name?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="authorized.title_relationship"
          render={({ field }) => (
            <CustomInput
              label="Title / Relationship"
              placeholder="e.g. Branch Officer"
              {...field}
              error={errors.authorized?.title_relationship?.message}
            />
          )}
        />
      </div>
      <div className="space-y-3">
        <Controller
          control={control}
          name="authorized.documents_attested"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="documents-attested"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="documents-attested" className="mb-0">
                I have sighted the original documents and attest they are true copies
              </Label>
            </div>
          )}
        />
        {errors.authorized?.documents_attested?.message && (
          <p className="text-xs text-destructive">
            {errors.authorized.documents_attested.message}
          </p>
        )}
        <Controller
          control={control}
          name="consentToScreen"
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Checkbox
                id="consent-to-screen"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="consent-to-screen" className="mb-0">
                The customer has consented to identity and AML screening
              </Label>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default StaffAttestation;
