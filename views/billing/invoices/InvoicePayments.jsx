"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getInvoicePayments,
  recordPayment,
} from "@/app/dashboard/client/billing/actions";
import { money } from "../plans/planFormat";
import PaymentActions from "../payments/PaymentActions";
import {
  PAYMENT_STATUS_STYLES,
  METHOD_LABELS,
  METHODS,
  fmtDateTime,
  signedAmount,
} from "../payments/paymentFormat";

/**
 * Payment history for one invoice, with the dooit-only record/refund/retry
 * controls. Replaces the earlier "mark paid" placeholder, which set the invoice
 * status without leaving any record of HOW it was paid.
 */
export default function InvoicePayments({ invoice, isDooit, onChanged }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ amount: "", method: "bank_transfer", reference: "", failed: false });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await getInvoicePayments(invoice._id);
    if (res.ok) {
      setRows(res.data || []);
      setMeta(res.meta || null);
    }
    setLoading(false);
  }, [invoice._id]);

  useEffect(() => {
    load();
  }, [load]);

  const openDialog = () => {
    setForm({
      // Default to the outstanding balance — the overwhelmingly common case,
      // and the API refuses anything above it anyway.
      amount: String(Number(invoice.amountDue) || ""),
      method: "bank_transfer",
      reference: "",
      failed: false,
    });
    setDialog(true);
  };

  const submit = async () => {
    setBusy(true);
    const res = await recordPayment({
      invoice: invoice._id,
      amount: form.amount === "" ? undefined : Number(form.amount),
      method: form.method,
      transactionId: form.reference.trim() || undefined,
      status: form.failed ? "failed" : "paid",
      failureReason: form.failed ? "Recorded as failed" : undefined,
    });
    setBusy(false);

    if (!res.ok) return toast.error(res.error || "Could not record the payment");

    if (res.meta?.duplicate) {
      toast.info("Already recorded", { description: res.meta.note });
    } else {
      toast.success(form.failed ? "Failure recorded" : "Payment recorded", {
        description: `Invoice is now ${res.meta?.invoiceStatus}${
          res.meta?.amountDue != null ? ` — ${money(res.meta.amountDue)} outstanding.` : "."
        }`,
      });
    }
    setDialog(false);
    load();
    onChanged?.();
  };

  const canRecord =
    isDooit && ["open", "overdue"].includes(invoice.status) && Number(invoice.amountDue) > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#eef0f3] p-4 dark:border-border">
        <CreditCard className="size-4 shrink-0 text-[#8a919b]" />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-extrabold text-[#12151a] dark:text-foreground">
            Payments
          </div>
          {meta && (
            <div className="mt-[2px] text-xs text-[#8a919b]">
              {money(meta.collected)} collected
              {meta.refunded > 0 ? ` · ${money(meta.refunded)} refunded` : ""} ·{" "}
              {money(meta.net)} net
              {meta.failures > 0 ? ` · ${meta.failures} failed attempt(s)` : ""}
            </div>
          )}
        </div>
        {canRecord && (
          <Button
            variant="outline"
            className="h-9 gap-2 rounded-[10px] font-bold"
            onClick={openDialog}
          >
            <Plus className="size-4" />
            Record payment
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 p-4">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="px-4 py-10 text-center text-[12.5px] text-[#9aa0a8]">
          Nothing recorded against this invoice yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Entry
              </TableHead>
              <TableHead className="w-[140px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Method
              </TableHead>
              <TableHead className="w-[120px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Amount
              </TableHead>
              <TableHead className="w-[100px] text-center text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Status
              </TableHead>
              {isDooit && <TableHead className="w-[150px]" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const signed = signedAmount(p);
              return (
                <TableRow key={p._id} className="border-t border-[#f4f5f7]">
                  <TableCell>
                    <div className="flex items-center gap-2 text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                      {p.uid}
                      {p.type === "refund" && (
                        <span className="rounded bg-slate-400/15 px-1.5 py-[1px] text-[9.5px] font-bold uppercase text-slate-600">
                          refund
                        </span>
                      )}
                      {p.retryCount > 0 && (
                        <span className="rounded bg-amber-500/15 px-1.5 py-[1px] text-[9.5px] font-bold uppercase text-amber-700">
                          attempt {p.retryCount + 1}
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-[#9aa0a8]">
                      {fmtDateTime(p.paidAt || p.failedAt || p.createdAt)}
                      {p.failureReason ? ` · ${p.failureReason}` : ""}
                      {p.refundReason ? ` · ${p.refundReason}` : ""}
                    </div>
                  </TableCell>
                  <TableCell className="text-[12.5px] text-[#6b7280]">
                    {p.methodLabel || METHOD_LABELS[p.method] || p.method}
                  </TableCell>
                  <TableCell
                    className={`text-right text-[13.5px] font-bold tabular-nums ${
                      signed < 0
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-[#12151a] dark:text-foreground"
                    }`}
                  >
                    {signed < 0 ? `-${money(Math.abs(signed))}` : money(signed)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                        PAYMENT_STATUS_STYLES[p.status] || ""
                      }`}
                    >
                      {p.status}
                    </span>
                  </TableCell>
                  {isDooit && (
                    <TableCell>
                      <PaymentActions
                        payment={p}
                        onDone={() => {
                          load();
                          onChanged?.();
                        }}
                      />
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Record a payment</DialogTitle>
            <DialogDescription>
              Against {invoice.invoiceNumber} — {money(invoice.amountDue)} outstanding.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-1">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-[#4a515b]">Amount (AUD)</Label>
              <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <span className="text-[13px] font-semibold text-[#98a0ab]">A$</span>
                <input
                  value={form.amount}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, amount: e.target.value.replace(/[^0-9.]/g, "") }))
                  }
                  className="h-9 w-full bg-transparent text-[13px] tabular-nums outline-none"
                  inputMode="decimal"
                />
              </div>
              <p className="text-[11.5px] text-[#9aa0a8]">
                Less than the balance records a partial payment. More is refused — a credit
                balance has nowhere to live yet.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-[#4a515b]">Method</Label>
              <select
                value={form.method}
                onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}
                className="h-9 rounded-md border border-input bg-background px-3 text-[13px]"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {METHOD_LABELS[m]}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-[#4a515b]">Reference</Label>
              <Input
                value={form.reference}
                onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                placeholder="Bank or gateway reference (optional)"
                className="font-mono text-[13px]"
              />
              <p className="text-[11.5px] text-[#9aa0a8]">
                Supplying one makes the entry idempotent — recording it twice is a no-op
                rather than a double credit.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-[#eef0f3] bg-[#fafbfc] p-3 dark:border-border dark:bg-muted/40">
              <input
                type="checkbox"
                checked={form.failed}
                onChange={(e) => setForm((f) => ({ ...f, failed: e.target.checked }))}
                className="mt-0.5"
              />
              <span>
                <span className="block text-[13px] font-bold text-[#25292f] dark:text-foreground">
                  Record as a failed attempt
                </span>
                <span className="block text-[11.5px] text-[#8a919b]">
                  Logs the attempt for the dunning history. The invoice stays owing.
                </span>
              </span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={busy} className="gap-2 font-bold">
              {busy && <Loader2 className="size-4 animate-spin" />}
              Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
