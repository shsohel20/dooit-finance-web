import React from "react";
import { cn, fmt } from "@/lib/utils";
import {
  IconShieldCheck,
  IconRadar,
  IconTarget,
  IconAlertTriangle,
} from "@tabler/icons-react";

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

const getScreeningVariant = (status) => {
  const map = { clear: "success", pending: "warning", flagged: "danger", hit: "danger" };
  return map[status?.toLowerCase()] || "muted";
};

const VARIANT_COLORS = {
  success: {
    bg: "bg-success/10",
    border: "border-success/20",
    text: "text-success",
    iconBg: "bg-success/10",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/20",
    text: "text-yellow-700",
    iconBg: "bg-warning/10",
  },
  danger: {
    bg: "bg-danger/10",
    border: "border-danger/20",
    text: "text-danger",
    iconBg: "bg-danger/10",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    iconBg: "bg-blue-50",
  },
  muted: {
    bg: "bg-muted/10",
    border: "border-border",
    text: "text-muted-foreground",
    iconBg: "bg-muted/20",
  },
};

function StatCard({ icon: Icon, label, value, variant = "muted" }) {
  const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.muted;
  return (
    <div className={cn("rounded-xl border p-5 space-y-4", colors.border, colors.bg)}>
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg border",
          colors.iconBg,
          colors.border
        )}
      >
        <Icon className={cn("h-5 w-5", colors.text)} />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className={cn("text-base font-bold", colors.text)}>{value || "—"}</p>
      </div>
    </div>
  );
}

export default function StaffOverviewCard({ staff }) {
  const kycVariant = getKycVariant(staff?.kycStatus);
  const screeningVariant = getScreeningVariant(staff?.screening?.status);
  const hasRiskFlags = staff?.isPep || staff?.sanction;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        icon={IconShieldCheck}
        label="KYC Status"
        value={fmt(staff?.kycStatus)}
        variant={kycVariant}
      />
      <StatCard
        icon={IconRadar}
        label="AML Status"
        value={staff?.amlStatus ? fmt(staff.amlStatus) : "Not Checked"}
        variant={staff?.amlStatus ? "info" : "muted"}
      />
      <StatCard
        icon={IconTarget}
        label="Screening"
        value={fmt(staff?.screening?.status)}
        variant={screeningVariant}
      />
      <StatCard
        icon={IconAlertTriangle}
        label="Risk Flags"
        value={hasRiskFlags ? "Flags Raised" : "No Flags"}
        variant={hasRiskFlags ? "danger" : "success"}
      />
    </div>
  );
}
