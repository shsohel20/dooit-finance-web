"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlarmClock, FilePlus2, FileText, Receipt, SearchX, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useGetUser from "@/hooks/useGetUser";
import {
  getInvoices,
  sweepOverdueInvoices,
} from "@/app/dashboard/client/billing/actions";
import { money } from "../plans/planFormat";
import GenerateInvoiceDialog from "./GenerateInvoiceDialog";

export const INVOICE_STATUS_STYLES = {
  draft: "bg-slate-400/15 text-slate-600 dark:text-slate-300",
  open: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  overdue: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  void: "bg-slate-400/15 text-slate-500 line-through dark:text-slate-400",
};

export const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const TABS = [
  { key: "all", label: "All" },
  { key: "draft", label: "Drafts" },
  { key: "open", label: "Open" },
  { key: "overdue", label: "Overdue" },
  { key: "paid", label: "Paid" },
];

function Stat({ label, value, sub, icon: Icon, tone }) {
  return (
    <div className="flex min-h-[112px] flex-col gap-1 rounded-2xl border border-[#e9ebef] bg-white p-[17px_18px] dark:border-border dark:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#8a919b]">
          {label}
        </span>
        {Icon ? <Icon className="size-4 text-[#b0b6be]" /> : null}
      </div>
      <div
        className={`text-[25px] font-extrabold leading-tight tracking-[-0.7px] ${
          tone || "text-[#12151a] dark:text-foreground"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-[#9aa0a8]">{sub}</div>
    </div>
  );
}

export default function Invoices() {
  const router = useRouter();
  const { loggedInUser } = useGetUser();
  const isDooit = loggedInUser?.userType === "dooit";

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("all");
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    const res = await getInvoices({ limit: 100 });
    if (res.ok) setInvoices(res.data || []);
    else toast.error(res.error || "Could not load invoices");
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (tab === "all" ? invoices : invoices.filter((i) => i.status === tab)),
    [invoices, tab]
  );

  const stats = useMemo(() => {
    // Voided invoices are excluded from every total — they were withdrawn, and
    // counting them would overstate both billed and outstanding.
    const live = invoices.filter((i) => i.status !== "void");
    return {
      billed: live.reduce((s, i) => s + Number(i.total || 0), 0),
      outstanding: live
        .filter((i) => ["open", "overdue"].includes(i.status))
        .reduce((s, i) => s + Number(i.amountDue || 0), 0),
      overdue: live.filter((i) => i.status === "overdue").length,
      paid: live.filter((i) => i.status === "paid").length,
    };
  }, [invoices]);

  const onSweep = async () => {
    setBusy(true);
    const res = await sweepOverdueInvoices();
    setBusy(false);
    if (!res.ok) return toast.error(res.error || "Sweep failed");
    toast.success(
      res.data.markedOverdue
        ? `${res.data.markedOverdue} invoice(s) marked overdue`
        : "Nothing was past due"
    );
    load();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[112px] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
            Invoices
          </h1>
          <p className="mt-[3px] text-[13px] text-[#8a919b]">
            {isDooit
              ? "Period statements across every account."
              : "Your billing statements."}
          </p>
        </div>
        {isDooit && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-[10px] font-bold"
              disabled={busy}
              onClick={onSweep}
            >
              <AlarmClock className="size-4" />
              Sweep overdue
            </Button>
            <Button
              className="gap-2 rounded-[10px] font-bold"
              disabled={busy}
              onClick={() => setGenerating(true)}
            >
              <FilePlus2 className="size-4" />
              Generate invoice
            </Button>
          </div>
        )}
      </div>

      <GenerateInvoiceDialog
        open={generating}
        onOpenChange={setGenerating}
        onDone={load}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Billed"
          value={money(stats.billed)}
          sub={`${invoices.length} invoice(s)`}
          icon={Receipt}
        />
        <Stat
          label="Outstanding"
          value={money(stats.outstanding)}
          sub="open + overdue"
          icon={Wallet}
          tone={stats.outstanding > 0 ? "text-amber-600 dark:text-amber-400" : undefined}
        />
        <Stat
          label="Overdue"
          value={stats.overdue}
          sub={stats.overdue ? "past the due date" : "nothing past due"}
          icon={AlarmClock}
          tone={stats.overdue > 0 ? "text-rose-600 dark:text-rose-400" : undefined}
        />
        <Stat label="Paid" value={stats.paid} sub="settled invoices" icon={FileText} />
      </div>

      <div className="inline-flex w-fit gap-1 rounded-xl border border-[#e9ebef] bg-[#f1f3f5] p-1 dark:border-border dark:bg-muted">
        {TABS.map((t) => {
          const count =
            t.key === "all" ? invoices.length : invoices.filter((i) => i.status === t.key).length;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3.5 py-1.5 text-[12.5px] font-bold transition ${
                tab === t.key
                  ? "bg-white text-[#12151a] shadow-sm dark:bg-card dark:text-foreground"
                  : "text-[#6b7280]"
              }`}
            >
              {t.label} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
        {visible.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
              <SearchX className="size-5 text-[#9aa0a8]" />
            </div>
            <div className="text-sm font-bold text-[#4a515b] dark:text-foreground">
              No invoices here
            </div>
            <div className="mt-1 text-[12.5px] text-[#9aa0a8]">
              {isDooit
                ? "Periods are closed automatically once they end — or use Generate invoice to close one now."
                : "Invoices appear at the end of each billing period."}
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Invoice
                </TableHead>
                {isDooit && (
                  <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                    Account
                  </TableHead>
                )}
                <TableHead className="w-[110px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Period
                </TableHead>
                <TableHead className="w-[120px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Due
                </TableHead>
                <TableHead className="w-[120px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Total
                </TableHead>
                <TableHead className="w-[120px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Due amount
                </TableHead>
                <TableHead className="w-[100px] text-center text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((inv) => (
                <TableRow
                  key={inv._id}
                  className="cursor-pointer border-t border-[#f4f5f7]"
                  onClick={() =>
                    router.push(`/dashboard/client/billing/invoices/${inv._id}`)
                  }
                >
                  <TableCell>
                    <div className="text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                      {inv.invoiceNumber || "— not yet issued —"}
                    </div>
                    <div className="font-mono text-[10.5px] text-[#9aa0a8]">
                      {inv.planSnapshot?.planName} v{inv.planSnapshot?.planVersion}
                    </div>
                  </TableCell>
                  {isDooit && (
                    <TableCell className="text-[12.5px] text-[#6b7280]">
                      {inv.user?.name || inv.user?.email || "—"}
                    </TableCell>
                  )}
                  <TableCell className="text-[13px] tabular-nums text-[#6b7280]">
                    {inv.periodKey}
                  </TableCell>
                  <TableCell className="text-[13px] text-[#6b7280]">
                    {fmtDate(inv.dueAt)}
                  </TableCell>
                  <TableCell className="text-right text-[13.5px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                    {money(inv.total)}
                  </TableCell>
                  <TableCell
                    className={`text-right text-[13.5px] font-bold tabular-nums ${
                      Number(inv.amountDue) > 0
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-[#9aa0a8]"
                    }`}
                  >
                    {money(inv.amountDue)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                        INVOICE_STATUS_STYLES[inv.status] || ""
                      }`}
                    >
                      {inv.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
