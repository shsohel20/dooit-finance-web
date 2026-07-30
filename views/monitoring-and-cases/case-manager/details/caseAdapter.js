/**
 * Adapts a case document from GET /cases/:id into the shape the detail
 * sections consume (which was originally written against the mockCases
 * fixtures in @/lib/case-manager-data).
 *
 * Everything here is a rename, a lookup through a populated ref, or a
 * derivation from data the API already returns — nothing is invented. Fields
 * with no backend source resolve to null / [] so each section falls through to
 * its own empty state rather than rendering a misleading value.
 */

const KYC_LABELS = {
  verified: "Verified",
  in_review: "Pending Review",
  pending: "Pending",
  rejected: "Rejected",
};

// "government_body" -> "Government Body", "australia" -> "Australia"
const humanize = (value) =>
  !value
    ? null
    : String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (ch) => ch.toUpperCase());

const joinNonEmpty = (parts, sep = ", ") => parts.filter(Boolean).join(sep) || null;

// Case.riskLabel is nullable; fall back to banding the numeric riskScore so the
// profile badges and risk rating still say something truthful.
const riskLabelFromScore = (score) => {
  if (score == null) return null;
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
};

const ageFrom = (dob) => {
  if (!dob) return null;
  const then = new Date(dob).getTime();
  if (Number.isNaN(then)) return null;
  const years = Math.floor((Date.now() - then) / (365.25 * 24 * 60 * 60 * 1000));
  return years > 0 && years < 130 ? years : null;
};

// A customer can be onboarded under several clients; use the relation belonging
// to the case's own tenant.
const pickRelation = (customer, clientId) => {
  const relations = customer?.relations || [];
  if (!relations.length) return null;
  const id = clientId && String(clientId);
  return relations.find((r) => id && String(r.client) === id) || relations[0];
};

const adaptCustomer = (customer, clientId) => {
  if (!customer) return null;

  const form = customer.personalKyc?.personal_form || {};
  const details = form.customer_details || {};
  const employment = form.employment_details || {};
  const address = form.residential_address || {};
  const relation = pickRelation(customer, clientId);

  return {
    // Fall back to the customer reference so an unnamed record still shows
    // something identifiable rather than an empty avatar.
    name:
      customer.user?.name ||
      joinNonEmpty([details.given_name, details.middle_name, details.surname], " ") ||
      customer.uid ||
      null,
    age: ageFrom(details.date_of_birth),
    nationality: humanize(address.country),
    occupation: employment.occupation || null,
    industry: employment.industry || null,
    accountOpeningDate: relation?.registeredAt || null,
    email: customer.user?.email || null,
    // Customer.phone is AES-encrypted and a lean() query bypasses
    // decryptForRole, so the API deliberately does not send it.
    phone: null,
    address: joinNonEmpty([
      address.address,
      address.suburb,
      address.state,
      address.postcode,
      humanize(address.country),
    ]),
    riskRating: null, // filled in by adaptCase from the case-level risk label
  };
};

const adaptTransaction = (txn) => {
  const flags = txn.riskFlags || [];
  return {
    ...txn,
    id: txn.uid || txn._id,
    date: txn.timestamp,
    country: txn.receiver?.institutionCountry || txn.sender?.institutionCountry || null,
    paymentChannel: txn.channel || humanize(txn.type),
    riskIndicator: flags,
    // The table classifies rows as flagged/normal rather than showing the
    // Transaction status enum, so derive it from the risk signals. The original
    // enum value stays available as `transactionStatus`.
    transactionStatus: txn.status,
    status: flags.length > 0 || (txn.riskScore ?? 0) > 0 ? "flagged" : "normal",
  };
};

// ── Companion endpoints ───────────────────────────────────────────────────────
// GET /cases/:id/notes  →  CaseNote docs (author populated)
export const adaptNotes = (notes = []) =>
  notes.map((n) => ({
    id: n._id,
    author: n.author?.name || "Unknown",
    date: n.createdAt,
    text: n.content || "",
    // CaseNote has no pinned flag — pinning stays a client-side affordance.
    pinned: false,
    attachment: n.attachments?.[0] || null,
  }));

// GET /cases/:id/audit  →  AuditLog docs (user populated). That model is
// event-shaped (service/action/details), not before/after-shaped.
export const adaptAuditLog = (logs = []) =>
  logs.map((l) => ({
    id: l._id,
    date: l.createdAt,
    user: l.user?.name || "System",
    action: l.action,
    details: l.details,
    source: l.service,
  }));

// GET /cases/:id/reports → the `rfi` bucket, reshaped for RFISection.
export const adaptRfis = (rfis = []) =>
  rfis.map((r) => ({
    id: r.uid || r._id,
    status: r.status,
    documents: r.documents || [],
    dueDate: r.responseDeadline,
    sentBy: r.primaryContactName || null,
    sentDate: r.createdAt,
    respondedDate: r.respondedAt || null,
    message: r.message || null,
  }));

// GET /cases/:id/reports → the `smr` bucket, reshaped for the Previous SARs card.
export const adaptPreviousSARs = (smrs = []) =>
  smrs.map((s) => ({
    id: s.uid || s._id,
    status: s.status,
    description: s.caseNumber || s.metadata?.austracReference || null,
    filedDate: s.createdAt,
  }));

export function adaptCase(api) {
  if (!api) return null;

  const customers = api.linkedCustomers || [];
  const alerts = api.linkedAlerts || [];
  const primaryCustomer = customers[0] || null;
  const primaryAlert = alerts[0] || null;
  const relation = pickRelation(primaryCustomer, api.client);

  const riskTag = api.riskLabel || riskLabelFromScore(api.riskScore);
  const customer = adaptCustomer(primaryCustomer, api.client);
  if (customer) customer.riskRating = riskTag;

  return {
    ...api,

    // ── Identity ──────────────────────────────────────────────────────────────
    displayId: api.uid || api._id,
    // The profile section labels this "Customer ID", so it wants the customer's
    // reference, not the case's.
    uid: primaryCustomer?.uid || api.uid,
    caseName: api.title,
    customerName: customer?.name || null,
    customerType: humanize(relation?.type),
    customer,

    // ── Dates ─────────────────────────────────────────────────────────────────
    createdDate: api.createdAt,
    lastUpdated: api.updatedAt,

    // ── Classification ────────────────────────────────────────────────────────
    riskTag,
    riskCategory: api.caseType || humanize(api.type),
    alertType: primaryAlert?.caseType || humanize(primaryAlert?.alertOrigin),
    detectionRule:
      joinNonEmpty([primaryAlert?.ruleId, primaryAlert?.ruleName], ": ") ||
      primaryAlert?.explanation ||
      null,

    // ── Screening ─────────────────────────────────────────────────────────────
    kycStatus: KYC_LABELS[primaryCustomer?.kycStatus] || humanize(primaryCustomer?.kycStatus),
    pepStatus: primaryCustomer ? (primaryCustomer.isPep ? "PEP" : "Not a PEP") : null,
    sanctionsStatus: primaryCustomer
      ? primaryCustomer.sanction
        ? "Confirmed Match"
        : "No Match"
      : null,
    // No backend field for these yet — the profile rows render "—".
    cddStatus: null,
    eddStatus: null,

    // ── Money & counts ────────────────────────────────────────────────────────
    // netActivity is already summed in AUD server-side.
    totalExposure: api.netActivity,
    relatedAlertsCount: alerts.length,
    previousInvestigationsCount: (api.relatedCases || []).length,
    confidenceScore: null, // no equivalent metric exists

    // ── Collections ───────────────────────────────────────────────────────────
    transactions: (api.linkedTransactions || []).map(adaptTransaction),
    assignedAnalyst: api.assignedTo?.name || null,
    // "Connected" means the other parties on the case — the primary customer is
    // already rendered by the profile section.
    connectedCustomers: customers.slice(1).map((c) => ({
      name: c.user?.name || null,
      relationship: humanize(pickRelation(c, api.client)?.type),
      riskTag: null,
    })),
    // Filings (previousSARs, rfis, auditLog, notes) arrive from the companion
    // endpoints and are merged in by CaseDetails — see the adapt* helpers above.
    previousSARs: [],

    // ── No backend source yet (sections fall through to empty states) ─────────
    duplicateAlerts: [], // linkedAlerts are the source alerts, not duplicates
    notes: [],
    rfis: [],
    activities: [],
    auditLog: [],
    atm: null,
    devices: [],
    relationships: [],
    files: [],
    beneficialOwners: [],
  };
}
