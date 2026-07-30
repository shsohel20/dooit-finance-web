"use client";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconBrandTelegram, IconUserPlus } from "@tabler/icons-react";
import Link from "next/link";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { sendInvite } from "@/app/dashboard/client/onboarding/customer-queue/actions";

export default function CustomerQueueHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className=" flex items-center justify-between">
        <PageHeader>
          <PageTitle>Customer Queue</PageTitle>
          <PageDescription>Manage and track all your customers</PageDescription>
        </PageHeader>
        <div className="flex items-center gap-2">
          <Button size={"sm"} variant={"outline"} className={"text-xs"} asChild>
            <Link href="/dashboard/client/onboarding/customer-queue/manual-import">
              <IconUserPlus /> Add Customer
            </Link>
          </Button>
          <Button size={"sm"} className={"text-xs"} onClick={() => setOpen(true)}>
            <IconBrandTelegram /> Send Invite
          </Button>
        </div>
      </div>
      <InvitationForm open={open} setOpen={setOpen} />
    </>
  );
}

// Matches the relationType allowlist in createInvite (api/controllers/customerController.js).
const RELATION_TYPES = [
  ["individual", "Individual"],
  ["company", "Company"],
  ["trust", "Trust"],
  ["partnership", "Partnership"],
  ["government_body", "Government Body"],
  ["association", "Association"],
  ["cooperative", "Cooperative"],
];

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  notes: z.string(),
  relationType: z.string().min(1, "Entity type is required"),
});
const InvitationForm = ({ open, setOpen }) => {
  const session = useSession();
  const initialValues = {
    email: "",
    phone: "",
    notes: "",
    relationType: "individual",
  };

  const [formData, setFormData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
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
      client: session.data?.user?.id,
      notes: data.notes,
      source: "in-branch",
      relationType: data.relationType,
    };
    console.log("dta", JSON.stringify(modifiedData, null, 2));
    const response = await sendInvite(modifiedData);
    setLoading(false);
    console.log("response => ", response);
    if (response.success) {
      toast.success("Invite sent successfully");
      setOpen(false);
      reset();
    } else {
      toast.error("Failed to send invite");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Invite</DialogTitle>
            <DialogDescription>Send invite to a new customer</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
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
              name="relationType"
              render={({ field }) => (
                <div className="grid gap-2">
                  <Label htmlFor="send-invite-relation-type">Register as</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="send-invite-relation-type">
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATION_TYPES.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.relationType?.message && (
                    <p className="text-xs text-destructive">{errors.relationType.message}</p>
                  )}
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

            {/* <div className="grid gap-2">
              <Label htmlFor="send-invite-phone">Phone</Label>
              <Input id="send-invite-phone" name="phone" placeholder="Enter phone" />
            </div> */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </span>
              ) : (
                "Send Invite"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};
