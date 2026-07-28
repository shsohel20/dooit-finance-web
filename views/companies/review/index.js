"use client";
/**
 * KYB Review — entity dossier.
 * React port of docs/kyb-ui-design/project/"KYB Review.dc.html" (docs/76).
 * Deliberately omits the design's ASIC filing log section and "ASIC document
 * no." field — excluded from CompanyKyc by standing owner decision (see
 * docs/75). Everything else renders from real CompanyKyc data via
 * buildDossier(); sections degrade gracefully (hide/empty-note) when a
 * register is empty, so pre-Phase-1 records still render.
 *
 * The decision panel is live (docs/65 Step 31): Approve / Escalate persist
 * through PATCH /company/:id/review-status (history + audit server-side) —
 * no more toast-only theater.
 */
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  getCompanyById,
  updateCompanyReviewStatus,
  updateCompanyDocument,
} from "@/app/dashboard/client/companies/actions";
import OwnershipGraph from "@/views/companies/ownership-graph";

/* ------------------------------------------------------------------ */
/* Design tokens — lifted from KYB Review.dc.html (Claude Design)      */
/* ------------------------------------------------------------------ */
const C = {
  bg: "#eef0ee",
  ink: "#1a2331",
  sub: "#79808d",
  subtle: "#8a92a0",
  faint: "#9aa1ac",
  line: "#e2e5df",
  line2: "#e8eae6",
  hair: "#f0f1ee",
  green: "#1f6f5c",
  greenBg: "#e7f2ee",
  greenInk: "#17795e",
  amber: "#b5731f",
  amberDeep: "#c9822a",
  amberBg: "#fbf2e0",
  amberFlagBg: "#fbf3e8",
  amberBorder: "#f0dcbd",
  amberInk: "#8a5615",
  red: "#a5342a",
  redBg: "#f9ebe8",
  redBorder: "#ecc9c2",
  redInk: "#8a2b22",
  navy: "#12233d",
  chipBg: "#f1f3f0",
  chipInk: "#3f4756",
  blueBg: "#eaf0f7",
  blueInk: "#2a5fa5",
};

// Use the app's existing font system (Inter Tight / Geist Mono, ui/app/layout.js
// + globals.css) rather than the design bundle's IBM Plex — the layout follows
// the design, typography stays consistent with the rest of the dashboard.
const mono = { fontFamily: "var(--font-mono)" };
const upLabel = {
  fontSize: 11,
  letterSpacing: ".05em",
  textTransform: "uppercase",
  color: C.subtle,
  fontWeight: 600,
};
const sectionCard = {
  scrollMarginTop: 74,
  background: "#fff",
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  padding: "22px 24px",
};
const h2 = { margin: 0, fontSize: 16, fontWeight: 600 };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function fmtDate(d) {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return `${MONTHS[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")} ${date.getFullYear()}`;
}
// Normalizes contact_email/phone_number, which may still be a legacy scalar
// string on pre-migration records (docs/65 Step 38) as well as the current
// array shape — always returns a clean array with blanks dropped.
const toList = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean);
// yyyy-mm-dd for <input type="date"> — fmtDate() above is display-only.
const isoDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const ENTITY_TYPE_LABELS = {
  proprietary_limited: "Proprietary Limited",
  public_company: "Public Company",
  foreign_company: "Foreign Company",
  other: "Other",
};

// Who a non-beneficially-held shareholding is held for (docs/65 Step 66).
// The beneficiary block names an entity via entity_name and a person via
// full_name, falling back to the split name parts a richer payload may carry.
const beneficiaryLabel = (arrangement) => {
  const b = arrangement?.beneficiary || {};
  return (
    b.entity_name ||
    b.full_name ||
    [b.first_name, b.middle_name, b.last_name].filter(Boolean).join(" ") ||
    ""
  );
};

const IDENTIFIER_TYPE_LABELS = {
  acn: "ACN",
  abn: "ABN",
  arbn: "ARBN",
  lei: "LEI",
  corporate_key: "Register No",
  other: "Other",
};

// Mirrors TrustKyc's trust_details.trust_type.selected_type vocabulary,
// same list as TRUST_TYPES in companies/add/index.js (docs/65 Step 43;
// removed with the entity-level trust card in Step 45, reintroduced in Step
// 46 for the expanded shareholder-level beneficial-trust card).
const TRUST_TYPE_LABELS = {
  unregulated_trust: "Unregulated Trust",
  self_managed_super_fund: "Self-Managed Super Fund",
  managed_investment_scheme_registered: "Managed Investment Scheme (Registered)",
  managed_investment_scheme_unregistered: "Managed Investment Scheme (Unregistered)",
  government_superannuation_fund: "Government Superannuation Fund",
  other_superannuation_trust: "Other Superannuation Trust",
};

// Mirrors DOCUMENT_TYPES in companies/add/index.js (docs/65 Step 34).
const DOCUMENT_TYPE_LABELS = {
  certificate_of_incorporation: "Certificate of Incorporation",
  constitution: "Constitution / Charter",
  register_of_members: "Register of Members / Shareholders",
  proof_of_address: "Proof of Registered Address",
  ownership_structure_chart: "Ownership / Structure Chart",
  asic_extract: "ASIC Extract",
  other: "Other",
};

const ROLE_LABELS = {
  director: "Director",
  secretary: "Secretary",
  amlctf_compliance_officer: "Officer",
  authorized_signer: "Authorized Signer",
  poa: "Power of Attorney",
  other: "Officer",
};

// KYB review workflow states (docs/65 Step 31) — server-owned on the record.
const REVIEW_STATUS_META = {
  draft: { label: "Draft", color: "#79808d" },
  in_review: { label: "In review", color: "#2a5fa5" },
  approved: { label: "Approved", color: "#17795e" },
  escalated: { label: "Escalated", color: "#b5731f" },
  declined: { label: "Declined", color: "#a5342a" },
};

function initials(...parts) {
  return parts
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function fullAddress(a) {
  if (!a) return null;
  const parts = [a.street || a.address, a.suburb, a.state, a.postcode, a.country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

// Loose match for registry identifiers ("626 832 559" vs "626832559").
const normalizeId = (v) => String(v || "").replace(/[^a-z0-9]/gi, "").toLowerCase();

const personName = (p) => `${p.given_name || ""} ${p.surname || ""}`.trim();

// DOB + birthplace + residential address registry line. residential_address
// is a structured object (docs/65 Step 27), not free text — compose it the
// same way fullAddress() composes any other address.
function personSubMeta(p) {
  const dob = p.date_of_birth ? `DOB ${fmtDate(p.date_of_birth)}` : null;
  return [dob, p.birth_place, fullAddress(p.residential_address)].filter(Boolean).join(" · ") || null;
}

// Per-person screening chip: prefer explicit screening_status, else fall back
// to the entity-level osintStatus (whole-entity screening flag).
function personStatus(p, osintStatus) {
  switch (p.screening_status) {
    case "cleared":
      return { ok: true, label: "Cleared" };
    case "pep":
      return { ok: false, label: "PEP flagged" };
    case "flagged":
      return { ok: false, label: "Flagged" };
    case "pending":
      return { ok: false, label: "Screening pending" };
    default:
      return osintStatus
        ? { ok: true, label: "Cleared" }
        : { ok: false, label: "Screening pending" };
  }
}

/* ------------------------------------------------------------------ */
/* Dossier builder — derives checks, flags, score from real CompanyKyc */
/* ------------------------------------------------------------------ */
function buildDossier(company) {
  const gi = company.general_information || {};
  const dbo = company.directors_beneficial_owner || {};
  const owners = dbo.beneficial_owners || [];
  const identifiers = company.identifiers || [];
  const documents = company.documents || [];
  const shareCapital = company.share_capital || [];
  const shareholders = company.shareholders || [];
  const relatedEntities = company.related_entities || [];
  const nameHistory = company.name_history || [];

  // appointments — fall back to legacy directors[] when register is empty
  const appointments = company.appointments?.length
    ? company.appointments
    : (dbo.directors || []).map((d) => ({
        _id: d._id,
        role: "director",
        given_name: d.given_name,
        surname: d.surname,
      }));

  const directors = appointments.filter((a) => a.role === "director");
  const secretaries = appointments.filter((a) => a.role === "secretary");
  const officers = appointments.filter(
    (a) => a.role !== "director" && a.role !== "secretary" && a.role !== "authorized_signer" && a.role !== "poa",
  );
  const signers = appointments.filter((a) => a.role === "authorized_signer" || a.role === "poa");

  const ubos = owners.filter(
    (o) =>
      (o.ownership_percent || 0) >= 25 ||
      (o.voting_percent || 0) >= 25 ||
      o.control_type === "other_means",
  );

  // Registration number vs identifiers[]: the intake flow may mirror ACN into
  // both the legacy scalar and the register — show it once.
  const regNumberDuplicatesIdentifier = identifiers.some(
    (i) => normalizeId(i.value) === normalizeId(gi.registration_number),
  );

  // identifiers row — always lead with the primary registration number
  const identifierRow = [
    ...(regNumberDuplicatesIdentifier
      ? []
      : [{ label: identifiers.length ? "Registration No" : "ACN / ARBN", value: gi.registration_number }]),
    ...identifiers.map((i) => ({
      label: IDENTIFIER_TYPE_LABELS[i.id_type] || (i.id_type || "ID").toUpperCase(),
      value: i.value,
    })),
  ]
    .filter((i) => i.value)
    .slice(0, 4);

  // typed addresses — arrays hold concurrently-active entries, not a history
  // (model has no effective dates — GEMS gap; docs/65 Step 26)
  const addresses = [];
  (gi.registered_addresses || []).forEach((a) => {
    if (fullAddress(a)) addresses.push({ type: "Registered Address", tone: "blue", text: fullAddress(a) });
  });
  (gi.business_addresses || []).forEach((a) => {
    if (fullAddress(a)) addresses.push({ type: "Principal Place of Business", tone: "blue", text: fullAddress(a) });
  });
  (gi.local_agents || []).forEach((a) => {
    if (a?.name || fullAddress(a?.address))
      addresses.push({
        type: "Registered Agent",
        tone: "grey",
        text: [a?.name, fullAddress(a?.address)].filter(Boolean).join(" — "),
      });
  });

  // verification checks (computed, not hardcoded)
  const checks = [
    {
      ok: !!(gi.legal_name && gi.registration_number),
      label: "Legal identity",
      note: gi.registration_number
        ? `Registration number on file`
        : "Registration number missing",
    },
    {
      ok: addresses.some((a) => a.type === "Registered Address"),
      label: "Registered address",
      note: addresses.some((a) => a.type === "Registered Address") ? "Confirmed" : "Not recorded",
    },
    {
      ok: directors.length > 0,
      label: "Directors",
      note: directors.length ? `${directors.length} on file` : "No directors recorded",
    },
    {
      ok: ubos.length > 0 || (owners.length === 0 && relatedEntities.every((r) => r.relation !== "parent")),
      label: "Beneficial owner",
      note: ubos.length
        ? `${ubos.length} identified`
        : relatedEntities.some((r) => r.relation === "parent")
          ? "Unresolved · terminates at a corporate parent"
          : "Not established",
    },
  ];

  // derived risk flags
  const flags = [];
  const parentEntities = relatedEntities.filter((r) => r.relation === "parent");
  if (parentEntities.length && ubos.length === 0) {
    flags.push({
      severity: "High",
      title: "Ownership terminates at a corporate entity",
      note: `${parentEntities.map((p) => p.name).join(", ")} holds an interest and no natural-person UBO is recorded. Request the members register / structure chart.`,
    });
  }
  if (company.osintStatus === false && appointments.some((a) => !a.screening_status || a.screening_status === "pending")) {
    flags.push({
      severity: "Medium",
      title: "Screening incomplete",
      note: "One or more appointees have no recorded PEP/sanctions screening outcome.",
    });
  }
  if (!documents.length) {
    flags.push({
      severity: "Medium",
      title: "No charter/formation documents on file",
      note: "Constitution or formation documents have not been uploaded.",
    });
  }
  const recentAppointment = appointments
    .filter((a) => a.date_appointed)
    .sort((a, b) => new Date(b.date_appointed) - new Date(a.date_appointed))[0];
  if (recentAppointment && Date.now() - new Date(recentAppointment.date_appointed).getTime() < 1000 * 60 * 60 * 24 * 365) {
    flags.push({
      severity: "Low",
      title: "Recent appointment",
      note: `${personName(recentAppointment)} appointed ${ROLE_LABELS[recentAppointment.role] || recentAppointment.role} ${fmtDate(recentAppointment.date_appointed)}. Confirm screening completed for the new appointee.`,
    });
  }
  if (!identifiers.length && !gi.registration_number) {
    flags.push({
      severity: "Medium",
      title: "No registry identifiers recorded",
      note: "No ACN/ABN/ARBN or equivalent on file for this entity.",
    });
  }

  const deduction = flags.reduce(
    (sum, f) => sum + (f.severity === "High" ? 20 : f.severity === "Medium" ? 12 : 6),
    0,
  );
  const score = Math.max(5, 100 - deduction);
  const rating =
    score >= 85
      ? { label: "Low", color: C.greenInk }
      : score >= 60
        ? { label: "Elevated", color: C.amber }
        : { label: "High", color: C.red };

  // review progress — 8 data-completeness checks
  const progressChecks = [
    ...checks.map((c) => c.ok),
    identifiers.length > 0,
    documents.length > 0,
    shareCapital.length > 0 || shareholders.length > 0,
    officers.length > 0 || signers.length > 0,
  ];
  const cleared = progressChecks.filter(Boolean).length;

  return {
    gi,
    owners,
    ubos,
    identifiers,
    identifierRow,
    regNumberDuplicatesIdentifier,
    addresses,
    appointments,
    directors,
    secretaries,
    officers,
    signers,
    documents,
    shareCapital,
    shareholders,
    relatedEntities,
    nameHistory,
    checks,
    flags,
    score,
    rating,
    cleared,
    progressTotal: progressChecks.length,
    progressPct: Math.round((cleared / progressChecks.length) * 100),
  };
}

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
/* ------------------------------------------------------------------ */
function Chip({ children }) {
  return (
    <span
      style={{
        background: C.chipBg,
        color: C.chipInk,
        fontSize: 12.5,
        fontWeight: 500,
        padding: "5px 11px",
        borderRadius: 7,
      }}
    >
      {children}
    </span>
  );
}

function IdCell({ label, value }) {
  return (
    <div>
      <div style={upLabel}>{label}</div>
      <div style={{ ...mono, fontSize: 14, color: C.ink, marginTop: 3 }}>{value}</div>
    </div>
  );
}

function EmptyNote({ children }) {
  return (
    <div
      style={{
        fontSize: 12.5,
        color: C.sub,
        background: "#f7f8f6",
        border: `1px dashed ${C.line2}`,
        borderRadius: 10,
        padding: "12px 14px",
      }}
    >
      {children}
    </div>
  );
}

function PersonRow({ name, sub, subMeta, status }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "11px 13px",
        border: `1px solid ${C.line2}`,
        borderRadius: 10,
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "#e6ebe9",
          color: C.chipInk,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {initials(name)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{name}</div>
        {sub && <div style={{ fontSize: 11.5, color: C.sub }}>{sub}</div>}
        {subMeta && <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>{subMeta}</div>}
      </div>
      {status && (
        <span
          style={{
            background: status.ok ? C.greenBg : C.amberBg,
            color: status.ok ? C.greenInk : C.amber,
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 9px",
            borderRadius: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {status.label}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
const NAV_SECTIONS = [
  { id: "s-verification", label: "Verification" },
  { id: "s-identity", label: "Identity" },
  { id: "s-addresses", label: "Addresses" },
  { id: "s-ownership", label: "Ownership & control" },
  { id: "s-people", label: "People" },
  { id: "s-compliance", label: "Compliance" },
  { id: "s-documents", label: "Documents" },
  { id: "s-relationship", label: "Relationship" },
];

export default function KybReview() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState(0);
  const [deciding, setDeciding] = useState(false);
  const [savingDocId, setSavingDocId] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const response = await getCompanyById(id);
        setCompany(response.data);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Persist a review decision, then refetch so the panel reflects the new
  // state (docs/65 Step 31 — history + audit are written server-side).
  const decide = async (status, note, onSuccess) => {
    setDeciding(true);
    try {
      const res = await updateCompanyReviewStatus(id, { status, note });
      if (res?.success) {
        toast.success(res.message || `Review ${status}`);
        const fresh = await getCompanyById(id);
        setCompany(fresh.data);
        if (onSuccess) onSuccess();
      } else {
        toast.error(res?.message || res?.error || "Failed to update review status");
      }
    } catch {
      toast.error("Failed to update review status");
    } finally {
      setDeciding(false);
    }
  };

  // Document verification (reviewer sets verification_status / expiry_date
  // per row) — same persist-then-refetch pattern as decide() above.
  const updateDocVerification = async (docId, patch) => {
    setSavingDocId(docId);
    try {
      const res = await updateCompanyDocument(id, docId, patch);
      if (res?.success) {
        toast.success(res.message || "Document updated");
        const fresh = await getCompanyById(id);
        setCompany(fresh.data);
      } else {
        toast.error(res?.message || res?.error || "Failed to update document");
      }
    } catch {
      toast.error("Failed to update document");
    } finally {
      setSavingDocId(null);
    }
  };

  // scroll-spy for the dossier nav (mirrors the prototype's highlight())
  useEffect(() => {
    const onScroll = () => {
      let active = 0;
      NAV_SECTIONS.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 130) active = i;
      });
      setActiveNav(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [company]);

  const d = useMemo(() => (company ? buildDossier(company) : null), [company]);

  if (loading)
    return (
      <div style={{ padding: 60, textAlign: "center", color: C.sub, fontSize: 14 }}>
        Loading dossier…
      </div>
    );

  if (!id || !company)
    return (
      <div style={{ padding: 60, textAlign: "center", color: C.sub, fontSize: 14 }}>
        {!id ? "No entity selected." : "Entity not found."}{" "}
        <Link href="/dashboard/client/companies" style={{ color: C.green, fontWeight: 600 }}>
          Back to Entities &amp; People
        </Link>
      </div>
    );

  const { gi } = d;
  const legalName = gi.legal_name || "Unnamed entity";
  const statusActive = (gi.status || "active") === "active";
  const entityTypeLabel =
    ENTITY_TYPE_LABELS[gi.entity_type] || gi.company_type?.type?.replaceAll?.("_", " ");
  const navCounts = {
    "s-verification": d.flags.length
      ? { n: d.flags.length, color: C.amber, bold: true }
      : null,
    "s-addresses": d.addresses.length ? { n: d.addresses.length, color: C.faint } : null,
    "s-people": d.appointments.length ? { n: d.appointments.length, color: C.faint } : null,
    "s-documents": d.documents.length ? { n: d.documents.length, color: C.faint } : null,
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        color: C.ink,
        background: C.bg,
        borderRadius: 14,
        border: `1px solid ${C.line}`,
        overflow: "hidden",
      }}
    >
      {/* entity hero */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${C.line}`, padding: "24px 40px 22px" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 12.5,
              color: C.sub,
              marginBottom: 12,
            }}
          >
            <Link href="/dashboard/client/companies" style={{ color: C.sub }}>
              Entities &amp; People
            </Link>
            <span style={{ color: "#c4c8c1" }}>/</span>
            <span>
              {gi.country_of_incorporation || "—"}
            </span>
            <span style={{ color: "#c4c8c1" }}>/</span>
            <span style={{ color: C.ink, fontWeight: 500 }}>{legalName}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 420 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <h1 style={{ margin: 0, fontSize: 29, fontWeight: 600, letterSpacing: "-.01em" }}>
                  {legalName}
                </h1>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: statusActive ? C.greenBg : C.redBg,
                    color: statusActive ? C.greenInk : C.red,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 20,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: statusActive ? C.greenInk : C.red,
                    }}
                  />
                  {statusActive ? "Active" : gi.status || "Unknown"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                {entityTypeLabel && <Chip>{entityTypeLabel}</Chip>}
                {gi.country_of_incorporation && (
                  <Chip>{gi.country_of_incorporation}</Chip>
                )}
                {gi.industry && <Chip>{gi.industry}</Chip>}
                {gi.registration_date && <Chip>Incorporated {fmtDate(gi.registration_date)}</Chip>}
              </div>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginTop: 20 }}>
                {d.identifierRow.map((i) => (
                  <IdCell key={i.label + i.value} label={i.label} value={i.value} />
                ))}
                <IdCell label="Register Date" value={fmtDate(gi.registration_date)} />
              </div>
            </div>

            {/* decision panel */}
            <div style={{ width: 340, background: "#fbfcfb", border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div
                  style={{
                    position: "relative",
                    width: 74,
                    height: 74,
                    borderRadius: "50%",
                    background: `conic-gradient(${d.rating.color} 0 ${d.score}%, #ecefe9 ${d.score}% 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 20, fontWeight: 700, color: d.rating.color, lineHeight: 1 }}>
                      {d.score}
                    </span>
                    <span style={{ fontSize: 9, color: C.faint, letterSpacing: ".04em" }}>/100</span>
                  </div>
                </div>
                <div>
                  <div style={upLabel}>Risk rating</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: d.rating.color, marginTop: 2 }}>
                    {d.rating.label}
                  </div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
                    {d.flags.length} open flag{d.flags.length === 1 ? "" : "s"}
                    {d.ubos.length === 0 && d.relatedEntities.some((r) => r.relation === "parent")
                      ? " · UBO unresolved"
                      : ""}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  type="button"
                  disabled={deciding || company.review_status === "approved"}
                  onClick={() => decide("approved")}
                  style={{
                    flex: 1,
                    background: C.green,
                    color: "#fff",
                    border: "none",
                    borderRadius: 9,
                    padding: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: deciding ? "wait" : "pointer",
                    opacity: deciding || company.review_status === "approved" ? 0.55 : 1,
                  }}
                >
                  {company.review_status === "approved" ? "Approved" : deciding ? "Saving…" : "Approve"}
                </button>
                <button
                  type="button"
                  disabled={deciding || company.review_status === "escalated"}
                  onClick={() =>
                    decide("escalated", "Escalated to SMR from KYB review", () =>
                      router.push("/dashboard/client/report-compliance/smr-filing/smr"),
                    )
                  }
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#fff",
                    color: C.amber,
                    border: `1px solid ${C.amberBorder}`,
                    borderRadius: 9,
                    padding: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                    cursor: deciding ? "wait" : "pointer",
                    opacity: deciding || company.review_status === "escalated" ? 0.55 : 1,
                  }}
                >
                  Escalate → SMR
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <Link
                  href={`/dashboard/client/companies/edit?id=${id}`}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: 9,
                    border: `1px solid ${C.line2}`,
                    borderRadius: 9,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.green,
                  }}
                >
                  Edit intake
                </Link>
                <Link
                  href="/dashboard/client/pep-and-adverse-media/aml-screening"
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    padding: 9,
                    border: `1px solid ${C.line2}`,
                    borderRadius: 9,
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: C.green,
                  }}
                >
                  Screening
                </Link>
              </div>
              <div
                style={{
                  marginTop: 14,
                  paddingTop: 13,
                  borderTop: `1px solid ${C.hair}`,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: C.sub,
                }}
              >
                <span>Review status</span>
                <span
                  style={{
                    color: (REVIEW_STATUS_META[company.review_status] || REVIEW_STATUS_META.draft).color,
                    fontWeight: 600,
                  }}
                >
                  {(REVIEW_STATUS_META[company.review_status] || REVIEW_STATUS_META.draft).label}
                </span>
              </div>
              {company.review_history?.length > 0 && (
                <div
                  style={{
                    marginTop: 6,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: C.sub,
                  }}
                >
                  <span>Last decision</span>
                  <span style={{ color: C.ink, fontWeight: 500 }}>
                    {fmtDate(company.review_history[company.review_history.length - 1].changedAt) || "—"}
                  </span>
                </div>
              )}
              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: C.sub,
                }}
              >
                <span>Last updated</span>
                <span style={{ color: C.ink, fontWeight: 500 }}>{fmtDate(company.updatedAt) || "—"}</span>
              </div>
              <Link
                href="/dashboard/client/monitoring-and-cases/case-manager"
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.redInk,
                  background: C.redBg,
                  border: `1px solid ${C.redBorder}`,
                  borderRadius: 8,
                  padding: "8px 11px",
                }}
              >
                <span>Monitoring &amp; cases</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "26px 40px 80px", display: "flex", gap: 30, alignItems: "flex-start" }}>
        {/* left nav */}
        <div style={{ width: 196, flexShrink: 0, position: "sticky", top: 80 }}>
          <div style={{ ...upLabel, padding: "0 12px 8px" }}>Dossier</div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {NAV_SECTIONS.map((s, i) => {
              const active = i === activeNav;
              const count = navCounts[s.id];
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: 8,
                    fontSize: 13.5,
                    textDecoration: "none",
                    background: active ? C.greenBg : "transparent",
                    color: active ? "#16513f" : C.chipInk,
                    fontWeight: active ? 600 : 400,
                    borderLeft: `2px solid ${active ? C.green : "transparent"}`,
                  }}
                >
                  {s.label}
                  {count && (
                    <span style={{ fontSize: 11, color: count.color, fontWeight: count.bold ? 600 : 400 }}>
                      {count.n}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>
          <div style={{ marginTop: 18, padding: 14, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12 }}>
            <div style={upLabel}>Review progress</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6, color: C.ink }}>{d.progressPct}%</div>
            <div style={{ height: 6, background: "#ecefe9", borderRadius: 4, marginTop: 8, overflow: "hidden" }}>
              <div style={{ width: `${d.progressPct}%`, height: "100%", background: C.green, borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 11.5, color: C.sub, marginTop: 8 }}>
              {d.cleared} of {d.progressTotal} checks cleared
            </div>
          </div>
        </div>

        {/* main column */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 22 }}>
          {/* VERIFICATION */}
          <section id="s-verification" style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <h2 style={h2}>Verification &amp; risk flags</h2>
              <span style={{ fontSize: 12, color: C.sub }}>Computed from the KYB registers</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: 12,
                marginBottom: 20,
                marginTop: 14,
              }}
            >
              {d.checks.map((c) => (
                <div
                  key={c.label}
                  style={{
                    border: `1px solid ${C.line}`,
                    borderRadius: 11,
                    padding: "13px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: c.ok ? C.greenBg : C.amberBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {c.ok ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.greenInk} strokeWidth="2.4">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2.4">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 8v5" />
                        <circle cx="12" cy="16" r=".5" fill={C.amber} />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: 11.5, color: c.ok ? C.sub : C.amber }}>{c.note}</div>
                  </div>
                </div>
              ))}
            </div>
            {d.flags.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {d.flags.map((f, i) => {
                  const tone = f.severity === "High" ? "red" : f.severity === "Medium" ? "amber" : "amber";
                  const bg = tone === "red" ? C.redBg : C.amberFlagBg;
                  const border = tone === "red" ? C.redBorder : C.amberBorder;
                  const dot = tone === "red" ? C.red : C.amberDeep;
                  const titleColor = tone === "red" ? C.redInk : C.amberInk;
                  return (
                    <div key={i} style={{ display: "flex", gap: 13, padding: "14px 16px", background: bg, border: `1px solid ${border}`, borderRadius: 11 }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: dot,
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 12,
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: titleColor }}>{f.title}</div>
                        <div style={{ fontSize: 12.5, color: tone === "red" ? "#835048" : "#7c6b52", marginTop: 2 }}>
                          {f.note}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: titleColor, alignSelf: "flex-start", whiteSpace: "nowrap" }}>
                        {f.severity}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyNote>No open risk flags computed from the current registers.</EmptyNote>
            )}
          </section>

          {/* IDENTITY */}
          <section id="s-identity" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 16 }}>Identity &amp; registration</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
                background: "#eef0ec",
                border: "1px solid #eef0ec",
                borderRadius: 11,
                overflow: "hidden",
              }}
            >
              {[
                { l: "Entity type", v: entityTypeLabel },
                { l: "Class / Subclass", v: gi.class_subclass },
                { l: "Jurisdiction", v: gi.country_of_incorporation },
                { l: "Status", v: gi.status || "active", dot: statusActive },
                { l: "Registration date", v: fmtDate(gi.registration_date) },
                { l: "Registration number", v: d.regNumberDuplicatesIdentifier ? null : gi.registration_number, mono: true },
                ...d.identifiers.map((i) => ({
                  l: IDENTIFIER_TYPE_LABELS[i.id_type] || (i.id_type || "identifier").toUpperCase(),
                  v: i.value,
                  mono: true,
                })),
                { l: "Trading names", v: gi.trading_names },
                { l: "Nature of business", v: gi.nature_of_business },
              ]
                .filter((cell) => cell.v || cell.dot !== undefined)
                .map((cell, idx) => (
                <div key={idx} style={{ background: "#fff", padding: "14px 16px" }}>
                  <div style={{ fontSize: 11.5, color: C.subtle, fontWeight: 600 }}>{cell.l}</div>
                  <div
                    style={{
                      ...(cell.mono ? mono : {}),
                      fontSize: 14,
                      marginTop: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      textTransform: cell.dot !== undefined ? "capitalize" : undefined,
                    }}
                  >
                    {cell.dot !== undefined && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: cell.dot ? C.greenInk : C.faint }} />
                    )}
                    {cell.v}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ADDRESSES */}
          <section id="s-addresses" style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={h2}>
                Addresses <span style={{ color: C.faint, fontWeight: 400 }}>{d.addresses.length}</span>
              </h2>
            </div>
            {d.addresses.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {d.addresses.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 15px", border: `1px solid ${C.line2}`, borderRadius: 11 }}>
                    <span
                      style={{
                        background: a.tone === "blue" ? C.blueBg : C.chipBg,
                        color: a.tone === "blue" ? C.blueInk : C.chipInk,
                        fontSize: 11.5,
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: 6,
                        width: 178,
                        textAlign: "center",
                        flexShrink: 0,
                      }}
                    >
                      {a.type}
                    </span>
                    <span style={{ flex: 1, fontSize: 13.5 }}>{a.text}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyNote>No addresses recorded yet.</EmptyNote>
            )}
          </section>

          {/* OWNERSHIP */}
          <section id="s-ownership" style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <h2 style={h2}>Ownership &amp; control</h2>
              {d.relatedEntities.some((r) => r.relation === "parent") && d.ubos.length === 0 && (
                <span style={{ background: C.amberBg, color: C.amber, fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 20 }}>
                  UBO unresolved
                </span>
              )}
            </div>

            {/* Interactive ownership graph (docs/65 Step 61) — replaces the
                static parent→subject→subsidiary stack that used to render
                here. Same data, so keeping both would show it twice; the
                graph additionally carries shareholders, UBOs, directors and
                each trust's own parties, which the stack could not. */}
            {(() => {
              const parents = d.relatedEntities.filter((r) => r.relation === "parent");
              const subs = d.relatedEntities.filter((r) => r.relation !== "parent");
              if (!parents.length && !subs.length && !d.shareholders.length) {
                return <EmptyNote>No ownership structure recorded yet.</EmptyNote>;
              }
              return (
                <OwnershipGraph
                  legalName={legalName}
                  jurisdiction={gi.country_of_incorporation}
                  relatedEntities={d.relatedEntities}
                  shareholders={d.shareholders}
                  ubos={d.ubos}
                  appointments={d.appointments}
                />
              );
            })()}
            {(d.shareCapital.length > 0 || d.shareholders.length > 0) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {d.shareCapital.map((sc, i) => (
                  <div key={i} style={{ border: `1px solid ${C.line2}`, borderRadius: 11, padding: "15px 16px" }}>
                    <div style={{ ...upLabel, marginBottom: 10 }}>Capital — {sc.security_class || "Ordinary"}</div>
                    {[
                      ["Amount issued", sc.amount_issued],
                      ["Total amount paid", sc.total_paid],
                      ["Total amount unpaid", sc.total_unpaid],
                      ["Voting", sc.voting ? "Yes" : "No"],
                    ]
                      .filter(([, v]) => v !== undefined && v !== null && v !== "")
                      .map(([l, v], j) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, borderTop: j ? `1px solid ${C.hair}` : "none" }}>
                          <span style={{ color: C.sub }}>{l}</span>
                          <span style={{ ...mono, fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                  </div>
                ))}
                {d.shareholders.map((sh, i) => (
                  <div key={i} style={{ border: `1px solid ${C.line2}`, borderRadius: 11, padding: "15px 16px" }}>
                    <div style={{ ...upLabel, marginBottom: 10 }}>Shareholder</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 7, background: "#f6f4ef", border: "1px solid #e9dcc4", display: "flex", alignItems: "center", justifyContent: "center", color: "#a67c33", fontWeight: 600, fontSize: 11, flexShrink: 0 }}>
                        {initials(sh.holder_name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{sh.holder_name}</div>
                        <div style={{ fontSize: 11.5, color: C.sub }}>
                          {[
                            sh.security_class,
                            sh.units_held !== undefined ? `${sh.units_held} shares held` : null,
                            sh.beneficially_held !== undefined ? `beneficially held: ${sh.beneficially_held ? "Yes" : "No"}` : null,
                            sh.fully_paid !== undefined ? (sh.fully_paid ? "fully paid" : "partly paid") : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </div>
                      </div>
                      {sh.percent_held !== undefined && (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ ...mono, fontSize: 16, fontWeight: 700 }}>{sh.percent_held}%</div>
                          <div style={{ fontSize: 10.5, color: C.sub }}>of issued</div>
                        </div>
                      )}
                    </div>
                    {sh.percent_held !== undefined && (
                      <div style={{ height: 8, background: "#ecefe9", borderRadius: 5, marginTop: 14, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(sh.percent_held, 100)}%`, height: "100%", background: C.green }} />
                      </div>
                    )}
                    {sh.beneficially_held === false && sh.holder_model !== "TrustKyc" && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: "9px 12px",
                          background: C.amberBg,
                          borderRadius: 8,
                          fontSize: 12,
                          color: C.amberDeep,
                        }}
                      >
                        {/* beneficiary is a block since docs/65 Step 66 — an
                            entity beneficiary is named by entity_name, a
                            person by full_name (or split parts). */}
                        Held on behalf of{" "}
                        <strong>{beneficiaryLabel(sh.beneficial_arrangement) || "an unnamed beneficiary"}</strong>
                        {sh.beneficial_arrangement?.arrangement_type ? ` (${sh.beneficial_arrangement.arrangement_type})` : ""}
                      </div>
                    )}
                    {/* Beneficial trust card (docs/65 Step 43; expanded in Step 46 to
                        surface every TrustFields-captured property, not just the
                        name) — sh.holder_entity is the populated TrustKyc doc
                        (shareholders.holder_entity, populated server-side). */}
                    {sh.beneficially_held === false && sh.holder_model === "TrustKyc" && sh.holder_entity && (
                      <div style={{ marginTop: 12, border: `1px solid ${C.amberBorder}`, background: C.amberBg, borderRadius: 10, padding: "12px 14px" }}>
                        <div style={{ fontSize: 11.5, color: C.amberDeep, marginBottom: 6 }}>
                          Held on behalf of a trust
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                          {sh.holder_entity.trust_details?.full_trust_name || "Unnamed trust"}
                        </div>
                        {(() => {
                          const te = sh.holder_entity;
                          const td = te.trust_details || {};
                          const settlor = te.settlor || {};
                          const settlorLabel = settlor.is_company
                            ? settlor.company?.company_name || settlor.full_name
                            : settlor.full_name || td.settlor_name;
                          const line1 = [
                            TRUST_TYPE_LABELS[td.trust_type?.selected_type],
                            td.country_of_establishment,
                            settlorLabel ? `Settlor: ${settlorLabel}${settlor.is_company ? " (company)" : ""}` : null,
                            td.settled_sum?.amount != null
                              ? `Settled sum: ${td.settled_sum.amount.toLocaleString()}${td.settled_sum.currency ? ` ${td.settled_sum.currency}` : ""}`
                              : null,
                            td.governing_law ? `Governing law: ${td.governing_law}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ");
                          // Trust identification (docs/65 Step 55) — registry/tax
                          // identifiers of the trust itself.
                          const ti = td.trust_identification || {};
                          const idLine = [
                            ti.abn ? `ABN ${ti.abn}` : null,
                            ti.acn ? `ACN ${ti.acn}` : null,
                            ti.registration_number ? `Reg. ${ti.registration_number}` : null,
                            ti.tfn ? "TFN on file" : null,
                            ti.tax_residency ? `Tax residency: ${ti.tax_residency}` : null,
                            // Dates moved to trust_details in Step 59; the
                            // fallback keeps older records rendering.
                            td.date_established ?? ti.date_established
                              ? `Established ${fmtDate(td.date_established ?? ti.date_established)}`
                              : null,
                            td.date_of_deed ?? ti.date_of_deed ? `Deed ${fmtDate(td.date_of_deed ?? ti.date_of_deed)}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ");
                          const pa = td.principal_address;
                          const addrLine = pa
                            ? [pa.address, pa.suburb, [pa.state, pa.postcode].filter(Boolean).join(" "), pa.country].filter(Boolean).join(", ")
                            : "";
                          const ci = td.contact_information || {};
                          const contactLine = [ci.email, ci.phone, ci.website].filter(Boolean).join(" · ");
                          const indivTrustees = te.individual_trustees?.trustees || [];
                          const companyTrustees = te.company_trustees?.company_details || [];
                          const trusteeNames = [
                            ...indivTrustees.map((tr) => tr.full_name).filter(Boolean),
                            ...companyTrustees
                              .map((c) => [c.company_name, c.registration_number ? `(${c.registration_number})` : null].filter(Boolean).join(" "))
                              .filter(Boolean),
                          ];
                          // Control + AML working state (docs/65 Step 55).
                          const controllers = te.controllers || {};
                          const controlNames = (controllers.controlling_persons || [])
                            .map((p) =>
                              [
                                p.full_name,
                                p.role ? `— ${p.role}` : null,
                                p.pep_status && p.pep_status !== "pending" ? `[PEP: ${p.pep_status}]` : null,
                                p.sanctions_status && p.sanctions_status !== "pending" ? `[Sanctions: ${p.sanctions_status}]` : null,
                              ]
                                .filter(Boolean)
                                .join(" ")
                            )
                            .filter(Boolean);
                          const repNames = (controllers.authorised_representatives || [])
                            .map((r) => [r.full_name, r.role ? `(${r.role})` : null].filter(Boolean).join(" "))
                            .filter(Boolean);
                          const appointors = te.appointors || [];
                          const aml = te.aml_kyc || {};
                          const amlLine = [
                            aml.source_of_funds ? `Source of funds: ${aml.source_of_funds}` : null,
                            aml.source_of_wealth ? `Source of wealth: ${aml.source_of_wealth}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ");
                          const amlStatusLine = [
                            aml.kyc_verification_status ? `KYC: ${aml.kyc_verification_status}` : null,
                            aml.risk_rating ? `Risk: ${aml.risk_rating}` : null,
                            aml.verification_date ? `Verified ${fmtDate(aml.verification_date)}` : null,
                          ]
                            .filter(Boolean)
                            .join(" · ");
                          const beneficiaries = te.beneficiaries || [];
                          const documents = te.documents || [];
                          return (
                            <>
                              {line1 && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 3 }}>{line1}</div>}
                              {idLine && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>{idLine}</div>}
                              {addrLine && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>{addrLine}</div>}
                              {contactLine && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>{contactLine}</div>}
                              {trusteeNames.length > 0 && (
                                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 6 }}>
                                  Trustee(s): {trusteeNames.join(", ")}
                                </div>
                              )}
                              {appointors.length > 0 && (
                                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>
                                  Appointor(s): {appointors.join(", ")}
                                </div>
                              )}
                              {controlNames.length > 0 && (
                                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>
                                  Controlling person(s): {controlNames.join(", ")}
                                </div>
                              )}
                              {repNames.length > 0 && (
                                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>
                                  Authorised rep(s): {repNames.join(", ")}
                                </div>
                              )}
                              {beneficiaries.length > 0 && (
                                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>
                                  Beneficiaries:{" "}
                                  {beneficiaries
                                    .map((b) =>
                                      [
                                        b.named_beneficiaries,
                                        b.beneficiary_classes ? `(${b.beneficiary_classes})` : null,
                                        b.beneficiary_type ? `[${b.beneficiary_type}]` : null,
                                        b.beneficial_interest_percent !== undefined && b.beneficial_interest_percent !== null
                                          ? `${b.beneficial_interest_percent}%`
                                          : null,
                                      ]
                                        .filter(Boolean)
                                        .join(" ")
                                    )
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                              )}
                              {amlLine && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>{amlLine}</div>}
                              {amlStatusLine && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>{amlStatusLine}</div>}
                              {documents.length > 0 && (
                                <div style={{ fontSize: 11.5, color: C.sub, marginTop: 4 }}>
                                  Documents:{" "}
                                  {documents.map((d, i) => (
                                    <React.Fragment key={d._id || d.url || i}>
                                      {i > 0 && ", "}
                                      {d.url ? (
                                        <a href={d.url} target="_blank" rel="noreferrer" style={{ color: C.amberDeep, textDecoration: "underline" }}>
                                          {d.name || d.docType || "document"}
                                        </a>
                                      ) : (
                                        d.name || d.docType || "document"
                                      )}
                                      {d.verification_status && d.verification_status !== "unverified" ? ` [${d.verification_status}]` : ""}
                                      {d.expiry_date ? ` (exp. ${fmtDate(d.expiry_date)})` : ""}
                                    </React.Fragment>
                                  ))}
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* PEOPLE */}
          <section id="s-people" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 16 }}>People &amp; appointments</h2>
            {d.appointments.length ? (
              <>
                {d.directors.length > 0 && (
                  <>
                    <div style={{ ...upLabel, marginBottom: 9 }}>Directors · {d.directors.length}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                      {d.directors.map((p, i) => (
                        <PersonRow
                          key={p._id || i}
                          name={personName(p)}
                          sub={`Director${p.date_appointed ? ` · appointed ${fmtDate(p.date_appointed)}` : ""}`}
                          subMeta={personSubMeta(p)}
                          status={personStatus(p, company.osintStatus)}
                        />
                      ))}
                    </div>
                  </>
                )}
                {d.officers.length > 0 && (
                  <>
                    <div style={{ ...upLabel, marginBottom: 9 }}>Officers · {d.officers.length}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                      {d.officers.map((p, i) => (
                        <PersonRow
                          key={p._id || i}
                          name={personName(p)}
                          sub={`${ROLE_LABELS[p.role] || "Officer"}${p.date_appointed ? ` · appointed ${fmtDate(p.date_appointed)}` : ""}`}
                          subMeta={personSubMeta(p)}
                          status={personStatus(p, company.osintStatus)}
                        />
                      ))}
                    </div>
                  </>
                )}
                {d.secretaries.length > 0 && (
                  <>
                    <div style={{ ...upLabel, marginBottom: 9 }}>Secretary · {d.secretaries.length}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                      {d.secretaries.map((p, i) => (
                        <PersonRow
                          key={p._id || i}
                          name={personName(p)}
                          sub={`Secretary${p.date_appointed ? ` · appointed ${fmtDate(p.date_appointed)}` : ""}`}
                          subMeta={personSubMeta(p)}
                          status={personStatus(p, company.osintStatus)}
                        />
                      ))}
                    </div>
                  </>
                )}
                {d.signers.length > 0 && (
                  <>
                    <div style={{ ...upLabel, marginBottom: 9 }}>Authorized signers (PoA) · {d.signers.length}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {d.signers.map((p, i) => (
                        <PersonRow
                          key={p._id || i}
                          name={personName(p)}
                          sub={`${ROLE_LABELS[p.role] || "Authorized Signer"}${p.date_appointed ? ` · ${fmtDate(p.date_appointed)}` : ""}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <EmptyNote>No directors, officers or signers recorded yet.</EmptyNote>
            )}
          </section>

          {/* COMPLIANCE */}
          <section id="s-compliance" style={sectionCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={h2}>Compliance activities</h2>
            </div>
            <EmptyNote>
              Per-entity compliance activities (AGM, annual return, AUSTRAC annual report) are not
              yet recorded on the KYB register — this is a known gap (docs/76). Obligations are
              currently tracked platform-wide in Monitoring &amp; Cases.
            </EmptyNote>
          </section>

          {/* DOCUMENTS */}
          <section id="s-documents" style={sectionCard}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <h2 style={h2}>
                Charter &amp; formation documents <span style={{ color: C.faint, fontWeight: 400 }}>{d.documents.length}</span>
              </h2>
            </div>
            {d.documents.length ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.documents.map((doc, i) => {
                  const vStatus = doc.verification_status || "unverified";
                  const vTone = { verified: { bg: C.greenBg, fg: C.greenInk }, rejected: { bg: C.redBg, fg: C.red } }[vStatus] || {
                    bg: "#f0f1ed",
                    fg: C.sub,
                  };
                  const saving = doc._id && savingDocId === doc._id;
                  return (
                    <div key={doc._id || i} style={{ border: `1px solid ${C.line2}`, borderRadius: 10, padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.blueInk} strokeWidth="1.8" style={{ flexShrink: 0 }}>
                          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                          <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
                        </svg>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                            {doc.url ? (
                              <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                                {doc.name || doc.docType || "Document"}
                              </a>
                            ) : (
                              doc.name || doc.docType || "Document"
                            )}
                          </div>
                          <div style={{ fontSize: 11.5, color: C.sub }}>
                            {[DOCUMENT_TYPE_LABELS[doc.category] || doc.category?.replaceAll?.("_", " "), doc.docType].filter(Boolean).join(" · ")}
                          </div>
                        </div>
                        <span style={{ ...mono, fontSize: 12.5, color: C.sub }}>{fmtDate(doc.document_date) || fmtDate(doc.uploadedAt)}</span>
                      </div>

                      {doc._id && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 10,
                            marginTop: 11,
                            paddingTop: 11,
                            borderTop: `1px solid ${C.line2}`,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10.5,
                              fontWeight: 700,
                              letterSpacing: ".03em",
                              textTransform: "uppercase",
                              padding: "3px 9px",
                              borderRadius: 20,
                              background: vTone.bg,
                              color: vTone.fg,
                            }}
                          >
                            {vStatus}
                          </span>
                          <button
                            type="button"
                            disabled={saving || vStatus === "verified"}
                            onClick={() => updateDocVerification(doc._id, { verification_status: "verified" })}
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: vStatus === "verified" ? C.faint : C.greenInk,
                              background: "none",
                              border: `1px solid ${vStatus === "verified" ? C.line2 : "#bfe0d3"}`,
                              borderRadius: 7,
                              padding: "4px 10px",
                              cursor: vStatus === "verified" ? "default" : "pointer",
                            }}
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            disabled={saving || vStatus === "rejected"}
                            onClick={() => updateDocVerification(doc._id, { verification_status: "rejected" })}
                            style={{
                              fontSize: 11.5,
                              fontWeight: 600,
                              color: vStatus === "rejected" ? C.faint : C.red,
                              background: "none",
                              border: `1px solid ${vStatus === "rejected" ? C.line2 : "#eec7c0"}`,
                              borderRadius: 7,
                              padding: "4px 10px",
                              cursor: vStatus === "rejected" ? "default" : "pointer",
                            }}
                          >
                            Reject
                          </button>
                          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: C.sub, marginLeft: "auto" }}>
                            Expiry
                            <input
                              type="date"
                              defaultValue={isoDate(doc.expiry_date)}
                              disabled={saving}
                              onBlur={(e) => {
                                if (e.target.value !== isoDate(doc.expiry_date)) {
                                  updateDocVerification(doc._id, { expiry_date: e.target.value || null });
                                }
                              }}
                              style={{ fontSize: 12, border: `1px solid ${C.line2}`, borderRadius: 6, padding: "3px 6px", fontFamily: "inherit" }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyNote>No charter or formation documents attached yet.</EmptyNote>
            )}
          </section>

          {/* RELATIONSHIP */}
          <section id="s-relationship" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 16 }}>Relationship</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ ...upLabel, marginBottom: 10 }}>Contact</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {toList(gi.contact_email).map((email, i) => (
                    <div key={`email-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                      <span style={{ width: 100, color: C.sub, flexShrink: 0 }}>{i === 0 ? "Email" : ""}</span>
                      <span style={{ fontWeight: 500 }}>{email}</span>
                    </div>
                  ))}
                  {toList(gi.phone_number).map((phone, i) => (
                    <div key={`phone-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                      <span style={{ width: 100, color: C.sub, flexShrink: 0 }}>{i === 0 ? "Phone" : ""}</span>
                      <span style={{ fontWeight: 500 }}>{phone}</span>
                    </div>
                  ))}
                  {!toList(gi.contact_email).length && !toList(gi.phone_number).length && (
                    <EmptyNote>No contact details on file.</EmptyNote>
                  )}
                </div>
              </div>
              <div>
                <div style={{ ...upLabel, marginBottom: 10 }}>Name history</div>
                {d.nameHistory.length ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {d.nameHistory.map((n, i) => (
                      <div key={i} style={{ fontSize: 13, display: "flex", justifyContent: "space-between" }}>
                        <span>{n.name}</span>
                        <span style={{ ...mono, color: C.sub }}>
                          from {fmtDate(n.effective_from)}
                          {n.effective_to ? ` to ${fmtDate(n.effective_to)}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyNote>No name history recorded.</EmptyNote>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
