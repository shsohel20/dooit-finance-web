"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { sendInviteForScanQR } from "./action";
import { toast } from "sonner";
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  notes: z.string(),
});
export default function ScanQRPage() {
  const client = useSearchParams().get("client") || null;
  const branch = useSearchParams().get("branch") || null;

  const initialValues = {
    email: "",
    phone: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });
  const onSubmit = async (data) => {
    setLoading(true);
    const modifiedData = {
      contact: {
        email: data.email,
        phone: data.phone,
      },
      client: client,
      branch: branch,
      notes: data.notes,
      source: "in-branch",
      onboardingChannel: "app",
    };

    const response = await sendInviteForScanQR(modifiedData);
    setLoading(false);
    console.log("response => ", response);
    if (response.success) {
      router.push(response?.data?.url);
      reset();
    } else {
      toast.error("Failed to send invite");
    }
  };

  if (!client && !branch) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="grid gap-4 max-w-md mx-auto w-full border p-4 rounded-md">
          <h1 className="text-2xl font-bold">Invalid QR Code</h1>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="grid gap-4 max-w-md mx-auto w-full border p-4 rounded-md">
        <div>
          <h1 className="text-2xl font-bold">Get Onboarding Link</h1>
          <p className="text-sm text-muted-foreground">Fill the form to get a onboarding link</p>
        </div>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor="send-invite-email">Email</Label>
              <Input
                id="send-invite-email"
                name="email"
                placeholder="example@example.com"
                error={errors.email?.message}
                {...field}
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor="send-invite-phone">Phone</Label>
              <Input
                id="send-invite-phone"
                name="phone"
                placeholder="Enter phone"
                {...field}
                error={errors.phone?.message}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="notes"
          render={({ field }) => (
            <div className="grid gap-2">
              <Label htmlFor="send-invite-notes">Notes</Label>
              <Input
                type="textarea"
                rows={3}
                id="send-invite-notes"
                name="notes"
                placeholder="Enter notes"
                {...field}
                error={errors.notes?.message}
              />
            </div>
          )}
        />
        <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Sending...
            </span>
          ) : (
            "Send Invite"
          )}
        </Button>

        {/* <div className="grid gap-2">
              <Label htmlFor="send-invite-phone">Phone</Label>
              <Input id="send-invite-phone" name="phone" placeholder="Enter phone" />
            </div> */}
      </div>
    </div>
  );
}
