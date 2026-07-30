"use client";

import { useRouter } from "next/navigation";
import CollapsibleSection from "../components/CollapsibleSection";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconLink, IconEye, IconFileCheck, IconUsers, IconCopy, IconArrowsExchange } from "@tabler/icons-react";
import { mockCases } from "@/lib/case-manager-data";
import { dateShowFormat } from "@/lib/utils";

const statusVariants = {
  Active: "success",
  "Under Review": "warning",
  Closed: "outline",
};

function SubCard({ icon: Icon, title, count, children, empty }) {
  return (
    <div className="rounded-lg border border-border p-3.5">
      <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="size-3.5" />
        {title} ({count})
      </p>
      {count === 0 ? <p className="text-sm text-muted-foreground">{empty}</p> : children}
    </div>
  );
}

export default function RelatedCasesSection({ caseData, sectionRef }) {
  const router = useRouter();
  const relatedCases = caseData?.relatedCases || [];
  const previousSARs = caseData?.previousSARs || [];
  const connectedCustomers = caseData?.connectedCustomers || [];
  const duplicateAlerts = caseData?.duplicateAlerts || [];
  const linkedTransactions = caseData?.linkedTransactions || [];

  const allTransactions = mockCases.flatMap((c) => c.transactions || []);

  return (
    <CollapsibleSection id="related-cases" title="Related Cases & Alerts" icon={IconLink} sectionRef={sectionRef}>
      <div className="grid gap-3.5 md:grid-cols-2">
        <SubCard icon={IconLink} title="Related Investigations" count={relatedCases.length} empty="No related cases found.">
          <div className="divide-y">
            {relatedCases.map((rc, i) => {
              const fullCase = mockCases.find((c) => c.uid === rc.caseId);
              return (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-sm font-semibold text-heading">{rc.caseId}</span>
                    <Badge variant="outline" className="w-fit text-xs">
                      {rc.caseType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill variant={statusVariants[rc.status]}>{rc.status}</StatusPill>
                    {fullCase && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          router.push(`/dashboard/client/monitoring-and-cases/case-manager/${fullCase._id}`)
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

        <SubCard icon={IconUsers} title="Connected Customers" count={connectedCustomers.length} empty="No connected customers found.">
          <div className="divide-y">
            {connectedCustomers.map((cc, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-heading">{cc.name}</p>
                  <p className="text-xs text-muted-foreground">{cc.relationship}</p>
                </div>
                <StatusPill variant={cc.riskTag === "High" ? "danger" : cc.riskTag === "Medium" ? "warning" : "info"}>
                  {cc.riskTag}
                </StatusPill>
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
            {linkedTransactions.map((txnId) => {
              const txn = allTransactions.find((t) => t.id === txnId);
              return (
                <div key={txnId} className="flex items-center justify-between py-2">
                  <span className="font-mono text-sm font-semibold text-heading">{txnId}</span>
                  {txn ? (
                    <span className="text-xs text-muted-foreground">
                      {txn.sender} → {txn.receiver}
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
