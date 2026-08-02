// Shared formatting for the plan screens.
// Kept out of the components so the Pricing Plans cards and the Plan Builder
// preview render a plan identically — they are the same object, and a customer
// comparing the two must not see two different prices.

export const SUPPORT_LABELS = {
  community: "Community",
  email: "Email",
  priority: "Priority",
  dedicated_csm: "Dedicated CSM",
  white_glove: "White-glove",
};

export const CYCLE_SUFFIX = {
  monthly: "/mo",
  quarterly: "/qtr",
  yearly: "/yr",
  custom: "",
};

export const STATUS_STYLES = {
  draft: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  published: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  archived: "bg-slate-400/15 text-slate-600 dark:text-slate-300",
};

export const VISIBILITY_STYLES = {
  public: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  private: "bg-slate-400/15 text-slate-600 dark:text-slate-300",
};

/** A$1,900.00 — 4dp when the value is sub-cent, matching the prototype. */
export const money = (n) => {
  const v = Number(n) || 0;
  const dp = v > 0 && v < 0.1 ? 4 : 2;
  return `A$${v.toLocaleString("en-AU", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  })}`;
};

export const int = (n) => Number(n || 0).toLocaleString("en-AU");

/** Headline price + suffix. Custom-priced plans read "Custom" with no suffix. */
export const headlinePrice = (plan) => {
  if (!plan) return { price: "A$0", suffix: "" };
  if (plan.isCustomPriced) return { price: "Custom", suffix: "" };
  if (plan.pricingModel === "usage") {
    return { price: money(plan.overagePrice), suffix: ` /${plan.includedUnit || "unit"}` };
  }
  return { price: money(plan.basePrice), suffix: CYCLE_SUFFIX[plan.billingCycle] ?? "/mo" };
};

/** The allowance line — "5,000 applicants / mo", or "Unlimited". */
export const allowanceLabel = (plan) => {
  const unit = plan?.includedUnit || "applicant";
  const plural = unit.endsWith("s") ? unit : `${unit}s`;
  return plan?.includedUsage
    ? `${int(plan.includedUsage)} ${plural} / mo`
    : `Unlimited ${plural}`;
};

/**
 * Bullet list for a plan card: the allowance, then enabled products, then the
 * typed limits. Mirrors the prototype's card, which leads with volume.
 */
export const planBullets = (plan, max = 5) => {
  if (!plan) return [];
  const enabled = (plan.products || []).filter((p) => p.enabled);
  const bullets = [allowanceLabel(plan), ...enabled.map((p) => p.name)];
  if (plan.slaTarget && plan.slaTarget !== "none") bullets.push(`SLA ${plan.slaTarget}`);
  if (plan.supportLevel) bullets.push(`${SUPPORT_LABELS[plan.supportLevel]} support`);
  return {
    shown: bullets.slice(0, max),
    more: Math.max(0, bullets.length - max),
  };
};
