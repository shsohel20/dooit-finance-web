import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconShield, IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const DECLARATION_LABELS = {
  pepDeclaration: "PEP Declaration",
  sanctionsDeclaration: "Sanctions Declaration",
  criminalRecordDeclaration: "Criminal Record Declaration",
  conflictOfInterestDecl: "Conflict of Interest Disclosure",
  ongoingMonitoringConsent: "Consent to Ongoing Monitoring",
  backgroundCheckAuth: "Background Check Authorization",
  amlPolicyAgreement: "AML Policy Agreement",
  accuracyDeclaration: "Accuracy Declaration",
  sarObligationAcknowledged: "SAR Obligation Acknowledged",
};

function DeclarationItem({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-foreground">{label}</span>
      <div
        className={cn(
          "inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 border",
          value
            ? "bg-success/10 text-success border-success/20"
            : "bg-muted/20 text-muted-foreground border-border"
        )}
      >
        {value ? (
          <>
            <IconCheck className="h-3 w-3" />
            Acknowledged
          </>
        ) : (
          <>
            <IconX className="h-3 w-3" />
            Pending
          </>
        )}
      </div>
    </div>
  );
}

export default function ComplianceSection({ staff }) {
  const declarations = staff?.declarations || {};
  const completedCount = Object.values(declarations).filter(Boolean).length;
  const totalCount = Object.keys(DECLARATION_LABELS).length;
  const allComplete = completedCount === totalCount;

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <IconShield className="h-4 w-4 text-primary" />
            </div>
            Compliance Declarations
          </CardTitle>
          <span
            className={cn(
              "text-sm font-bold",
              allComplete ? "text-success" : "text-warning"
            )}
          >
            {completedCount}/{totalCount}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4 mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Completion</span>
            <span>{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                allComplete ? "bg-success" : "bg-warning"
              )}
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {Object.entries(DECLARATION_LABELS).map(([key, label]) => (
          <DeclarationItem key={key} label={label} value={!!declarations[key]} />
        ))}
      </CardContent>
    </Card>
  );
}
