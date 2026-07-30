"use client";
// Reusable manual KYC decision button (approve / reject / status change).
// Opens a dialog with a status select + audit note and calls
// PATCH customer/:id/kyc-status via the updateCustomerKycStatus server action.
// Used on the customer queue details page and as a per-row action in the list.

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusPill } from "@/components/ui/StatusPill";
import { Textarea } from "@/components/ui/textarea";
import { IconLoader2, IconUserCheck } from "@tabler/icons-react";
import { updateCustomerKycStatus } from "@/app/dashboard/client/onboarding/customer-queue/actions";

const STATUS_OPTIONS = [
  { value: "verified", label: "Approve (Verified)" },
  { value: "rejected", label: "Reject" },
  { value: "in_review", label: "In Review" },
  { value: "pending", label: "Pending" },
];

const statusVariants = {
  pending: "warning",
  rejected: "danger",
  verified: "success",
  in_review: "info",
};

export default function KycStatusButton({
  customerId,
  currentStatus,
  onUpdated,
  label = "Update KYC Status",
  iconOnly = false,
  size = "sm",
  variant = "outline",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const noteRequired = status === "rejected";
  const canSubmit = status && status !== currentStatus && (!noteRequired || note.trim());

  const handleOpen = (e) => {
    // Table rows open details on double-click — keep this click contained.
    e?.stopPropagation?.();
    setStatus("");
    setNote("");
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const res = await updateCustomerKycStatus(customerId, {
        status,
        note: note.trim(),
      });
      if (res?.success) {
        toast.success(res.message || "KYC status updated");
        setOpen(false);
        onUpdated?.();
      } else {
        toast.error(res?.error || res?.message || "Failed to update KYC status");
      }
    } catch (error) {
      console.error("KYC status update failed", error);
      toast.error("Failed to update KYC status");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {iconOnly ? (
        <Button
          variant={variant}
          size="icon"
          className={className}
          onClick={handleOpen}
          title="Update KYC status"
        >
          <IconUserCheck />
        </Button>
      ) : (
        <Button className={`text-xs ${className}`} size={size} variant={variant} onClick={handleOpen}>
          {label} <IconUserCheck className="size-4" />
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="md:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Update KYC Status</DialogTitle>
            <DialogDescription>
              Manual compliance decision — recorded in the customer&apos;s KYC history.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2">
            <Label className="font-bold">Current Status</Label>
            <StatusPill variant={statusVariants[currentStatus] || "muted"}>
              {currentStatus || "unknown"}
            </StatusPill>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold">New Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.filter((o) => o.value !== currentStatus).map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="font-bold">
              Note {noteRequired ? <span className="text-danger">*</span> : "(optional)"}
            </Label>
            <Textarea
              placeholder={
                noteRequired ? "Reason for rejection (required)" : "Add a note for the KYC history"
              }
              className="min-h-24"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
              {submitting ? (
                <>
                  Saving... <IconLoader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Save Decision"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
