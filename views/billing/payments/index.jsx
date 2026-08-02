"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDownLeft, ArrowUpRight, SearchX, TriangleAlert, Wallet } from "lucide-react";

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
import { getPayments } from "@/app/dashboard/client/billing/actions";
import { money } from "../plans/planFormat";
import PaymentActions from "./PaymentActions";
import {
  PAYMENT_STATUS_STYLES,
  METHOD_LABELS,
  fmtDateTime,
  signedAmount,
} from "./paymentFormat";

const TABS = [
  { key: "all", label: "All" },
  { key: "paid", label: "Settled" },
  { key: "failed", label: "Failed" },
  { key: "refunded", label: "Refunded" },
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

export default function Payments() {
  const router = useRouter();
  const { loggedInUser } = useGetUser();
  const isDooit = loggedInUser?.userType === "dooit";

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const load = useCallback(async () => {
    const res = await getPayments({ limit: 200 });
    if (res.ok) setPayments(res.data || []);
    else toast.error(res.error || "Could not load payments");
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (tab === "all" ? payments : payments.filter((p) => p.status === tab)),
    [payments, tab]
  );

  const stats = useMemo(() => {
    // A refunded payment still COLLECTED money at the time; what reverses it is
    // the refund entry. Only `type` decides direction — never `status`.
    const settled = payments.filter((p) => ["paid", "refunded"].includes(p.status));
    const collected = settled
      .filter((p) => p.type === "payment")
      .reduce((s, p) => s + Number(p.amount || 0), 0);
    const refunded = settled
      .filter((p) => p.type === "refund")
      .reduce((s, p) => s + Number(p.amount || 0), 0);
    return {
      collected,
      refunded,
      net: collected - refunded,
      failures: payments.filter((p) => p.status === "failed").length,
    };
  }, [payments]);

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
      <div>
        <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
          Payments
        </h1>
        <p className="mt-[3px] text-[13px] text-[#8a919b]">
          {isDooit
            ? "Settlement, retries and refunds across every account."
            : "Your payment history."}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Collected"
          value={money(stats.collected)}
          sub="successful payments"
          icon={ArrowDownLeft}
        />
        <Stat
          label="Refunded"
          value={money(stats.refunded)}
          sub="returned to the customer"
          icon={ArrowUpRight}
        />
        <Stat label="Net" value={money(stats.net)} sub="collected − refunded" icon={Wallet} />
        <Stat
          label="Failures"
          value={stats.failures}
          sub={stats.failures ? "needing a retry" : "none"}
          icon={TriangleAlert}
          tone={stats.failures > 0 ? "text-rose-600 dark:text-rose-400" : undefined}
        />
      </div>

      <div className="inline-flex w-fit gap-1 rounded-xl border border-[#e9ebef] bg-[#f1f3f5] p-1 dark:border-border dark:bg-muted">
        {TABS.map((t) => {
          const count =
            t.key === "all" ? payments.length : payments.filter((p) => p.status === t.key).length;
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
              No payments here
            </div>
            <div className="mt-1 text-[12.5px] text-[#9aa0a8]">
              Payments appear once an invoice is issued and settled.
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Payment
                </TableHead>
                {isDooit && (
                  <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                    Account
                  </TableHead>
                )}
                <TableHead className="w-[150px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Invoice
                </TableHead>
                <TableHead className="w-[140px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Method
                </TableHead>
                <TableHead className="w-[130px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Amount
                </TableHead>
                <TableHead className="w-[110px] text-center text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Status
                </TableHead>
                {isDooit && <TableHead className="w-[160px]" />}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((p) => {
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
                      </div>
                    </TableCell>
                    {isDooit && (
                      <TableCell className="text-[12.5px] text-[#6b7280]">
                        {p.user?.name || p.user?.email || "—"}
                      </TableCell>
                    )}
                    <TableCell>
                      <button
                        type="button"
                        className="text-[12.5px] font-semibold text-primary hover:underline"
                        onClick={() =>
                          p.invoice?._id &&
                          router.push(`/dashboard/client/billing/invoices/${p.invoice._id}`)
                        }
                      >
                        {p.invoice?.invoiceNumber || p.invoice?.periodKey || "—"}
                      </button>
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
                        <PaymentActions payment={p} onDone={load} />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
