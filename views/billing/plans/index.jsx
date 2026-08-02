"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  deletePlan,
  getPlans,
  publishPlan,
  getCurrentSubscription,
  createSubscription,
  changeSubscriptionPlan,
} from "@/app/dashboard/client/billing/actions";

import PlanCard from "./PlanCard";
import AssignPlanDialog from "./AssignPlanDialog";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "archived", label: "Archived" },
];

/** Confirm copy per destructive/lifecycle action — stated in business terms. */
const CONFIRMS = {
  publish: {
    title: (p) => `Publish “${p.name}”?`,
    body: "The plan becomes buyable and is frozen — later changes need a new version. Any previously published version of this code is archived.",
    cta: "Publish",
  },
  archive: {
    title: (p) => `Archive “${p.name}”?`,
    body: "It is removed from the catalogue for new subscribers. Existing subscriptions are unaffected — they bill from their own price snapshot.",
    cta: "Archive",
  },
  delete: {
    title: (p) => `Delete draft “${p.name}”?`,
    body: "The draft is removed. Only drafts can be deleted; published plans must be archived.",
    cta: "Delete",
    danger: true,
  },
  "new-version": {
    title: (p) => `Create version ${p.version + 1} of “${p.name}”?`,
    body: "A new draft is cloned from this plan with all its pricing and entitlements. The current version keeps selling until you publish the new one.",
    cta: "Create draft",
  },
  subscribe: {
    title: (p) => `Subscribe to “${p.name}”?`,
    body: "The plan's pricing is frozen onto your subscription at this moment — later changes to the plan will not affect what you pay.",
    cta: "Subscribe",
  },
  change: {
    title: (p) => `Move to “${p.name}”?`,
    body: "Your current subscription ends at the close of this billing period and the new one starts then, so there is no mid-cycle proration. Usage already incurred is still invoiced.",
    cta: "Change plan",
  },
};

export default function PricingPlans() {
  const router = useRouter();
  const { loggedInUser } = useGetUser();
  const isDooit = loggedInUser?.userType === "dooit";

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(isDooit ? "all" : "published");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [current, setCurrent] = useState(null);
  // The plan dooit is putting a client onto, or null. Held separately from
  // `confirm` because assigning is not a yes/no confirmation — it needs an
  // account picked before there is anything to confirm.
  const [assigning, setAssigning] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    // A client only ever receives published+visible plans, so the status filter
    // is a dooit convenience rather than a security boundary.
    const [res, sub] = await Promise.all([
      getPlans({ limit: 100, sort: "order" }),
      getCurrentSubscription(),
    ]);
    if (res.ok) setPlans(res.data || []);
    else toast.error(res.error || "Could not load plans");
    // dooit has no subscription of its own; the call simply returns null.
    if (sub.ok) setCurrent(sub.data || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => (tab === "all" ? plans : plans.filter((p) => p.status === tab)),
    [plans, tab]
  );

  const onAction = async (action, plan) => {
    if (action === "open")
      return router.push(`/dashboard/client/billing/plans/${plan._id}`);
    if (action === "edit") return router.push(`/dashboard/client/billing/plans/${plan._id}/edit`);
    if (action === "eligibility")
      return router.push(`/dashboard/client/billing/plans/${plan._id}/access`);
    if (action === "manage")
      return router.push("/dashboard/client/billing/subscription");
    // Assigning opens a picker rather than a confirm — the account is the whole
    // decision, and the dialog confirms per row.
    if (action === "assign") return setAssigning(plan);
    setConfirm({ action, plan });
  };

  const runAction = async () => {
    const { action, plan } = confirm;
    setConfirm(null);
    setBusyId(plan._id);

    // Subscribing and changing plan are client actions and take different
    // arguments, so they are handled before the dooit lifecycle map.
    if (action === "subscribe" || action === "change") {
      const res =
        action === "subscribe"
          ? await createSubscription({ plan: plan._id })
          : await changeSubscriptionPlan(current._id, plan._id);
      setBusyId(null);

      if (!res.ok) {
        // 409 covers both "quote-only plan" and "already subscribed" — the API
        // message says which, so show it verbatim rather than guessing.
        toast.error(res.error || "Could not subscribe");
        return;
      }
      toast.success(
        action === "subscribe" ? `Subscribed to ${plan.name}` : `Moved to ${plan.name}`,
        {
          description:
            action === "change" && res.meta?.effectiveAt
              ? `Takes effect ${new Date(res.meta.effectiveAt).toLocaleDateString("en-AU")} — ${res.meta.direction}.`
              : undefined,
        }
      );
      load();
      return;
    }

    const fn = {
      publish: publishPlan,
      archive: archivePlan,
      delete: deletePlan,
      "new-version": createPlanVersion,
    }[action];

    const res = await fn(plan._id);
    setBusyId(null);

    if (!res.ok) {
      // Publish validation failures are the useful ones — show them verbatim.
      toast.error(res.error || `Could not ${action} plan`);
      return;
    }

    if (action === "publish") {
      const archived = res.meta?.archivedPreviousVersions;
      toast.success(`${plan.name} published`, {
        description: archived
          ? `${archived} previous version(s) archived.`
          : undefined,
      });
    } else if (action === "new-version") {
      toast.success(`Draft v${res.data.version} created`);
      router.push(`/dashboard/client/billing/plans/${res.data._id}/edit`);
      return;
    } else {
      toast.success(`${plan.name} ${action === "delete" ? "deleted" : "archived"}`);
    }
    load();
  };

  const cfg = confirm ? CONFIRMS[confirm.action] : null;

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
            Plans &amp; pricing tiers
          </h1>
          <p className="mt-[3px] text-[13px] text-[#8a919b]">
            {isDooit
              ? "Compare tiers, adjust pricing, or build a new plan."
              : "Plans available to your account."}
          </p>
        </div>
        {isDooit && (
          <Button
            className="gap-2 rounded-[10px] font-bold"
            onClick={() => router.push("/dashboard/client/billing/plans/builder")}
          >
            <Plus className="size-4" />
            Create plan
          </Button>
        )}
      </div>

      {/* ── Status tabs (dooit only — a client has published plans only) ────── */}
      {isDooit && (
        <div className="inline-flex w-fit gap-1 rounded-xl border border-[#e9ebef] bg-[#f1f3f5] p-1 dark:border-border dark:bg-muted">
          {STATUS_TABS.map((t) => {
            const count =
              t.key === "all" ? plans.length : plans.filter((p) => p.status === t.key).length;
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
      )}

      {/* ── Cards ──────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[380px] rounded-2xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-[#e9ebef] bg-white px-5 py-16 text-center dark:border-border dark:bg-card">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
            <SearchX className="size-5 text-[#9aa0a8]" />
          </div>
          <div className="text-sm font-bold text-[#4a515b] dark:text-foreground">
            No plans here
          </div>
          <div className="mt-1 text-[12.5px] text-[#9aa0a8]">
            {isDooit
              ? "Create a plan to start selling."
              : "No plans have been made available to your account yet."}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {visible.map((p) => (
            <PlanCard
              key={p._id}
              plan={p}
              isDooit={isDooit}
              busy={busyId === p._id}
              onAction={onAction}
              currentSubscription={current}
            />
          ))}
        </div>
      )}

      <AssignPlanDialog
        plan={assigning}
        open={!!assigning}
        onOpenChange={(o) => !o && setAssigning(null)}
      />

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{cfg?.title(confirm.plan)}</AlertDialogTitle>
            <AlertDialogDescription>{cfg?.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={cfg?.danger ? "bg-destructive text-white hover:bg-destructive/90" : ""}
              onClick={runAction}
            >
              {cfg?.cta}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
