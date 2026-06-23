"use client";

import { getAllEntityTypes } from "@/app/dashboard/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";

export function CompanyInfoSection({ control, errors, setValue, id }) {
  const [entityTypes, setEntityTypes] = useState([]);
  useEffect(() => {
    const fetchEntityTypes = async () => {
      const response = await getAllEntityTypes();
      setEntityTypes(response.data);
    };
    fetchEntityTypes();
  }, []);

  // The Client Type select stores the entity type *name* (label). Keep the
  // companion `clientTypeId` in sync with the matching EntityType _id so the
  // form submits both. Runs on user selection and on edit-mode hydration once
  // the entity types have loaded. Also tolerates a value that is already an id.
  const clientTypeValue = useWatch({ control, name: "clientType" });
  useEffect(() => {
    if (!setValue || !entityTypes?.length || !clientTypeValue) return;
    const match = entityTypes.find(
      (t) =>
        t.label === clientTypeValue ||
        String(t.value) === String(clientTypeValue) ||
        String(t._id) === String(clientTypeValue),
    );
    if (match) setValue("clientTypeId", String(match._id ?? match.value ?? ""));
  }, [entityTypes, clientTypeValue, setValue]);
  //client Types
  //   Bank / Financial Institution
  // VASPs / Crypto Exchanges / Wallets
  // Accountants / Auditors
  // Legal / Real Estate
  // Precious Metals / Dealers

  const clientTypes = [
    {
      label: "Bank / Financial Institution",
      value: "Bank",
    },
    {
      label: "VASPs / Crypto Exchanges / Wallets",
      value: "Financial",
    },
    {
      label: "Accountants / Auditors",
      value: "Accountants / Auditors",
    },
    {
      label: "Legal / Real Estate",
      value: "Real Estate",
    },
    {
      label: "Precious Metals / Dealers",
      value: "Insurance",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];
  return (
    <Card className={"shadow-none"}>
      <CardHeader>
        <CardTitle>Company Information</CardTitle>
        <CardDescription>Basic details about your company</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Identity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="name">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  {...field}
                  placeholder="Enter company name"
                  error={errors.name?.message}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="clientType"
            render={({ field }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="clientType">
                    Client Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="clientType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map((type) => (
                        <SelectItem key={type.label} value={type.label}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.clientType?.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.clientType.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Identifiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="registrationNumber"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input id="registrationNumber" {...field} placeholder="e.g., REG-2025-001" />
              </div>
            )}
          />
          <Controller
            control={control}
            name="taxId"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  {...field}
                  placeholder="e.g., TAX-0001"
                  error={errors.taxId?.message}
                />
              </div>
            )}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...field}
                  placeholder="company@example.com"
                  error={errors.email?.message}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  {...field}
                  error={errors.phone?.message}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            )}
          />
        </div>

        {/* Web & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="website"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  {...field}
                  error={errors.website?.message}
                  placeholder="https://example.com"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select id="status" value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
