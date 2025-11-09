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

export function AddressSection({ control, errors }) {
  return (
    <Card className={"shadow-none"}>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
        <CardDescription>Company location details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="address.street"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...field}
                placeholder="House number and street name"
                error={errors.address?.street?.message}
              />
            </div>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="address.city"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...field}
                  placeholder="City"
                  error={errors.address?.city?.message}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="address.state"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  {...field}
                  error={errors.address?.state?.message}
                  placeholder="State or province"
                />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            control={control}
            name="address.country"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...field}
                  placeholder="Country"
                  error={errors.address?.country?.message}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="address.zipcode"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="zipcode">Zip/Postal Code</Label>
                <Input
                  id="zipcode"
                  {...field}
                  placeholder="Postal code"
                  error={errors.address?.zipcode?.message}
                />
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
