// CRA V2 shared constants — Customer Risk Assessment (docs/datasheet/CRA_Scoring_Method.md)
// Bands: Low 0–17 · Medium 18–20 · High 21–99 · Unacceptable 100+

export const CUSTOMER_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "company", label: "Company" },
  { value: "trust", label: "Trust" },
  { value: "partnership", label: "Partnership" },
  { value: "association", label: "Association" },
  { value: "government_body", label: "Government Body" },
  { value: "sole proprietorship", label: "Sole Proprietorship" },
  { value: "cooperative", label: "Cooperative" },
];

// shadcn Badge variant per CRA risk label
export const RISK_BADGE_VARIANT = {
  Low: "success",
  Medium: "warning",
  High: "danger",
  Unacceptable: "danger",
};

// Tailwind text/bg classes per risk label (for score readouts / progress bar)
export const RISK_TEXT = {
  Low: "text-success",
  Medium: "text-yellow-600",
  High: "text-orange-600",
  Unacceptable: "text-danger",
};

export const RISK_BAR = {
  Low: "bg-success",
  Medium: "bg-yellow-500",
  High: "bg-orange-500",
  Unacceptable: "bg-danger",
};

export const BAND_BANNER = {
  Low: "bg-green-50 border-green-200 text-green-800",
  Medium: "bg-yellow-50 border-yellow-200 text-yellow-800",
  High: "bg-orange-50 border-orange-200 text-orange-800",
  Unacceptable: "bg-red-50 border-red-200 text-red-800",
};

export const JURISDICTION_BAND_TEXT = {
  UHRC: "text-red-600",
  HRC: "text-orange-600",
  MRC: "text-yellow-600",
  LRC: "text-success",
};

// 0–110 axis with band boundaries at 17/20/99 (Unacceptable starts at 100)
export const SCORE_AXIS_MAX = 110;
export const SCORE_TICKS = [17, 20, 99];

export const bandLabel = (score) => {
  if (score >= 100) return "Unacceptable";
  if (score >= 21) return "High";
  if (score >= 18) return "Medium";
  return "Low";
};

export const humanFactor = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
