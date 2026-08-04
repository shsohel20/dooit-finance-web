"use server";

import { fetchWithAuth } from "@/services/serverApi";

// ─────────────────────────────────────────────────────────────────────────────
// Billing — product catalogue server actions.
//
// Access model (enforced by the API, mirrored in the UI):
//   read   — any authenticated user; a client needs the catalogue because it
//            names the rows on their usage table and invoices
//   write  — dooit only; the API returns 403 for anyone else
//
// Every action returns the parsed body plus `ok`, so callers can branch on the
// HTTP status without a second fetch. Errors are surfaced, never swallowed.
// ─────────────────────────────────────────────────────────────────────────────

const call = async (endpoint, options) => {
  try {
    // `cache: "no-store"` is required, not defensive.
    //
    // Next wraps fetch and may serve a cached response inside a Server Action.
    // Billing reads are point-in-time facts about money — a plan's entitlements
    // right now, the subscription in force right now — so a cached read shows a
    // customer the PREVIOUS version's products after an edit or a plan move, and
    // is indistinguishable from a write that silently failed.
    //
    // Scoped to billing rather than services/serverApi.js so other modules keep
    // whatever caching they were built against.
    const res = await fetchWithAuth(endpoint, { cache: "no-store", ...options });
    // fetchWithAuth returns a plain object on network failure
    if (typeof res?.json !== "function") {
      return { ok: false, status: 0, success: false, error: res?.error || "Network error" };
    }
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, ...body };
  } catch (error) {
    return { ok: false, status: 0, success: false, error: error.message };
  }
};

/**
 * List products. `params` maps 1:1 to the API query string.
 *
 * Only empty/null values are dropped — `"all"` is a MEANINGFUL value the API
 * understands (`status=all`, `billable=all`) and must be sent through. An
 * earlier version stripped it, which happened to work only because the API's
 * no-status default is also "return everything": the caller's intent was
 * discarded and the right answer came out by luck. Changing that default would
 * have silently broken the Show inactive toggle.
 */
export const getProducts = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`product${qs ? `?${qs}` : ""}`);
};

/** Category summary — returns all 8 categories, including empty ones. */
export const getProductCategories = async () => call("product/categories");

/** Enum values (categories, units, meter sources) for building forms. */
export const getProductMeta = async () => call("product/meta");

export const getProduct = async (id) => call(`product/${id}`);

export const createProduct = async (payload) =>
  call("product", { method: "POST", body: JSON.stringify(payload) });

export const updateProduct = async (id, payload) =>
  call(`product/${id}`, { method: "PUT", body: JSON.stringify(payload) });

/** Activate / deactivate. Response `meta.affectedPublishedPlans` is worth showing. */
export const setProductStatus = async (id, status) =>
  call(`product/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });

/** Soft delete. Returns 409 when a non-archived plan still sells the product. */
export const deleteProduct = async (id) => call(`product/${id}`, { method: "DELETE" });

/** Upsert by code — used to seed the catalogue. */
export const bulkImportProducts = async (products) =>
  call("product/bulk-import", { method: "POST", body: JSON.stringify({ products }) });

// ─────────────────────────────────────────────────────────────────────────────
// Billing plans
//
// Reads are scoped server-side: dooit sees every plan including drafts, a client
// sees only published plans that are public or privately granted to them. The UI
// never has to replicate that rule — it just renders what comes back.
// ─────────────────────────────────────────────────────────────────────────────

export const getPlans = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`billing-plan${qs ? `?${qs}` : ""}`);
};

/** Enum values (pricing models, cycles, SLA, support levels) for the builder. */
export const getPlanMeta = async () => call("billing-plan/meta");

export const getPlan = async (id) => call(`billing-plan/${id}`);

export const createPlan = async (payload) =>
  call("billing-plan", { method: "POST", body: JSON.stringify(payload) });

/** Drafts only — the API returns 409 for a published plan. */
export const updatePlan = async (id, payload) =>
  call(`billing-plan/${id}`, { method: "PUT", body: JSON.stringify(payload) });

/** Validates, then archives any prior published version of the same code. */
export const publishPlan = async (id) =>
  call(`billing-plan/${id}/publish`, { method: "POST" });

/** Clone a published plan into a new draft version. */
export const createPlanVersion = async (id) =>
  call(`billing-plan/${id}/new-version`, { method: "POST" });

export const archivePlan = async (id) =>
  call(`billing-plan/${id}/archive`, { method: "POST" });

/** Drafts only — archive a published plan instead. */
export const deletePlan = async (id) => call(`billing-plan/${id}`, { method: "DELETE" });

// ── Private-plan eligibility (dooit only) ────────────────────────────────────

export const getPlanEligibility = async (id) => call(`billing-plan/${id}/eligibility`);

export const grantPlanEligibility = async (id, payload) =>
  call(`billing-plan/${id}/eligibility`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const revokePlanEligibility = async (id, userId) =>
  call(`billing-plan/${id}/eligibility/${userId}`, { method: "DELETE" });

/** Client users a private plan can be granted to (dooit only). */
export const getGrantableClients = async (search = "") =>
  call(`billing-plan/clients${search ? `?search=${encodeURIComponent(search)}` : ""}`);

// ─────────────────────────────────────────────────────────────────────────────
// Subscriptions — the one billing collection a CLIENT writes to.
//
// Scoping is server-side: a client only ever sees and acts on its own
// subscriptions, because the controller pins `user` from the JWT and ignores any
// user in the body. The UI never has to enforce that itself.
// ─────────────────────────────────────────────────────────────────────────────

export const getSubscriptions = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`subscription${qs ? `?${qs}` : ""}`);
};

/** The caller's live subscription, or null. */
export const getCurrentSubscription = async () => call("subscription/current");

export const getSubscription = async (id) => call(`subscription/${id}`);

/** Subscribe to a plan. dooit may pass { user } to provision on a client's behalf. */
export const createSubscription = async (payload) =>
  call("subscription", { method: "POST", body: JSON.stringify(payload) });

/** Supersedes the current subscription — never mutates it. */
export const changeSubscriptionPlan = async (id, planId) =>
  call(`subscription/${id}/change-plan`, {
    method: "POST",
    body: JSON.stringify({ plan: planId }),
  });

/** Cancels at period end for a client; dooit may pass { immediate: true }. */
export const cancelSubscription = async (id, payload = {}) =>
  call(`subscription/${id}/cancel`, { method: "POST", body: JSON.stringify(payload) });

export const resumeSubscription = async (id) =>
  call(`subscription/${id}/resume`, { method: "POST" });

/** dooit only. */
export const pauseSubscription = async (id, reason = null) =>
  call(`subscription/${id}/pause`, { method: "POST", body: JSON.stringify({ reason }) });

/**
 * Set, change or clear the negotiated discount. dooit only.
 *
 * Takes effect on the NEXT invoice close — invoices already produced copied the
 * discount they applied, so this never rewrites a total already shown.
 *
 * @param {{type: 'none'|'percentage'|'fixed', value?: number, reason?: string}} discount
 */
export const updateSubscriptionDiscount = async (id, discount) =>
  call(`subscription/${id}/discount`, {
    method: "PATCH",
    body: JSON.stringify(discount),
  });

// ─────────────────────────────────────────────────────────────────────────────
// Metered usage
//
// Reads are scoped server-side to the caller's own records; dooit sees all.
// Writes are dooit/system only — a client never self-reports usage — so no
// record/reverse actions are exposed here.
// ─────────────────────────────────────────────────────────────────────────────

export const getUsage = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`usage${qs ? `?${qs}` : ""}`);
};

/**
 * dooit only — records a manual usage entry can be attributed to.
 *
 * Scoped by the SUBSCRIPTION being billed, so it only ever lists customers of
 * the account paying for the usage. Labels are `uid` rather than names: customer
 * names are encrypted and mask to "***" without a decrypt grant, and the uid is
 * what an operator has to hand when backfilling anyway.
 */
export const getUsageReferences = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`usage/references${qs ? `?${qs}` : ""}`);
};

/** Period totals: byProduct, byDay, and distinct applicants. */
export const getUsageSummary = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`usage/summary${qs ? `?${qs}` : ""}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// Invoices
//
// Reads are scoped server-side to the caller's own invoices; dooit sees all.
// Closing, issuing and voiding are dooit-only platform operations.
// ─────────────────────────────────────────────────────────────────────────────

export const getInvoices = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`invoice${qs ? `?${qs}` : ""}`);
};

export const getInvoice = async (id) => call(`invoice/${id}`);

/** Dry run — computes what a period would bill without writing anything. */
export const previewInvoice = async (subscription, periodKey, taxRatePercent = 0) =>
  call(
    `invoice/preview?subscription=${subscription}&periodKey=${periodKey}&taxRatePercent=${taxRatePercent}`
  );

/** dooit only — produces a DRAFT invoice and stamps the usage it consumed. */
export const closePeriod = async (payload) =>
  call("invoice/close", { method: "POST", body: JSON.stringify(payload) });

/** dooit only — allocates the invoice number. */
export const issueInvoice = async (id, dueDays = 14) =>
  call(`invoice/${id}/issue`, { method: "POST", body: JSON.stringify({ dueDays }) });

/** dooit only — releases the invoice's usage so the period can be re-billed. */
export const voidInvoice = async (id, reason) =>
  call(`invoice/${id}/void`, { method: "POST", body: JSON.stringify({ reason }) });

/**
 * dooit only — email an ISSUED invoice to the account it bills, with a PDF.
 *
 * Pass `to` to deliver this copy somewhere else (an accounts-payable mailbox)
 * without changing who the invoice is addressed to. The response reports the
 * destination MASKED, and whether the PDF attached — Chrome failing to start
 * does not stop the email, so a send can legitimately succeed without one.
 */
export const sendInvoice = async (id, to = null) =>
  call(`invoice/${id}/send`, {
    method: "POST",
    body: JSON.stringify(to ? { to } : {}),
  });

/**
 * Download the invoice PDF.
 *
 * Returns base64 rather than a URL because the endpoint is authenticated: a
 * bare window.open() carries no Authorization header, so the browser would be
 * handed a 401 page named .pdf. Same contract as exportCustomerKycPdf() — the
 * caller decodes it into a Blob download. `call()` is bypassed deliberately,
 * since it parses the body as JSON.
 */
export const exportInvoicePdf = async (id) => {
  try {
    const res = await fetchWithAuth(`invoice/${id}/pdf`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res || typeof res.arrayBuffer !== "function") {
      return { success: false, error: "Network error while downloading" };
    }
    if (!res.ok) {
      return { success: false, error: `Download failed (${res.status})` };
    }

    const base64 = Buffer.from(await res.arrayBuffer()).toString("base64");
    const cd = res.headers?.get?.("content-disposition") || "";
    const match = /filename="?([^"]+)"?/.exec(cd);

    return { success: true, base64, filename: match ? match[1] : `invoice-${id}.pdf` };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NOTE: `POST /invoice/:id/mark-paid` is deliberately NOT exposed here.
//
// It flips an invoice to paid without producing a payment record, so there is
// nothing to refund, retry or reconcile against afterwards. Settlement goes
// through recordPayment() instead. The endpoint remains on the API as a
// break-glass tool, but the UI should never take that shortcut.

export const sweepOverdueInvoices = async () =>
  call("invoice/sweep-overdue", { method: "POST" });

/** dooit only — appends a reversing usage record. Never edits the original. */
export const reverseUsage = async (id, reason) =>
  call(`usage/${id}/reverse`, { method: "POST", body: JSON.stringify({ reason }) });

/**
 * dooit only — record a single billable event by hand.
 *
 * The backfill path for a lost provider webhook: the work happened and the cost
 * was incurred, so it must be recordable. Without this, dooit could REVERSE
 * usage but never add it, which is a one-way correction and not a correction
 * at all. `source.system: "manual"` marks it as human-entered.
 */
export const recordUsage = async (payload) =>
  call("usage", { method: "POST", body: JSON.stringify(payload) });

// ─────────────────────────────────────────────────────────────────────────────
// Payments & refunds
//
// Reads are scoped server-side to the caller's own payment history.
// Writes are dooit-only: without a gateway, a client-initiated "Pay now" would
// record money movement that never happened.
// ─────────────────────────────────────────────────────────────────────────────

export const getPayments = async (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== "" && v != null)
  ).toString();
  return call(`payment${qs ? `?${qs}` : ""}`);
};

export const getPayment = async (id) => call(`payment/${id}`);

/** Payments for one invoice, plus collected / refunded / net totals. */
export const getInvoicePayments = async (invoiceId) =>
  call(`payment/for-invoice/${invoiceId}`);

/** dooit only. Omit `amount` to settle the whole outstanding balance. */
export const recordPayment = async (payload) =>
  call("payment", { method: "POST", body: JSON.stringify(payload) });

/** dooit only — appends a NEW attempt; the failed record is never edited. */
export const retryPayment = async (id, payload = {}) =>
  call(`payment/${id}/retry`, { method: "POST", body: JSON.stringify(payload) });

/** dooit only. Omit `amount` for a full refund of what remains. */
export const refundPayment = async (id, payload = {}) =>
  call(`payment/${id}/refund`, { method: "POST", body: JSON.stringify(payload) });
