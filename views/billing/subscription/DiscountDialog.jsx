"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Percent, Tag } from "lucide-react";

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

import { updateSubscriptionDiscount } from "@/app/dashboard/client/billing/actions";
import { money } from "../plans/planFormat";

const TYPES = [
  { value: "percentage", label: "Percentage", hint: "% off the invoice subtotal" },
  { value: "fixed", label: "Fixed amount", hint: "A$ off the invoice subtotal" },
];

/**
 * Set, change or clear a subscription's negotiated discount. dooit only.
 *
 * The live estimate against the base fee is the point of this dialog: "15%" and
 * "A$285" are the same concession, but only one of them is checkable against
 * what was agreed with the customer. Percentage and fixed are one keystroke
 * apart and a mis-set type is invisible afterwards — a 15 meant as a percentage
 * but saved as fixed is A$15 off A$1,900, and nothing downstream can tell.
 */
export default function DiscountDialog({ open, onOpenChange, subscription, onSaved }) {
  const existing = subscription?.discount;
  const basePrice = Number(subscription?.priceSnapshot?.basePrice) || 0;

  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setType(existing?.type && existing.type !== "none" ? existing.type : "percentage");
    setValue(existing?.value && existing.type !== "none" ? String(existing.value) : "");
    setReason(existing?.reason || "");
    setError(null);
  }, [open, existing]);

  const n = Number(value);
  const valid = Number.isFinite(n) && n > 0 && (type !== "percentage" || n <= 100);
  // Against the base fee only — real subtotals also carry overage and any
  // unentitled usage, neither of which is known until the period closes.
  const estimate = !valid ? 0 : type === "percentage" ? (basePrice * n) / 100 : Math.min(n, basePrice);

  const save = async (clearing = false) => {
    if (!clearing && !valid) {
      return setError(
        type === "percentage"
          ? "Enter a percentage between 0 and 100"
          : "Enter an amount greater than zero"
      );
    }
    setSaving(true);
    const res = await updateSubscriptionDiscount(
      subscription._id,
      clearing ? { type: "none" } : { type, value: n, reason: reason.trim() || null }
    );
    setSaving(false);

    if (!res.ok) return setError(res.error || "Could not save the discount");
    toast.success(clearing ? "Discount removed" : "Discount applied", {
      description: clearing
        ? "Future invoices will bill at the full plan price."
        : `Takes effect on the next invoice. About ${money(res.meta?.estimatedOnBaseFee ?? estimate)} off the base fee.`,
    });
    onOpenChange(false);
    onSaved?.();
  };

  const hasExisting = existing?.type && existing.type !== "none";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag className="size-4" />
            {hasExisting ? "Change discount" : "Apply a discount"}
          </DialogTitle>
          <DialogDescription>
            Applies to the whole invoice subtotal, from the next close onwards.
            Invoices already issued keep the discount they were billed with.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground">
              Type
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => {
                    setType(t.value);
                    setError(null);
                  }}
                  className={`rounded-xl border p-3 text-left transition ${
                    type === t.value
                      ? "border-[#0e9384] bg-[#0e9384]/[0.06]"
                      : "border-[#e9ebef] hover:border-[#cdd2d8] dark:border-border"
                  }`}
                >
                  <div className="text-[13px] font-bold text-[#12151a] dark:text-foreground">
                    {t.label}
                  </div>
                  <div className="text-[11px] text-[#9aa0a8]">{t.hint}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="discount-value"
              className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground"
            >
              {type === "percentage" ? "Percentage" : "Amount"}
            </Label>
            <div className="relative">
              {type === "fixed" && (
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#9aa0a8]">
                  A$
                </span>
              )}
              <Input
                id="discount-value"
                inputMode="decimal"
                placeholder={type === "percentage" ? "15" : "250.00"}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                className={type === "fixed" ? "pl-9" : "pr-9"}
              />
              {type === "percentage" && (
                <Percent className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9aa0a8]" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="discount-reason"
              className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground"
            >
              Reason
            </Label>
            <Input
              id="discount-reason"
              placeholder="Launch partner, service credit, negotiated term…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <p className="text-[11.5px] text-[#9aa0a8]">
              Printed on every invoice this discount touches, and kept with it.
            </p>
          </div>

          {valid && basePrice > 0 && (
            <div className="rounded-xl border border-[#e9ebef] bg-[#f7f8f9] p-3 dark:border-border dark:bg-muted">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[#6b7280]">Base fee</span>
                <span className="tabular-nums">{money(basePrice)}</span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[#6b7280]">Discount</span>
                <span className="tabular-nums text-emerald-700 dark:text-emerald-400">
                  −{money(estimate)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-[#e4e7ea] pt-1 text-[13px] font-extrabold dark:border-border">
                <span>Base fee after discount</span>
                <span className="tabular-nums">{money(basePrice - estimate)}</span>
              </div>
              <p className="mt-1.5 text-[11px] text-[#9aa0a8]">
                Overage and anything used outside the plan are added on top, then
                discounted at the same rate.
              </p>
            </div>
          )}

          {error && <p className="text-[12px] text-destructive">{error}</p>}
        </div>

        <DialogFooter className="sm:justify-between">
          {hasExisting ? (
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={saving}
              onClick={() => save(true)}
            >
              Remove discount
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="gap-2 font-bold" disabled={saving} onClick={() => save(false)}>
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              {hasExisting ? "Update" : "Apply"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
