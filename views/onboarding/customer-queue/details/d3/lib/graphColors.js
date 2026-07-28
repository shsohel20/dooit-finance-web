export const RISK_COLORS = {
  HIGH: "#ef4444", // red
  MEDIUM: "#f59e0b", // amber
  LOW: "#6b7280", // gray
  UNKNOWN: "#4b5563",
};

export const RELATION_COLORS = {
  FAMILY: "#a78bfa", // purple
  TRANSACTIONAL: "#34d399", // green
  OWNERSHIP: "#60a5fa", // blue
  BUSINESS: "#f97316", // orange
  UNKNOWN: "#4b5563",
};

export function getRiskColor(risk) {
  return RISK_COLORS[risk] ?? RISK_COLORS.UNKNOWN;
}

export function getEdgeColor(type) {
  return RELATION_COLORS[type] ?? RELATION_COLORS.UNKNOWN;
}
