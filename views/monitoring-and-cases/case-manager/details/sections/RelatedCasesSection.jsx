"use client";

import { useRouter } from "next/navigation";
import CollapsibleSection from "../components/CollapsibleSection";
import SubCard from "../components/SubCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconLink, IconEye, IconFileCheck, IconUsers, IconCopy, IconArrowsExchange, IconBell } from "@tabler/icons-react";
import { mockCases } from "@/lib/case-manager-data";
import { dateShowFormat } from "@/lib/utils";

const statusVariants = {
  // API Case status enum
  open: "info",
  under_investigation: "warning",
  pending_review: "outline",
  closed: "success",
  escalated: "danger",
  // mock fixture values
  Active: "success",
  "Under Review": "warning",
  Closed: "outline",
};

const humanizeStatus = (status) =>
  !status
    ? "—"
    : String(status)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase());

// Transaction sender/receiver are PartySchema subdocuments on the API
// ({ name, account, institution, ... }) but plain strings in the mock
// fixtures — never render either straight into JSX.
const partyName = (party) => {
  if (!party) return "";
  if (typeof party === "string") return party;
  return party.name || party.account || party.institution || "";
};

export default function RelatedCasesSection({ caseData, sectionRef }) {
  const router = useRouter();
  const relatedCases = caseData?.relatedCases || [];
  const previousSARs = caseData?.previousSARs || [];
  const connectedCustomers = caseData?.connectedCustomers || [];
  const duplicateAlerts = caseData?.duplicateAlerts || [];
  const linkedAlerts = caseData?.linkedAlerts || [];
  const linkedTransactions = caseData?.linkedTransactions || [];

  const allTransactions = mockCases.flatMap((c) => c.transactions || []);

  return (
    <CollapsibleSection id="related-cases" title="Related Cases & Alerts" icon={IconLink} sectionRef={sectionRef}>
      <div className="grid gap-3.5 md:grid-cols-2">
        <SubCard icon={IconLink} title="Related Investigations" count={relatedCases.length} empty="No related cases found.">
          <div className="divide-y">
            {relatedCases.map((rc, i) => {
              // The API already returns the target _id on each related case;
              // fall back to the mock lookup for the fixture shape.
              const targetId = rc._id || mockCases.find((c) => c.uid === rc.caseId)?._id;
              return (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-sm font-semibold text-heading">{rc.caseId}</span>
                    <Badge variant="outline" className="w-fit text-xs">
                      {rc.caseType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill variant={statusVariants[rc.status] || "outline"}>
                      {humanizeStatus(rc.status)}
                    </StatusPill>
                    {targetId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          router.push(`/dashboard/client/monitoring-and-cases/case-manager/${targetId}`)
                        }
                      >
                        <IconEye className="size-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SubCard>

        <SubCard icon={IconFileCheck} title="Previous SARs" count={previousSARs.length} empty="No SARs filed for this customer.">
          <div className="divide-y">
            {previousSARs.map((s) => (
              <div key={s.id} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-heading">{s.id}</span>
                  <StatusPill variant="outline">{s.status}</StatusPill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <p className="text-xs text-muted-foreground">Filed {dateShowFormat(s.filedDate)}</p>
              </div>
            ))}
          </div>
        </SubCard>

        <SubCard
          icon={IconBell}
          title="Linked Alerts"
          count={linkedAlerts.length}
          empty="No alerts linked to this case."
        >
          <div className="divide-y">
            {linkedAlerts.map((a, i) => (
              <div key={a._id || i} className="flex items-center justify-between py-2">
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-heading">{a.uid}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.ruleName || a.explanation || a.caseType || "—"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {a.riskLabel && (
                    <Badge variant="outline" className="text-xs">
                      {a.riskLabel}
                    </Badge>
                  )}
                  <StatusPill variant={statusVariants[a.status] || "outline"}>
                    {humanizeStatus(a.status)}
                  </StatusPill>
                </div>
              </div>
            ))}
          </div>
        </SubCard>

        <SubCard icon={IconUsers} title="Connected Customers" count={connectedCustomers.length} empty="No connected customers found.">
          <div className="divide-y">
            {connectedCustomers.map((cc, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-heading">{cc.name}</p>
                  <p className="text-xs text-muted-foreground">{cc.relationship}</p>
                </div>
                {cc.riskTag && (
                  <StatusPill variant={cc.riskTag === "High" ? "danger" : cc.riskTag === "Medium" ? "warning" : "info"}>
                    {cc.riskTag}
                  </StatusPill>
                )}
              </div>
            ))}
          </div>
        </SubCard>

        <SubCard icon={IconCopy} title="Duplicate Alerts" count={duplicateAlerts.length} empty="No duplicate alerts detected.">
          <div className="divide-y">
            {duplicateAlerts.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-heading">{d.alertId}</p>
                  <p className="text-xs text-muted-foreground">{d.detectionRule}</p>
                </div>
                <div className="text-right">
                  <StatusPill variant="outline">{d.status}</StatusPill>
                  <p className="mt-0.5 text-xs text-muted-foreground">{dateShowFormat(d.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </SubCard>

        <SubCard
          icon={IconArrowsExchange}
          title="Linked Transactions"
          count={linkedTransactions.length}
          empty="No linked transactions across other cases."
        >
          <div className="divide-y">
            {linkedTransactions.map((linked, i) => {
              // The API populates linkedTransactions with full Transaction
              // documents; the mock fixtures store bare ids. Support both.
              const populated = linked && typeof linked === "object";
              const txn = populated ? linked : allTransactions.find((t) => t.id === linked);
              const label = populated ? linked.uid || linked._id : linked;
              const from = partyName(txn?.sender);
              const to = partyName(txn?.receiver);
              return (
                <div key={label || i} className="flex items-center justify-between py-2">
                  <span className="font-mono text-sm font-semibold text-heading">{label}</span>
                  {from || to ? (
                    <span className="text-xs text-muted-foreground">
                      {from || "—"} → {to || "—"}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Details unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
        </SubCard>
      </div>
    </CollapsibleSection>
  );
}
