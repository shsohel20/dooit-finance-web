"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller } from "react-hook-form";

export function CompanyInfoSection({
  control,
  errors,
  formData,
  setFormData,
  id,
}) {
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData?.name}
                  {...field}
                  placeholder="Enter company name"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="userName"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  {...field}
                  placeholder="Enter username"
                  disabled={!!id}
                />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="clientType"
            render={({ field }) => {
              return (
                <div className="space-y-2">
                  <Label htmlFor="clientType">Client Type</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="clientType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {clientTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="registrationNumber"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  {...field}
                  placeholder="e.g., REG-2025-001"
                />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
                <Label htmlFor="phone">Phone</Label>
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
      </CardContent>
    </Card>
  );
}
