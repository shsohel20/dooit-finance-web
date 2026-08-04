"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Eye, FilePlus2, Loader2 } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  closePeriod,
  getSubscriptions,
  previewInvoice,
} from "@/app/dashboard/client/billing/actions";

const money = (v) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(Number(v || 0));

/** '2026-07' for a date, in the same shape the API keys periods by. */
const periodKeyOf = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

/** The last 12 period keys, newest first — the realistic close window. */
function recentPeriods() {
  const out = [];
  const d = new Date();
  for (let i = 0; i < 12; i += 1) {
    out.push(periodKeyOf(new Date(d.getFullYear(), d.getMonth() - i, 1)));
  }
  return out;
}

/**
 * Close a billing period into an invoice — the manual counterpart to the hourly
 * sweep in services/billing/billingCycleJob.js.
 *
 * The sweep only closes periods that have ENDED. This exists for everything
 * else: billing a period early, re-closing one after its invoice was voided, or
 * catching up an account the sweep could not process. Both paths call the same
 * closeSubscriptionPeriod() service, so an invoice is identical either way.
 *
 * Preview first, deliberately. Closing writes an invoice AND stamps every usage
 * record it consumed as billed; the preview runs the identical rating code with
 * nothing persisted, so the operator sees the real numbers before anything is
 * committed.
 */
export default function GenerateInvoiceDialog({ open, onOpenChange, onDone }) {
  const periods = useMemo(recentPeriods, []);

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subId, setSubId] = useState("");
  // Default to LAST month: the period most likely to be closed by hand is the
  // one that just ended, not the one still accruing.
  const [periodKey, setPeriodKey] = useState(periods[1] || periods[0]);
  const [taxRate, setTaxRate] = useState("0");

  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [closing, setClosing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getSubscriptions({ status: "active", limit: 200 });
    if (res.ok) setSubs(res.data || []);
    else toast.error(res.error || "Could not load subscriptions");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      setPreview(null);
      setSubId("");
      load();
    }
  }, [open, load]);

  // Any change to what is being billed invalidates the numbers on screen.
  useEffect(() => {
    setPreview(null);
  }, [subId, periodKey, taxRate]);

  const onPreview = async () => {
    if (!subId) return toast.error("Pick an account first");
    setPreviewing(true);
    const res = await previewInvoice(subId, periodKey, Number(taxRate) || 0);
    setPreviewing(false);

    if (!res.ok) return toast.error(res.error || "Could not preview the invoice");
    setPreview({ ...res.data, usageRecords: res.meta?.usageRecords ?? 0 });
  };

  const onClose = async () => {
    setClosing(true);
    const res = await closePeriod({
      subscription: subId,
      periodKey,
      taxRatePercent: Number(taxRate) || 0,
    });
    setClosing(false);

    if (!res.ok) {
      // 409 means the period already has a live invoice — the message names it.
      return toast.error(res.error || "Could not generate the invoice");
    }

    toast.success(`Draft invoice created for ${periodKey}`, {
      description: `${res.meta?.usageRecordsBilled ?? 0} usage record(s) billed. Issue it to allocate a number.`,
    });
    onOpenChange(false);
    onDone?.();
  };

  const selected = subs.find((s) => s._id === subId);

  return (
    <Dialog open={open} onOpenChange={(o) => !closing && onOpenChange(o)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate an invoice</DialogTitle>
          <DialogDescription>
            Closes a billing period into a draft invoice and marks the usage it consumed as
            billed. Periods that have already ended are closed automatically every hour —
            this is for billing early, or re-closing after a void.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label className="text-[12.5px] font-semibold">Account</Label>
            <Select value={subId} onValueChange={setSubId} disabled={loading}>
              <SelectTrigger className="h-9 rounded-[10px] text-[13px]">
                <SelectValue
                  placeholder={loading ? "Loading…" : "Pick an active subscription"}
                />
              </SelectTrigger>
              <SelectContent>
                {subs.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.user?.name || s.user?.email || s.uid} ·{" "}
                    {s.priceSnapshot?.planName || s.planCode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!loading && subs.length === 0 && (
              <p className="text-[11.5px] text-[#9aa0a8]">
                No active subscriptions — assign a plan to a client first.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[12.5px] font-semibold">Period</Label>
              <Select value={periodKey} onValueChange={setPeriodKey}>
                <SelectTrigger className="h-9 rounded-[10px] text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                      {p === periods[0] ? " (current)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="tax" className="text-[12.5px] font-semibold">
                Tax rate %
              </Label>
              <Input
                id="tax"
                type="number"
                min="0"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="h-9 rounded-[10px] text-[13px]"
              />
            </div>
          </div>

          {periodKey === periods[0] && (
            <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11.5px] text-amber-800 dark:text-amber-300">
              This period has not ended. Usage recorded after you close it will land on the
              next invoice as a late adjustment rather than this one.
            </p>
          )}

          {/* ── Preview ────────────────────────────────────────────────────── */}
          {preview && (
            <div className="rounded-xl border border-[#e9ebef] bg-[#f7f8f9] p-3 dark:border-border dark:bg-muted">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Preview · nothing saved yet
                </span>
                <span className="text-[11.5px] text-[#8a919b]">
                  {preview.usageRecords} usage record(s)
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {(preview.lineItems || []).map((l, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 text-[12.5px]">
                    <span className="min-w-0 flex-1 truncate text-[#4a515b] dark:text-muted-foreground">
                      {l.description}
                      {/* Outside the plan and therefore charged. Flagged here
                          because this dialog is where dooit decides whether the
                          invoice is right before anything is written. */}
                      {l.isExcluded && (
                        <span className="ml-1.5 rounded bg-amber-500/15 px-1 py-[1px] text-[9.5px] font-bold uppercase text-amber-700 dark:text-amber-400">
                          outside plan
                        </span>
                      )}
                    </span>
                    <span
                      className={`shrink-0 font-semibold tabular-nums ${
                        l.isIncluded
                          ? "text-[#0e766a]"
                          : l.lineType === "discount"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : "text-[#25292f] dark:text-foreground"
                      }`}
                    >
                      {l.isIncluded
                        ? "Included"
                        : l.lineType === "discount"
                          ? `-${money(l.amount)}`
                          : money(l.amount)}
                    </span>
                  </div>
                ))}
                {(preview.lineItems || []).length === 0 && (
                  <p className="text-[12.5px] text-[#9aa0a8]">
                    Nothing to bill for this period.
                  </p>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between border-t border-[#e4e7ea] pt-2 text-[13.5px] font-extrabold dark:border-border">
                <span>Total</span>
                <span className="tabular-nums">{money(preview.total)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            className="gap-2"
            disabled={!subId || previewing || closing}
            onClick={onPreview}
          >
            {previewing ? <Loader2 className="size-4 animate-spin" /> : <Eye className="size-4" />}
            Preview
          </Button>

          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={closing}>
              Cancel
            </Button>
            {/* Gated on a preview: closing stamps usage as billed, and an
                operator should have seen the numbers before that happens. */}
            <Button
              className="gap-2 font-bold"
              disabled={!subId || !preview || closing}
              onClick={onClose}
            >
              {closing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <FilePlus2 className="size-4" />
              )}
              Generate draft
            </Button>
          </div>
        </DialogFooter>

        {selected && !preview && (
          <p className="text-[11.5px] text-[#9aa0a8]">
            Preview first to see what {selected.user?.name || "this account"} would be billed.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
