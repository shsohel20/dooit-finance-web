"use client";

import CollapsibleSection from "../components/CollapsibleSection";
import SubCard from "../components/SubCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconFileStack,
  IconShieldLock,
  IconFileAlert,
  IconCash,
  IconWorld,
  IconFileAnalytics,
  IconMessageQuestion,
} from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";

/**
 * Every AUSTRAC filing raised against this case, from GET /cases/:id/reports.
 *
 * The registry below is the single place a report type is declared — the keys
 * match the API payload, and `subtitle` picks whichever secondary identifier
 * that model actually carries. Adding a seventh type is one entry here.
 */
const REPORT_TYPES = [
  {
    key: "ecdd",
    label: "ECDD",
    full: "Enhanced Customer Due Diligence",
    icon: IconShieldLock,
    subtitle: (r) => r.caseNumber || r.customerName || r.fullName,
  },
  {
    key: "smr",
    label: "SMR",
    full: "Suspicious Matter Report",
    icon: IconFileAlert,
    subtitle: (r) => r.caseNumber || r.metadata?.austracReference,
  },
  {
    key: "ttr",
    label: "TTR",
    full: "Threshold Transaction Report",
    icon: IconCash,
    subtitle: (r) => r.referenceNumber,
  },
  {
    key: "ifti",
    label: "IFTI",
    full: "International Funds Transfer Instruction",
    icon: IconWorld,
    subtitle: () => null,
  },
  {
    key: "gfs",
    label: "GFS",
    full: "Global Financial Sanctions",
    icon: IconFileAnalytics,
    subtitle: (r) => r.customerUID || r.customerName,
  },
  {
    key: "rfi",
    label: "RFI",
    full: "Request for Information",
    icon: IconMessageQuestion,
    subtitle: (r) => r.primaryContactName,
  },
];

// Report models each carry their own status enum; band them by meaning rather
// than maintaining six separate maps.
const statusVariant = (status) => {
  const s = String(status || "").toLowerCase();
  if (["approved", "submitted", "completed", "lodged", "closed", "responded"].includes(s))
    return "success";
  if (["rejected", "failed", "overdue", "cancelled"].includes(s)) return "danger";
  if (["draft", "pending", "in_review", "under_review", "sent"].includes(s)) return "warning";
  return "outline";
};

const humanize = (value) =>
  !value
    ? "—"
    : String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase());

export default function CaseReportsSection({ reports, summary, loading, sectionRef }) {
  const total = summary?.total ?? 0;

  return (
    <CollapsibleSection
      id="reports"
      title="Regulatory Filings"
      icon={IconFileStack}
      badge={loading ? undefined : total}
      defaultOpen={total > 0}
      sectionRef={sectionRef}
    >
      {loading ? (
        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
          {REPORT_TYPES.map(({ key, label, full, icon, subtitle }) => {
            const list = reports?.[key] || [];
            return (
              <SubCard
                key={key}
                icon={icon}
                title={label}
                count={list.length}
                empty={`No ${label} filed.`}
              >
                <div className="divide-y">
                  {list.map((r, i) => {
                    const sub = subtitle(r);
                    return (
                      <div
                        key={r._id || r.uid || i}
                        className="flex items-start justify-between gap-2 py-2"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-sm font-semibold text-heading">
                            {r.uid || r._id}
                          </p>
                          {sub && <p className="truncate text-xs text-muted-foreground">{sub}</p>}
                          <p className="text-xs text-muted-foreground">
                            {dateShowFormat(r.createdAt)}
                          </p>
                        </div>
                        <StatusPill variant={statusVariant(r.status)}>
                          {humanize(r.status)}
                        </StatusPill>
                      </div>
                    );
                  })}
                </div>
              </SubCard>
            );
          })}
        </div>
      )}

      {!loading && total === 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Filings raised from this case&apos;s alerts will appear here automatically.
        </p>
      )}

      <p className="sr-only">
        {REPORT_TYPES.map((t) => `${t.label} — ${t.full}`).join("; ")}
      </p>
    </CollapsibleSection>
  );
}
