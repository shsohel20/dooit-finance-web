"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, ShieldAlert, Landmark } from "lucide-react";
import { fmtAUDCompact } from "./constants";

function StatCard({ title, value, subline, icon: Icon }) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {subline && <p className="text-sm text-muted-foreground">{subline}</p>}
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCards({ kpi, clients, trust }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Clients"
        value={kpi?.totalClients ?? 0}
        subline={`+${kpi?.newThisMonth ?? 0} new this month`}
        icon={Users}
      />
      <StatCard
        title="KYC Verified"
        value={kpi?.kycVerifiedPct != null ? `${kpi.kycVerifiedPct}%` : "—"}
        subline={`${clients?.byKycStatus?.verified ?? 0} of ${clients?.total ?? 0} clients`}
        icon={ShieldCheck}
      />
      <StatCard
        title="High-Risk Clients"
        value={kpi?.highRiskClients ?? 0}
        subline={`${kpi?.pendingEcdd ?? 0} awaiting ECDD decision`}
        icon={ShieldAlert}
      />
      <StatCard
        title="Trust Account (This Month)"
        value={fmtAUDCompact(kpi?.trustVolumeThisMonth)}
        subline={`${kpi?.trustTxnsThisMonth ?? 0} transactions · ${trust?.thisMonth?.flagged ?? 0} flagged`}
        icon={Landmark}
      />
    </div>
  );
}
