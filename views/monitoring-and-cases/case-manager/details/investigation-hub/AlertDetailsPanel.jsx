"use client";

import { StatusPill } from "@/components/ui/StatusPill";
import { IconAlertTriangle } from "@tabler/icons-react";
import { dateShowFormat, formatAUD, getInitials } from "@/lib/utils";

function FactRow({ label, value, valueClassName }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12.5px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={valueClassName || "font-semibold text-heading"}>{value ?? "—"}</span>
    </div>
  );
}

export default function AlertDetailsPanel({ caseData }) {
  const c = caseData?.customer || {};
  const transactions = caseData?.transactions || [];
  const flaggedCount = transactions.filter((t) => t.status === "flagged").length;

  return (
    <div className="flex w-[290px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-white">
      <div className="flex shrink-0 items-center gap-2.5 border-b-2 border-warning bg-warning/10 px-4 py-3">
        <span className="size-2 rounded-full bg-warning" />
        <span className="text-[13px] font-bold tracking-wide text-warning">ALERT DETAILS</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-4 rounded-lg border border-warning/20 bg-warning/5 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-warning">
            <IconAlertTriangle className="size-3" />
            ALERT TRIGGER
          </div>
          <div className="mb-1.5 text-[13px] font-semibold leading-snug text-heading">
            {caseData?.title || caseData?.caseName}
          </div>
          <StatusPill variant="warning">In progress</StatusPill>
        </div>

        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
          Case Facts
        </div>
        <div className="mb-4.5 flex flex-col gap-2.5">
          <FactRow label="Organisation" value={caseData?.organisation} />
          <FactRow label="Alert type" value={caseData?.alertType} />
          <FactRow label="Detection rule" value={caseData?.detectionRule} />
          <FactRow
            label="Total exposure"
            value={formatAUD(caseData?.totalExposure || 0)}
            valueClassName="font-bold text-primary"
          />
          <FactRow
            label="Flagged transactions"
            value={`${flaggedCount} of ${transactions.length}`}
          />
          <FactRow label="Related alerts" value={caseData?.relatedAlertsCount ?? 0} />
        </div>

        <div className="mb-4 h-px bg-border" />

        <div className="mb-3.5 flex items-center gap-2.5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {getInitials(c.name || caseData?.customerName)}
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-bold text-heading">{c.name || caseData?.customerName}</div>
            <div className="text-xs text-muted-foreground">{caseData?.customerType} customer</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <FactRow label="Customer ID" value={caseData?.uid} valueClassName="font-mono text-[11px] font-semibold" />
          <FactRow label="Nationality" value={c.nationality} />
          <FactRow label="Occupation" value={c.occupation} />
          <FactRow
            label="Account opened"
            value={c.accountOpeningDate ? dateShowFormat(c.accountOpeningDate) : "—"}
          />
          <FactRow label="Risk rating" value={c.riskRating || caseData?.riskTag} valueClassName="font-semibold text-warning" />
          <FactRow label="Email" value={c.email} valueClassName="text-right text-[11px] font-semibold break-all" />
        </div>
      </div>
    </div>
  );
}
