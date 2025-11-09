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
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.settings?.billingCycle?.message}
                >
                  <SelectTrigger id="billingCycle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />
          <Controller
            control={control}
            name="settings.currency"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.settings?.currency?.message}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="BDT">BDT (৳)</SelectItem>
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
