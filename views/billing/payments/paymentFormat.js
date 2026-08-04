// Shared vocabulary for the payment screens, so the history page and the
// invoice panel describe the same record identically.

export const PAYMENT_STATUS_STYLES = {
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  paid: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  failed: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
  refunded: "bg-slate-400/15 text-slate-600 dark:text-slate-300",
};

export const METHOD_LABELS = {
  card: "Card",
  bank_transfer: "Bank transfer",
  payid: "PayID",
  wire: "Wire",
  credit_note: "Credit note",
  manual: "Manual",
};

export const METHODS = Object.keys(METHOD_LABELS);

export const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })
    : "—";

/**
 * A refund moves money the other way, but is STORED as a positive amount —
 * `type` carries the direction. Render the sign here so no screen has to
 * remember, and so "what did we collect" stays answerable from the raw data.
 */
export const signedAmount = (p) => {
  const v = Number(p?.amount) || 0;
  return p?.type === "refund" ? -v : v;
};
