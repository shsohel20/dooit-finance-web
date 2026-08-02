"use client";

import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, ResponsiveContainer, Tooltip, Cell } from "recharts";
import {
  Minus, Flag, Globe, CheckCircle2, XCircle,
  Clock, ShieldAlert, Activity, ArrowUpRight, ArrowDownRight, Calendar,
} from "lucide-react";
import { getTransactionDashboardStats } from "@/app/dashboard/client/transactions/actions";

// ── Period config ─────────────────────────────────────────────────────────────

const PERIODS = [
  { key: "30d", label: "30 Days"  },
  { key: "6m",  label: "6 Months" },
  { key: "1y",  label: "1 Year"   },
  { key: "all", label: "All Time" },
];

// ── Formatters ────────────────────────────────────────────────────────────────

const fmtAUD = (n) => {
  if (n == null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(1)}K`;
  return `$${Number(n).toLocaleString("en-AU")}`;
};
const fmtNum = (n) => (n == null ? "—" : Number(n).toLocaleString());

// ── Trend badge ───────────────────────────────────────────────────────────────

function TrendBadge({ pct }) {
  if (pct == null) return null;
  const up   = pct > 0;
  const flat = pct === 0;
  const Icon = flat ? Minus : up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className="inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold border"
      style={
        flat ? { background: "var(--smoke-300)", color: "var(--smoke-600)", borderColor: "var(--smoke-400)" }
        : up  ? { background: "#e6f7f0", color: "#199335", borderColor: "#b7e4c7" }
              : { background: "#fdf0f5", color: "#ca2f7f", borderColor: "#f5b8d4" }
      }
    >
      <Icon className="size-2.5" />
      {flat ? "0%" : `${up ? "+" : ""}${pct}%`}
    </span>
  );
}

// ── Chart tooltip ─────────────────────────────────────────────────────────────

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border px-3 py-2.5 shadow-lg text-xs"
      style={{ background: "var(--smoke-100)", borderColor: "var(--smoke-400)" }}>
      <p className="font-semibold mb-1.5" style={{ color: "var(--heading)" }}>{label}</p>
      <p className="flex justify-between gap-4" style={{ color: "var(--gray)" }}>
        Txns <span className="font-bold" style={{ color: "var(--heading)" }}>{fmtNum(payload[0]?.value)}</span>
      </p>
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ bgFrom, bgTo, glowColor, icon: Icon, label, value, sub, loading }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background:  `linear-gradient(135deg, ${bgFrom} 0%, ${bgTo} 100%)`,
        boxShadow:   `0 6px 28px -6px ${glowColor}`,
      }}>
      {/* decorative orb */}
      <div className="pointer-events-none absolute -right-5 -top-5 size-24 rounded-full opacity-20 blur-2xl"
        style={{ background: "#fff" }} />

      <div className="relative z-10 mb-3 w-fit rounded-xl p-2"
        style={{ background: "rgba(255,255,255,0.18)" }}>
        <Icon className="size-4 text-white" />
      </div>

      <div className="relative z-10">
        {loading
          ? <Skeleton className="h-7 w-20 mb-1" style={{ background: "rgba(255,255,255,0.25)" }} />
          : <p className="text-2xl font-black text-white leading-none tracking-tight">{value}</p>
        }
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/60">{label}</p>
        {!loading && sub && <p className="mt-0.5 text-[10px] text-white/50">{sub}</p>}
      </div>
    </div>
  );
}

// ── Status row ────────────────────────────────────────────────────────────────

function StatusRow({ icon: Icon, label, count, total, barColor, iconColor, loading }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <Icon className="size-3" style={{ color: iconColor }} />
          <span className="font-medium" style={{ color: "var(--heading)" }}>{label}</span>
        </div>
        {loading ? <Skeleton className="h-3 w-14" /> : (
          <div className="flex items-center gap-2">
            <span className="font-bold tabular-nums" style={{ color: iconColor }}>{fmtNum(count)}</span>
            <span className="text-[10px] w-7 text-right" style={{ color: "var(--gray)" }}>{pct}%</span>
          </div>
        )}
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--smoke-300)" }}>
        {!loading && (
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: barColor }} />
        )}
      </div>
    </div>
  );
}

// ── Period toggle ─────────────────────────────────────────────────────────────

function PeriodToggle({ active, onChange }) {
  return (
    <div className="flex items-center gap-0.5 rounded-xl p-1 border"
      style={{ background: "var(--smoke-200)", borderColor: "var(--smoke-400)" }}>
      {PERIODS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150"
          style={
            active === key
              ? { background: "var(--primary)", color: "#fff", boxShadow: "0 2px 8px rgba(0,89,100,0.25)" }
              : { color: "var(--gray)", background: "transparent" }
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TransactionDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState("30d");

  const fetchStats = useCallback((p) => {
    setLoading(true);
    getTransactionDashboardStats(p)
      .then((res) => { if (res?.success) setStats(res.data); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchStats(period); }, [period, fetchStats]);

  const d         = stats;
  const pending   = d?.byStatus?.pending   || 0;
  const completed = d?.byStatus?.completed || 0;
  const failed    = d?.byStatus?.failed    || 0;
  const total     = d?.totalAllTime        || 1;

  const chartData = (() => {
    if (!d?.monthlyCashFlow?.length) {
      const MO = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const now = new Date();
      return Array.from({ length: 12 }, (_, i) => {
        const m = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        return { label: MO[m.getMonth()], count: 0, totalAmount: 0 };
      });
    }
    return d.monthlyCashFlow;
  })();

  const maxCount = Math.max(...chartData.map((r) => r.count), 1);

  return (
    <div className="space-y-3 mb-4">

      {/* ── Period header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Calendar className="size-4" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--heading)" }}>
            {loading ? "Loading…" : (d?.periodLabel ?? "Transaction Analytics")}
          </span>
          {!loading && <TrendBadge pct={d?.amountTrendPct} />}
        </div>
        <PeriodToggle active={period} onChange={setPeriod} />
      </div>

      {/* ── Row 1: hero + 3 KPI cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-3">

        {/* Hero — volume */}
        <div className="col-span-12 sm:col-span-5 relative overflow-hidden rounded-2xl p-6 text-white"
          style={{
            background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)",
            boxShadow:  "0 8px 36px -8px rgba(0,89,100,0.45)",
          }}>
          {/* orbs */}
          <div className="pointer-events-none absolute -top-10 -right-10 size-48 rounded-full blur-3xl"
            style={{ background: "rgba(0,216,126,0.15)" }} />
          <div className="pointer-events-none absolute bottom-0 left-0 size-32 rounded-full blur-2xl"
            style={{ background: "rgba(255,255,255,0.07)" }} />

          <div className="relative z-10 flex flex-col h-full justify-between min-h-[130px]">
            {/* top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 rounded-lg px-2.5 py-1"
                style={{ background: "rgba(255,255,255,0.12)" }}>
                <Activity className="size-3.5 text-white/80" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                  Volume · {PERIODS.find(p => p.key === period)?.label}
                </span>
              </div>

              {!loading && d?.amountTrendPct != null && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold border"
                  style={
                    d.amountTrendPct >= 0
                      ? { background: "rgba(0,216,126,0.18)", color: "#a7f3d0", borderColor: "rgba(0,216,126,0.3)" }
                      : { background: "rgba(202,47,127,0.18)", color: "#fbcfe8", borderColor: "rgba(202,47,127,0.3)" }
                  }>
                  {d.amountTrendPct >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                  {d.amountTrendPct >= 0 ? "+" : ""}{d.amountTrendPct}%
                </span>
              )}
            </div>

            {/* value */}
            <div>
              {loading
                ? <Skeleton className="h-12 w-40 mb-1" style={{ background: "rgba(255,255,255,0.2)" }} />
                : <p className="text-5xl font-black leading-none tracking-tighter">{fmtAUD(d?.totalAmount)}</p>
              }
              <div className="flex items-center gap-3 mt-3">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.2)" }} />
                <p className="text-[11px] shrink-0" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {loading ? "—" : fmtNum(d?.totalCount)} transactions this period
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 KPI cards */}
        <div className="col-span-12 sm:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <KpiCard
            bgFrom="#ca2f7f"   bgTo="#9b1060"
            glowColor="rgba(202,47,127,0.35)"
            icon={Flag}
            label="Flagged"
            value={loading ? "—" : fmtNum(d?.flaggedCount)}
            sub={`${total > 0 ? Math.round(((d?.flaggedCount || 0) / total) * 100) : 0}% of period`}
            loading={loading}
          />
          <KpiCard
            bgFrom="#f6b500"   bgTo="#c98a00"
            glowColor="rgba(246,181,0,0.35)"
            icon={ShieldAlert}
            label="High Risk"
            value={loading ? "—" : fmtNum(d?.riskBuckets?.high)}
            sub={`Medium: ${fmtNum(d?.riskBuckets?.medium)}`}
            loading={loading}
          />
          <KpiCard
            bgFrom="#17a2b8"   bgTo="#0d7a8a"
            glowColor="rgba(23,162,184,0.35)"
            icon={Globe}
            label="Countries"
            value={loading ? "—" : fmtNum(d?.activeCountries)}
            sub="distinct origins"
            loading={loading}
          />
        </div>
      </div>

      {/* ── Row 2: chart + status breakdown + pending queue ────────────────── */}
      <div className="grid grid-cols-12 gap-3">

        {/* Volume chart */}
        <div className="col-span-12 sm:col-span-5 rounded-2xl border p-5"
          style={{ background: "var(--smoke-100)", borderColor: "var(--smoke-400)" }}>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold" style={{ color: "var(--heading)" }}>Volume Chart</p>
              <p className="text-[11px]" style={{ color: "var(--gray)" }}>
                {period === "all" ? "All months" : `Last ${PERIODS.find(p => p.key === period)?.label.toLowerCase()}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1"
              style={{ background: "var(--smoke-200)" }}>
              <span className="size-2 rounded-full" style={{ background: "var(--primary)" }} />
              <span className="text-[10px] font-medium" style={{ color: "var(--gray)" }}>Peak</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-end gap-1 h-[90px]">
              {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 rounded" style={{ height: `${25 + (i % 4) * 18}%` }} />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={chartData} barSize={14} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <Tooltip content={<BarTooltip />} cursor={{ fill: "var(--smoke-200)", radius: 4 }} />
                <Bar dataKey="count" radius={[4, 4, 1, 1]}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.count === maxCount ? "var(--primary)" : "var(--primary-light)"}
                      opacity={0.4 + 0.6 * (entry.count / maxCount)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          <div className="flex justify-between mt-2">
            <span className="text-[10px] font-medium" style={{ color: "var(--gray)" }}>{chartData[0]?.label}</span>
            <span className="text-[10px] font-medium" style={{ color: "var(--gray)" }}>{chartData[chartData.length - 1]?.label}</span>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="col-span-12 sm:col-span-4 rounded-2xl border p-5"
          style={{ background: "var(--smoke-100)", borderColor: "var(--smoke-400)" }}>

          <div className="mb-4">
            <p className="text-sm font-bold" style={{ color: "var(--heading)" }}>Status Breakdown</p>
            <p className="text-[11px]" style={{ color: "var(--gray)" }}>
              {PERIODS.find(p => p.key === period)?.label} · {fmtNum(total)} total
            </p>
          </div>

          <div className="space-y-3.5">
            <StatusRow icon={Clock}        label="Pending"   count={pending}   total={total}
              barColor="var(--warning)"  iconColor="var(--warning)"  loading={loading} />
            <StatusRow icon={CheckCircle2} label="Completed" count={completed} total={total}
              barColor="var(--success)"  iconColor="var(--success)"  loading={loading} />
            <StatusRow icon={XCircle}      label="Failed"    count={failed}    total={total}
              barColor="var(--danger)"   iconColor="var(--danger)"   loading={loading} />
          </div>

          {!loading && (
            <div className="mt-4 pt-3 flex items-center justify-between"
              style={{ borderTop: "1px solid var(--smoke-300)" }}>
              <span className="text-xs" style={{ color: "var(--gray)" }}>Period total</span>
              <span className="text-sm font-black tabular-nums" style={{ color: "var(--heading)" }}>
                {fmtNum(total)}
              </span>
            </div>
          )}
        </div>

        {/* Pending queue card */}
        <div className="col-span-12 sm:col-span-3 rounded-2xl border p-5 flex flex-col justify-between"
          style={{ background: "var(--smoke-100)", borderColor: "var(--smoke-400)" }}>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-xl p-2" style={{ background: "rgba(0,89,100,0.1)" }}>
                <Clock className="size-4" style={{ color: "var(--primary)" }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider rounded-md px-2 py-0.5"
                style={{ color: "var(--primary)", background: "rgba(0,89,100,0.08)" }}>
                Queue
              </span>
            </div>

            <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--gray)" }}>
              Pending Review
            </p>
            {loading
              ? <Skeleton className="h-10 w-20" />
              : <p className="text-4xl font-black leading-none tabular-nums" style={{ color: "var(--heading)" }}>
                  {fmtNum(pending)}
                </p>
            }
          </div>

          {!loading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: "var(--gray)" }}>of period</span>
                <span className="font-bold" style={{ color: "var(--heading)" }}>
                  {total > 0 ? Math.round((pending / total) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--smoke-300)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width:      `${total > 0 ? Math.round((pending / total) * 100) : 0}%`,
                    background: `linear-gradient(90deg, var(--primary-light), var(--primary))`,
                  }} />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
