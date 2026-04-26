"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/badge";
import { IconArrowLeft, IconPennant, IconUser, IconCalendar } from "@tabler/icons-react";
import { cn, dateShowFormat } from "@/lib/utils";

const riskVariants = {
  High: "danger",
  Medium: "warning",
  Low: "info",
};

const statusVariants = {
  Active: "success",
  "Under Review": "warning",
  Closed: "outline",
};

const riskHeaderBg = {
  High: "from-red-50 to-orange-50 border-red-100",
  Medium: "from-yellow-50 to-amber-50 border-yellow-100",
  Low: "from-blue-50 to-cyan-50 border-blue-100",
};

export default function CaseHeader({ caseData }) {
  const router = useRouter();

  if (!caseData) return null;

  return (
    <div
      className={cn(
        "rounded-xl border bg-gradient-to-r p-5 shadow-sm",
        riskHeaderBg[caseData.riskTag] || "from-gray-50 to-slate-50 border-border",
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs px-2"
          onClick={() => router.push("/dashboard/client/monitoring-and-cases/case-manager")}
        >
          <IconArrowLeft className="size-3.5" />
          Back to Cases
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-bold text-heading">{caseData.caseName}</h1>
            <StatusPill icon={<IconPennant />} variant={riskVariants[caseData.riskTag]}>
              {caseData.riskTag} Risk
            </StatusPill>
            <StatusPill variant={statusVariants[caseData.status]}>{caseData.status}</StatusPill>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-medium text-heading bg-white/60 px-2 py-0.5 rounded border">
                {caseData.uid}
              </span>
            </div>
            <Badge variant="outline" className="text-xs capitalize">
              {caseData.customerType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {caseData.caseType}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconUser className="size-4 shrink-0" />
            <span>
              Analyst:{" "}
              <span className="font-semibold text-heading">{caseData.assignedAnalyst}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconCalendar className="size-4 shrink-0" />
            <span>
              Created:{" "}
              <span className="font-semibold text-heading">
                {dateShowFormat(caseData.createdDate)}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
