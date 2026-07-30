"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KYC_COLORS, KYC_LABELS } from "./constants";

const KYC_ORDER = ["pending", "in_review", "verified", "rejected"];

export function KycPipeline({ clients, onboarding }) {
  const byStatus = clients?.byKycStatus || {};
  const total = clients?.total ?? 0;

  const inProgress =
    (onboarding?.byStatus?.in_progress ?? 0) + (onboarding?.byStatus?.submitted ?? 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">KYC Pipeline</CardTitle>
        <CardDescription>
          {inProgress > 0
            ? `${inProgress} onboarding journey${inProgress === 1 ? "" : "s"} in progress`
            : "Client verification status"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {total === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
            No clients onboarded yet
          </div>
        ) : (
          <>
            {/* Stacked ratio bar with 2px gaps between segments */}
            <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full">
              {KYC_ORDER.filter((s) => (byStatus[s] ?? 0) > 0).map((status) => (
                <div
                  key={status}
                  className="h-full rounded-sm"
                  style={{
                    backgroundColor: KYC_COLORS[status],
                    width: `${((byStatus[status] ?? 0) / total) * 100}%`,
                  }}
                />
              ))}
            </div>
            <ul className="space-y-2">
              {KYC_ORDER.map((status) => {
                const count = byStatus[status] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <li key={status} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: KYC_COLORS[status] }}
                    />
                    <span className="text-foreground">{KYC_LABELS[status]}</span>
                    <span className="ml-auto text-muted-foreground">
                      {count} · {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="text-muted-foreground">PEP flagged</span>
              <span className="font-medium text-foreground">{clients?.pep ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sanctions hits</span>
              <span className="font-medium text-foreground">{clients?.sanctioned ?? 0}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
