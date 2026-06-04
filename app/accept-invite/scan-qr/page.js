"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { getClientInfo, sendInviteForScanQR } from "./action";
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
  const [clientData, setClientData] = useState(null);
  useEffect(() => {
    const fetchClientData = async () => {
      const response = await getClientInfo(client);
      const brandColor = response.data?.settings?.color;
      localStorage.setItem("brandColor", brandColor);
      setClientData(response.data);
    };
    fetchClientData();
  }, [client]);
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
    if (response.success) {
      // console.log("response", response);
      // const token = response?.data?.token;
      // localStorage.setItem("invite_token", token);
      console.log("response", JSON.stringify(response?.data?.url, null, 2));
      // router.push(response?.data?.url);
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
  const clientSettings = {
    ...clientData?.settings,
    name: clientData?.name,
  };
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="grid gap-4 max-w-md md:w-full mx-auto w-[90%] border p-4 rounded-md">
        <div className="flex  items-center gap-4 ">
          <div className="size-16 rounded-lg overflow-hidden border-2">
            <img
              src={clientSettings?.logo}
              alt={clientSettings?.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="">
            <h5 className="text-lg font-bold">{clientSettings?.name}</h5>
            <p className="text-sm text-muted-foreground">Fill the form to get a onboarding link</p>
          </div>
        </div>
        {/* <div>
          <h4 className=" font-bold">Get Onboarding Link</h4>
        </div> */}
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <div className="grid ">
              <Label htmlFor="send-invite-email" className={"uppercase"}>
                Email
              </Label>
              <Input
                id="send-invite-email"
                name="email"
                type="email"
                placeholder="example@example.com"
                className={"!py-5 "}
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
            <div className="grid ">
              <Label htmlFor="send-invite-phone" className={"uppercase"}>
                Phone
              </Label>
              <Input
                id="send-invite-phone"
                name="phone"
                placeholder="Enter phone"
                className={"!py-5 "}
                {...field}
                error={errors.phone?.message}
              />
            </div>
          )}
        />
        {/* <Controller
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
        /> */}
        <Button
          style={{ backgroundColor: clientSettings?.color }}
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="!py-6 text-sm hover:opacity-90"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Get Link
            </span>
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
