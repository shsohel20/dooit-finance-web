"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Loader2, RotateCw, Undo2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { refundPayment, retryPayment } from "@/app/dashboard/client/billing/actions";
import { money } from "../plans/planFormat";

/**
 * dooit-only refund / retry controls for a single payment row.
 *
 * Refund is partial-capable: the amount defaults to the whole payment, and the
 * API refuses anything beyond what remains unrefunded, so over-refunding is not
 * reachable from here even by typing a larger number.
 */
export default function PaymentActions({ payment, onDone }) {
  const [dialog, setDialog] = useState(null); // 'refund' | 'retry'
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  const open = (kind) => {
    setAmount(kind === "refund" ? String(Number(payment.amount) || "") : "");
    setReason("");
    setDialog(kind);
  };

  const submit = async () => {
    setBusy(true);
    const res =
      dialog === "refund"
        ? await refundPayment(payment._id, {
            amount: amount === "" ? undefined : Number(amount),
            reason: reason || undefined,
          })
        : await retryPayment(payment._id, { status: "paid" });
    setBusy(false);

    if (!res.ok) return toast.error(res.error || `Could not ${dialog}`);

    if (dialog === "refund") {
      toast.success(res.meta?.partial ? "Partial refund recorded" : "Refund recorded", {
        description: `${money(res.meta?.refundedToDate)} of ${money(res.meta?.originalAmount)} refunded — invoice now ${res.meta?.invoiceStatus}.`,
      });
    } else {
      toast.success(`Retry recorded (attempt ${res.meta?.attempt})`, {
        description: `Invoice now ${res.meta?.invoiceStatus}.`,
      });
    }
    setDialog(null);
    onDone?.();
  };

  // A refund cannot itself be refunded, and only a failed payment can be retried.
  const canRefund = payment.type === "payment" && ["paid", "refunded"].includes(payment.status);
  const canRetry = payment.type === "payment" && payment.status === "failed";
  if (!canRefund && !canRetry) return null;

  return (
    <>
      <div className="flex justify-end gap-1">
        {canRetry && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={() => open("retry")}
          >
            <RotateCw className="size-3.5" />
            Retry
          </Button>
        )}
        {canRefund && payment.status !== "refunded" && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-destructive hover:text-destructive"
            onClick={() => open("refund")}
          >
            <Undo2 className="size-3.5" />
            Refund
          </Button>
        )}
      </div>

      <Dialog open={!!dialog} onOpenChange={(o) => !o && setDialog(null)}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>
              {dialog === "refund" ? "Refund this payment?" : "Retry this payment?"}
            </DialogTitle>
            <DialogDescription>
              {dialog === "refund"
                ? "A refund is recorded as its own entry pointing at this payment — the original is never altered, so the record of what was collected stays intact."
                : "A retry is recorded as a new attempt. The failed record is kept, so the dunning history stays legible."}
            </DialogDescription>
          </DialogHeader>

          {dialog === "refund" && (
            <div className="flex flex-col gap-4 py-1">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-[#4a515b]">Amount (AUD)</Label>
                <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                  <span className="text-[13px] font-semibold text-[#98a0ab]">A$</span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    className="h-9 w-full bg-transparent text-[13px] tabular-nums outline-none"
                    inputMode="decimal"
                  />
                </div>
                <p className="text-[11.5px] text-[#9aa0a8]">
                  Full amount is {money(payment.amount)}. A smaller value records a partial
                  refund; the API refuses more than remains unrefunded.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-[#4a515b]">Reason</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Duplicate charge"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)} disabled={busy}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={busy}
              className={`gap-2 font-bold ${
                dialog === "refund" ? "bg-destructive text-white hover:bg-destructive/90" : ""
              }`}
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {dialog === "refund" ? "Refund" : "Retry"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
