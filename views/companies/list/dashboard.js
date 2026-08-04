"use client";
import React, { useEffect, useState } from "react";
import { getCompanyStats } from "@/app/dashboard/client/companies/actions";
import JurisdictionMap, { JURISDICTION_RAMP } from "./jurisdiction-map";

/**
 * Companies portfolio dashboard — implements the "Company Dashboard" design
 * (docs/65 Step 58).
 *
 * Every figure comes from GET /customer/company/stats, which aggregates the
 * WHOLE collection server-side. Deliberately not tallied from the list
 * response in the browser: that endpoint is paginated (default 25), so a
 * client-side tally would silently describe page one and under-report every
 * number — worse than showing nothing in a compliance tool.
 *
 * Scope taken from the design file:
 *  - Its sidebar and top nav are NOT reproduced — this app already has its
 *    own dashboard shell, so rebuilding them here would duplicate the chrome.
 *  - Its "Risk rating" donut is replaced by "Registry status". CompanyKyc has
 *    no risk-rating field anywhere, and inventing one on a compliance screen
 *    would be fabricating a regulatory signal. Registry status is real, is
 *    already aggregated, and fits the same donut form.
 *  - Its per-row "Oldest Nd" ages in Needs attention, the "avg idle / past
 *    SLA / pass rate / reopened" pipeline sub-stats, and the "2 jurisdictions
 *    flagged by FATF" note are omitted for the same reason — no data backs
 *    them. Median-days-to-approval and oldest-file-in-review ARE backed, and
 *    are shown.
 *  - Typography follows the app's own font tokens rather than the design's
 *    IBM Plex, per the standing decision recorded in docs/65 Step 16.
 *
 * Colour follows the data's job, and the palettes were run through the
 * dataviz validator rather than eyeballed:
 *  - status trio (#2f9e68 / #d79a25 / #c2542a) passes CVD and normal-vision
 *    separation on a white card; amber is sub-3:1, which is why every status
 *    everywhere here ships with a text label beside it, never colour alone;
 *  - the donut ramp is the design's teal family with its lightest step
 *    darkened — the design's own #c3cfcd measured 1.60:1 against white, below
 *    the 2:1 floor, so the smallest slice would have been near-invisible;
 *  - the trend is a single series, so it carries no legend (the title names it).
 */

const TEAL = "#0f7368";
const STATUS = { good: "#2f9e68", warning: "#d79a25", critical: "#c2542a", neutral: "#9a9990", muted: "#c3cfcd" };

/* Ordinal donut ramp — validated: monotone lightness, adjacent ΔL >= 0.06,
   light end 2.23:1 vs white, hue spread 4°. Ordered darkest-first because the
   largest slice is drawn first. */
const DONUT = ["#0f7368", "#4f9089", "#6ba49d", "#8fb5b0"];

const REVIEW_STAGES = [
  ["draft", "Draft", STATUS.muted],
  ["in_review", "In review", STATUS.warning],
  ["escalated", "Escalated", TEAL],
  ["approved", "Approved", STATUS.good],
  ["declined", "Declined", STATUS.critical],
];

const ENTITY_TYPE_LABELS = {
  proprietary_limited: "Proprietary limited",
  public_company: "Public company",
  foreign_company: "Foreign company",
  other: "Other",
  unspecified: "Not specified",
};

const REGISTRY_STATUS_LABELS = {
  active: "Registered",
  deregistered: "Deregistered",
  external_administration: "External administration",
  unspecified: "Not specified",
};

const DOC_TYPE_LABELS = {
  certificate_of_incorporation: "Certificate of incorporation",
  constitution: "Constitution / charter",
  register_of_members: "Register of members",
  proof_of_address: "Proof of registered address",
  ownership_structure_chart: "Ownership structure",
  asic_extract: "ASIC extract",
  other: "Other",
};

const num = (n) => (Number(n) || 0).toLocaleString();
const monthLabel = (key) => {
  const [y, m] = String(key).split("-");
  return new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleString("en-AU", { month: "short" });
};

/* ── primitives ───────────────────────────────────────────────────────── */

const cardCls = "min-w-0 rounded-xl border border-[#e7e6e1] bg-white";
const figureCls = "font-mono tabular-nums";

function Card({ children, className = "" }) {
  return <div className={`${cardCls} ${className}`}>{children}</div>;
}

function PanelHead({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold text-[#1a1a18]">{title}</div>
        {subtitle && <div className="mt-[3px] text-[12.5px] text-[#78776f]">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

function Dot({ color, square = false }) {
  return (
    <span
      className={`shrink-0 ${square ? "size-2 rounded-[2px]" : "size-[7px] rounded-full"}`}
      style={{ background: color }}
      aria-hidden="true"
    />
  );
}

/** Donut built from a conic-gradient, as in the design. */
function Donut({ slices, centerValue, centerLabel, size = 104 }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const stops = [];
  let acc = 0;
  for (const s of slices) {
    const from = total ? (acc / total) * 100 : 0;
    acc += s.value;
    const to = total ? (acc / total) * 100 : 0;
    stops.push(`${s.color} ${from}% ${to}%`);
  }
  const bg = total ? `conic-gradient(${stops.join(", ")})` : "conic-gradient(#efeee9 0 100%)";
  return (
    <div className="relative shrink-0 rounded-full" style={{ width: size, height: size, background: bg }}>
      {/* The hole is ~62px across, so the caption has to stay short or it
          spills onto the ring — keep centerLabel to a word (see call sites). */}
      <div className="absolute inset-[21px] flex flex-col items-center justify-center overflow-hidden rounded-full bg-white px-1">
        <div className={`text-[17px] font-medium leading-none text-[#1a1a18] ${figureCls}`}>{centerValue}</div>
        <div className="mt-[2px] max-w-full truncate text-[9.5px] uppercase leading-none tracking-[0.03em] text-[#9a9990]">{centerLabel}</div>
      </div>
    </div>
  );
}

/** Donut + legend. The legend is the identity channel; colour reinforces. */
function DonutPanel({ title, subtitle, slices, centerValue, centerLabel, emptyNote }) {
  const hasData = slices.some((s) => s.value > 0);
  return (
    <Card className="p-[15px_17px_16px]">
      <PanelHead title={title} subtitle={subtitle} />
      {hasData ? (
        <div className="mt-[14px] flex items-center gap-4">
          <Donut slices={slices} centerValue={centerValue} centerLabel={centerLabel} />
          <div className="flex min-w-0 flex-1 flex-col gap-[9px] text-[12.5px]">
            {slices.map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <Dot color={s.color} square />
                <span className="min-w-0 flex-1 truncate text-[#1a1a18]">{s.label}</span>
                <span className={`text-[#45443e] ${figureCls}`}>{s.display ?? num(s.value)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-[12.5px] text-[#78776f]">{emptyNote}</p>
      )}
    </Card>
  );
}

/* ── dashboard ────────────────────────────────────────────────────────── */

export default function CompaniesDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getCompanyStats();
        if (cancelled) return;
        if (res?.success && res.data) setStats(res.data);
        else setError(res?.message || "Could not load portfolio analytics");
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load portfolio analytics");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="mb-4 rounded-xl border border-[#e7e6e1] bg-white p-4 text-[12.5px] text-[#78776f]">
        Portfolio analytics unavailable — {error}. The register below is unaffected.
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="mb-3 grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[96px] animate-pulse rounded-xl border border-[#e7e6e1] bg-[#f4f4f0]" />
        ))}
      </div>
    );
  }

  const a = stats.attention || {};
  const rs = stats.by_review_status || {};
  const timing = stats.review_timing || {};
  const cov = stats.document_coverage || {};
  const needsAttention = (a.ubo_unresolved || 0) + (a.docs_expired || 0) + (a.docs_rejected || 0);

  const stages = REVIEW_STAGES.map(([key, label, color]) => ({ key, label, color, value: rs[key] || 0 }));
  const pipelineTotal = stages.reduce((s, x) => s + x.value, 0);

  const attentionRows = [
    { label: "Ownership not resolved to a person", value: a.ubo_unresolved || 0, tone: STATUS.critical },
    { label: "Documents expired", value: a.docs_expired || 0, tone: STATUS.critical },
    { label: "Documents rejected at verification", value: a.docs_rejected || 0, tone: STATUS.critical },
    { label: "Documents expiring within 30 days", value: a.docs_expiring_soon || 0, tone: STATUS.warning },
    { label: "Screening still pending", value: a.screening_pending || 0, tone: STATUS.warning },
    { label: "No documents attached", value: a.no_documents || 0, tone: STATUS.neutral },
  ].filter((r) => r.value > 0);

  const entitySlices = Object.entries(stats.by_entity_type || {})
    .map(([k, v]) => ({ label: ENTITY_TYPE_LABELS[k] || k, value: v }))
    .sort((x, z) => z.value - x.value)
    .map((s, i) => ({ ...s, color: DONUT[Math.min(i, DONUT.length - 1)] }));

  const registrySlices = Object.entries(stats.by_registry_status || {})
    .map(([k, v]) => ({ label: REGISTRY_STATUS_LABELS[k] || k, value: v }))
    .sort((x, z) => z.value - x.value)
    .map((s, i) => ({ ...s, color: DONUT[Math.min(i, DONUT.length - 1)] }));

  const covByType = (cov.by_type || []).slice(0, 4);
  const coverageSlices = [
    { label: "With documents", value: cov.with_any_document || 0, color: TEAL },
    { label: "None on file", value: Math.max(0, (stats.total || 0) - (cov.with_any_document || 0)), color: "#efeee9" },
  ];

  const countries = stats.by_country || [];
  const countryMax = Math.max(1, ...countries.map((c) => c.count));
  const trend = stats.trend || [];
  const trendMax = Math.max(1, ...trend.map((p) => p.count));
  const trendAvg = trend.length ? Math.round((trend.reduce((s, p) => s + p.count, 0) / trend.length) * 10) / 10 : 0;

  return (
    <div className="mb-4 flex flex-col gap-3">
      {/* KPI row */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        <Card className="p-[13px_15px_14px]">
          <div className="text-[12.5px] text-[#78776f]">Companies on register</div>
          <div className={`my-[6px] text-[29px] font-medium leading-none tracking-[-0.03em] text-[#1a1a18] ${figureCls}`}>{num(stats.total)}</div>
          <div className="text-[12px] text-[#2f7d59]">
            {stats.added_last_30_days > 0 ? `+${num(stats.added_last_30_days)} in the last 30 days` : "No additions in the last 30 days"}
          </div>
        </Card>
        <Card className="p-[13px_15px_14px]">
          <div className="flex items-center gap-[7px] text-[12.5px] text-[#78776f]"><Dot color={STATUS.warning} />Awaiting review</div>
          <div className={`my-[6px] text-[29px] font-medium leading-none tracking-[-0.03em] text-[#1a1a18] ${figureCls}`}>{num(rs.in_review || 0)}</div>
          <div className="text-[12px] text-[#78776f]">Submitted files sitting in the queue.</div>
        </Card>
        <Card className="p-[13px_15px_14px]">
          <div className="flex items-center gap-[7px] text-[12.5px] text-[#78776f]"><Dot color={STATUS.good} />Approved</div>
          <div className={`my-[6px] text-[29px] font-medium leading-none tracking-[-0.03em] text-[#1a1a18] ${figureCls}`}>{num(rs.approved || 0)}</div>
          <div className="text-[12px] text-[#78776f]">Files that passed review.</div>
        </Card>
        <Card className="p-[13px_15px_14px]">
          <div className="flex items-center gap-[7px] text-[12.5px] text-[#78776f]"><Dot color={STATUS.critical} />Needs attention</div>
          <div className={`my-[6px] text-[29px] font-medium leading-none tracking-[-0.03em] text-[#1a1a18] ${figureCls}`}>{num(needsAttention)}</div>
          <div className="text-[12px] text-[#78776f]">Unresolved ownership, expiries, rejections.</div>
        </Card>
      </div>

      {/* Review pipeline + Needs attention */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(330px, 1fr))" }}>
        <Card className="p-[15px_17px_16px]">
          <PanelHead
            title="Review pipeline"
            subtitle={`${num(pipelineTotal)} files in the compliance workflow`}
            right={
              timing.median_days_to_approval != null ? (
                <div className="shrink-0 text-right">
                  <div className="text-[11px] uppercase tracking-[0.06em] text-[#9a9990]">Median to approval</div>
                  <div className={`text-[15px] font-medium text-[#1a1a18] ${figureCls}`}>{timing.median_days_to_approval} days</div>
                </div>
              ) : null
            }
          />
          {pipelineTotal > 0 ? (
            <>
              {/* Stacked proportion bar — 2px surface gaps separate segments. */}
              <div className="mt-[14px] flex h-[10px] gap-[2px] overflow-hidden rounded-[5px]">
                {stages
                  .filter((s) => s.value > 0)
                  .map((s) => (
                    <div key={s.key} style={{ width: `${(s.value / pipelineTotal) * 100}%`, background: s.color }} title={`${s.label}: ${num(s.value)}`} />
                  ))}
              </div>
              <div className="mt-[14px] grid gap-[10px]" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))" }}>
                {stages.map((s) => (
                  <div key={s.key}>
                    <div className="flex items-center gap-[6px] text-[12px] text-[#45443e]">
                      <Dot color={s.color} square />
                      <span className="truncate">{s.label}</span>
                    </div>
                    <div className={`mt-1 text-[19px] font-medium text-[#1a1a18] ${figureCls}`}>{num(s.value)}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-3 text-[12.5px] text-[#78776f]">No files in the review workflow yet.</p>
          )}
          {timing.oldest_in_review && (
            <div className="mt-[14px] border-t border-[#f0efea] pt-3 text-[12px] text-[#78776f]">
              Oldest file in review: <span className="text-[#1a1a18]">{timing.oldest_in_review.legal_name}</span> · {timing.oldest_in_review.days} days
            </div>
          )}
        </Card>

        <Card className="flex flex-col p-[15px_17px_16px]">
          <PanelHead
            title="Needs attention"
            subtitle={`${num(needsAttention)} companies blocked from approval`}
            right={
              needsAttention > 0 ? (
                <span className="shrink-0 whitespace-nowrap rounded-[20px] bg-[#fbe9e2] px-[9px] py-[3px] text-[11.5px] font-semibold text-[#9a3d1c]">
                  {num(needsAttention)} critical
                </span>
              ) : null
            }
          />
          {attentionRows.length ? (
            <div className="mt-2 flex flex-col">
              {attentionRows.map((r, i) => (
                <div
                  key={r.label}
                  className={`flex items-center gap-[10px] py-2 text-[12.5px] ${i < attentionRows.length - 1 ? "border-b border-[#f0efea]" : ""}`}
                >
                  <Dot color={r.tone} />
                  <span className="min-w-0 flex-1 text-[#1a1a18]">{r.label}</span>
                  <span className={`font-medium text-[#1a1a18] ${figureCls}`}>{num(r.value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[12.5px] text-[#78776f]">
              Nothing outstanding — no unresolved ownership, expired documents or pending screening.
            </p>
          )}
        </Card>
      </div>

      {/* Three donuts */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))" }}>
        <DonutPanel
          title="Entity type"
          subtitle="Composition of the register"
          slices={entitySlices}
          centerValue={num(stats.total)}
          centerLabel="entities"
          emptyNote="No companies on the register yet."
        />
        <Card className="p-[15px_17px_16px]">
          <PanelHead title="Document coverage" subtitle="Required KYB evidence on file" />
          <div className="mt-[14px] flex items-center gap-4">
            <Donut slices={coverageSlices} centerValue={`${cov.overall_pct ?? 0}%`} centerLabel="on file" />
            <div className="flex min-w-0 flex-1 flex-col gap-[9px] text-[12.5px]">
              {covByType.length ? (
                covByType.map((t) => (
                  <div key={t.doc_type} className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-[#1a1a18]">{DOC_TYPE_LABELS[t.doc_type] || t.doc_type}</span>
                    <span className={`${figureCls} ${t.pct < 70 ? "text-[#c2542a]" : "text-[#45443e]"}`}>{t.pct}%</span>
                  </div>
                ))
              ) : (
                <span className="text-[#78776f]">No typed documents on file yet.</span>
              )}
            </div>
          </div>
        </Card>
        <DonutPanel
          title="Registry status"
          subtitle="As recorded on the register"
          slices={registrySlices}
          centerValue={num(stats.by_registry_status?.active || 0)}
          centerLabel="active"
          emptyNote="No registry status recorded yet."
        />
      </div>

      {/* Geographic exposure + trend */}
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(430px, 1fr))" }}>
        <Card className="p-[15px_17px_16px]">
          <PanelHead
            title="Geographic exposure"
            subtitle="Companies by country of incorporation"
            right={
              <div className="flex shrink-0 items-center gap-[10px] text-[11px] text-[#78776f]">
                <span>Fewer</span>
                <span className="flex gap-[3px]">
                  {JURISDICTION_RAMP.map((c) => (
                    <span key={c} className="h-[9px] w-[22px] rounded-[2px]" style={{ background: c }} />
                  ))}
                </span>
                <span>More</span>
              </div>
            }
          />
          {/* 215px, not the design's 190 — our country names are longer
              ("United Kingdom", "New Zealand") and were truncating. */}
          <div className="mt-2 grid items-center gap-4" style={{ gridTemplateColumns: "minmax(0, 1fr) 215px" }}>
            <JurisdictionMap byCountry={countries} />
            <div className="flex flex-col gap-3">
              <div className="text-[11px] uppercase tracking-[0.06em] text-[#9a9990]">Concentration</div>
              <div className="flex flex-col gap-[11px] text-[12.5px]">
                {countries.length ? (
                  countries.map((c) => (
                    <div key={c.country} className="flex items-center gap-[10px]">
                      <span className="min-w-0 flex-1 truncate text-[#1a1a18]" title={c.country}>{c.country}</span>
                      <span className="h-[6px] w-[56px] shrink-0 rounded-[4px] bg-[#efeee9]">
                        <span
                          className="block h-[6px] rounded-[4px]"
                          style={{ width: `${Math.max(4, (c.count / countryMax) * 100)}%`, background: TEAL }}
                        />
                      </span>
                      <span className={`w-[26px] shrink-0 text-right text-[#45443e] ${figureCls}`}>{num(c.count)}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-[#78776f]">No jurisdiction recorded yet.</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-[15px_17px_13px]">
          <PanelHead
            title="Companies added"
            subtitle="Last 12 months"
            right={
              <div className="flex shrink-0 gap-[22px] text-right">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.06em] text-[#9a9990]">This month</div>
                  <div className={`text-[20px] font-medium text-[#1a1a18] ${figureCls}`}>{num(trend[trend.length - 1]?.count || 0)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.06em] text-[#9a9990]">Avg / month</div>
                  <div className={`text-[20px] font-medium text-[#1a1a18] ${figureCls}`}>{trendAvg}</div>
                </div>
              </div>
            }
          />
          <div className="mt-4">
            {/* Stretch-to-fit geometry so the plot fills the card; the stroke
                is held at a true 2.5px by vector-effect, and the month ticks
                are HTML so they stay crisp instead of being squeezed. */}
            <div className="relative">
              <svg viewBox="0 0 1200 220" preserveAspectRatio="none" className="block h-[118px] w-full" role="img" aria-label="Companies added per month, last 12 months">
                {[40, 100, 160].map((y) => (
                  <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="#f0efea" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                ))}
                <line x1="0" y1="210" x2="1200" y2="210" stroke="#e2e1db" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                {(() => {
                  const pts = trend.map((p, i) => {
                    const x = trend.length === 1 ? 600 : (i / (trend.length - 1)) * 1200;
                    const y = 210 - (p.count / trendMax) * 180;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  });
                  if (!pts.length) return null;
                  const d = `M${pts.join(" L")}`;
                  return (
                    <>
                      <path d={`${d} L1200,210 L0,210 Z`} fill="#e6f0ee" />
                      <path d={d} fill="none" stroke={TEAL} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
                    </>
                  );
                })()}
              </svg>
              {/* Hover layer with hit targets far larger than the marks. */}
              <div className="absolute inset-0 flex">
                {trend.map((p) => (
                  <div key={p.month} className="h-full flex-1 hover:bg-[#f0efea]/50" title={`${monthLabel(p.month)}: ${p.count} added`} />
                ))}
              </div>
            </div>
            <div className="mt-2 flex text-[11.5px] text-[#9a9990]">
              {trend.map((p) => (
                <span key={p.month} className="flex-1 text-center">
                  {monthLabel(p.month)}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
