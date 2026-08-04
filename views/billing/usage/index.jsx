"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Activity,
  BadgeCheck,
  CircleDollarSign,
  Plus,
  SearchX,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getUsageSummary } from "@/app/dashboard/client/billing/actions";
import { money, int } from "../plans/planFormat";
import RecordsDrawer from "./RecordsDrawer";
import RecordUsageDialog from "./RecordUsageDialog";
import useGetUser from "@/hooks/useGetUser";

// ─────────────────────────────────────────────────────────────────────────────
// One validated hue, used for every mark on this page.
//
// The charts encode magnitude by LENGTH and POSITION, not by identity, so a
// categorical palette would be the wrong tool — and the prototype's 8-colour
// donut palette fails validation as chart marks anyway (#0e766a and #94a3b8
// fall below the chroma floor and read as grey).
//
// #0e9384 passes every check against BOTH the light and dark chart surfaces:
// lightness band, chroma floor, and ≥3:1 contrast.
// ─────────────────────────────────────────────────────────────────────────────
const SERIES = "#0e9384";

const CHART_CONFIG = {
  amount: { label: "Spend", color: SERIES },
};

/** Category chips are tinted TEXT badges, not series marks — different job. */
const CATEGORY_TINT = {
  Platform: "bg-[#2c74d6]/10 text-[#2c74d6]",
  Verification: "bg-[#0e766a]/10 text-[#0e766a]",
  Screening: "bg-[#d97706]/10 text-[#b45c06]",
  Biometrics: "bg-[#7c3aed]/10 text-[#7c3aed]",
  Monitoring: "bg-[#0891b2]/10 text-[#0891b2]",
  Risk: "bg-[#e11d63]/10 text-[#e11d63]",
  Data: "bg-[#65a30d]/10 text-[#4d7c0f]",
  Notifications: "bg-slate-400/15 text-slate-600",
};

const shortDay = (dayKey) => {
  const [, m, d] = dayKey.split("-");
  return `${d}/${m}`;
};

/** A headline number. Not a chart — one value has no shape to read. */
function Stat({ label, value, sub, icon: Icon }) {
  return (
    <div className="flex min-h-[112px] flex-col gap-1 rounded-2xl border border-[#e9ebef] bg-white p-[17px_18px] dark:border-border dark:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#8a919b]">
          {label}
        </span>
        {Icon ? <Icon className="size-4 text-[#b0b6be]" /> : null}
      </div>
      <div className="text-[25px] font-extrabold leading-tight tracking-[-0.7px] text-[#12151a] dark:text-foreground">
        {value}
      </div>
      <div className="text-xs text-[#9aa0a8]">{sub}</div>
    </div>
  );
}

function Card({ title, subtitle, action, children, padded = true }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e9ebef] bg-white dark:border-border dark:bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#eef0f3] p-4 dark:border-border">
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

export default function ServiceUsage() {
  const { loggedInUser } = useGetUser();
  const isDooit = loggedInUser?.userType === "dooit";
  const [summary, setSummary] = useState(null);
  // `loading` is FIRST load only. Changing the period sets `refreshing`, which
  // dims the existing render instead of swapping in skeletons — a skeleton flash
  // on refetch throws away the reader's context and jumps the layout.
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [period, setPeriod] = useState("");
  const [search, setSearch] = useState("");
  const [drilldown, setDrilldown] = useState(null);
  const [recording, setRecording] = useState(false);
  // dooit reads across every account, so the page needs to say WHOSE usage it
  // is showing. null = all accounts; otherwise the row that was drilled into.
  const [account, setAccount] = useState(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    const res = await getUsageSummary({
      ...(period ? { periodKey: period } : {}),
      ...(account ? { user: account.user } : {}),
    });
    if (res.ok) setSummary(res.data);
    else toast.error(res.error || "Could not load usage");
    setLoading(false);
    setRefreshing(false);
  }, [period, account]);

  useEffect(() => {
    load();
  }, [load]);

  // Memoised: `summary?.x || []` allocates a fresh array on every render, which
  // would make every downstream useMemo recompute and defeat the point.
  const byProduct = useMemo(() => summary?.byProduct ?? [], [summary]);
  // Usage of products the plan does not entitle. Charged at list price, and
  // kept out of `byProduct` because it is priced by a different rule — folding
  // it in would make the allowance figures below unreadable.
  const excluded = useMemo(() => summary?.excludedByProduct ?? [], [summary]);
  const byAccount = useMemo(() => summary?.byAccount ?? [], [summary]);
  const byDay = useMemo(() => summary?.byDay ?? [], [summary]);
  const totals = useMemo(() => summary?.totals ?? {}, [summary]);

  const verifications = useMemo(
    () =>
      byProduct
        .filter((p) => p.category === "Verification")
        .reduce((s, p) => s + p.quantity, 0),
    [byProduct]
  );

  // The prototype shows "Avg cost / applicant" with a figure that reconciles to
  // nothing. Now that usage records carry an applicantKey, it has a real
  // definition: metered spend ÷ DISTINCT applicants in the period. One applicant
  // running several checks counts once.
  const avgPerApplicant = totals.distinctApplicants
    ? totals.amount / totals.distinctApplicants
    : null;

  const topProducts = useMemo(
    () => byProduct.slice(0, 6).map((p) => ({ ...p, short: p.productName })),
    [byProduct]
  );

  const tableRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return byProduct;
    return byProduct.filter(
      (p) =>
        p.productName.toLowerCase().includes(term) ||
        p.productCode.toLowerCase().includes(term)
    );
  }, [byProduct, search]);

  const maxQty = Math.max(1, ...byProduct.map((p) => p.quantity));

  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[112px] rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const isEmpty = byProduct.length === 0;

  return (
    <div
      className={`flex flex-col gap-4 px-4 transition-opacity lg:px-6 ${refreshing ? "opacity-60" : ""}`}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
            Service usage
          </h1>
          <p className="mt-[3px] text-[13px] text-[#8a919b]">
            Metered products consumed in {summary?.periodKey || "this period"}
            {/* dooit sees every account by default, which is easy to mistake for
                one customer's figures. Say which it is. */}
            {isDooit &&
              (account
                ? ` · ${account.userName || account.userEmail || "one account"}`
                : ` · all accounts${summary?.accounts ? ` (${summary.accounts})` : ""}`)}
          </p>
        </div>
        <div className="flex items-center gap-2">
        {isDooit && (
          <Button
            variant="outline"
            className="h-9 gap-2 rounded-[10px] font-bold"
            onClick={() => setRecording(true)}
          >
            <Plus className="size-4" />
            Record usage
          </Button>
        )}
        <Input
          type="month"
          value={period || summary?.periodKey || ""}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-9 w-[170px] rounded-[10px] text-[13px]"
          aria-label="Billing period"
        />
        </div>
      </div>

      {/* ── Stat tiles ─────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Billable events"
          value={int(totals.events || 0)}
          sub={`across ${byProduct.length} products`}
          icon={Activity}
        />
        <Stat
          label="ID verifications"
          value={int(verifications)}
          sub="documents, DVS, PoA"
          icon={BadgeCheck}
        />
        <Stat
          label="Metered spend"
          value={money(totals.amount || 0)}
          sub="excludes plan base fee"
          icon={CircleDollarSign}
        />
        <Stat
          label="Avg cost / applicant"
          value={avgPerApplicant == null ? "—" : money(avgPerApplicant)}
          sub={
            totals.distinctApplicants
              ? `${int(totals.distinctApplicants)} distinct applicants`
              : "no applicants recorded"
          }
          icon={Users}
        />
      </div>

      {isEmpty ? (
        <div className="rounded-2xl border border-[#e9ebef] bg-white px-5 py-16 text-center dark:border-border dark:bg-card">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-xl bg-muted">
            <SearchX className="size-5 text-[#9aa0a8]" />
          </div>
          <div className="text-sm font-bold text-[#4a515b] dark:text-foreground">
            No usage in this period
          </div>
          <div className="mt-1 text-[12.5px] text-[#9aa0a8]">
            Metered activity appears here as customers are onboarded and screened.
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
            {/* ── Daily spend: change over time, one series ─────────────── */}
            <Card
              title="Daily billable spend"
              subtitle={`${byDay.length} days · AUD`}
            >
              {/* One series, so no legend — the title names it. */}
              <ChartContainer config={CHART_CONFIG} className="h-[248px] w-full">
                <AreaChart data={byDay} margin={{ left: 4, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={SERIES} stopOpacity={0.22} />
                      <stop offset="100%" stopColor={SERIES} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  {/* Recessive grid: horizontal only, no vertical rules */}
                  {/* solid hairline, one shade off the surface — never dashed */}
                  <CartesianGrid vertical={false} strokeDasharray="0" strokeOpacity={0.5} />
                  <XAxis
                    dataKey="dayKey"
                    tickFormatter={shortDay}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                  />
                  <YAxis
                    tickFormatter={(v) => `A$${v}`}
                    tickLine={false}
                    axisLine={false}
                    width={58}
                  />
                  <ChartTooltip
                    cursor={{ stroke: SERIES, strokeOpacity: 0.35, strokeWidth: 1 }}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(v) => v}
                        formatter={(value) => [money(value), " Spend"]}
                      />
                    }
                  />
                  <Area
                    dataKey="amount"
                    type="monotone"
                    stroke={SERIES}
                    strokeWidth={2}
                    fill="url(#usageFill)"
                    /* dots only on hover — a dot per point is noise at 30 days */
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ChartContainer>
            </Card>

            {/* ── Top products: magnitude comparison ────────────────────── */}
            <Card title="Top products by cost" subtitle="This period">
              <ChartContainer config={CHART_CONFIG} className="h-[220px] w-full">
                <BarChart
                  data={topProducts}
                  layout="vertical"
                  margin={{ left: 4, right: 56, top: 4, bottom: 4 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="0" strokeOpacity={0.5} />
                  <XAxis type="number" dataKey="amount" hide />
                  <YAxis
                    type="category"
                    dataKey="productName"
                    tickLine={false}
                    axisLine={false}
                    width={130}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => (v.length > 20 ? `${v.slice(0, 19)}…` : v)}
                  />
                  <ChartTooltip
                    cursor={{ fillOpacity: 0.06 }}
                    content={
                      <ChartTooltipContent formatter={(value) => [money(value), " Spend"]} />
                    }
                  />
                  {/* 4px rounded data-end, square against the baseline */}
                  <Bar dataKey="amount" fill={SERIES} radius={[0, 4, 4, 0]} barSize={14}>
                    {/* Direct labels — few enough bars that a legend is unnecessary */}
                    <LabelList
                      dataKey="amount"
                      position="right"
                      offset={8}
                      className="fill-muted-foreground"
                      fontSize={11}
                      formatter={(v) => money(v)}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </Card>
          </div>

          {/* ── Per-account breakdown (dooit only) ────────────────────────── */}
          {/* A client is already scoped to itself, so this would restate the
              tiles above. For dooit it is the difference between "the platform
              metered 40,000 events" and "who consumed them". */}
          {isDooit && (byAccount.length > 0 || account) && (
            <Card
              title="Usage by account"
              subtitle={
                account
                  ? "Showing one account — clear the filter to compare all"
                  : `${byAccount.length} subscriber(s) metering this period · highest spend first`
              }
              padded={false}
              action={
                account && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 rounded-[10px] font-bold"
                    onClick={() => setAccount(null)}
                  >
                    <X className="size-3.5" />
                    All accounts
                  </Button>
                )
              }
            >
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Account
                    </TableHead>
                    <TableHead className="w-[110px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Applicants
                    </TableHead>
                    <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Events
                    </TableHead>
                    <TableHead className="w-[100px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Products
                    </TableHead>
                    <TableHead className="w-[120px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Spend
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {byAccount.map((r) => (
                    <TableRow
                      key={String(r.user)}
                      className="cursor-pointer border-t border-[#f4f5f7]"
                      onClick={() => setAccount(account ? null : r)}
                    >
                      <TableCell>
                        <div className="text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                          {r.userName || r.userEmail || "—"}
                        </div>
                        <div className="text-[11.5px] text-[#9aa0a8]">
                          {r.clientName || r.userEmail || "—"}
                        </div>
                      </TableCell>
                      {/* The allowance is denominated in DISTINCT applicants, so
                          this — not the event count — is the number a plan limit
                          is measured against. */}
                      <TableCell className="text-right text-[13px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                        {int(r.distinctApplicants)}
                      </TableCell>
                      <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                        {int(r.events)}
                      </TableCell>
                      <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                        {int(r.products)}
                      </TableCell>
                      <TableCell className="text-right text-[13px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                        {money(r.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* ── Table view — the accessible equivalent of both charts ─────── */}
          <Card
            title="Metered usage by product"
            subtitle="Every billable product in the period"
            padded={false}
            action={
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products"
                className="h-9 w-full rounded-[10px] text-[13px] sm:w-[240px]"
              />
            }
          >
            {tableRows.length === 0 ? (
              <p className="px-4 py-10 text-center text-[12.5px] text-[#9aa0a8]">
                No products match that search.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Product
                    </TableHead>
                    <TableHead className="w-[140px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Category
                    </TableHead>
                    <TableHead className="w-[200px] text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Usage
                    </TableHead>
                    <TableHead className="w-[110px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Events
                    </TableHead>
                    <TableHead className="w-[120px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                      Total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((p) => (
                    <TableRow
                      key={p.productCode}
                      className="cursor-pointer border-t border-[#f4f5f7]"
                      onClick={() => setDrilldown(p)}
                    >
                      <TableCell className="max-w-0">
                        <div className="truncate text-[13.5px] font-semibold text-[#25292f] dark:text-foreground">
                          {p.productName}
                        </div>
                        <div className="truncate font-mono text-[10.5px] text-[#9aa0a8]">
                          {p.productCode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-md px-2 py-[2px] text-[10.5px] font-bold ${
                            CATEGORY_TINT[p.category] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${(p.quantity / maxQty) * 100}%`,
                                background: SERIES,
                              }}
                            />
                          </div>
                          <span className="text-[13px] font-semibold tabular-nums text-[#25292f] dark:text-foreground">
                            {int(p.quantity)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                        {int(p.events)}
                      </TableCell>
                      <TableCell className="text-right text-[13.5px] font-bold tabular-nums text-[#12151a] dark:text-foreground">
                        {money(p.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </>
      )}

      {/* ── Outside the plan ─────────────────────────────────────────────────
          Its own card rather than a row style inside the table above, because
          these are priced by a different rule: list price per event, with no
          claim on the applicant allowance. Mixing them into the main table
          would make its allowance column mean two different things. */}
      {excluded.length > 0 && (
        <Card className="gap-0 overflow-hidden rounded-2xl border-amber-500/25 py-0 dark:border-amber-500/20">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 bg-amber-500/[0.06] px-4 py-3">
            <div className="flex items-center gap-2">
              <TriangleAlert className="size-4 text-amber-600 dark:text-amber-400" />
              <div>
                <h2 className="text-[13.5px] font-extrabold text-[#12151a] dark:text-foreground">
                  Outside the plan
                </h2>
                <p className="text-[11.5px] text-[#8a919b]">
                  {isDooit
                    ? "Not entitled by the subscribed plan — charged at list price."
                    : "Not included in your plan. These are charged at list price on your invoice."}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[15px] font-extrabold tabular-nums text-amber-700 dark:text-amber-400">
                {money(totals.excludedAmount || 0)}
              </div>
              <div className="text-[11px] text-[#9aa0a8]">
                {int(totals.excludedEvents || 0)} event(s)
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Product
                </TableHead>
                <TableHead className="w-[110px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Quantity
                </TableHead>
                <TableHead className="w-[110px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Events
                </TableHead>
                <TableHead className="w-[120px] text-right text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
                  Charged
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {excluded.map((p) => (
                <TableRow
                  key={p.productCode}
                  className="cursor-pointer border-t border-[#f4f5f7]"
                  onClick={() => setDrilldown(p)}
                >
                  <TableCell>
                    <div className="text-[13px] font-semibold text-[#25292f] dark:text-foreground">
                      {p.productName}
                    </div>
                    <div className="font-mono text-[10.5px] text-[#9aa0a8]">
                      {p.productCode}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                    {int(p.quantity)}
                  </TableCell>
                  <TableCell className="text-right text-[13px] tabular-nums text-[#6b7280]">
                    {int(p.events)}
                  </TableCell>
                  <TableCell className="text-right text-[13.5px] font-bold tabular-nums text-amber-700 dark:text-amber-400">
                    {money(p.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <RecordUsageDialog
        open={recording}
        onOpenChange={setRecording}
        onRecorded={load}
      />

      <RecordsDrawer
        open={!!drilldown}
        onOpenChange={(o) => !o && setDrilldown(null)}
        product={drilldown}
        periodKey={summary?.periodKey}
        isDooit={isDooit}
        user={account?.user || null}
        onChanged={load}
      />
    </div>
  );
}
