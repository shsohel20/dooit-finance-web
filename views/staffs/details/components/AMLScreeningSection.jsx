import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconRadar, IconCheck, IconX } from "@tabler/icons-react";
import { cn, dateShowFormatWithTime, fmt } from "@/lib/utils";

const getScreeningVariant = (status) => {
  const map = {
    clear: "success",
    pending: "warning",
    flagged: "danger",
    hit: "danger",
  };
  return map[status?.toLowerCase()] || "muted";
};

function BooleanFlag({ value, trueLabel = "Match Found", falseLabel = "No Match" }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium",
        value ? "text-danger" : "text-success",
      )}
    >
      {value ? <IconX className="h-3.5 w-3.5" /> : <IconCheck className="h-3.5 w-3.5" />}
      {value ? trueLabel : falseLabel}
    </div>
  );
}

function ScreeningRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {value}
    </div>
  );
}

export default function AMLScreeningSection({ staff }) {
  const screening = staff?.screening || {};
  const screeningVariant = getScreeningVariant(screening?.status);

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <IconRadar className="h-4 w-4 text-primary" />
            </div>
            AML Screening
          </CardTitle>
          <StatusPill variant={screeningVariant}>{fmt(screening?.status)}</StatusPill>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <ScreeningRow
          label="PEP Match"
          value={
            <BooleanFlag
              value={screening?.pepMatch}
              trueLabel="Match Found"
              falseLabel="No Match"
            />
          }
        />
        <ScreeningRow
          label="Sanctions Match"
          value={
            <BooleanFlag
              value={screening?.sanctionsMatch}
              trueLabel="Match Found"
              falseLabel="No Match"
            />
          }
        />
        <ScreeningRow
          label="Adverse Media"
          value={
            <BooleanFlag value={screening?.adverseMedia} trueLabel="Found" falseLabel="None" />
          }
        />
        {/* <ScreeningRow
          label="Provider"
          value={
            <span className="text-sm font-medium text-foreground capitalize">
              {screening?.provider || "—"}
            </span>
          }
        /> */}
        {staff?.amlCheckedAt && (
          <ScreeningRow
            label="Last Checked"
            value={
              <span className="text-sm text-foreground">
                {dateShowFormatWithTime(staff.amlCheckedAt)}
              </span>
            }
          />
        )}
        {staff?.amlVendor && (
          <ScreeningRow
            label="AML Vendor"
            value={
              <span className="text-sm font-medium text-foreground capitalize">
                {staff.amlVendor}
              </span>
            }
          />
        )}
        {screening?.riskLabels?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Risk Labels
            </p>
            <div className="flex flex-wrap gap-1.5">
              {screening.riskLabels.map((label, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-danger/10 text-danger border border-danger/20 rounded-md"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
        {screening?.hits?.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              AML Hits ({screening.hits.length})
            </p>
            <div className="space-y-1">
              {screening.hits.map((hit, i) => (
                <div
                  key={i}
                  className="text-sm text-foreground bg-danger/5 border border-danger/10 rounded-md px-3 py-2"
                >
                  {typeof hit === "string" ? hit : JSON.stringify(hit)}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
