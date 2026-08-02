"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  IconAlertTriangle,
  IconGavel,
  IconTag,
  IconCoin,
  IconFlag3,
  IconLink,
  IconHistory,
  IconGauge,
} from "@tabler/icons-react";

function formatCurrency(amount, currency = "AUD") {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    amount || 0,
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  // Not every metric has a backend source — show an explicit dash rather than
  // an empty slot or a misleading zero.
  const display = value === null || value === undefined || value === "" ? "—" : value;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3.5">
      <div className="mt-0.5 shrink-0 rounded-md bg-primary/10 p-2">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-heading" title={typeof display === "string" ? display : undefined}>
          {display}
        </p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export default function InvestigationSummary({ caseData, sectionRef }) {
  if (!caseData) return null;

  const flaggedCount = (caseData.transactions || []).filter((t) => t.status === "flagged").length;

  return (
    <Card ref={sectionRef} id="investigation-summary" className="scroll-mt-4 border-border shadow-sm">
      <CardContent>
        <h2 className="mb-3.5 text-sm font-semibold text-heading">Investigation Summary</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={IconAlertTriangle} label="Alert Type" value={caseData.alertType} />
          <StatCard icon={IconGavel} label="Detection Rule" value={caseData.detectionRule} />
          <StatCard icon={IconTag} label="Risk Category" value={caseData.riskCategory} />
          <StatCard
            icon={IconCoin}
            label="Total Exposure"
            // netActivity is summed in AUD server-side — do not label it with an
            // individual transaction's currency.
            value={formatCurrency(caseData.totalExposure)}
          />
          <StatCard
            icon={IconFlag3}
            label="Flagged Transactions"
            value={`${flaggedCount} of ${caseData.transactions?.length || 0}`}
          />
          <StatCard icon={IconLink} label="Related Alerts" value={caseData.relatedAlertsCount ?? 0} />
          <StatCard
            icon={IconHistory}
            label="Previous Investigations"
            value={caseData.previousInvestigationsCount ?? 0}
          />
          <StatCard
            icon={IconGauge}
            label="Confidence Score"
            value={caseData.confidenceScore != null ? `${caseData.confidenceScore}%` : null}
          />
        </div>
      </CardContent>
    </Card>
  );
}
