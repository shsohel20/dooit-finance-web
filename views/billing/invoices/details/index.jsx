"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Ban,
  Download,
  Gauge,
  Loader2,
  Mail,
  MailCheck,
  Send,
} from "lucide-react";

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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import useGetUser from "@/hooks/useGetUser";
import {
  exportInvoicePdf,
  getInvoice,
  issueInvoice,
  sendInvoice,
  voidInvoice,
} from "@/app/dashboard/client/billing/actions";
import { money, int } from "../../plans/planFormat";
import { INVOICE_STATUS_STYLES, fmtDate } from "../index";
import InvoicePayments from "../InvoicePayments";

const LINE_LABELS = {
  base: "Plan",
  usage: "Usage",
  overage: "Overage",
  adjustment: "Adjustment",
  discount: "Discount",
  tax: "Tax",
};

export default function InvoiceDetails({ invoiceId }) {
  const router = useRouter();
  const { loggedInUser } = useGetUser();
  const isDooit = loggedInUser?.userType === "dooit";

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [sendOpen, setSendOpen] = useState(false);
  // Blank = send to the address on the account. Only ever an override for THIS
  // copy; it never changes who the invoice is addressed to.
  const [sendTo, setSendTo] = useState("");

  const load = useCallback(async () => {
    const res = await getInvoice(invoiceId);
    if (res.ok) setInvoice(res.data);
    else toast.error(res.error || "Could not load invoice");
    setLoading(false);
  }, [invoiceId]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async () => {
    const action = confirm;
    setConfirm(null);
    setBusy(true);
    // No `paid` entry: settlement is recorded through the Payments panel, which
    // produces an actual payment record rather than just flipping a status.
    const res = await {
      issue: () => issueInvoice(invoiceId, 14),
      void: () => voidInvoice(invoiceId, "Voided from the invoice page"),
    }[action]();
    setBusy(false);

    if (!res.ok) return toast.error(res.error || `Could not ${action} invoice`);

    if (action === "issue") toast.success(`Issued as ${res.data.invoiceNumber}`);
    else
      toast.success("Invoice voided", {
        description: `${res.meta?.usageReleased ?? 0} usage record(s) released — the period can be re-invoiced.`,
      });
    load();
  };

  const onSend = async () => {
    setBusy(true);
    const res = await sendInvoice(invoiceId, sendTo.trim() || null);
    setBusy(false);

    if (!res.ok) return toast.error(res.error || "Could not send the invoice");

    setSendOpen(false);
    setSendTo("");
    toast.success(res.meta?.resend ? "Invoice resent" : "Invoice sent", {
      description:
        `Delivered to ${res.meta?.sentTo || "the account"}` +
        // A send can legitimately succeed without the attachment, so say so
        // rather than letting the operator assume a PDF went out.
        (res.meta?.pdfAttached === false
          ? " — the PDF could not be generated, so the email body carries the invoice."
          : " with a PDF attached."),
    });
    load();
  };

  /**
   * The endpoint is authenticated, so the PDF comes back through a server
   * action as base64 and is turned into a download here — the same contract
   * KycExportButton uses. window.open() would send no Authorization header and
   * download a 401 page named .pdf.
   */
  const onDownloadPdf = async () => {
    setBusy(true);
    const res = await exportInvoicePdf(invoiceId);
    setBusy(false);

    if (!res.success) return toast.error(res.error || "Could not download the PDF");

    const chars = atob(res.base64);
    const bytes = new Uint8Array(chars.length);
    for (let i = 0; i < chars.length; i += 1) bytes[i] = chars.charCodeAt(i);

    const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = res.filename || `${invoice?.invoiceNumber || "invoice"}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="px-4 lg:px-6">
        <Button variant="ghost" size="sm" className="-ml-2 gap-1.5" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <p className="mt-6 text-[13px] text-[#8a919b]">
          This invoice could not be found, or is not available to your account.
        </p>
      </div>
    );
  }

  const a = invoice.allowance || {};
  const isDraft = invoice.status === "draft";

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 gap-1.5 text-[#6b7280]"
          onClick={() => router.push("/dashboard/client/billing/invoices")}
        >
          <ArrowLeft className="size-4" />
          Back to invoices
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
                {invoice.invoiceNumber || "Draft invoice"}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                  INVOICE_STATUS_STYLES[invoice.status] || ""
                }`}
              >
                {invoice.status}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#8a919b]">
              {invoice.planSnapshot?.planName} v{invoice.planSnapshot?.planVersion} ·{" "}
              {fmtDate(invoice.periodStart)} → {fmtDate(invoice.periodEnd)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* A draft has no number and nothing to reproduce yet, so the
                document actions only make sense once it is issued. Both
                parties may take the PDF — it is the same document. */}
            {!isDraft && invoice.status !== "void" && (
              <Button
                variant="outline"
                className="gap-2 rounded-[10px] font-bold"
                disabled={busy}
                onClick={onDownloadPdf}
              >
                <Download className="size-4" />
                PDF
              </Button>
            )}

            {isDooit && (
              <>
                {isDraft && (
                  <Button
                    className="gap-2 rounded-[10px] font-bold"
                    disabled={busy}
                    onClick={() => setConfirm("issue")}
                  >
                    <Send className="size-4" />
                    Issue
                  </Button>
                )}

                {!isDraft && invoice.status !== "void" && (
                  <Button
                    variant={invoice.sentAt ? "outline" : "default"}
                    className="gap-2 rounded-[10px] font-bold"
                    disabled={busy}
                    onClick={() => setSendOpen(true)}
                  >
                    {invoice.sentAt ? (
                      <MailCheck className="size-4" />
                    ) : (
                      <Mail className="size-4" />
                    )}
                    {invoice.sentAt ? "Resend" : "Email to client"}
                  </Button>
                )}

                {/* "Mark paid" lived here. It flipped the invoice status without
                    recording HOW it was paid, leaving no payment entry to refund
                    or reconcile against. Settlement now goes through the Payments
                    panel below, which produces a real record. */}
                {invoice.status !== "void" && invoice.status !== "paid" && (
                  <Button
                    variant="outline"
                    className="gap-2 rounded-[10px] font-bold text-destructive hover:text-destructive"
                    disabled={busy}
                    onClick={() => setConfirm("void")}
                  >
                    <Ban className="size-4" />
                    Void
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {invoice.status === "void" && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-[12.5px] text-rose-800 dark:text-rose-300">
          Voided {fmtDate(invoice.voidedAt)}
          {invoice.voidReason ? ` — ${invoice.voidReason}` : ""}. Its usage was released and
          can be re-invoiced.
        </div>
      )}

      {/* "Was this ever actually sent?" is the first question asked about an
          unpaid invoice, so it is stated on the record rather than inferred. */}
      {isDooit && !isDraft && invoice.status !== "void" && (
        <div
          className={`flex items-start gap-2.5 rounded-xl border p-3 text-[12.5px] ${
            invoice.sentAt
              ? "border-[#e9ebef] bg-[#f7f8f9] text-[#4a515b] dark:border-border dark:bg-muted dark:text-muted-foreground"
              : "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300"
          }`}
        >
          {invoice.sentAt ? (
            <MailCheck className="mt-0.5 size-4 shrink-0" />
          ) : (
            <Mail className="mt-0.5 size-4 shrink-0" />
          )}
          <span>
            {invoice.sentAt ? (
              <>
                Sent to <strong>{invoice.lastSentTo || "the account"}</strong> on{" "}
                {fmtDate(invoice.sentAt)}
                {invoice.sentCount > 1 ? ` · ${invoice.sentCount} times` : ""}.
              </>
            ) : (
              <>
                This invoice has been issued but <strong>not sent</strong> — the customer has
                not received it yet.
              </>
            )}
          </span>
        </div>
      )}

      {/* ── Allowance ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[#e9ebef] bg-white p-4 dark:border-border dark:bg-card">
        <Gauge className="size-4 shrink-0 text-[#8a919b]" />
        <div className="text-[12.5px] text-[#6b7280] dark:text-muted-foreground">
          {/* States the Model B rule in the customer's own numbers, so a A$0
              usage line does not read as a mistake. */}
          <strong className="text-[#25292f] dark:text-foreground">
            {int(a.used)} of {a.included == null ? "unlimited" : int(a.included)} {a.unit}s
          </strong>{" "}
          used this period.{" "}
          {a.overage > 0 ? (
            <>
              <strong>{int(a.overage)}</strong> beyond the allowance, billed at{" "}
              {money(a.overageUnitPrice)} each.
            </>
          ) : (
            <>Within the allowance, so entitled usage is included in the base fee.</>
          )}
        </div>
      </div>

      {/* ── Lines ──────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Description
              </TableHead>
              <TableHead className="w-[90px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Type
              </TableHead>
              <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Qty
              </TableHead>
              <TableHead className="w-[110px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Unit
              </TableHead>
              <TableHead className="w-[120px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* `discount` and `tax` are shown in the totals block below. They
                are still line items so the invoice reconciles against its own
                lines, but listing them here as well would show each twice. */}
            {invoice.lineItems
              .filter((l) => !["discount", "tax"].includes(l.lineType))
              .map((l, i) => (
              <TableRow key={i} className="border-t border-[#f4f5f7]">
                <TableCell className="text-[13px] text-[#25292f] dark:text-foreground">
                  {l.description}
                </TableCell>
                <TableCell className="text-[11.5px] uppercase tracking-[0.3px] text-[#9aa0a8]">
                  {LINE_LABELS[l.lineType] || l.lineType}
                  {/* Charged at list price because the plan does not cover it —
                      worth flagging next to the charge, not buried in the
                      description, since it is the reason for the amount. */}
                  {l.isExcluded && (
                    <span className="ml-1.5 rounded bg-amber-500/15 px-1.5 py-[1px] text-[9.5px] font-bold normal-case tracking-normal text-amber-700 dark:text-amber-400">
                      outside plan
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                  {l.quantity == null ? "—" : int(l.quantity)}
                </TableCell>
                <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                  {l.unitPrice == null ? "—" : money(l.unitPrice)}
                </TableCell>
                <TableCell
                  className={`text-right text-[13.5px] font-bold tabular-nums ${
                    l.isIncluded
                      ? "text-[#9aa0a8]"
                      : "text-[#12151a] dark:text-foreground"
                  }`}
                >
                  {/* A zero-amount line is INCLUDED, not free-of-charge — say so
                      rather than printing A$0.00 and inviting the question. */}
                  {l.isIncluded ? "included" : money(l.amount)}
                </TableCell>
              </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* ── Totals ───────────────────────────────────────────────────────── */}
        <div className="flex justify-end border-t-2 border-[#eef0f3] bg-[#fafbfc] p-4 dark:border-border dark:bg-muted/40">
          <div className="w-full max-w-[320px]">
            {[
              ["Subtotal", money(invoice.subtotal)],
              ...(Number(invoice.discount) > 0
                ? [
                    [
                      // Name the rate, not just the money: "Discount -A$285.00"
                      // leaves the customer to work out what they were given.
                      invoice.discountApplied?.type === "percentage"
                        ? `Discount (${invoice.discountApplied.value}%)`
                        : "Discount",
                      `-${money(invoice.discount)}`,
                    ],
                  ]
                : []),
              [`Tax (${invoice.taxRatePercent || 0}%)`, money(invoice.tax)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-1 text-[13px]">
                <span className="text-[#6b7280]">{k}</span>
                <span className="tabular-nums text-[#25292f] dark:text-foreground">{v}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t-2 border-[#eef0f3] pt-2 dark:border-border">
              <span className="text-[15px] font-extrabold text-[#25292f] dark:text-foreground">
                Total
              </span>
              <span className="text-[18px] font-extrabold tabular-nums text-[#12151a] dark:text-foreground">
                {money(invoice.total)}
              </span>
            </div>
            {Number(invoice.amountPaid) > 0 && (
              <div className="flex justify-between py-1 text-[13px]">
                <span className="text-[#6b7280]">Paid</span>
                <span className="tabular-nums text-emerald-600">
                  -{money(invoice.amountPaid)}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1 text-[13px]">
              <span className="font-bold text-[#6b7280]">Amount due</span>
              <span
                className={`font-extrabold tabular-nums ${
                  Number(invoice.amountDue) > 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600"
                }`}
              >
                {money(invoice.amountDue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <InvoicePayments invoice={invoice} isDooit={isDooit} onChanged={load} />

      <Dialog open={sendOpen} onOpenChange={(o) => !busy && setSendOpen(o)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {invoice.sentAt ? "Resend" : "Send"} {invoice.invoiceNumber}
            </DialogTitle>
            <DialogDescription>
              The invoice is emailed with a PDF attached. Leave the field blank to send it
              to the address on the account.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="send-to" className="text-[12.5px] font-semibold">
              Send this copy to
            </Label>
            <Input
              id="send-to"
              type="email"
              value={sendTo}
              onChange={(e) => setSendTo(e.target.value)}
              placeholder="Account email on file"
              className="h-9 rounded-[10px] text-[13px]"
            />
            <p className="text-[11.5px] text-[#9aa0a8]">
              An override changes where this copy is delivered only — the invoice is still
              addressed to the account it bills.
            </p>
          </div>

          {invoice.sentAt && (
            <div className="rounded-xl border border-[#e9ebef] bg-[#f7f8f9] p-3 text-[12px] text-[#6b7280] dark:border-border dark:bg-muted">
              Already sent to {invoice.lastSentTo || "the account"} on{" "}
              {fmtDate(invoice.sentAt)}. Sending again delivers another copy of the same
              invoice — the number and amounts do not change.
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSendOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={onSend} disabled={busy} className="gap-2 font-bold">
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Mail className="size-4" />}
              {invoice.sentAt ? "Resend" : "Send invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "issue" && "Issue this invoice?"}
              {confirm === "void" && "Void this invoice?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "issue" &&
                "An invoice number is allocated and the invoice becomes final — after this it can only be voided and replaced, never edited."}
              {confirm === "void" &&
                "The invoice is withdrawn and its usage records are released, so the period can be closed again. Both documents are kept."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirm === "void" ? "bg-destructive text-white hover:bg-destructive/90" : ""}
              onClick={run}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
