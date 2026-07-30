"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, FileText } from "lucide-react";

function ReportRow({ label, stages, total, href }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Link href={href} className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
          <FileText className="h-4 w-4 text-muted-foreground" />
          {label}
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
        <span className="text-sm font-semibold text-foreground">{total}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stages.map((stage) => (
          <div key={stage.label} className="rounded-md bg-muted/50 px-2 py-1.5 text-center">
            <p className="text-sm font-medium text-foreground">{stage.value}</p>
            <p className="text-xs text-muted-foreground">{stage.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportingSnapshot({ reports }) {
  const smr = reports?.smr || {};
  const ttr = reports?.ttr || {};

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Regulatory Reporting</CardTitle>
        <CardDescription>SMR and TTR filing pipeline</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <ReportRow
          label="Suspicious Matter Reports"
          href="/dashboard/client/report-compliance/smr-filing/smr"
          total={smr.total ?? 0}
          stages={[
            { label: "Draft", value: smr.draft ?? 0 },
            { label: "Review", value: smr.review ?? 0 },
            { label: "Approved", value: smr.approved ?? 0 },
          ]}
        />
        <ReportRow
          label="Threshold Transaction Reports"
          href="/dashboard/client/report-compliance/ttr"
          total={ttr.total ?? 0}
          stages={[
            { label: "Draft", value: ttr.draft ?? 0 },
            { label: "Submitted", value: ttr.submitted ?? 0 },
            { label: "Approved", value: ttr.approved ?? 0 },
          ]}
        />
      </CardContent>
    </Card>
  );
}
