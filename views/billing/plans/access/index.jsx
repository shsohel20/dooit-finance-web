"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Search, ShieldCheck, UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  getGrantableClients,
  getPlan,
  getPlanEligibility,
  grantPlanEligibility,
  revokePlanEligibility,
} from "@/app/dashboard/client/billing/actions";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }) : "—";

/**
 * Manage which client users may see and buy a PRIVATE plan.
 *
 * The API refuses to publish a private plan with no active grant, so this page
 * is a prerequisite for publishing one — not an optional extra.
 */
export default function PlanAccess({ planId }) {
  const router = useRouter();

  const [plan, setPlan] = useState(null);
  const [grants, setGrants] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [p, g, c] = await Promise.all([
      getPlan(planId),
      getPlanEligibility(planId),
      getGrantableClients(),
    ]);
    if (p.ok) setPlan(p.data);
    else toast.error(p.error || "Could not load plan");
    if (g.ok) setGrants(g.data || []);
    if (c.ok) setClients(c.data || []);
    setLoading(false);
  }, [planId]);

  useEffect(() => {
    load();
  }, [load]);

  const grantedIds = useMemo(
    () => new Set(grants.filter((g) => g.status === "active").map((g) => String(g.user?._id ?? g.user))),
    [grants]
  );

  const candidates = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clients
      .filter((c) => !grantedIds.has(String(c._id)))
      .filter(
        (c) =>
          !term ||
          c.name?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.clientName?.toLowerCase().includes(term)
      )
      .slice(0, 8);
  }, [clients, grantedIds, search]);

  const activeGrants = grants.filter((g) => g.status === "active");

  const onGrant = async (user) => {
    setBusy(user._id);
    const res = await grantPlanEligibility(planId, { user: user._id, client: user.client });
    setBusy(null);
    if (!res.ok) return toast.error(res.error || "Could not grant access");
    toast.success(`${user.name || user.email} can now see this plan`);
    setSearch("");
    load();
  };

  const onRevoke = async (grant) => {
    const userId = grant.user?._id ?? grant.user;
    setBusy(userId);
    const res = await revokePlanEligibility(planId, userId);
    setBusy(null);
    if (!res.ok) return toast.error(res.error || "Could not revoke access");
    toast.success("Access revoked");
    load();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
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
        <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
          Access · {plan?.name}
        </h1>
        <p className="mt-[3px] text-[13px] text-[#8a919b]">
          Which client users can see and buy this private plan.
        </p>
      </div>

      {plan?.visibility !== "private" && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-[12.5px] text-amber-800 dark:text-amber-300">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <span>
            This plan is <strong>public</strong> — every client can already see it, so an access
            list has no effect. Grants are kept in case it is made private later.
          </span>
        </div>
      )}

      {plan?.visibility === "private" && activeGrants.length === 0 && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-[12.5px] text-amber-800 dark:text-amber-300">
          <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          <span>
            No one can see this plan yet. A private plan cannot be published until at least one
            client has been granted access.
          </span>
        </div>
      )}

      {/* ── Grant ──────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-[#e9ebef] bg-white p-4 dark:border-border dark:bg-card">
        <div className="mb-3 flex items-center gap-2">
          <UserPlus className="size-4 text-[#8a919b]" />
          <span className="text-[15px] font-extrabold text-[#12151a] dark:text-foreground">
            Grant access
          </span>
        </div>

        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a0ab]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client users by name, email or company"
            className="h-9 rounded-[10px] pl-9 text-[13px]"
          />
        </div>

        <div className="mt-3 flex flex-col gap-1">
          {clients.length === 0 ? (
            <p className="text-[12.5px] text-[#9aa0a8]">
              No active client users found to grant access to.
            </p>
          ) : candidates.length === 0 ? (
            <p className="text-[12.5px] text-[#9aa0a8]">
              {search ? "No matching client users." : "Every client user already has access."}
            </p>
          ) : (
            candidates.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#f1f3f5] px-3 py-2 dark:border-border"
              >
                <div className="min-w-0">
                  <div className="truncate text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                    {c.name || c.email}
                  </div>
                  <div className="truncate text-[11.5px] text-[#9aa0a8]">
                    {c.email}
                    {c.clientName ? ` · ${c.clientName}` : ""}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5"
                  disabled={busy === c._id}
                  onClick={() => onGrant(c)}
                >
                  {busy === c._id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="size-3.5" />
                  )}
                  Grant
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Current access ─────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
        <div className="border-b border-[#eef0f3] p-4 dark:border-border">
          <div className="text-[15px] font-extrabold text-[#12151a] dark:text-foreground">
            Access list
          </div>
          <div className="mt-[2px] text-xs text-[#8a919b]">
            {activeGrants.length} active · {grants.length - activeGrants.length} revoked
          </div>
        </div>

        {grants.length === 0 ? (
          <p className="px-4 py-10 text-center text-[12.5px] text-[#9aa0a8]">
            No one has been granted access yet.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Client user
                </TableHead>
                <TableHead className="w-[130px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Granted
                </TableHead>
                <TableHead className="w-[130px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Expires
                </TableHead>
                <TableHead className="w-[110px] text-center text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Status
                </TableHead>
                <TableHead className="w-[100px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {grants.map((g) => {
                const active = g.status === "active";
                const userId = g.user?._id ?? g.user;
                return (
                  <TableRow key={g._id} className="border-t border-[#f4f5f7]">
                    <TableCell>
                      <div className="text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                        {g.user?.name || "—"}
                      </div>
                      <div className="text-[11.5px] text-[#9aa0a8]">{g.user?.email}</div>
                    </TableCell>
                    <TableCell className="text-[13px] text-[#6b7280]">
                      {fmtDate(g.grantedAt)}
                    </TableCell>
                    <TableCell className="text-[13px] text-[#6b7280]">
                      {fmtDate(g.expiresAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold capitalize ${
                          active
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-slate-400/15 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {g.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {active && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          disabled={busy === userId}
                          onClick={() => onRevoke(g)}
                        >
                          <X className="size-3.5" />
                          Revoke
                        </Button>
                      )}
                    </TableCell>
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
