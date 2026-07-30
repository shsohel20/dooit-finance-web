// Status colors follow the app-wide risk conventions
// (see components/risk-assessment/cra/constants.js — RISK_BAR)
export const RISK_COLORS = {
  Low: "var(--success)",
  Medium: "var(--warning)",
  High: "#f97316",
  Unacceptable: "var(--danger)",
};

export const KYC_COLORS = {
  verified: "var(--success)",
  in_review: "var(--warning)",
  pending: "#94a3b8",
  rejected: "var(--danger)",
};

export const KYC_LABELS = {
  verified: "Verified",
  in_review: "In Review",
  pending: "Pending",
  rejected: "Rejected",
};

export const CASE_STATUS_VARIANT = {
  Pending: "warning",
  Active: "default",
  Inactive: "secondary",
  Blocked: "danger",
};

export const fmtAUD = (value) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const fmtAUDCompact = (value) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
