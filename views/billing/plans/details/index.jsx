"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Boxes,
  Gauge,
  Layers,
  Pencil,
  Rocket,
  ShieldCheck,
  UserPlus,
  Users,
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
  archivePlan,
  createPlanVersion,
  getPlan,
  publishPlan,
} from "@/app/dashboard/client/billing/actions";

import {
  allowanceLabel,
  headlinePrice,
  int,
  money,
  STATUS_STYLES,
  SUPPORT_LABELS,
  VISIBILITY_STYLES,
} from "../planFormat";
import AssignPlanDialog from "../AssignPlanDialog";

const MODEL_LABELS = {
  flat: "Flat monthly fee",
  usage: "Per unit (usage)",
  tiered: "Tiered volume",
  hybrid: "Base fee + overage",
};

function Card({ icon: Icon, title, subtitle, action, children, padded = true }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
      <div className="flex items-center gap-3 border-b border-[#eef0f3] p-4 dark:border-border">
        {Icon && <Icon className="size-4 shrink-0 text-[#8a919b]" />}
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-extrabold text-[#12151a] dark:text-foreground">
            {title}
          </div>
          {subtitle && <div className="mt-[2px] text-xs text-[#8a919b]">{subtitle}</div>}
        </div>
        {action}
      </div>
      <div className={padded ? "p-4" : ""}>{children}</div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-t border-[#f4f5f7] py-2 text-[12.5px] first:border-t-0 dark:border-border">
      <span className="text-[#8a919b]">{label}</span>
      <span className="text-right font-bold text-[#25292f] dark:text-foreground">{value}</span>
    </div>
  );
}

export default function PlanDetails({ planId }) {
  const router = useRouter();
  const { loggedInUser } = useGetUser();
  const isDooit = loggedInUser?.userType === "dooit";

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getPlan(planId);
    if (res.ok) setPlan(res.data);
    else toast.error(res.error || "Could not load plan");
    setLoading(false);
  }, [planId]);

  useEffect(() => {
    load();
  }, [load]);

  const enabled = useMemo(
    () => (plan?.products || []).filter((p) => p.enabled),
    [plan]
  );

  const runAction = async () => {
    const action = confirm;
    setConfirm(null);
    setBusy(true);
    const fn = { publish: publishPlan, archive: archivePlan, "new-version": createPlanVersion }[
      action
    ];
    const res = await fn(planId);
    setBusy(false);

    if (!res.ok) return toast.error(res.error || `Could not ${action} plan`);

    if (action === "new-version") {
      toast.success(`Draft v${res.data.version} created`);
      return router.push(`/dashboard/client/billing/plans/${res.data._id}/edit`);
    }
    if (action === "publish") {
      toast.success(`${plan.name} published`, {
        description: res.meta?.archivedPreviousVersions
          ? `${res.meta.archivedPreviousVersions} previous version(s) archived.`
          : undefined,
      });
    } else {
      toast.success(`${plan.name} archived`);
    }
    load();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Skeleton className="h-20 rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="px-4 lg:px-6">
        <Button variant="ghost" size="sm" className="-ml-2 gap-1.5" onClick={() => router.back()}>
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <p className="mt-6 text-[13px] text-[#8a919b]">
          This plan could not be found, or is not available to your account.
        </p>
      </div>
    );
  }

  const { price, suffix } = headlinePrice(plan);
  const isDraft = plan.status === "draft";
  const accent = plan.accentColor || "#0e766a";

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 gap-1.5 text-[#6b7280]"
          onClick={() => router.push("/dashboard/client/billing/plans")}
        >
          <ArrowLeft className="size-4" />
          Back to plans
        </Button>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ background: accent }}
                aria-hidden
              />
              <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
                {plan.name}
              </h1>
              <span
                className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                  STATUS_STYLES[plan.status] || ""
                }`}
              >
                {plan.status}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                  VISIBILITY_STYLES[plan.visibility] || ""
                }`}
              >
                {plan.visibility}
              </span>
              {plan.popular && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-extrabold text-white"
                  style={{ background: accent }}
                >
                  MOST POPULAR
                </span>
              )}
            </div>
            <p className="mt-1 font-mono text-[11.5px] text-[#9aa0a8]">
              {plan.uid} · {plan.code} · v{plan.version}
            </p>
            {plan.tagline && (
              <p className="mt-1 text-[13px] text-[#8a919b]">{plan.tagline}</p>
            )}
          </div>

          {isDooit && (
            <div className="flex flex-wrap gap-2">
              {isDraft && (
                <>
                  <Button
                    variant="outline"
                    className="gap-2 rounded-[10px] font-bold"
                    onClick={() =>
                      router.push(`/dashboard/client/billing/plans/${planId}/edit`)
                    }
                  >
                    <Pencil className="size-4" />
                    Edit draft
                  </Button>
                  <Button
                    className="gap-2 rounded-[10px] font-bold"
                    disabled={busy}
                    onClick={() => setConfirm("publish")}
                  >
                    <Rocket className="size-4" />
                    Publish
                  </Button>
                </>
              )}
              {plan.status === "published" && (
                <>
                  {/* The only route by which a quote-only plan is ever sold —
                      selfServe:false means a client cannot subscribe itself. */}
                  <Button
                    className="gap-2 rounded-[10px] font-bold"
                    disabled={busy}
                    onClick={() => setAssigning(true)}
                  >
                    <UserPlus className="size-4" />
                    Assign to client
                  </Button>
                  {plan.visibility === "private" && (
                    <Button
                      variant="outline"
                      className="gap-2 rounded-[10px] font-bold"
                      onClick={() =>
                        router.push(`/dashboard/client/billing/plans/${planId}/access`)
                      }
                    >
                      <Users className="size-4" />
                      Manage access
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="gap-2 rounded-[10px] font-bold"
                    disabled={busy}
                    onClick={() => setConfirm("new-version")}
                  >
                    New version
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-[10px] font-bold"
                    disabled={busy}
                    onClick={() => setConfirm("archive")}
                  >
                    Archive
                  </Button>
                </>
              )}
              {plan.status === "archived" && (
                <Button
                  variant="outline"
                  className="rounded-[10px] font-bold"
                  disabled={busy}
                  onClick={() => setConfirm("new-version")}
                >
                  New version from this
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {plan.status === "published" && (
        <div className="flex items-start gap-2.5 rounded-xl border border-[#e9ebef] bg-[#fafbfc] p-3 text-[12.5px] text-[#6b7280] dark:border-border dark:bg-muted/40">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <span>
            This version is <strong>published and frozen</strong>. Pricing and entitlements below
            cannot change — create a new version to alter them. Existing subscribers keep billing
            from their own snapshot regardless.
          </span>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex flex-col gap-4">
          {/* ── Volume pricing tiers ─────────────────────────────────────── */}
          <Card
            icon={Gauge}
            title="Volume pricing tiers"
            subtitle="Applied automatically as monthly volume grows"
            padded={false}
          >
            {plan.tiers?.length ? (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab]">
                      Monthly volume
                    </TableHead>
                    <TableHead className="w-[160px] text-[11.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab]">
                      Unit price
                    </TableHead>
                    <TableHead className="w-[140px] text-[11.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab]">
                      Discount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plan.tiers.map((t, i) => (
                    <TableRow key={i} className="border-t border-[#f4f5f7]">
                      <TableCell className="text-[13.5px] font-semibold tabular-nums text-[#25292f] dark:text-foreground">
                        {int(t.from)} – {t.to == null ? "∞" : int(t.to)}
                      </TableCell>
                      <TableCell className="text-[13.5px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                        {money(t.unitPrice)}
                      </TableCell>
                      <TableCell className="text-[13px] font-bold text-emerald-600">
                        {t.discountPercent ? `${t.discountPercent}%` : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="px-4 py-8 text-center text-[12.5px] text-[#9aa0a8]">
                No volume tiers — the flat overage price of{" "}
                <strong>{money(plan.overagePrice)}</strong> per {plan.includedUnit} applies above
                the allowance.
              </p>
            )}
          </Card>

          {/* ── Product entitlements ─────────────────────────────────────── */}
          <Card
            icon={Boxes}
            title="Product entitlements"
            subtitle={`${enabled.length} of ${plan.products?.length ?? 0} products included`}
            padded={false}
          >
            {enabled.length === 0 ? (
              <p className="px-4 py-8 text-center text-[12.5px] text-[#9aa0a8]">
                No products enabled. A plan cannot be published without at least one.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab]">
                      Product
                    </TableHead>
                    <TableHead className="w-[110px] text-[11.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab]">
                      Unit
                    </TableHead>
                    <TableHead className="w-[130px] text-right text-[11.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab]">
                      Included
                    </TableHead>
                    <TableHead className="w-[130px] text-right text-[11.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab]">
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
                      <TableCell className="text-[13px] text-[#6b7280]">{p.unit}</TableCell>
                      <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                        {p.includedQuantity ? int(p.includedQuantity) : "—"}
                      </TableCell>
                      <TableCell className="text-right text-[13px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                        {/* null means "inherit the product's list price" — the
                            plan does not override it. */}
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

        {/* ── Summary rail ───────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-4">
          <Card icon={Layers} title="Pricing">
            <div className="mb-3 flex items-baseline gap-1">
              <span className="text-[28px] font-extrabold tracking-[-1px] text-[#12151a] dark:text-foreground">
                {price}
              </span>
              <span className="text-[13px] font-semibold text-[#9aa0a8]">{suffix}</span>
            </div>
            <Row label="Model" value={MODEL_LABELS[plan.pricingModel] || plan.pricingModel} />
            <Row label="Billing cycle" value={plan.billingCycle} />
            <Row label="Currency" value={plan.currency} />
            <Row label="Included / mo" value={allowanceLabel(plan)} />
            <Row
              label="Overage"
              value={`${money(plan.overagePrice)} / ${plan.includedUnit}`}
            />
            {plan.annualDiscountPercent > 0 && (
              <Row label="Annual discount" value={`${plan.annualDiscountPercent}%`} />
            )}
            {plan.isCustomPriced && <Row label="Quote only" value="Yes" />}
          </Card>

          <Card icon={ShieldCheck} title="Limits & support">
            <Row label="Seats" value={plan.seatsLabel || "—"} />
            <Row label="SLA" value={plan.slaTarget === "none" ? "—" : plan.slaTarget} />
            <Row label="Support" value={SUPPORT_LABELS[plan.supportLevel] || "—"} />
            <Row label="Trial" value={plan.trialDays ? `${plan.trialDays} days` : "—"} />
            <Row
              label="Self-serve"
              value={plan.selfServe ? "Yes" : plan.salesCta || "Contact sales"}
            />
          </Card>

          {isDooit && (
            <Card icon={Users} title="Change policy">
              <Row label="Upgrade" value={plan.changePolicy?.allowUpgrade ? "Allowed" : "No"} />
              <Row
                label="Downgrade"
                value={plan.changePolicy?.allowDowngrade ? "Allowed" : "No"}
              />
              <Row label="Cancel" value={plan.changePolicy?.allowCancel ? "Allowed" : "No"} />
              <Row
                label="Minimum term"
                value={
                  plan.changePolicy?.minimumTermMonths
                    ? `${plan.changePolicy.minimumTermMonths} months`
                    : "None"
                }
              />
            </Card>
          )}
        </div>
      </div>

      <AssignPlanDialog
        plan={plan}
        open={assigning}
        onOpenChange={setAssigning}
      />

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "publish" && `Publish “${plan.name}”?`}
              {confirm === "archive" && `Archive “${plan.name}”?`}
              {confirm === "new-version" &&
                `Create version ${plan.version + 1} of “${plan.name}”?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "publish" &&
                "The plan becomes buyable and is frozen — later changes need a new version. Any previously published version of this code is archived."}
              {confirm === "archive" &&
                "It is removed from the catalogue for new subscribers. Existing subscriptions are unaffected — they bill from their own price snapshot."}
              {confirm === "new-version" &&
                "A new draft is cloned with all pricing and entitlements. This version keeps selling until you publish the new one."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runAction}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
