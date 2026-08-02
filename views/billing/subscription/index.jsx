"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowLeftRight,
  Ban,
  CalendarClock,
  History,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";

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
  cancelSubscription,
  getCurrentSubscription,
  getSubscription,
  getSubscriptions,
  pauseSubscription,
  resumeSubscription,
} from "@/app/dashboard/client/billing/actions";

import { money, int, SUPPORT_LABELS } from "../plans/planFormat";
import DiscountDialog from "./DiscountDialog";

const STATUS_STYLES = {
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  paused: "bg-slate-400/15 text-slate-600 dark:text-slate-300",
  cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  expired: "bg-slate-400/15 text-slate-600 dark:text-slate-300",
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-t border-[#f4f5f7] py-2 text-[12.5px] first:border-t-0 dark:border-border">
      <span className="text-[#8a919b]">{label}</span>
      <span className="text-right font-bold text-[#25292f] dark:text-foreground">{value}</span>
    </div>
  );
}

function Card({ icon: Icon, title, subtitle, children, padded = true }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
      <div className="flex items-center gap-3 border-b border-[#eef0f3] p-4 dark:border-border">
        {Icon && <Icon className="size-4 shrink-0 text-[#8a919b]" />}
        <div className="min-w-0">
          <div className="text-[15px] font-extrabold text-[#12151a] dark:text-foreground">
            {title}
          </div>
          {subtitle && <div className="mt-[2px] text-xs text-[#8a919b]">{subtitle}</div>}
        </div>
      </div>
      <div className={padded ? "p-4" : ""}>{children}</div>
    </div>
  );
}

export default function MySubscription() {
  const router = useRouter();
  const { loggedInUser } = useGetUser();
  const isDooit = loggedInUser?.userType === "dooit";

  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [discounting, setDiscounting] = useState(false);
  // dooit has no subscription of its own — `getCurrentSubscription` resolves
  // to whatever the JWT belongs to, and dooit is never a client. Without this,
  // dooit can never open an account's detail view (pause, discount, cancel are
  // all gated behind `current`), so a row in the table below sets this.
  const [selectedId, setSelectedId] = useState(null);

  const hasDiscount =
    !!current?.discount?.type &&
    current.discount.type !== "none" &&
    Number(current.discount.value) > 0;

  const load = useCallback(async () => {
    setLoading(true);
    const [cur, all] = await Promise.all([
      isDooit
        ? selectedId
          ? getSubscription(selectedId)
          : Promise.resolve({ ok: true, data: null })
        : getCurrentSubscription(),
      getSubscriptions({ limit: 50, sort: "-createdAt" }),
    ]);
    if (cur.ok) setCurrent(cur.data || null);
    if (all.ok) setHistory(all.data || []);
    else toast.error(all.error || "Could not load subscriptions");
    setLoading(false);
  }, [isDooit, selectedId]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async () => {
    const action = confirm;
    setConfirm(null);
    setBusy(true);

    const fn = {
      cancel: () => cancelSubscription(current._id),
      resume: () => resumeSubscription(current._id),
      pause: () => pauseSubscription(current._id),
    }[action];

    const res = await fn();
    setBusy(false);

    if (!res.ok) return toast.error(res.error || `Could not ${action}`);

    if (action === "cancel") {
      toast.success("Cancellation scheduled", {
        description: `Your plan runs until ${fmtDate(res.meta?.effectiveAt)}. Usage already incurred is still invoiced.`,
      });
    } else {
      toast.success(action === "resume" ? "Subscription resumed" : "Subscription paused");
    }
    load();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Skeleton className="h-16 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  const snap = current?.priceSnapshot;
  const enabled = (snap?.products || []).filter((p) => p.enabled);
  const pendingCancel = current?.cancelAtPeriodEnd && current?.status === "active";

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {isDooit && selectedId && (
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="mb-1.5 flex items-center gap-1 text-[12px] font-semibold text-[#6b7280] hover:text-[#12151a] dark:hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              All accounts
            </button>
          )}
          <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
            {isDooit ? "Subscriptions" : "My subscription"}
          </h1>
          <p className="mt-[3px] text-[13px] text-[#8a919b]">
            {isDooit
              ? selectedId
                ? "This account's subscription and its frozen pricing."
                : "Every account's subscription and its frozen pricing — click a row below to manage one."
              : "Your current plan, what it includes, and what you pay."}
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-[10px] font-bold"
          onClick={() => router.push("/dashboard/client/billing/plans")}
        >
          <ArrowLeftRight className="size-4" />
          {current ? "Change plan" : "Browse plans"}
        </Button>
      </div>

      {/* ── No subscription ────────────────────────────────────────────────── */}
      {!current && !isDooit && (
        <div className="rounded-2xl border border-[#e9ebef] bg-white px-5 py-16 text-center dark:border-border dark:bg-card">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
            <Sparkles className="size-5 text-[#9aa0a8]" />
          </div>
          <div className="text-sm font-bold text-[#4a515b] dark:text-foreground">
            No active subscription
          </div>
          <div className="mx-auto mt-1 max-w-md text-[12.5px] text-[#9aa0a8]">
            Pick a plan to start. Its pricing is frozen onto your subscription at the moment you
            subscribe, so later catalogue changes will not affect what you pay.
          </div>
          <Button
            className="mt-4 rounded-[10px] font-bold"
            onClick={() => router.push("/dashboard/client/billing/plans")}
          >
            Browse plans
          </Button>
        </div>
      )}

      {/* ── Current subscription ───────────────────────────────────────────── */}
      {current && (
        <>
          {pendingCancel && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-[12.5px] text-amber-800 dark:text-amber-300">
              <CalendarClock className="mt-0.5 size-4 shrink-0" />
              <span>
                Cancellation is scheduled for{" "}
                <strong>{fmtDate(current.currentPeriodEnd)}</strong>. The plan keeps working until
                then, and usage already incurred is still invoiced. You can undo this.
              </span>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div className="flex flex-col gap-4">
              <Card
                icon={ShieldCheck}
                title={snap?.planName || current.planCode}
                subtitle={`${current.uid} · ${current.planCode} v${current.planVersion}`}
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                      STATUS_STYLES[current.status] || ""
                    }`}
                  >
                    {current.status}
                  </span>
                  {current.changeType !== "new" && (
                    <span className="rounded-full bg-slate-400/15 px-2 py-0.5 text-[10.5px] font-bold capitalize text-slate-600 dark:text-slate-300">
                      {current.changeType}
                    </span>
                  )}
                </div>

                <Row label="Started" value={fmtDate(current.startDate)} />
                <Row
                  label="Current period"
                  value={`${fmtDate(current.currentPeriodStart)} → ${fmtDate(current.currentPeriodEnd)}`}
                />
                <Row label="Next invoice" value={fmtDate(current.nextInvoiceAt)} />
                {current.trialEndsAt && (
                  <Row label="Trial ends" value={fmtDate(current.trialEndsAt)} />
                )}
                {current.minimumTermEndsAt && (
                  <Row label="Minimum term to" value={fmtDate(current.minimumTermEndsAt)} />
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {pendingCancel ? (
                    <Button
                      className="gap-2 rounded-[10px] font-bold"
                      disabled={busy}
                      onClick={() => setConfirm("resume")}
                    >
                      <Play className="size-4" />
                      Keep my plan
                    </Button>
                  ) : (
                    current.status === "active" && (
                      <Button
                        variant="outline"
                        className="gap-2 rounded-[10px] font-bold text-destructive hover:text-destructive"
                        disabled={busy}
                        onClick={() => setConfirm("cancel")}
                      >
                        <Ban className="size-4" />
                        Cancel subscription
                      </Button>
                    )
                  )}
                  {current.status === "paused" && (
                    <Button
                      className="gap-2 rounded-[10px] font-bold"
                      disabled={busy}
                      onClick={() => setConfirm("resume")}
                    >
                      <Play className="size-4" />
                      Resume
                    </Button>
                  )}
                  {isDooit && current.status === "active" && (
                    <Button
                      variant="outline"
                      className="gap-2 rounded-[10px] font-bold"
                      disabled={busy}
                      onClick={() => setConfirm("pause")}
                    >
                      <Pause className="size-4" />
                      Pause
                    </Button>
                  )}
                </div>
              </Card>

              {/* Entitlements come from the SNAPSHOT, not the live plan — this is
                  what the customer actually bought. */}
              {/* These entitlements come from the SNAPSHOT and deliberately do
                  NOT change when dooit publishes a new plan version — that is
                  the immutability guarantee, not a stale read. Said plainly here
                  because "the plan changed but my page didn't" otherwise looks
                  like a bug. */}
              <Card
                icon={Sparkles}
                title="What's included"
                subtitle={`${enabled.length} products · as sold on ${fmtDate(snap?.snapshotAt)} (${snap?.planName} v${current.planVersion})`}
                padded={false}
              >
                {enabled.length === 0 ? (
                  <p className="px-4 py-8 text-center text-[12.5px] text-[#9aa0a8]">
                    No products on this subscription.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-[11.5px] font-bold uppercase text-[#98a0ab]">
                          Product
                        </TableHead>
                        <TableHead className="w-[130px] text-right text-[11.5px] font-bold uppercase text-[#98a0ab]">
                          Included
                        </TableHead>
                        <TableHead className="w-[130px] text-right text-[11.5px] font-bold uppercase text-[#98a0ab]">
                          Unit price
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enabled.map((p) => (
                        <TableRow key={p.code} className="border-t border-[#f4f5f7]">
                          <TableCell className="max-w-0">
                            <div className="truncate text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                              {p.name}
                            </div>
                            <div className="truncate font-mono text-[10.5px] text-[#9aa0a8]">
                              {p.code}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                            {p.includedQuantity ? int(p.includedQuantity) : "—"}
                          </TableCell>
                          <TableCell className="text-right text-[13px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                            {p.unitPrice == null ? (
                              <span className="font-normal text-[#9aa0a8]">list price</span>
                            ) : (
                              money(p.unitPrice)
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </Card>
            </div>

            {/* ── Frozen pricing rail ──────────────────────────────────────── */}
            <div className="flex flex-col gap-4 lg:sticky lg:top-4">
              <Card icon={ShieldCheck} title="Your price">
                <div className="mb-3 flex items-baseline gap-1">
                  <span className="text-[28px] font-extrabold tracking-[-1px] text-[#12151a] dark:text-foreground">
                    {snap?.isCustomPriced ? "Custom" : money(snap?.basePrice)}
                  </span>
                  {!snap?.isCustomPriced && (
                    <span className="text-[13px] font-semibold text-[#9aa0a8]">
                      /{snap?.billingCycle === "yearly" ? "yr" : "mo"}
                    </span>
                  )}
                </div>
                <Row
                  label="Included / mo"
                  value={
                    snap?.includedUsage
                      ? `${int(snap.includedUsage)} ${snap.includedUnit}s`
                      : `Unlimited ${snap?.includedUnit || "unit"}s`
                  }
                />
                <Row
                  label="Overage"
                  value={`${money(snap?.overagePrice)} / ${snap?.includedUnit}`}
                />
                <Row label="Tiers" value={snap?.tiers?.length || 0} />
                <Row label="SLA" value={snap?.slaTarget === "none" ? "—" : snap?.slaTarget} />
                <Row label="Support" value={SUPPORT_LABELS[snap?.supportLevel] || "—"} />
                {/* The discount sits with the price it changes, not with the
                    plan commercials above it — it is a term of this deal, and
                    unlike everything else on this card it is not frozen. */}
                {hasDiscount && (
                  <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-emerald-700 dark:text-emerald-400">
                        Discount applied
                      </span>
                      <span className="text-[13.5px] font-extrabold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {current.discount.type === "percentage"
                          ? `${current.discount.value}%`
                          : money(current.discount.value)}
                      </span>
                    </div>
                    {current.discount.reason && (
                      <p className="mt-1 text-[11.5px] text-[#6b7280]">
                        {current.discount.reason}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-[#9aa0a8]">
                      Applied to the subtotal of each new invoice.
                    </p>
                  </div>
                )}

                {isDooit && current.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full gap-2 rounded-[10px] font-bold"
                    onClick={() => setDiscounting(true)}
                  >
                    <Tag className="size-3.5" />
                    {hasDiscount ? "Change discount" : "Apply a discount"}
                  </Button>
                )}

                <p className="mt-3 border-t border-[#f4f5f7] pt-3 text-[11.5px] leading-relaxed text-[#9aa0a8] dark:border-border">
                  Frozen when you subscribed, from <strong>{snap?.planName} v
                  {current.planVersion}</strong>. If a newer version of that plan
                  is published, this pricing and the included products stay as
                  they are — moving to it is an explicit change you make from
                  Pricing Plans.
                </p>
              </Card>

              <Card icon={ShieldCheck} title="What you can change">
                <Row
                  label="Upgrade"
                  value={snap?.changePolicy?.allowUpgrade ? "Allowed" : "Not allowed"}
                />
                <Row
                  label="Downgrade"
                  value={snap?.changePolicy?.allowDowngrade ? "Allowed" : "Not allowed"}
                />
                <Row
                  label="Cancel"
                  value={snap?.changePolicy?.allowCancel ? "Allowed" : "Contact support"}
                />
                <Row
                  label="Minimum term"
                  value={
                    snap?.changePolicy?.minimumTermMonths
                      ? `${snap.changePolicy.minimumTermMonths} months`
                      : "None"
                  }
                />
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ── History ────────────────────────────────────────────────────────── */}
      {/* For a client this recaps their own past plan changes, so it is hidden
          when there is nothing beyond the current row. For dooit it is the ONLY
          way to reach an account's detail view — it must stay visible even
          while one is selected, or there would be no way to switch accounts. */}
      {(isDooit ? history.length > 0 : history.length > (current ? 1 : 0)) && (
        <Card
          icon={History}
          title="Subscription history"
          subtitle="Plan changes supersede rather than overwrite — each row keeps its own frozen pricing"
          padded={false}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11.5px] font-bold uppercase text-[#98a0ab]">
                  Subscription
                </TableHead>
                {isDooit && (
                  <TableHead className="text-[11.5px] font-bold uppercase text-[#98a0ab]">
                    Account
                  </TableHead>
                )}
                <TableHead className="w-[120px] text-[11.5px] font-bold uppercase text-[#98a0ab]">
                  Change
                </TableHead>
                <TableHead className="w-[120px] text-right text-[11.5px] font-bold uppercase text-[#98a0ab]">
                  Price
                </TableHead>
                <TableHead className="w-[160px] text-[11.5px] font-bold uppercase text-[#98a0ab]">
                  Period
                </TableHead>
                <TableHead className="w-[110px] text-center text-[11.5px] font-bold uppercase text-[#98a0ab]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((s) => (
                <TableRow
                  key={s._id}
                  onClick={isDooit ? () => setSelectedId(s._id) : undefined}
                  className={`border-t border-[#f4f5f7] ${
                    isDooit ? "cursor-pointer hover:bg-[#f7f8f9] dark:hover:bg-muted/40" : ""
                  } ${
                    selectedId === s._id ? "bg-[#f0fdfa] dark:bg-emerald-500/[0.08]" : ""
                  }`}
                >
                  <TableCell>
                    <div className="text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                      {s.priceSnapshot?.planName || s.planCode}
                    </div>
                    <div className="font-mono text-[10.5px] text-[#9aa0a8]">
                      {s.uid} · v{s.planVersion}
                    </div>
                  </TableCell>
                  {isDooit && (
                    <TableCell className="text-[12.5px] text-[#6b7280]">
                      {s.user?.name || s.user?.email || "—"}
                    </TableCell>
                  )}
                  <TableCell className="text-[12.5px] capitalize text-[#6b7280]">
                    {s.changeType}
                  </TableCell>
                  <TableCell className="text-right text-[13px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                    {money(s.priceSnapshot?.basePrice)}
                  </TableCell>
                  <TableCell className="text-[12.5px] text-[#6b7280]">
                    {fmtDate(s.currentPeriodStart)} → {fmtDate(s.currentPeriodEnd)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                        STATUS_STYLES[s.status] || ""
                      }`}
                    >
                      {s.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "cancel" && "Cancel your subscription?"}
              {confirm === "resume" && "Keep your subscription?"}
              {confirm === "pause" && "Pause this subscription?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "cancel" &&
                `Your plan keeps working until ${fmtDate(current?.currentPeriodEnd)}, then stops. Usage already incurred in this period is still invoiced. You can undo this at any point before then.`}
              {confirm === "resume" &&
                "The scheduled cancellation is removed and billing continues as normal."}
              {confirm === "pause" &&
                "Billing stops at the end of the current cycle and the service becomes unavailable to the customer."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              className={
                confirm === "cancel" ? "bg-destructive text-white hover:bg-destructive/90" : ""
              }
              onClick={run}
            >
              {confirm === "cancel" ? "Cancel subscription" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DiscountDialog
        open={discounting}
        onOpenChange={setDiscounting}
        subscription={current}
        onSaved={load}
      />
    </div>
  );
}
