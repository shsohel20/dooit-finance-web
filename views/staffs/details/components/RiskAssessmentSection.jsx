import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";
import { cn, fmt } from "@/lib/utils";

const getRiskLabelVariant = (label) => {
  const map = {
    low: "success",
    medium: "warning",
    high: "danger",
    critical: "danger",
    unacceptable: "danger",
  };
  return map[label?.toLowerCase()] || "muted";
};

function RiskFlag({ label, value, flagOnTrue = true }) {
  const isAlert = flagOnTrue ? value === true : value === false;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium",
          isAlert ? "text-danger" : "text-success"
        )}
      >
        {isAlert ? (
          <IconX className="h-3.5 w-3.5" />
        ) : (
          <IconCheck className="h-3.5 w-3.5" />
        )}
        {value ? "Yes" : "No"}
      </div>
    </div>
  );
}

export default function RiskAssessmentSection({ staff }) {
  const hasRiskScore = staff?.riskScore !== null && staff?.riskScore !== undefined;
  const riskLabelVariant = getRiskLabelVariant(staff?.riskLabel);

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <IconAlertTriangle className="h-4 w-4 text-primary" />
          </div>
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        {hasRiskScore ? (
          <div className="mb-5 p-4 rounded-lg border border-border bg-muted/10">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              Risk Score
            </p>
            <p className="text-3xl font-bold text-foreground">{staff.riskScore}</p>
            {staff.riskLabel && (
              <StatusPill variant={riskLabelVariant} className="mt-2">
                {fmt(staff.riskLabel)}
              </StatusPill>
            )}
          </div>
        ) : (
          <div className="mb-4 px-3 py-2.5 rounded-lg border border-border bg-muted/10 text-sm text-muted-foreground italic">
            No risk score calculated yet
          </div>
        )}

        <RiskFlag label="Politically Exposed Person (PEP)" value={staff?.isPep} flagOnTrue />
        <RiskFlag label="Under Sanctions" value={staff?.sanction} flagOnTrue />
        <RiskFlag
          label="Consent to Screen"
          value={staff?.consentToScreen}
          flagOnTrue={false}
        />
        <div className="flex items-center justify-between py-2.5 last:border-0">
          <span className="text-sm text-muted-foreground">Screening Clear</span>
          <div
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              staff?.isScreeningClear ? "text-success" : "text-danger"
            )}
          >
            {staff?.isScreeningClear ? (
              <>
                <IconCheck className="h-3.5 w-3.5" /> Clear
              </>
            ) : (
              <>
                <IconX className="h-3.5 w-3.5" /> Not Clear
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
