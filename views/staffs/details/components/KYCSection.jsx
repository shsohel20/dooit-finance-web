"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconFingerprint, IconCopy } from "@tabler/icons-react";
import { dateShowFormatWithTime, fmt } from "@/lib/utils";
import { toast } from "sonner";

const getKycVariant = (status) => {
  const map = {
    verified: "success",
    approved: "success",
    pending: "warning",
    rejected: "danger",
    in_review: "info",
  };
  return map[status?.toLowerCase()] || "muted";
};

function CopyableId({ value }) {
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex items-center gap-1.5 group">
      <span className="font-mono text-xs text-foreground bg-muted/40 border border-border rounded px-2 py-1 break-all">
        {value || "—"}
      </span>
      {value && (
        <button
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted shrink-0"
          title="Copy"
        >
          <IconCopy className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}

export default function KYCSection({ staff }) {
  const kycVariant = getKycVariant(staff?.kycStatus);

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <IconFingerprint className="h-4 w-4 text-primary" />
            </div>
            KYC Verification
          </CardTitle>
          <StatusPill variant={kycVariant}>{fmt(staff?.kycStatus)}</StatusPill>
        </div>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
            Applicant ID
          </p>
          <CopyableId value={staff?.sumsubApplicantId} />
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">
            Inspection ID
          </p>
          <CopyableId value={staff?.sumsubInspectionId} />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Verified At
          </p>
          <p className="text-sm font-semibold text-foreground">
            {staff?.kycVerifiedAt
              ? dateShowFormatWithTime(staff.kycVerifiedAt)
              : "Not yet verified"}
          </p>
        </div>

        {staff?.kycRejectReason && (
          <div className="rounded-lg border border-danger/20 bg-danger/5 p-3">
            <p className="text-xs font-semibold text-danger mb-1">Rejection Reason</p>
            <p className="text-sm text-foreground">{staff.kycRejectReason}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
