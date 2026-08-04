"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  Loader2,
  Search,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  createSubscription,
  changeSubscriptionPlan,
  getGrantableClients,
  getSubscriptions,
} from "@/app/dashboard/client/billing/actions";

const money = (v) =>
  v == null
    ? "—"
    : new Intl.NumberFormat("en-AU", {
        style: "currency",
        currency: "AUD",
        minimumFractionDigits: 2,
      }).format(Number(v));

/**
 * Put a client account onto a plan — the dooit-side provisioning surface.
 *
 * A client subscribes to itself from the plan card; dooit never can, because the
 * subscribing user is pinned from the JWT unless an explicit `user` is sent.
 * That `user` is what this dialog collects. Without it, the only way to sell a
 * plan was for the customer to self-serve, which no Enterprise plan allows.
 *
 * Two operations sit behind one picker, chosen per row rather than by a mode
 * switch, because the operator is answering one question — "put this account on
 * this plan" — and which endpoint that needs is a detail of where the account
 * already is:
 *
 *   no subscription   → POST /subscription           (assign)
 *   on another plan   → POST /subscription/:id/change-plan
 *   on THIS plan      → nothing to do
 *
 * The API enforces all of this regardless; showing it here just avoids offering
 * an action that would come back 409.
 */
export default function AssignPlanDialog({ plan, open, onOpenChange, onDone }) {
  const [clients, setClients] = useState([]);
  const [subsByUser, setSubsByUser] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    // dooit sees every account's subscription, so one call maps them all.
    const [c, s] = await Promise.all([
      getGrantableClients(),
      getSubscriptions({ status: "active", limit: 200 }),
    ]);

    if (c.ok) setClients(c.data || []);
    else toast.error(c.error || "Could not load client accounts");

    if (s.ok) {
      setSubsByUser(
        new Map((s.data || []).map((sub) => [String(sub.user?._id ?? sub.user), sub]))
      );
    }
    setLoading(false);
  }, []);

  // Re-read on every open: a subscription may have been created elsewhere since
  // the dialog was last shown, and assigning against a stale map is how an
  // operator gets a surprise 409.
  useEffect(() => {
    if (open) {
      setSearch("");
      load();
    }
  }, [open, load]);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients
      .filter(
        (c) =>
          !term ||
          c.name?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.clientName?.toLowerCase().includes(term)
      )
      .map((c) => {
        const sub = subsByUser.get(String(c._id)) || null;
        // Same code but an older VERSION is not "already on this plan" — it is
        // exactly the move-to-vN case the plan card offers, and blocking it
        // would strand accounts on a superseded version with no route forward.
        const sameCode = !!sub && sub.planCode === plan?.code;
        const onThisPlan = sameCode && sub.planVersion === plan?.version;
        return { ...c, sub, onThisPlan, isVersionMove: sameCode && !onThisPlan };
      })
      .sort((a, b) => {
        // Accounts you can act on first; already-on-this-plan sinks to the end.
        if (a.onThisPlan !== b.onThisPlan) return a.onThisPlan ? 1 : -1;
        return (a.name || a.email || "").localeCompare(b.name || b.email || "");
      })
      .slice(0, 40);
  }, [clients, subsByUser, search, plan]);

  const assignable = rows.filter((r) => !r.onThisPlan).length;

  const onAssign = async (row) => {
    setBusy(row._id);

    const res = row.sub
      ? await changeSubscriptionPlan(row.sub._id, plan._id)
      : await createSubscription({ plan: plan._id, user: row._id, client: row.client });

    setBusy(null);

    if (!res.ok) {
      // The API messages here are specific ("already has an active
      // subscription", "minimum term runs until …") — show them verbatim
      // rather than flattening to a generic failure.
      toast.error(res.error || "Could not assign plan");
      return;
    }

    const who = row.name || row.email;
    if (row.sub) {
      toast.success(`${who} moved to ${plan.name}`, {
        description: res.meta?.effectiveAt
          ? `Takes effect ${new Date(res.meta.effectiveAt).toLocaleDateString("en-AU")} — ${res.meta.direction}.`
          : undefined,
      });
    } else {
      toast.success(`${who} assigned to ${plan.name}`, {
        description: `Pricing is frozen onto the subscription as of now (${money(plan.basePrice)} ${plan.billingCycle}).`,
      });
    }

    await load();
    onDone?.();
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign “{plan.name}” to a client</DialogTitle>
          <DialogDescription>
            The plan&apos;s pricing is frozen onto the subscription at the moment it is
            assigned, so later changes to the plan will not affect what this account pays.
          </DialogDescription>
        </DialogHeader>

        {plan.isCustomPriced && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[12.5px] text-amber-800 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>
              This is a <strong>custom-priced</strong> plan, so it carries no list price — the
              subscription will be created with a base fee of <strong>A$0.00</strong> and bill
              usage and overage only. Record the negotiated amount separately.
            </span>
          </div>
        )}

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a0ab]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client users by name, email or company"
            className="h-9 rounded-[10px] pl-9 text-[13px]"
          />
        </div>

        <div className="-mx-1 max-h-[340px] overflow-y-auto px-1">
          {loading ? (
            <div className="flex flex-col gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : clients.length === 0 ? (
            <p className="py-8 text-center text-[12.5px] text-[#9aa0a8]">
              No active client users found to assign this plan to.
            </p>
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-[12.5px] text-[#9aa0a8]">
              No matching client users.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {rows.map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#f1f3f5] px-3 py-2 dark:border-border"
                >
                  <div className="min-w-0">
                    <div className="truncate text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                      {r.name || r.email}
                    </div>
                    <div className="truncate text-[11.5px] text-[#9aa0a8]">
                      {r.email}
                      {r.clientName ? ` · ${r.clientName}` : ""}
                    </div>
                    {r.sub && (
                      <div className="mt-0.5 truncate text-[11px] font-semibold text-[#8a919b]">
                        Currently on {r.sub.priceSnapshot?.planName || r.sub.planCode}
                        {r.sub.planVersion ? ` v${r.sub.planVersion}` : ""}
                      </div>
                    )}
                  </div>

                  {r.onThisPlan ? (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      <Check className="size-3.5" />
                      On this plan
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="shrink-0 gap-1.5"
                      disabled={busy === r._id}
                      onClick={() => onAssign(r)}
                    >
                      {busy === r._id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : r.sub ? (
                        <ArrowLeftRight className="size-3.5" />
                      ) : (
                        <UserPlus className="size-3.5" />
                      )}
                      {r.isVersionMove
                        ? `Move to v${plan.version}`
                        : r.sub
                          ? "Move here"
                          : "Assign"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <span className="text-[11.5px] text-[#9aa0a8]">
            {loading ? "" : `${assignable} account${assignable === 1 ? "" : "s"} can be assigned`}
          </span>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
