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
import { Controller } from "react-hook-form";

export function LegalSection({ control, errors }) {
  return (
    <Card className={"shadow-none"}>
      <CardHeader>
        <CardTitle>Legal Representative</CardTitle>
        <CardDescription>
          Information about your legal representative
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="legalRepresentative.name"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="legal-name">Name</Label>
                <Input
                  id="legal-name"
                  {...field}
                  placeholder="Full name"
                  error={errors.legalRepresentative?.name?.message}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="legalRepresentative.designation"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="legal-designation">Designation</Label>
                <Input
                  id="legal-designation"
                  {...field}
                  placeholder="Job title"
                  error={errors.legalRepresentative?.designation?.message}
                />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="legalRepresentative.email"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="legal-email">Email</Label>
                <Input
                  id="legal-email"
                  type="email"
                  {...field}
                  placeholder="email@example.com"
                  error={errors.legalRepresentative?.email?.message}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="legalRepresentative.phone"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="legal-phone">Phone</Label>
                <Input
                  id="legal-phone"
                  {...field}
                  placeholder="+1 (555) 000-0000"
                  error={errors.legalRepresentative?.phone?.message}
                />
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
