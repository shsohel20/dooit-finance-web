"use client";
import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusPill } from "@/components/ui/StatusPill";

/**
 * Ownership summary badge + hover map (docs/65 Step 70).
 *
 * Shared by the Companies and Trusts registers so both count the same things
 * the same way. The row shows ONE compact count; hovering reveals the actual
 * structure, so the table stays scannable but the detail is a pointer away
 * rather than requiring the file to be opened.
 *
 * Following the dataviz guidance already used for the ownership graph:
 *  - every entry is a labelled row, so identity never depends on colour;
 *  - the reserved status colour is used only for the one blocking condition
 *    (ownership that doesn't resolve to a person), never as decoration;
 *  - the hover panel is a small labelled chain, not a chart — half a dozen
 *    named counts is a job for a list, not a plot.
 */

/**
 * The UBO test, in one place: >=25% ownership, >=25% voting, or control by
 * other means. Must stay identical to CompanyKyc's `ubos` virtual and the
 * Review page badge — counting the raw beneficial_owners array instead would
 * over-report, since a 10% holder is recorded but does not resolve ownership.
 */
export const qualifyingUbos = (owners = []) =>
  owners.filter(
    (o) => (o.ownership_percent || 0) >= 25 || (o.voting_percent || 0) >= 25 || o.control_type === "other_means",
  );

/** Every connected entity a company record holds. */
export function companyOwnership(c = {}) {
  const shareholders = c.shareholders || [];
  const related = c.related_entities || [];
  const appointments = c.appointments || [];
  const trusts = shareholders.filter((s) => s.holder_model === "TrustKyc");
  const parents = related.filter((r) => r.relation === "parent");
  const subsidiaries = related.filter((r) => r.relation && r.relation !== "parent");
  const directors = appointments.filter((a) => a.role === "director");
  const ubos = qualifyingUbos(c.directors_beneficial_owner?.beneficial_owners);

  const rows = [
    ["Shareholders", shareholders.length],
    ["Held via trust", trusts.length],
    ["Parent entities", parents.length],
    ["Subsidiaries / branches", subsidiaries.length],
    ["Directors", directors.length],
    ["Other officers", appointments.length - directors.length],
    ["Beneficial owners (UBO)", ubos.length],
  ];
  return {
    rows,
    total: rows.reduce((n, [, v]) => n + v, 0),
    trusts: trusts.length,
    // The blocking condition: a parent entity recorded with no owner behind
    // it who meets the UBO test.
    gap: parents.length > 0 && ubos.length === 0,
    chain: {
      above: parents.map((p) => p.name).filter(Boolean),
      belowLabel: "Subsidiaries",
      below: subsidiaries.map((s) => s.name).filter(Boolean),
      trustNames: trusts
        .map((s) => s.holder_entity?.trust_details?.full_trust_name || s.holder_name)
        .filter(Boolean),
    },
  };
}

/** Every connected entity a trust record holds. `companies` is the reverse
 *  lookup (which companies this trust holds an interest in) — optional,
 *  because the list endpoint doesn't carry it. */
export function trustOwnership(t = {}, companies = []) {
  const trustees = t.individual_trustees?.trustees || [];
  const companyTrustees = t.company_trustees?.company_details || [];
  const beneficiaries = t.beneficiaries || [];
  const controllers = t.controllers?.controlling_persons || [];
  const reps = t.controllers?.authorised_representatives || [];
  const settlor = t.settlor?.full_name || t.settlor?.company?.company_name ? 1 : 0;

  const rows = [
    ["Settlor", settlor],
    ["Individual trustees", trustees.length],
    ["Company trustees", companyTrustees.length],
    ["Beneficiaries", beneficiaries.length],
    ["Controlling persons", controllers.length],
    ["Authorised reps", reps.length],
    ["Companies held", companies.length],
  ];
  return {
    rows,
    total: rows.reduce((n, [, v]) => n + v, 0),
    // A trust with no trustee, or none of settlor/beneficiary, is the thing
    // worth flagging from a register.
    gap: trustees.length + companyTrustees.length === 0 || beneficiaries.length === 0,
    chain: {
      above: [
        ...(t.settlor?.full_name ? [`${t.settlor.full_name} (settlor)`] : []),
        ...trustees.map((x) => `${x.full_name} (trustee)`).filter(Boolean),
        ...companyTrustees.map((c) => `${c.company_name} (company trustee)`).filter(Boolean),
      ],
      belowLabel: "Companies held",
      below: companies.map((c) => c.general_information?.legal_name || c.uid).filter(Boolean),
      trustNames: [],
    },
  };
}

function ChainList({ title, items, empty }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      {items.length ? (
        <ul className="mt-1 space-y-0.5">
          {items.slice(0, 4).map((n) => (
            <li key={n} className="truncate text-[11.5px]">
              {n}
            </li>
          ))}
          {items.length > 4 && <li className="text-[11px] text-muted-foreground">+{items.length - 4} more</li>}
        </ul>
      ) : (
        <p className="mt-1 text-[11.5px] text-muted-foreground">{empty}</p>
      )}
    </div>
  );
}

/**
 * The badge that sits beside the record's name. One number, plus the single
 * blocking flag when it applies; the breakdown lives in the hover panel.
 */
export function OwnershipBadge({ summary, subjectName, subjectRole = "This entity", defaultOpen = false }) {
  const { rows, total, gap, chain } = summary;
  if (!total && !gap) return null;

  // A record with nothing on file still shows the badge when it has a gap —
  // that IS the finding. "0 linked" read like a count that failed to load, so
  // the empty case says what it means.
  const label = total ? `${total} linked` : "Nothing linked";

  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip defaultOpen={defaultOpen}>
        <TooltipTrigger asChild>
          {/* A button, not a bare span: the panel must be reachable by
              keyboard, and Radix opens the tooltip on focus. */}
          <button
            type="button"
            className="inline-flex cursor-help items-center gap-1 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10.5px] font-semibold text-muted-foreground"
            aria-label={`${total} connected entities. ${gap ? "Ownership does not resolve to a person." : ""}`}
          >
            {label}
            {gap && <span className="size-1.5 rounded-full bg-danger" aria-hidden="true" />}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[320px] bg-popover p-0 text-popover-foreground shadow-lg">
          <div className="w-[320px] p-3">
            <div className="truncate text-[12.5px] font-semibold">{subjectName || "This record"}</div>
            <div className="text-[11px] text-muted-foreground">{subjectRole}</div>

            {/* The map: what sits above this record in the chain, the record
                itself, and what sits below it. */}
            <div className="mt-2.5 grid gap-2 rounded-md border bg-background/60 p-2">
              <ChainList title="Owned / controlled by" items={chain.above} empty="Nothing recorded above." />
              {chain.trustNames.length > 0 && (
                <ChainList title="Held via trust" items={chain.trustNames} empty="" />
              )}
              <ChainList title={chain.belowLabel} items={chain.below} empty="Nothing recorded below." />
            </div>

            {/* Counts — labelled rows, so no meaning rests on colour. */}
            <div className="mt-2.5 space-y-0.5">
              {rows
                .filter(([, v]) => v > 0)
                .map(([label, v]) => (
                  <div key={label} className="flex items-baseline justify-between gap-3 text-[11.5px]">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-mono font-semibold tabular-nums">{v}</span>
                  </div>
                ))}
            </div>

            {gap && (
              <div className="mt-2.5">
                <StatusPill variant="danger">Ownership unresolved</StatusPill>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
