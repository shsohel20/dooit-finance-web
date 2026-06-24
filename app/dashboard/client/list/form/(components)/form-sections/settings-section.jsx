"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

export function SettingsSection({ control, errors }) {
  return (
    <Card className={"shadow-none"}>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Configure billing and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="settings.billingCycle"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="billingCycle">
                  Billing Cycle <span className="text-destructive">*</span>
                </Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="billingCycle">
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
                {errors.settings?.billingCycle?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.settings.billingCycle.message}
                  </p>
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name="settings.currency"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="currency">
                  Currency <span className="text-destructive">*</span>
                </Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="BDT">BDT (৳)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.settings?.currency?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.settings.currency.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
