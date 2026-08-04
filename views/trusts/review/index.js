"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { getTrustById, getCompaniesForTrust } from "@/app/dashboard/client/companies/actions";
import { C } from "@/views/kyb/form-kit";
import TrustOwnershipGraph from "@/views/trusts/ownership-graph";

/**
 * Trust review dossier (docs/65 Step 65) — the read-only view, mirroring the
 * company Review page: sticky section rail on the left, stacked section cards
 * on the right, a header carrying identity and review state.
 *
 * Deliberately NO approve/escalate/decline controls. `TrustKyc` carries
 * `review_status`/`review_history`, but nothing writes them — there is no
 * Trust review endpoint (noted as outstanding since Step 55). Rendering the
 * buttons would imply a workflow that doesn't exist, so the current state is
 * shown and the gap is stated plainly instead.
 */

const mono = { fontFamily: "var(--font-mono)" };
const upLabel = { fontSize: 11, letterSpacing: ".05em", textTransform: "uppercase", color: C.subtle, fontWeight: 600 };
const sectionCard = {
  scrollMarginTop: 74,
  background: "#fff",
  border: `1px solid ${C.line}`,
  borderRadius: 14,
  padding: "22px 24px",
};
const h2 = { margin: 0, fontSize: 16, fontWeight: 600 };

const TRUST_TYPE_LABELS = {
  unregulated_trust: "Unregulated Trust",
  self_managed_super_fund: "Self-Managed Super Fund",
  managed_investment_scheme_registered: "Managed Investment Scheme (Registered)",
  managed_investment_scheme_unregistered: "Managed Investment Scheme (Unregistered)",
  government_superannuation_fund: "Government Superannuation Fund",
  other_superannuation_trust: "Other Superannuation Trust",
};

const REVIEW = {
  draft: ["Draft", C.sub, "#f1f1ec"],
  in_review: ["In review", "#8a5c11", "#fbf1de"],
  approved: ["Approved", "#1f6b4b", "#e6f2eb"],
  escalated: ["Escalated", "#9a3d1c", "#fbe9e2"],
  declined: ["Declined", "#9a3d1c", "#fbe9e2"],
};

const SECTIONS = [
  { id: "t-snapshot", label: "Snapshot" },
  { id: "t-ownership", label: "Ownership & control" },
  { id: "t-identity", label: "Identity & identification" },
  { id: "t-address", label: "Addresses & contact" },
  { id: "t-settlor", label: "Settlor" },
  { id: "t-trustees", label: "Trustees" },
  { id: "t-control", label: "Control" },
  { id: "t-beneficiaries", label: "Beneficiaries" },
  { id: "t-purpose", label: "Purpose & funds" },
  { id: "t-aml", label: "AML / KYC" },
  { id: "t-documents", label: "Documents" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (d) => {
  if (!d) return null;
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? null : `${MONTHS[x.getMonth()]} ${x.getDate()} ${x.getFullYear()}`;
};
// Enum values are stored snake_case; render them as words rather than
// leaking "in_progress" into the dossier.
const humanise = (v) => (v ? String(v).replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "");
const initials = (s = "") =>
  String(s).trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase() || "—";
const addrLine = (a, streetKey = "street") =>
  a ? [a[streetKey], a.suburb, [a.state, a.postcode].filter(Boolean).join(" "), a.country].filter(Boolean).join(", ") : "";

function EmptyNote({ children }) {
  return (
    <div style={{ fontSize: 12.5, color: C.sub, background: "#f7f8f6", border: `1px dashed ${C.line2 || C.line}`, borderRadius: 10, padding: "13px 15px" }}>
      {children}
    </div>
  );
}

/** Label/value grid — the dossier's workhorse. */
function Rows({ rows }) {
  const shown = rows.filter(([, v]) => v !== undefined && v !== null && v !== "" && v !== "—");
  if (!shown.length) return <EmptyNote>Not recorded.</EmptyNote>;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 1, background: "#eef0ec", border: "1px solid #eef0ec", borderRadius: 10, overflow: "hidden" }}>
      {shown.map(([k, v, isMono]) => (
        <div key={k} style={{ background: "#fff", padding: "11px 13px", display: "flex", justifyContent: "space-between", gap: 14 }}>
          <span style={{ fontSize: 12, color: C.subtle, flexShrink: 0 }}>{k}</span>
          <span style={{ fontSize: 12.5, fontWeight: 500, textAlign: "right", wordBreak: "break-word", ...(isMono ? mono : {}) }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function PersonCard({ name, role, rows = [], flags = [] }) {
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 11, padding: "13px 15px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e6ebe9", color: C.body, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11.5, fontWeight: 700 }}>
          {initials(name)}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, wordBreak: "break-word" }}>{name}</div>
          {role && <div style={{ fontSize: 11.5, color: C.sub }}>{role}</div>}
        </div>
        {flags.map(([label, fg, bg]) => (
          <span key={label} style={{ fontSize: 10.5, fontWeight: 700, color: fg, background: bg, padding: "3px 8px", borderRadius: 5, whiteSpace: "nowrap" }}>
            {label}
          </span>
        ))}
      </div>
      {rows.filter(([, v]) => v).length > 0 && (
        <div style={{ marginTop: 9, fontSize: 11.5, color: C.sub, lineHeight: 1.6 }}>
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}>
              <span style={{ color: C.subtle }}>{k}:</span> {v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const screenFlag = (status) => {
  if (!status || status === "pending") return null;
  if (status === "cleared") return [`Cleared`, "#1f6b4b", "#e6f2eb"];
  return [String(status).toUpperCase(), "#9a3d1c", "#fbe9e2"];
};

export default function TrustReview() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  const [trust, setTrust] = useState(null);
  // The companies this trust holds. Fetched separately because the link is
  // stored only on the company side (docs/65 Step 70) — a failure here must
  // not blank the dossier, so it degrades to an empty list.
  const [heldCompanies, setHeldCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(SECTIONS[0].id);

  useEffect(() => {
    if (!id) {
      setError("No trust selected.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await getTrustById(id);
        if (cancelled) return;
        if (res?.success && res.data) {
          setTrust(res.data);
          try {
            const linked = await getCompaniesForTrust(res.data._id || id);
            if (!cancelled && linked?.success) setHeldCompanies(linked.data || []);
          } catch {
            // The graph simply shows no holdings; the trust itself still loads.
          }
        } else setError(res?.message || "Could not load this trust");
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load this trust");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Highlight the rail entry for whichever section is nearest the top.
  useEffect(() => {
    if (!trust) return;
    const onScroll = () => {
      let current = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [trust]);

  const d = useMemo(() => {
    if (!trust) return null;
    const td = trust.trust_details || {};
    const ti = td.trust_identification || {};
    const typeKey = td.trust_type?.selected_type;
    return {
      td,
      ti,
      typeKey,
      variant: typeKey ? td.trust_type?.[typeKey] || {} : {},
      settlor: trust.settlor || {},
      trustees: trust.individual_trustees?.trustees || [],
      companyTrustees: trust.company_trustees?.company_details || [],
      beneficiaries: trust.beneficiaries || [],
      controllers: trust.controllers || {},
      appointors: trust.appointors || [],
      aml: trust.aml_kyc || {},
      documents: trust.documents || [],
    };
  }, [trust]);

  if (loading) return <div style={{ height: 320, borderRadius: 14, background: "#eef0ec" }} />;
  if (error || !trust)
    return (
      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 24 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: C.sub }}>{error || "Trust not found."}</p>
        <Link href="/dashboard/client/trusts" style={{ fontSize: 13, color: C.green, display: "inline-block", marginTop: 10 }}>
          ← Back to trusts
        </Link>
      </div>
    );

  const name = d.td.full_trust_name || "Unnamed trust";
  const [reviewLabel, reviewFg, reviewBg] = REVIEW[trust.review_status] || ["Not submitted", C.sub, "#f1f1ec"];
  const settlorName = d.settlor.is_company ? d.settlor.company?.company_name || d.settlor.full_name : d.settlor.full_name;
  const postalDifferent = d.td.postal_address?.different_from_principal;

  return (
    <div style={{ background: C.bg, borderRadius: 14 }}>
      <style>{`
        @media (max-width: 900px) {
          .trust-review-body { flex-direction: column !important; gap: 16px !important; }
          .trust-review-rail { width: 100% !important; position: static !important; }
          .trust-review-head, .trust-review-body { padding-left: 18px !important; padding-right: 18px !important; }
        }
      `}</style>

      {/* header */}
      <div className="trust-review-head" style={{ background: "#fff", borderBottom: `1px solid ${C.line}`, padding: "22px 40px", borderRadius: "14px 14px 0 0" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: C.sub, marginBottom: 8 }}>
            <Link href="/dashboard/client/trusts" style={{ color: C.sub, textDecoration: "none" }}>
              Trusts
            </Link>
            <span style={{ color: "#c4c8c1" }}>/</span>
            <span style={{ color: C.ink, fontWeight: 500 }}>{name}</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, letterSpacing: "-.01em", wordBreak: "break-word" }}>{name}</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap", fontSize: 12.5, color: C.sub }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: reviewFg, background: reviewBg, padding: "3px 9px", borderRadius: 20 }}>{reviewLabel}</span>
                {d.typeKey && <span>{TRUST_TYPE_LABELS[d.typeKey] || d.typeKey}</span>}
                {d.td.country_of_establishment && <span>· {d.td.country_of_establishment}</span>}
                {trust.uid && <span style={{ ...mono }}>· {trust.uid}</span>}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link
                href={`/dashboard/client/trusts/edit?id=${trust._id}`}
                style={{ background: C.green, color: "#fff", borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 600, textDecoration: "none" }}
              >
                Edit trust
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="trust-review-body" style={{ maxWidth: 1180, margin: "0 auto", padding: "26px 40px 40px", display: "flex", gap: 34, alignItems: "flex-start" }}>
        <div className="trust-review-rail" style={{ width: 212, flexShrink: 0, position: "sticky", top: 80 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {SECTIONS.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActive(s.id)}
                style={{
                  padding: "9px 12px",
                  borderRadius: 9,
                  fontSize: 13,
                  textDecoration: "none",
                  color: active === s.id ? C.greenDark : C.body,
                  background: active === s.id ? C.greenBg : "transparent",
                  fontWeight: active === s.id ? 600 : 400,
                }}
              >
                {s.label}
              </a>
            ))}
          </div>
          {/* Stated rather than hidden: the schema carries review state but no
              endpoint sets it, so there is deliberately no decision control. */}
          <div style={{ marginTop: 16, padding: "12px 13px", background: "#f7f8f6", border: `1px dashed ${C.line}`, borderRadius: 11, fontSize: 11.5, color: C.sub, lineHeight: 1.5 }}>
            Approve / escalate decisions aren’t available for trusts yet — the review workflow is built for companies only.
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {/* snapshot */}
          <section id="t-snapshot" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Snapshot</h2>
            <Rows
              rows={[
                ["Trust name", name],
                ["Trust type", TRUST_TYPE_LABELS[d.typeKey] || d.typeKey],
                ["Country of establishment", d.td.country_of_establishment],
                ["Governing law", d.td.governing_law],
                ["Settlor", settlorName],
                ["Record ID", trust.uid, true],
                ["Created", fmtDate(trust.createdAt)],
                ["Last updated", fmtDate(trust.updatedAt)],
                ["Next review", fmtDate(trust.next_review_date)],
              ]}
            />
          </section>

          {/* ownership & control (docs/65 Step 70) — the same graph the
              company Review page carries, with the trust as the subject:
              its parties above, the companies it holds below. */}
          <section id="t-ownership" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 4 }}>Ownership &amp; control</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: C.sub }}>
              Who stands behind this trust, and what it holds. {heldCompanies.length === 0
                ? "No company currently records a shareholding held by this trust."
                : `${heldCompanies.length} compan${heldCompanies.length === 1 ? "y records" : "ies record"} a shareholding held by this trust.`}
            </p>
            <TrustOwnershipGraph trust={trust} companies={heldCompanies} />
          </section>

          {/* identity & identification */}
          <section id="t-identity" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Identity &amp; identification</h2>
            <Rows
              rows={[
                ["ABN", d.ti.abn, true],
                ["ACN", d.ti.acn, true],
                ["Registration number", d.ti.registration_number, true],
                ["TFN", d.ti.tfn ? "On file" : ""],
                ["Tax residency", d.ti.tax_residency],
                ["Date established", fmtDate(d.td.date_established)],
                ["Date of deed", fmtDate(d.td.date_of_deed)],
                [
                  "Settled sum",
                  d.td.settled_sum?.amount != null
                    ? `${Number(d.td.settled_sum.amount).toLocaleString()}${d.td.settled_sum.currency ? ` ${d.td.settled_sum.currency}` : ""}`
                    : "",
                  true,
                ],
                ["Type description", d.variant.type_description],
                ["Regulatory body", d.variant.regulatory_body],
                ["Registered", d.variant.is_registered === undefined ? "" : d.variant.is_registered ? "Yes" : "No"],
                ["ASRN", d.variant.asrn, true],
                ["Legislation", d.variant.legislation_name],
                ["Regulator", d.variant.regulator_name],
              ]}
            />
          </section>

          {/* addresses & contact */}
          <section id="t-address" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Addresses &amp; contact</h2>
            <Rows
              rows={[
                ["Principal address", addrLine(d.td.principal_address, "address")],
                ["Postal address", postalDifferent ? addrLine(d.td.postal_address, "address") : "Same as principal"],
                ["Email", d.td.contact_information?.email],
                ["Phone", d.td.contact_information?.phone],
                ["Website", d.td.contact_information?.website],
              ]}
            />
          </section>

          {/* settlor */}
          <section id="t-settlor" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Settlor</h2>
            {settlorName ? (
              <PersonCard
                name={settlorName}
                role={d.settlor.is_company ? "Settlor (company)" : "Settlor"}
                rows={[
                  ["Date of birth", fmtDate(d.settlor.date_of_birth)],
                  ["Country of residence", d.settlor.country_of_residence],
                  ["Address", addrLine(d.settlor.residential_address)],
                  ["Registration", d.settlor.company?.registration_number],
                ]}
              />
            ) : (
              <EmptyNote>No settlor recorded.</EmptyNote>
            )}
          </section>

          {/* trustees */}
          <section id="t-trustees" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Trustees</h2>
            {d.trustees.length === 0 && d.companyTrustees.length === 0 ? (
              <EmptyNote>No trustees recorded.</EmptyNote>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {d.companyTrustees.map((c, i) => (
                  <PersonCard
                    key={`c${i}`}
                    name={c.company_name || "Unnamed company trustee"}
                    role="Company trustee"
                    rows={[
                      ["ACN / reg. no.", c.registration_number],
                      ["ABN", c.abn],
                      ["Registered address", addrLine(c.registered_address)],
                      ["Directors", (c.directors || []).map((x) => x.full_name).filter(Boolean).join(", ")],
                    ]}
                  />
                ))}
                {d.trustees.map((t, i) => (
                  <PersonCard
                    key={`t${i}`}
                    name={t.full_name || "Unnamed trustee"}
                    role="Individual trustee"
                    rows={[
                      ["Date of birth", fmtDate(t.date_of_birth)],
                      ["Address", addrLine(t.residential_address)],
                    ]}
                  />
                ))}
                {trust.individual_trustees?.has_additional_trustees && (
                  <div style={{ fontSize: 12, color: C.amber || "#b5731f" }}>
                    Additional trustees exist that are not listed above.
                  </div>
                )}
              </div>
            )}
          </section>

          {/* control */}
          <section id="t-control" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 6 }}>Control</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: C.sub }}>
              Who can appoint or remove the trustee, and anyone else exercising effective control.
            </p>
            {(d.controllers.controlling_persons || []).length === 0 && (d.controllers.authorised_representatives || []).length === 0 ? (
              <EmptyNote>No controlling persons or authorised representatives recorded.</EmptyNote>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(d.controllers.controlling_persons || []).map((p, i) => (
                  <PersonCard
                    key={`cp${i}`}
                    name={p.full_name || "Unnamed"}
                    role={p.role || "Controlling person"}
                    flags={[screenFlag(p.pep_status) && [`PEP: ${p.pep_status}`, ...screenFlag(p.pep_status).slice(1)], screenFlag(p.sanctions_status) && [`Sanctions: ${p.sanctions_status}`, ...screenFlag(p.sanctions_status).slice(1)]].filter(Boolean)}
                  />
                ))}
                {(d.controllers.authorised_representatives || []).map((r, i) => (
                  <PersonCard key={`ar${i}`} name={r.full_name || "Unnamed"} role={r.role ? `Authorised rep · ${r.role}` : "Authorised representative"} />
                ))}
              </div>
            )}
            {d.appointors.length > 0 && (
              <div style={{ marginTop: 12, fontSize: 12, color: C.sub }}>
                <span style={upLabel}>Appointors</span>
                <div style={{ marginTop: 5 }}>{d.appointors.join(", ")}</div>
              </div>
            )}
          </section>

          {/* beneficiaries */}
          <section id="t-beneficiaries" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Beneficiaries</h2>
            {d.beneficiaries.length === 0 ? (
              <EmptyNote>No beneficiaries recorded.</EmptyNote>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {d.beneficiaries.map((b, i) => (
                  <PersonCard
                    key={i}
                    name={b.named_beneficiaries || "Unnamed beneficiary"}
                    role={b.beneficiary_type ? `Beneficiary · ${humanise(b.beneficiary_type)}` : "Beneficiary"}
                    rows={[
                      ["Class", b.beneficiary_classes],
                      ["Interest", b.beneficial_interest_percent != null ? `${b.beneficial_interest_percent}%` : ""],
                      ["Date of birth", fmtDate(b.date_of_birth)],
                    ]}
                  />
                ))}
              </div>
            )}
          </section>

          {/* purpose & funds */}
          <section id="t-purpose" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Purpose &amp; funds</h2>
            <Rows
              rows={[
                [
                  "Account purpose",
                  Object.entries(d.td.account_purpose || {})
                    .filter(([, v]) => v === true)
                    .map(([k]) => k.replace(/_/g, " "))
                    .join(", "),
                ],
                ["Industry", d.td.industry],
                ["Nature of business", d.td.nature_of_business],
                ["Annual income", d.td.annual_income],
                ["Estimated trading volume", d.td.estimated_trading_volume],
                ["Source of funds", d.aml.source_of_funds],
                ["Source of wealth", d.aml.source_of_wealth],
              ]}
            />
          </section>

          {/* aml */}
          <section id="t-aml" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>AML / KYC</h2>
            <Rows
              rows={[
                ["KYC verification", humanise(d.aml.kyc_verification_status)],
                ["Verified on", fmtDate(d.aml.verification_date)],
                ["Risk rating", humanise(d.aml.risk_rating)],
                ["PEP screening", humanise(d.aml.pep_screening_status)],
                ["Sanctions screening", humanise(d.aml.sanctions_screening_status)],
              ]}
            />
          </section>

          {/* documents */}
          <section id="t-documents" style={sectionCard}>
            <h2 style={{ ...h2, marginBottom: 14 }}>Documents</h2>
            {d.documents.length === 0 ? (
              <EmptyNote>No documents attached.</EmptyNote>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {d.documents.map((doc, i) => {
                  const expired = doc.expiry_date && new Date(doc.expiry_date) < new Date();
                  return (
                    <div key={doc._id || i} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", border: `1px solid ${C.line}`, borderRadius: 10, padding: "10px 13px" }}>
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, wordBreak: "break-word" }}>{doc.name || doc.docType || "Document"}</div>
                        <div style={{ fontSize: 11.5, color: C.sub }}>
                          {[doc.docType, doc.uploadedAt ? `uploaded ${fmtDate(doc.uploadedAt)}` : null].filter(Boolean).join(" · ")}
                        </div>
                      </div>
                      {doc.expiry_date && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: expired ? "#9a3d1c" : C.sub, background: expired ? "#fbe9e2" : "#f1f1ec", padding: "3px 8px", borderRadius: 5 }}>
                          {expired ? "Expired" : "Expires"} {fmtDate(doc.expiry_date)}
                        </span>
                      )}
                      {doc.verification_status && doc.verification_status !== "unverified" && (
                        <span style={{ fontSize: 11, fontWeight: 600, color: doc.verification_status === "verified" ? "#1f6b4b" : "#9a3d1c", background: doc.verification_status === "verified" ? "#e6f2eb" : "#fbe9e2", padding: "3px 8px", borderRadius: 5 }}>
                          {doc.verification_status}
                        </span>
                      )}
                      {doc.url && (
                        <a href={doc.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 600, color: C.green, textDecoration: "none" }}>
                          Open
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
