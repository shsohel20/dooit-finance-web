"use client";
// Reusable per-step manual review buttons for a verification journey step
// (e.g. ID Document): Approve applies immediately, Reject opens a dialog with
// a required reason. Calls PATCH customer/:id/journeys/:journeyId/steps/:stepType/review
// via the reviewJourneyStep server action.

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
import { Textarea } from "@/components/ui/textarea";
import { IconCheck, IconLoader2, IconX } from "@tabler/icons-react";
import { reviewJourneyStep } from "@/app/dashboard/client/onboarding/customer-queue/actions";

export default function StepReviewButtons({
  customerId,
  journeyId,
  stepType,
  stepLabel = "Step",
  currentStatus,
  onUpdated,
}) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(null); // "approved" | "rejected" | null

  const submit = async (status, decisionNote) => {
    if (submitting) return;
    setSubmitting(status);
    try {
      const res = await reviewJourneyStep(customerId, journeyId, stepType, {
        status,
        note: decisionNote?.trim() || "",
      });
      if (res?.success) {
        toast.success(res.message || `${stepLabel} ${status}`);
        setRejectOpen(false);
        setNote("");
        onUpdated?.();
      } else {
        toast.error(res?.error || res?.message || "Failed to update step");
      }
    } catch (error) {
      console.error("Step review failed", error);
      toast.error("Failed to update step");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-2 text-[10px] font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          disabled={currentStatus === "approved" || !!submitting}
          onClick={() => submit("approved")}
        >
          {submitting === "approved" ? (
            <IconLoader2 className="size-3 animate-spin" />
          ) : (
            <IconCheck className="size-3" />
          )}
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-2 text-[10px] font-semibold text-red-700 border-red-200 hover:bg-red-50"
          disabled={currentStatus === "rejected" || !!submitting}
          onClick={() => setRejectOpen(true)}
        >
          <IconX className="size-3" />
          Reject
        </Button>
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="md:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject {stepLabel}</DialogTitle>
            <DialogDescription>
              The reason is recorded on the step and in the journey event log.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label className="font-bold">
              Reason <span className="text-danger">*</span>
            </Label>
            <Textarea
              placeholder="Reason for rejecting this step (required)"
              className="min-h-24"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)} disabled={!!submitting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => submit("rejected", note)}
              disabled={!note.trim() || !!submitting}
            >
              {submitting === "rejected" ? (
                <>
                  Rejecting... <IconLoader2 className="size-4 animate-spin" />
                </>
              ) : (
                "Reject Step"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
