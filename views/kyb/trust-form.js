"use client";
/**
 * Shared trust capture form (docs/65 Step 62).
 *
 * `TrustFields` and its state helpers were defined inside the company
 * add/edit wizard, where they back the "held on behalf of a trust" modal.
 * The standalone Trust pages need the same form, so the implementation was
 * lifted here and both hosts import it — a copy would have guaranteed the
 * two drift apart, and this form is the whole TrustKyc schema.
 *
 * Lifted unchanged; only the import/export wiring is new.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { fileUploadOnCloudinary } from "@/app/actions";
import {
  ocrExtractTrust,
  getTrusts,
  getTrustById,
  createTrust,
  updateTrust,
} from "@/app/dashboard/client/companies/actions";
import {
  C,
  fld,
  labelCss,
  errCss,
  monoFam,
  COUNTRY_OPTIONS,
  toNum,
  labelFor,
  dateOnly,
  rowIsBlank,
  blankStr,
  digitsOnly,
  todayISO,
  EMAIL_RE,
  URL_RE,
  POSTCODE_RE,
  isAdultDob,
  splitName,
  RemoveBtn,
  Fld,
  VField,
  Input,
  Select,
  Seg,
  AddBtn,
} from "./form-kit";

// TrustKyc's trust_type.selected_type vocabulary (api/models/TrustKyc.js) —
// reused as-is rather than inventing a parallel list for a shareholder's
// beneficial-trust details (docs/65 Step 43), which creates/updates a real
// TrustKyc document via TrustFields below.
const TRUST_TYPES = [
  ["Unregulated Trust", "unregulated_trust"],
  ["Self-Managed Super Fund", "self_managed_super_fund"],
  ["Managed Investment Scheme (Registered)", "managed_investment_scheme_registered"],
  ["Managed Investment Scheme (Unregistered)", "managed_investment_scheme_unregistered"],
  ["Government Superannuation Fund", "government_superannuation_fund"],
  ["Other Superannuation Trust", "other_superannuation_trust"],
];

// Each trust_type variant's own primary identifying field on TrustKyc,
// shown next to the Trust type dropdown. unregulated_trust and
// other_superannuation_trust have additional variant-specific fields beyond
// this one (captured separately below, docs/65 Step 46).
const TRUST_TYPE_ID_FIELD = {
  unregulated_trust: { key: "registration_number", label: "Registration number" },
  self_managed_super_fund: { key: "abn", label: "ABN" },
  managed_investment_scheme_registered: { key: "asrn", label: "ASRN" },
  managed_investment_scheme_unregistered: { key: "abn", label: "ABN" },
  government_superannuation_fund: { key: "legislation_name", label: "Legislation name" },
  other_superannuation_trust: { key: "registration_number", label: "Registration number" },
};

// Variant identifier keys that the generic "Trust identification" section
// already captures. TrustKyc reconciles these two paths server-side
// (docs/65 Step 59), so the form must ask once, not twice. `asrn` and
// `legislation_name` aren't here — they have no generic counterpart, so
// their variant field is the only place to enter them.
const GENERIC_TRUST_ID_FIELDS = ["abn", "registration_number"];

// Screening-status vocabularies (docs/65 Step 55) — labels for TrustKyc's
// SCREENING_STATUSES enum; sanctions omits the PEP label (it's a PEP-only
// outcome even though the schema shares one vocabulary).
const PEP_STATUS_OPTIONS = [
  ["Pending", "pending"],
  ["Cleared", "cleared"],
  ["PEP", "pep"],
  ["Flagged", "flagged"],
];

const SANCTIONS_STATUS_OPTIONS = [
  ["Pending", "pending"],
  ["Cleared", "cleared"],
  ["Flagged", "flagged"],
];

const BENEFICIARY_TYPES = [
  ["Individual", "individual"],
  ["Class", "class"],
  ["Company", "company"],
  ["Other", "other"],
];

// principal_address/postal_address both use the schema's "address" key;
// a trustee's own residential_address uses "street" instead (docs/65 Step
// 46) — two distinct empty shapes rather than one reused across both.
const emptyTrustAddress = () => ({ address: "", suburb: "", state: "", postcode: "", country: "" });

const emptyTrustee = () => ({ full_name: "", dob: "", street: "", suburb: "", state: "", postcode: "", country: "" });

const emptyCompanyTrustee = () => ({
  company_name: "",
  registration_number: "",
  abn: "",
  street: "",
  suburb: "",
  state: "",
  postcode: "",
  country: "",
  directors: "", // comma-separated names — a list-inside-a-list stays flat in the UI
});

const emptyAuthorisedRep = () => ({ full_name: "", role: "" });

const emptyControllingPerson = () => ({ full_name: "", role: "", pep: "Pending", sanctions: "Pending" });

const emptyTrustBeneficiary = () => ({
  named_beneficiaries: "",
  beneficiary_classes: "",
  beneficiary_type: "",
  interest_percent: "",
  dob: "",
});

const emptyTrust = () => ({
  id: "",
  full_trust_name: "",
  country: "",
  // Trust identification (docs/65 Step 55)
  abn: "",
  acn: "",
  registration_number: "",
  tfn: "",
  tax_residency: "",
  date_established: "",
  date_of_deed: "",
  governing_law: "",
  appointors: "", // comma-separated names
  // Local form-state key only — it serialises to `settlor.full_name`, which
  // since docs/65 Step 60 is the schema's sole home for the settlor's name.
  settlor_name: "",
  settled_sum_amount: "",
  settled_sum_currency: "",
  settlor_dob: "",
  settlor_is_company: "No",
  settlor_company_name: "",
  settlor_company_reg: "",
  settlor_street: "",
  settlor_suburb: "",
  settlor_state: "",
  settlor_postcode: "",
  settlor_country: "",
  industry: "",
  nature_of_business: "",
  annual_income: "",
  estimated_trading_volume: "",
  source_of_funds: "",
  source_of_wealth: "",
  principal_address: emptyTrustAddress(),
  postal_same_as_principal: "Same as principal",
  postal_address: emptyTrustAddress(),
  contact_email: "",
  contact_phone: "",
  contact_website: "",
  trust_type: "Unregulated Trust",
  trust_type_id: "",
  unregulated_type_description: "",
  unregulated_is_registered: "No",
  unregulated_regulatory_body: "",
  other_super_regulator_name: "",
  account_purpose: { digital_currency_exchange: false, peer_to_peer: false, fx: false, other: false },
  has_company_trustees: "No",
  company_trustees: [emptyCompanyTrustee()],
  trustees: [emptyTrustee()],
  has_additional_trustees: "No",
  authorised_reps: [],
  controlling_persons: [],
  beneficiaries: [],
  documents: [],
});

// Every value present, undefined otherwise, so an all-blank block collapses
// to undefined rather than persisting an object of empty strings.
const buildTrustAddress = (a) => {
  const out = {
    address: a.address.trim() || undefined,
    suburb: a.suburb.trim() || undefined,
    state: a.state.trim() || undefined,
    postcode: a.postcode.trim() || undefined,
    country: a.country || undefined,
  };
  return Object.values(out).some(Boolean) ? out : undefined;
};

const buildResidentialAddress = (tr) => {
  const out = {
    street: tr.street.trim() || undefined,
    suburb: tr.suburb.trim() || undefined,
    state: tr.state.trim() || undefined,
    postcode: tr.postcode.trim() || undefined,
    country: tr.country || undefined,
  };
  return Object.values(out).some(Boolean) ? out : undefined;
};

// Comma-separated free text -> trimmed non-empty name list (appointors,
// company-trustee directors — flat capture for list-inside-a-list fields).
const splitNames = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);

// Mirrors the wrapper shape resolveTrustLinks() expects server-side
// (customerController.js) — { id, trust_details, individual_trustees,
// beneficiaries, company_trustees, settlor, controllers, appointors,
// aml_kyc, documents } — used for a shareholder's beneficial trust
// (docs/65 Step 43; expanded to every TrustKyc property in Step 46 and to
// the Step 55 schema expansion).
const buildTrustPayload = (t) => {
  const typeValue = TRUST_TYPES.find(([l]) => l === t.trust_type)?.[1] || "unregulated_trust";
  const idField = TRUST_TYPE_ID_FIELD[typeValue];
  const variantDetails = {
    ...(idField && t.trust_type_id.trim() ? { [idField.key]: t.trust_type_id.trim() } : {}),
    ...(typeValue === "unregulated_trust"
      ? {
          type_description: t.unregulated_type_description.trim() || undefined,
          is_registered: t.unregulated_is_registered === "Yes",
          regulatory_body: t.unregulated_regulatory_body.trim() || undefined,
        }
      : {}),
    ...(typeValue === "other_superannuation_trust"
      ? { regulator_name: t.other_super_regulator_name.trim() || undefined }
      : {}),
  };
  const postalSame = t.postal_same_as_principal !== "Different";
  const settlorAddress = buildResidentialAddress({
    street: t.settlor_street,
    suburb: t.settlor_suburb,
    state: t.settlor_state,
    postcode: t.settlor_postcode,
    country: t.settlor_country,
  });
  const settlorIsCompany = t.settlor_is_company === "Yes";
  return {
    id: t.id || undefined,
    trust_details: {
      full_trust_name: t.full_trust_name.trim(),
      country_of_establishment: t.country || undefined,
      // Dates live on trust_details, not under trust_identification — a date
      // is not an identifier (docs/65 Step 59).
      date_established: t.date_established || undefined,
      date_of_deed: t.date_of_deed || undefined,
      trust_identification: {
        abn: t.abn.trim() || undefined,
        acn: t.acn.trim() || undefined,
        registration_number: t.registration_number.trim() || undefined,
        tfn: t.tfn.trim() || undefined,
        tax_residency: t.tax_residency || undefined,
      },
      governing_law: t.governing_law.trim() || undefined,
      // No trust_details.settlor_name — removed from the schema in docs/65
      // Step 60. The settlor's name goes on settlor.full_name below only.
      settled_sum: {
        amount: toNum(t.settled_sum_amount),
        currency: t.settled_sum_currency.trim() || undefined,
      },
      industry: t.industry.trim() || undefined,
      nature_of_business: t.nature_of_business.trim() || undefined,
      annual_income: t.annual_income.trim() || undefined,
      estimated_trading_volume: t.estimated_trading_volume.trim() || undefined,
      principal_address: buildTrustAddress(t.principal_address),
      postal_address: {
        different_from_principal: !postalSame,
        ...(postalSame ? {} : buildTrustAddress(t.postal_address) || {}),
      },
      contact_information: {
        email: t.contact_email.trim() || undefined,
        phone: t.contact_phone.trim() || undefined,
        website: t.contact_website.trim() || undefined,
      },
      trust_type: {
        selected_type: typeValue,
        ...(Object.keys(variantDetails).length ? { [typeValue]: variantDetails } : {}),
      },
      account_purpose: t.account_purpose,
    },
    settlor: {
      full_name: t.settlor_name.trim() || undefined,
      date_of_birth: settlorIsCompany ? undefined : t.settlor_dob || undefined,
      residential_address: settlorIsCompany ? undefined : settlorAddress,
      country_of_residence: settlorIsCompany ? undefined : t.settlor_country || undefined,
      is_company: settlorIsCompany,
      company: settlorIsCompany
        ? {
            company_name: t.settlor_company_name.trim() || undefined,
            registration_number: t.settlor_company_reg.trim() || undefined,
          }
        : undefined,
    },
    individual_trustees: {
      trustees: t.trustees
        .filter((tr) => tr.full_name.trim())
        .map((tr) => ({
          full_name: tr.full_name.trim(),
          date_of_birth: tr.dob || undefined,
          residential_address: buildResidentialAddress(tr),
        })),
      has_additional_trustees: t.has_additional_trustees === "Yes",
    },
    company_trustees: {
      has_company_trustees: t.has_company_trustees === "Yes",
      company_details: t.company_trustees
        .filter((c) => c.company_name.trim())
        .map((c) => ({
          company_name: c.company_name.trim(),
          registration_number: c.registration_number.trim() || undefined,
          abn: c.abn.trim() || undefined,
          registered_address: buildResidentialAddress(c),
          directors: splitNames(c.directors).map((full_name) => ({ full_name })),
        })),
    },
    controllers: {
      authorised_representatives: t.authorised_reps
        .filter((r) => r.full_name.trim())
        .map((r) => ({ full_name: r.full_name.trim(), role: r.role.trim() || undefined })),
      controlling_persons: t.controlling_persons
        .filter((p) => p.full_name.trim())
        .map((p) => ({
          full_name: p.full_name.trim(),
          role: p.role.trim() || undefined,
          pep_status: PEP_STATUS_OPTIONS.find(([l]) => l === p.pep)?.[1] || "pending",
          sanctions_status: SANCTIONS_STATUS_OPTIONS.find(([l]) => l === p.sanctions)?.[1] || "pending",
        })),
    },
    appointors: splitNames(t.appointors),
    aml_kyc: {
      source_of_funds: t.source_of_funds.trim() || undefined,
      source_of_wealth: t.source_of_wealth.trim() || undefined,
    },
    beneficiaries: t.beneficiaries
      .filter((b) => b.named_beneficiaries.trim())
      .map((b) => ({
        named_beneficiaries: b.named_beneficiaries.trim(),
        beneficiary_classes: b.beneficiary_classes.trim() || undefined,
        beneficiary_type: BENEFICIARY_TYPES.find(([l]) => l === b.beneficiary_type)?.[1] || undefined,
        beneficial_interest_percent: toNum(b.interest_percent),
        date_of_birth: b.dob || undefined,
      })),
    documents: (t.documents || [])
      .filter((d) => d.url)
      .map((d) => ({
        name: d.name,
        url: d.url,
        mimeType: d.mimeType,
        docType: d.docType || undefined,
        expiry_date: d.expiry || undefined,
      })),
  };
};

// Reverse of buildTrustPayload() — maps a populated TrustKyc doc (a
// shareholder's populated holder_entity when holder_model is "TrustKyc")
// back into TrustFields' local state shape (docs/65 Step 43). Falls back to
// a blank trust when there's nothing to restore (not yet linked, or the ref
// didn't populate).
function trustKycToWizardState(t) {
  if (!t || typeof t !== "object") return emptyTrust();
  const td = t.trust_details || {};
  const typeValue = td.trust_type?.selected_type;
  const idField = TRUST_TYPE_ID_FIELD[typeValue];
  const variant = td.trust_type?.[typeValue] || {};
  const pa = td.principal_address || {};
  const posta = td.postal_address || {};
  const ci = td.contact_information || {};
  const ap = td.account_purpose || {};
  const ct = t.company_trustees || {};
  const ti = td.trust_identification || {};
  const settlor = t.settlor || {};
  const sa = settlor.residential_address || {};
  const ctrl = t.controllers || {};
  const aml = t.aml_kyc || {};
  return {
    id: t._id || "",
    full_trust_name: td.full_trust_name || "",
    country: td.country_of_establishment || "",
    abn: ti.abn || "",
    acn: ti.acn || "",
    registration_number: ti.registration_number || "",
    tfn: ti.tfn || "",
    tax_residency: ti.tax_residency || "",
    // Read the new home first, falling back to the pre-Step-59 path so
    // records written before the move still restore.
    date_established: dateOnly(td.date_established ?? ti.date_established),
    date_of_deed: dateOnly(td.date_of_deed ?? ti.date_of_deed),
    governing_law: td.governing_law || "",
    appointors: (t.appointors || []).join(", "),
    // Canonical field only; the `td.settlor_name` fallback covers records
    // stored before the Step 60 removal that haven't been migrated yet.
    settlor_name: settlor.full_name || td.settlor_name || "",
    settled_sum_amount: td.settled_sum?.amount ?? "",
    settled_sum_currency: td.settled_sum?.currency || "",
    settlor_dob: dateOnly(settlor.date_of_birth),
    settlor_is_company: settlor.is_company ? "Yes" : "No",
    settlor_company_name: settlor.company?.company_name || "",
    settlor_company_reg: settlor.company?.registration_number || "",
    settlor_street: sa.street || "",
    settlor_suburb: sa.suburb || "",
    settlor_state: sa.state || "",
    settlor_postcode: sa.postcode || "",
    settlor_country: sa.country || settlor.country_of_residence || "",
    source_of_funds: aml.source_of_funds || "",
    source_of_wealth: aml.source_of_wealth || "",
    authorised_reps: (ctrl.authorised_representatives || []).map((r) => ({
      full_name: r.full_name || "",
      role: r.role || "",
    })),
    controlling_persons: (ctrl.controlling_persons || []).map((p) => ({
      full_name: p.full_name || "",
      role: p.role || "",
      pep: labelFor(PEP_STATUS_OPTIONS, p.pep_status, "Pending"),
      sanctions: labelFor(SANCTIONS_STATUS_OPTIONS, p.sanctions_status, "Pending"),
    })),
    industry: td.industry || "",
    nature_of_business: td.nature_of_business || "",
    annual_income: td.annual_income || "",
    estimated_trading_volume: td.estimated_trading_volume || "",
    principal_address: {
      address: pa.address || "",
      suburb: pa.suburb || "",
      state: pa.state || "",
      postcode: pa.postcode || "",
      country: pa.country || "",
    },
    postal_same_as_principal: posta.different_from_principal ? "Different" : "Same as principal",
    postal_address: {
      address: posta.address || "",
      suburb: posta.suburb || "",
      state: posta.state || "",
      postcode: posta.postcode || "",
      country: posta.country || "",
    },
    contact_email: ci.email || "",
    contact_phone: ci.phone || "",
    contact_website: ci.website || "",
    trust_type: labelFor(TRUST_TYPES, typeValue, "Unregulated Trust"),
    trust_type_id: idField ? variant[idField.key] || "" : "",
    unregulated_type_description: typeValue === "unregulated_trust" ? variant.type_description || "" : "",
    unregulated_is_registered: typeValue === "unregulated_trust" && variant.is_registered ? "Yes" : "No",
    unregulated_regulatory_body: typeValue === "unregulated_trust" ? variant.regulatory_body || "" : "",
    other_super_regulator_name: typeValue === "other_superannuation_trust" ? variant.regulator_name || "" : "",
    account_purpose: {
      digital_currency_exchange: Boolean(ap.digital_currency_exchange),
      peer_to_peer: Boolean(ap.peer_to_peer),
      fx: Boolean(ap.fx),
      other: Boolean(ap.other),
    },
    has_company_trustees: ct.has_company_trustees ? "Yes" : "No",
    company_trustees: (ct.company_details || []).length
      ? ct.company_details.map((c) => ({
          company_name: c.company_name || "",
          registration_number: c.registration_number || "",
          abn: c.abn || "",
          street: c.registered_address?.street || "",
          suburb: c.registered_address?.suburb || "",
          state: c.registered_address?.state || "",
          postcode: c.registered_address?.postcode || "",
          country: c.registered_address?.country || "",
          directors: (c.directors || []).map((d) => d.full_name).filter(Boolean).join(", "),
        }))
      : [emptyCompanyTrustee()],
    trustees: (t.individual_trustees?.trustees || []).length
      ? t.individual_trustees.trustees.map((tr) => ({
          full_name: tr.full_name || "",
          dob: dateOnly(tr.date_of_birth),
          street: tr.residential_address?.street || "",
          suburb: tr.residential_address?.suburb || "",
          state: tr.residential_address?.state || "",
          postcode: tr.residential_address?.postcode || "",
          country: tr.residential_address?.country || "",
        }))
      : [emptyTrustee()],
    has_additional_trustees: t.individual_trustees?.has_additional_trustees ? "Yes" : "No",
    beneficiaries: (t.beneficiaries || []).map((b) => ({
      named_beneficiaries: b.named_beneficiaries || "",
      beneficiary_classes: b.beneficiary_classes || "",
      beneficiary_type: labelFor(BENEFICIARY_TYPES, b.beneficiary_type, ""),
      interest_percent: b.beneficial_interest_percent ?? "",
      dob: dateOnly(b.date_of_birth),
    })),
    documents: (t.documents || []).map((d, i) => ({
      _uploadId: d._id ? String(d._id) : `existing_${i}`,
      name: d.name || "",
      mimeType: d.mimeType || "",
      docType: d.docType || d.type || "",
      url: d.url || "",
      expiry: dateOnly(d.expiry_date),
      // Server-owned; carried through for display only, never editable in
      // the wizard (docs/65 Step 55).
      verification_status: d.verification_status || "",
      status: "done",
    })),
  };
}

// eKYB OCR pre-fill for a Trust Deed (docs/65 Step 50) — merges a
// /process-ekyb-trust response into TrustFields' current local state.
// Unlike the Company OCR response (Step 49), a real sample here confirmed
// `data` genuinely does mirror TrustKyc.js one-for-one (same top-level
// trust_details/beneficiaries/company_trustees/individual_trustees layout
// trustKycToWizardState() above already reads) — no undocumented extra
// top-level arrays this time. Same additive-never-destructive rule as the
// Company merge: a field only overwrites the current value when OCR
// actually returned something for it.
//
// One real wrinkle a live sample surfaced: `trust_details.trust_type.
// selected_type` came back "Discretionary" — natural-language, not one of
// TRUST_TYPES' six backend enum values. Rather than drop an unrecognised
// type, it's matched case-insensitively against TRUST_TYPES' labels/values
// first; if nothing matches, it falls back to "unregulated_trust" (the
// correct umbrella per TrustKyc's own schema — see unregulated_trust.
// type_description) with the raw OCR string recorded in that description
// field, so "Discretionary" isn't silently lost.
function applyOcrToTrust(t, ocrData) {
  const td = ocrData?.trust_details || {};
  const pa = td.principal_address || {};
  const posta = td.postal_address || {};
  const ci = td.contact_information || {};
  const ap = td.account_purpose;

  const rawType = td.trust_type?.selected_type || "";
  const matchedTypeValue = TRUST_TYPES.find(
    ([label, value]) => value.toLowerCase() === rawType.toLowerCase() || label.toLowerCase() === rawType.toLowerCase(),
  )?.[1];
  const typeValue = matchedTypeValue || (rawType ? "unregulated_trust" : "");
  const variant = typeValue ? td.trust_type?.[typeValue] || {} : {};
  const idField = typeValue ? TRUST_TYPE_ID_FIELD[typeValue] : null;

  const newTrustees = (ocrData?.individual_trustees?.trustees || [])
    .map((tr) => ({
      full_name: tr.full_name || "",
      dob: dateOnly(tr.date_of_birth || tr.dob),
      street: tr.residential_address?.street || tr.street || "",
      suburb: tr.residential_address?.suburb || tr.suburb || "",
      state: tr.residential_address?.state || tr.state || "",
      postcode: tr.residential_address?.postcode || tr.postcode || "",
      country: tr.residential_address?.country || tr.country || "",
    }))
    .filter((r) => r.full_name.trim());
  const newCompanyTrustees = (ocrData?.company_trustees?.company_details || [])
    .map((c) => ({ company_name: c.company_name || "", registration_number: c.registration_number || "" }))
    .filter((r) => r.company_name.trim());
  const newBeneficiaries = (ocrData?.beneficiaries || [])
    .map((b) => ({
      ...emptyTrustBeneficiary(),
      named_beneficiaries: b.named_beneficiaries || "",
      beneficiary_classes: b.beneficiary_classes || "",
    }))
    .filter((r) => r.named_beneficiaries.trim());

  return {
    ...t,
    full_trust_name: td.full_trust_name?.trim() || t.full_trust_name,
    country: td.country_of_establishment?.trim() || t.country,
    // Had no schema home until Step 55 — previously surfaced in a
    // "not captured by this form" toast, now stored like everything else.
    date_of_deed: dateOnly(td.date_of_deed) || t.date_of_deed,
    governing_law: ocrData?.governing_law?.trim() || t.governing_law,
    appointors: (ocrData?.appointors || []).length ? ocrData.appointors.join(", ") : t.appointors,
    settlor_name: td.settlor_name?.trim() || t.settlor_name,
    industry: td.industry?.trim() || t.industry,
    nature_of_business: td.nature_of_business?.trim() || t.nature_of_business,
    annual_income: td.annual_income?.trim() || t.annual_income,
    estimated_trading_volume: td.estimated_trading_volume?.trim() || t.estimated_trading_volume,
    principal_address: {
      address: pa.address?.trim() || t.principal_address.address,
      suburb: pa.suburb?.trim() || t.principal_address.suburb,
      state: pa.state?.trim() || t.principal_address.state,
      postcode: pa.postcode?.trim() || t.principal_address.postcode,
      country: pa.country?.trim() || t.principal_address.country,
    },
    postal_same_as_principal: posta.different_from_principal ? "Different" : t.postal_same_as_principal,
    postal_address: posta.different_from_principal
      ? {
          address: posta.address?.trim() || t.postal_address.address,
          suburb: posta.suburb?.trim() || t.postal_address.suburb,
          state: posta.state?.trim() || t.postal_address.state,
          postcode: posta.postcode?.trim() || t.postal_address.postcode,
          country: posta.country?.trim() || t.postal_address.country,
        }
      : t.postal_address,
    contact_email: ci.email?.trim() || t.contact_email,
    contact_phone: ci.phone?.trim() || t.contact_phone,
    contact_website: ci.website?.trim() || t.contact_website,
    trust_type: typeValue ? labelFor(TRUST_TYPES, typeValue, t.trust_type) : t.trust_type,
    trust_type_id: idField && variant[idField.key] ? String(variant[idField.key]) : t.trust_type_id,
    unregulated_type_description:
      typeValue === "unregulated_trust"
        ? variant.type_description?.trim() || (!matchedTypeValue && rawType ? rawType : t.unregulated_type_description)
        : t.unregulated_type_description,
    unregulated_is_registered:
      typeValue === "unregulated_trust" && variant.is_registered != null ? (variant.is_registered ? "Yes" : "No") : t.unregulated_is_registered,
    unregulated_regulatory_body:
      typeValue === "unregulated_trust" ? variant.regulatory_body?.trim() || t.unregulated_regulatory_body : t.unregulated_regulatory_body,
    other_super_regulator_name:
      typeValue === "other_superannuation_trust" ? variant.regulator_name?.trim() || t.other_super_regulator_name : t.other_super_regulator_name,
    account_purpose: ap
      ? {
          digital_currency_exchange: ap.digital_currency_exchange ?? t.account_purpose.digital_currency_exchange,
          peer_to_peer: ap.peer_to_peer ?? t.account_purpose.peer_to_peer,
          fx: ap.fx ?? t.account_purpose.fx,
          other: ap.other ?? t.account_purpose.other,
        }
      : t.account_purpose,
    has_company_trustees: ocrData?.company_trustees?.has_company_trustees ? "Yes" : t.has_company_trustees,
    company_trustees: newCompanyTrustees.length
      ? (t.company_trustees.length === 1 && rowIsBlank(t.company_trustees[0], ["company_name", "registration_number"])
          ? newCompanyTrustees
          : [...t.company_trustees, ...newCompanyTrustees])
      : t.company_trustees,
    trustees: newTrustees.length
      ? (t.trustees.length === 1 && rowIsBlank(t.trustees[0], ["full_name"]) ? newTrustees : [...t.trustees, ...newTrustees])
      : t.trustees,
    has_additional_trustees: ocrData?.individual_trustees?.has_additional_trustees ? "Yes" : t.has_additional_trustees,
    beneficiaries: newBeneficiaries.length ? [...t.beneficiaries, ...newBeneficiaries] : t.beneficiaries,
  };
}

// Reused for both the entity's own Trust details (entity_type === "Trust")
// and a shareholder's beneficial trust (Beneficially held = No, arrangement
// = Trust) — same TrustKyc-shaped fields either way (docs/65 Step 43),
// so the two required-trust-form contexts stay consistent by construction
// rather than by copy-pasted markup.
// (SectionLabel — the flat heading used here in Steps 46–55 — was replaced
// by TrustSection below in Step 56 and removed rather than left dead.)
// Each trust section is its own titled card (docs/65 Step 56) — with 15
// sections in one modal, a flat stack of labels made it hard to tell where
// one ended and the next began. The header wraps on narrow screens so a
// section with an action control (Add…/Yes-No toggle) stays usable.
// `issues` (docs/65 Step 62) — with 15 sections in one scrolling modal, a
// per-section count is what makes "3 fields need attention" findable without
// scrolling the whole form looking for red.
function TrustSection({ title, hint, action, issues = 0, group, only, children }) {
  // `only` lets a host render a subset (the Trust intake wizard shows a few
  // sections per step); undefined means render everything, which is what the
  // company wizard's single-scroll modal wants (docs/65 Step 64).
  if (only && group && !only.includes(group)) return null;
  const flagged = issues > 0;
  return (
    <section style={{ border: `1px solid ${flagged ? C.redLine : C.line}`, borderRadius: 12, background: "#fff", overflow: "hidden" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          padding: "11px 14px",
          background: flagged ? C.redSoft : "#f7f9f7",
          borderBottom: `1px solid ${flagged ? C.redLine : C.hair}`,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: flagged ? C.redDeep : C.mid }}>{title}</div>
            {flagged && (
              <span
                style={{
                  background: "#fff",
                  border: `1px solid ${C.redLine}`,
                  color: C.red,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 20,
                }}
              >
                {issues} to fix
              </span>
            )}
          </div>
          {hint && <div style={{ fontSize: 11.5, color: C.sub, marginTop: 3, fontWeight: 400 }}>{hint}</div>}
        </div>
        {action}
      </div>
      <div style={{ padding: 14 }}>{children}</div>
    </section>
  );
}

const trustFieldGrid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 };

const smallRemoveBtn = (onClick) => (
  <button
    type="button"
    title="Remove"
    onClick={onClick}
    style={{ background: "none", border: "none", cursor: "pointer", color: "#b0b6bd", padding: "8px 2px", flexShrink: 0 }}
  >
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  </button>
);

// Which error keys belong to which TrustSection card, for the "N to fix"
// header badges. Prefix match, so "trustees" covers "trustees.0.dob".
const TRUST_SECTION_KEYS = {
  identity: ["full_trust_name", "country", "governing_law", "industry", "nature_of_business", "annual_income", "estimated_trading_volume"],
  identification: ["abn", "acn", "registration_number", "tfn", "tax_residency", "date_established", "date_of_deed"],
  settlor: ["settlor_name", "settlor_dob", "settlor_company_name", "settlor_company_reg", "settlor_street", "settlor_suburb", "settlor_state", "settlor_postcode", "settlor_country"],
  trust_type: ["trust_type", "trust_type_id", "unregulated_type_description", "unregulated_regulatory_body", "other_super_regulator_name"],
  principal_address: ["principal_address"],
  postal_address: ["postal_address"],
  contact: ["contact_email", "contact_phone", "contact_website"],
  account_purpose: ["account_purpose"],
  company_trustees: ["company_trustees"],
  trustees: ["trustees"],
  control: ["appointors", "controlling_persons"],
  reps: ["authorised_reps"],
  funds: ["source_of_funds", "source_of_wealth"],
  beneficiaries: ["beneficiaries"],
  documents: ["documents", "doc"],
};
const countIssues = (errors, group) =>
  Object.keys(errors).filter((k) => (TRUST_SECTION_KEYS[group] || []).some((p) => k === p || k.startsWith(`${p}.`))).length;


function validateTrust(t) {
  const e = {};
  const req = (key, value, message) => {
    if (blankStr(value)) e[key] = message;
  };
  const addressBlock = (prefix, a = {}) => {
    req(`${prefix}.address`, a.address, "Address is required.");
    req(`${prefix}.suburb`, a.suburb, "Suburb is required.");
    req(`${prefix}.state`, a.state, "State is required.");
    req(`${prefix}.postcode`, a.postcode, "Postcode is required.");
    req(`${prefix}.country`, a.country, "Country is required.");
    if (!blankStr(a.postcode) && !POSTCODE_RE.test(String(a.postcode).trim())) e[`${prefix}.postcode`] = "Enter a valid postcode.";
  };

  // Trust identity
  req("full_trust_name", t.full_trust_name, "Full trust name is required.");
  req("country", t.country, "Country of establishment is required.");
  req("industry", t.industry, "Industry is required.");
  req("nature_of_business", t.nature_of_business, "Nature of business is required.");
  req("annual_income", t.annual_income, "Annual income is required.");
  req("estimated_trading_volume", t.estimated_trading_volume, "Estimated trading volume is required.");

  // Trust identification — every identifier is optional (which ones exist
  // depends on the trust), but a supplied one has to be well-formed.
  if (!blankStr(t.abn) && digitsOnly(t.abn).length !== 11) e.abn = "ABN must be 11 digits.";
  if (!blankStr(t.acn) && digitsOnly(t.acn).length !== 9) e.acn = "ACN must be 9 digits.";
  if (!blankStr(t.tfn) && ![8, 9].includes(digitsOnly(t.tfn).length)) e.tfn = "TFN must be 8 or 9 digits.";
  if (!blankStr(t.date_established) && t.date_established > todayISO()) e.date_established = "Date established can't be in the future.";
  if (!blankStr(t.date_of_deed) && t.date_of_deed > todayISO()) e.date_of_deed = "Date of deed can't be in the future.";

  // Trust type + the variant-specific fields it unlocks
  req("trust_type", t.trust_type, "Trust type is required.");
  const typeValue = TRUST_TYPES.find(([l]) => l === t.trust_type)?.[1];
  const idField = TRUST_TYPE_ID_FIELD[typeValue];
  if (idField) {
    // Where the variant's identifier is one the generic Trust identification
    // section already collects (abn / registration_number), the requirement
    // applies to THAT field — its variant input isn't rendered any more
    // (docs/65 Step 59), and requiring a hidden field would block submit
    // with an error the user can't see or clear.
    if (GENERIC_TRUST_ID_FIELDS.includes(idField.key)) {
      req(idField.key, t[idField.key], `${idField.label} is required for this trust type.`);
    } else {
      req("trust_type_id", t.trust_type_id, `${idField.label} is required for this trust type.`);
    }
  }
  // (ABN digit-length is already validated once on the generic field above.)
  if (typeValue === "unregulated_trust") {
    req("unregulated_type_description", t.unregulated_type_description, "Type description is required.");
    if (t.unregulated_is_registered === "Yes") {
      req("unregulated_regulatory_body", t.unregulated_regulatory_body, "Regulatory body is required when the trust is registered.");
    }
  }
  if (typeValue === "other_superannuation_trust") {
    req("other_super_regulator_name", t.other_super_regulator_name, "Regulator name is required.");
  }

  // Settlor
  req("settlor_name", t.settlor_name, "Settlor name is required.");
  if (t.settlor_is_company === "Yes") {
    req("settlor_company_name", t.settlor_company_name, "Company name is required.");
    req("settlor_company_reg", t.settlor_company_reg, "Registration number is required.");
  } else if (!blankStr(t.settlor_dob) && t.settlor_dob > todayISO()) {
    e.settlor_dob = "Date of birth can't be in the future.";
  }

  // Addresses — postal only when it differs from the principal address.
  addressBlock("principal_address", t.principal_address);
  if (t.postal_same_as_principal === "Different") addressBlock("postal_address", t.postal_address);

  // Contact information
  if (blankStr(t.contact_email)) e.contact_email = "Email is required.";
  else if (!EMAIL_RE.test(t.contact_email.trim())) e.contact_email = "Enter a valid email address.";
  if (blankStr(t.contact_phone)) e.contact_phone = "Phone is required.";
  else if (digitsOnly(t.contact_phone).length < 6) e.contact_phone = "Enter a valid phone number.";
  if (!blankStr(t.contact_website) && !URL_RE.test(t.contact_website.trim())) e.contact_website = "Enter a valid website URL.";

  // Account purpose — section-level, at least one box ticked.
  if (!Object.values(t.account_purpose || {}).some(Boolean)) e.account_purpose = "Select at least one account purpose.";

  // Company trustees — only when the trust says it has them.
  if (t.has_company_trustees === "Yes") {
    const rows = t.company_trustees || [];
    if (!rows.length) e.company_trustees = "Add at least one company trustee.";
    rows.forEach((c, i) => {
      req(`company_trustees.${i}.company_name`, c.company_name, "Company name is required.");
      req(`company_trustees.${i}.registration_number`, c.registration_number, "ACN / registration number is required.");
      if (!blankStr(c.abn) && digitsOnly(c.abn).length !== 11) e[`company_trustees.${i}.abn`] = "ABN must be 11 digits.";
    });
  }

  // Individual trustees — at least one, fully identified (name, DOB and
  // residential address), same as the standalone trust form.
  const trustees = t.trustees || [];
  if (!trustees.length) e.trustees = "At least one individual trustee is required.";
  trustees.forEach((tr, i) => {
    req(`trustees.${i}.full_name`, tr.full_name, "Full name is required.");
    if (blankStr(tr.dob)) e[`trustees.${i}.dob`] = "Date of birth is required.";
    else if (tr.dob > todayISO()) e[`trustees.${i}.dob`] = "Date of birth can't be in the future.";
    else if (!isAdultDob(tr.dob)) e[`trustees.${i}.dob`] = "A trustee must be at least 18 years old.";
    req(`trustees.${i}.street`, tr.street, "Street is required.");
    req(`trustees.${i}.suburb`, tr.suburb, "Suburb is required.");
    req(`trustees.${i}.state`, tr.state, "State is required.");
    req(`trustees.${i}.postcode`, tr.postcode, "Postcode is required.");
    req(`trustees.${i}.country`, tr.country, "Country is required.");
    if (!blankStr(tr.postcode) && !POSTCODE_RE.test(String(tr.postcode).trim())) e[`trustees.${i}.postcode`] = "Enter a valid postcode.";
  });

  // Controllers and representatives are optional lists — but a row that has
  // been added has to say who and in what capacity, or it's noise.
  (t.controlling_persons || []).forEach((p, i) => {
    req(`controlling_persons.${i}.full_name`, p.full_name, "Full name is required.");
    req(`controlling_persons.${i}.role`, p.role, "Role is required.");
  });
  (t.authorised_reps || []).forEach((r, i) => {
    req(`authorised_reps.${i}.full_name`, r.full_name, "Full name is required.");
    req(`authorised_reps.${i}.role`, r.role, "Role is required.");
  });

  // Beneficiaries
  let totalInterest = 0;
  (t.beneficiaries || []).forEach((b, i) => {
    req(`beneficiaries.${i}.named_beneficiaries`, b.named_beneficiaries, "Named beneficiary is required.");
    req(`beneficiaries.${i}.beneficiary_type`, b.beneficiary_type, "Beneficiary type is required.");
    if (!blankStr(b.interest_percent)) {
      const pct = Number(b.interest_percent);
      if (!Number.isFinite(pct) || pct < 0 || pct > 100) e[`beneficiaries.${i}.interest_percent`] = "Enter a percentage between 0 and 100.";
      else totalInterest += pct;
    }
    if (b.beneficiary_type === "Individual") {
      if (blankStr(b.dob)) e[`beneficiaries.${i}.dob`] = "Date of birth is required for an individual beneficiary.";
      else if (b.dob > todayISO()) e[`beneficiaries.${i}.dob`] = "Date of birth can't be in the future.";
    }
  });
  if (totalInterest > 100) e.beneficiaries = "Total beneficial interest can't exceed 100%.";

  // Documents — an attached file has to say what it is, and an unfinished
  // or failed upload would be silently dropped by buildTrustPayload().
  const docs = t.documents || [];
  docs.forEach((d) => {
    if (blankStr(d.docType)) e[`doc.${d._uploadId}.docType`] = "Document type is required.";
  });
  if (docs.some((d) => d.status === "uploading")) e.documents = "Wait for the upload to finish.";
  else if (docs.some((d) => d.status === "error")) e.documents = "Retry or remove the failed upload.";

  return e;
}

// Shared 5-field address block (address/suburb/state/postcode/country) —
// used for both principal_address and postal_address, which share this
// exact shape on TrustKyc (docs/65 Step 46). `vf` supplies each field's
// validation wiring, keyed by the block's prefix (docs/65 Step 62).
function TrustAddressFields({ value: a, onChange, vf, prefix }) {
  const p = (k, v) => onChange({ ...a, [k]: v });
  return (
    <div style={trustFieldGrid}>
      <VField label="Address" required {...vf(`${prefix}.address`)}>
        <Input value={a.address} onChange={(e) => p("address", e.target.value)} />
      </VField>
      <VField label="Suburb" required {...vf(`${prefix}.suburb`)}>
        <Input value={a.suburb} onChange={(e) => p("suburb", e.target.value)} />
      </VField>
      <VField label="State" required {...vf(`${prefix}.state`)}>
        <Input value={a.state} onChange={(e) => p("state", e.target.value)} />
      </VField>
      <VField label="Postcode" required {...vf(`${prefix}.postcode`)}>
        <Input value={a.postcode} onChange={(e) => p("postcode", e.target.value)} />
      </VField>
      <VField label="Country" required {...vf(`${prefix}.country`)}>
        <Select value={a.country} onChange={(e) => p("country", e.target.value)} options={["", ...COUNTRY_OPTIONS]} />
      </VField>
    </div>
  );
}

// Reused for a shareholder's beneficial trust (Beneficially held = No,
// arrangement = Trust — docs/65 Step 43). Covers every property on the
// TrustKyc schema (docs/65 Step 46) so the linked record this creates isn't
// a partial capture — trust identity, both addresses, contact info, every
// trust_type variant's own fields, account purpose, company trustees,
// individual trustees (incl. residential address), beneficiaries and
// documents.
function TrustFields({ value: t, onChange, showErrors = false, sections, showConnect = true, showSaveBar = true }) {
  const patch = (k, v) => onChange({ ...t, [k]: v });
  const patchAccountPurpose = (k, v) => onChange({ ...t, account_purpose: { ...t.account_purpose, [k]: v } });

  const patchTrustee = (i, k, v) =>
    onChange({ ...t, trustees: t.trustees.map((tr, idx) => (idx === i ? { ...tr, [k]: v } : tr)) });
  const addTrustee = () => onChange({ ...t, trustees: [...t.trustees, emptyTrustee()] });
  const removeTrustee = (i) =>
    onChange({ ...t, trustees: t.trustees.length > 1 ? t.trustees.filter((_, idx) => idx !== i) : t.trustees });

  const patchCompanyTrustee = (i, k, v) =>
    onChange({ ...t, company_trustees: t.company_trustees.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)) });
  const addCompanyTrustee = () => onChange({ ...t, company_trustees: [...t.company_trustees, emptyCompanyTrustee()] });
  const removeCompanyTrustee = (i) =>
    onChange({
      ...t,
      company_trustees: t.company_trustees.length > 1 ? t.company_trustees.filter((_, idx) => idx !== i) : t.company_trustees,
    });

  const patchBeneficiary = (i, k, v) =>
    onChange({ ...t, beneficiaries: t.beneficiaries.map((b, idx) => (idx === i ? { ...b, [k]: v } : b)) });
  const addBeneficiary = () => onChange({ ...t, beneficiaries: [...t.beneficiaries, emptyTrustBeneficiary()] });
  const removeBeneficiary = (i) => onChange({ ...t, beneficiaries: t.beneficiaries.filter((_, idx) => idx !== i) });

  // Controllers (docs/65 Step 55) — authorised representatives and the
  // persons exercising effective control over the trust.
  const patchRep = (i, k, v) =>
    onChange({ ...t, authorised_reps: t.authorised_reps.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)) });
  const addRep = () => onChange({ ...t, authorised_reps: [...t.authorised_reps, emptyAuthorisedRep()] });
  const removeRep = (i) => onChange({ ...t, authorised_reps: t.authorised_reps.filter((_, idx) => idx !== i) });
  const patchController = (i, k, v) =>
    onChange({ ...t, controlling_persons: t.controlling_persons.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)) });
  const addController = () => onChange({ ...t, controlling_persons: [...t.controlling_persons, emptyControllingPerson()] });
  const removeController = (i) =>
    onChange({ ...t, controlling_persons: t.controlling_persons.filter((_, idx) => idx !== i) });

  /* -------- validation (docs/65 Step 62) -------- */
  // Errors are always computed; what changes is whether they're *shown*.
  // A field shows its message once it's been touched, and Save (here) or
  // Done (in the modal footer, via `showErrors`) reveals all of them at once.
  const errors = useMemo(() => validateTrust(t), [t]);
  const issueCount = Object.keys(errors).length;
  const [selfAttempted, setSelfAttempted] = useState(false);
  const [touched, setTouched] = useState({});
  const reveal = showErrors || selfAttempted;
  // The subset the user can currently see — everything once revealed, only
  // touched fields before that. Section badges count the same subset, so a
  // badge never claims an issue the form isn't showing anywhere.
  const visibleErrors = useMemo(
    () => (reveal ? errors : Object.fromEntries(Object.entries(errors).filter(([k]) => touched[k]))),
    [errors, reveal, touched],
  );
  const err = (k) => visibleErrors[k];
  const vf = (k) => ({
    error: visibleErrors[k],
    onTouch: () => setTouched((s) => (s[k] ? s : { ...s, [k]: true })),
  });
  const issues = (group) => countIssues(visibleErrors, group);
  // Bring the first offending field into view when everything is revealed —
  // in a modal this long the failure is otherwise off-screen. Scoped to the
  // dialog so it can't grab a field on the wizard page behind it.
  useEffect(() => {
    if (!reveal || !issueCount) return;
    // Deliberately keyed on `reveal` alone: this fires when errors are first
    // revealed, not on every keystroke while the user works through them.
    document.querySelector('[role="dialog"] [data-invalid="true"]')?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [reveal]); // eslint-disable-line react-hooks/exhaustive-deps

  // Refs so the async upload callback always writes into the latest state
  // rather than whatever `t`/`onChange` closed over when the upload started
  // (docs/65 Step 46) — this is a controlled prop, not top-level useState,
  // so a functional updater isn't available the way the wizard's own
  // Documents step (setDocs(d => ...)) uses.
  const tRef = useRef(t);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    tRef.current = t;
    onChangeRef.current = onChange;
  });
  const uploadDoc = async (uploadId, file) => {
    try {
      const res = await fileUploadOnCloudinary(file);
      const publicUrl = res?.file?.publicUrl;
      if (!res?.success || !publicUrl) throw new Error(res?.message || "Upload failed");
      onChangeRef.current({
        ...tRef.current,
        documents: tRef.current.documents.map((d) => (d._uploadId === uploadId ? { ...d, url: publicUrl, status: "done" } : d)),
      });
    } catch (err) {
      onChangeRef.current({
        ...tRef.current,
        documents: tRef.current.documents.map((d) => (d._uploadId === uploadId ? { ...d, status: "error" } : d)),
      });
      toast.error(`${file.name}: ${err.message || "Upload failed"}`);
    }
  };
  const onFiles = (fileList) => {
    const added = Array.from(fileList || []).map((f) => ({
      _uploadId: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      _file: f,
      name: f.name,
      mimeType: f.type || "application/octet-stream",
      docType: "",
      url: "",
      status: "uploading",
    }));
    if (!added.length) return;
    onChange({ ...t, documents: [...t.documents, ...added] });
    added.forEach((row) => uploadDoc(row._uploadId, row._file));
  };
  const retryUpload = (row) => {
    if (!row._file) return;
    onChange({ ...t, documents: t.documents.map((d) => (d._uploadId === row._uploadId ? { ...d, status: "uploading" } : d)) });
    uploadDoc(row._uploadId, row._file);
  };
  const removeDoc = (uploadId) => onChange({ ...t, documents: t.documents.filter((d) => d._uploadId !== uploadId) });
  const patchDocType = (uploadId, v) =>
    onChange({ ...t, documents: t.documents.map((d) => (d._uploadId === uploadId ? { ...d, docType: v } : d)) });

  // Connect an existing trust + Save (docs/65 Step 57). `t.id` is the link:
  // set means this form is bound to a real TrustKyc record, so saving
  // updates that record and the company submit reuses it rather than
  // creating a duplicate (resolveTrustLinks reads `trust.id`).
  const [trustOptions, setTrustOptions] = useState([]);
  const [trustsLoading, setTrustsLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const linked = Boolean(t.id);

  // Load the pickable trust list once the section is first rendered.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTrustsLoading(true);
      try {
        const res = await getTrusts();
        if (cancelled) return;
        setTrustOptions(
          (res?.data || []).map((d) => ({
            id: String(d._id),
            label: [d.trust_details?.full_trust_name || "Unnamed trust", d.uid].filter(Boolean).join(" · "),
          })),
        );
      } catch {
        // Non-fatal: the picker just stays empty and the form still works
        // as a create-new form.
      } finally {
        if (!cancelled) setTrustsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Selecting an existing trust loads its full record into this form, so
  // what's shown is the connected trust's real details (not a blank form
  // that would overwrite them on the next save).
  const connectExisting = async (label) => {
    const match = trustOptions.find((o) => o.label === label);
    if (!match) return;
    setConnecting(true);
    try {
      const res = await getTrustById(match.id);
      if (!res?.success || !res?.data) {
        toast.error(res?.message || "Could not load that trust");
        return;
      }
      onChangeRef.current(trustKycToWizardState(res.data));
      toast.success(`Connected to ${res.data.trust_details?.full_trust_name || "the selected trust"}.`);
    } catch (err) {
      toast.error(err.message || "Could not load that trust");
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    // Keeps the typed details, drops the link — the next save creates a new
    // record instead of overwriting the one that was connected.
    onChange({ ...t, id: "" });
    toast.message("Disconnected. Saving now creates a new trust record.");
  };

  const saveTrust = async () => {
    // A saved trust is a real TrustKyc record other companies can connect
    // to, so it has to be complete — not just named (docs/65 Step 62).
    // Saving also re-maps the form from the server's response, which would
    // replace an in-flight upload row (its File handle and "uploading"
    // status live only in local state) and silently lose that document —
    // validateTrust() covers that case too.
    if (issueCount) {
      setSelfAttempted(true);
      toast.error(`${issueCount} ${issueCount === 1 ? "field needs" : "fields need"} attention before this trust can be saved.`);
      return;
    }
    setSaving(true);
    try {
      const payload = buildTrustPayload(t);
      delete payload.id; // the id travels in the URL for an update, not the body
      const res = t.id ? await updateTrust(t.id, payload) : await createTrust(payload);
      if (!res?.success || !res?.data) {
        toast.error(res?.message || "Could not save this trust");
        return;
      }
      // Re-map from the saved record so the form reflects exactly what was
      // stored (and picks up the new id + uid on a create).
      onChangeRef.current(trustKycToWizardState(res.data));
      if (!t.id) {
        setTrustOptions((opts) => [
          { id: String(res.data._id), label: [res.data.trust_details?.full_trust_name, res.data.uid].filter(Boolean).join(" · ") },
          ...opts,
        ]);
      }
      toast.success(t.id ? "Trust updated." : "Trust saved — it can now be connected from other companies.");
    } catch (err) {
      toast.error(err.message || "Could not save this trust");
    } finally {
      setSaving(false);
    }
  };

  // eKYB OCR pre-fill for a Trust Deed (docs/65 Step 50) — no document-type
  // picker needed here (unlike the Company wizard's uploader): the upstream
  // endpoint only ever accepts one kind of document, a trust deed.
  const [trustOcrFile, setTrustOcrFile] = useState(null);
  const [trustOcrLoading, setTrustOcrLoading] = useState(false);
  const runTrustOcr = async () => {
    if (!trustOcrFile) return;
    setTrustOcrLoading(true);
    try {
      const res = await ocrExtractTrust(trustOcrFile);
      if (!res?.success || !res?.data) {
        toast.error(res?.error || res?.message || "Could not extract data from this trust deed — try a clearer scan or fill the form manually.");
        return;
      }
      const merged = applyOcrToTrust(tRef.current, res.data);
      const uploadId = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
      onChangeRef.current({
        ...merged,
        documents: [
          ...merged.documents,
          {
            _uploadId: uploadId,
            _file: trustOcrFile,
            name: trustOcrFile.name,
            mimeType: trustOcrFile.type || "application/octet-stream",
            docType: "Trust Deed",
            url: "",
            status: "uploading",
          },
        ],
      });
      uploadDoc(uploadId, trustOcrFile);

      // date_of_deed / appointors / governing_law used to be surfaced here
      // as "extracted but not captured" — since the Step 55 schema
      // expansion they have real fields and applyOcrToTrust() stores them
      // like everything else, so the extra toast is gone.
      toast.success("Trust details pre-filled from the deed. Review every field before continuing.");
      setTrustOcrFile(null);
    } catch (err) {
      toast.error(err.message || "OCR extraction failed — try again or fill the form manually.");
    } finally {
      setTrustOcrLoading(false);
    }
  };

  const typeValue = TRUST_TYPES.find(([l]) => l === t.trust_type)?.[1];
  const idField = TRUST_TYPE_ID_FIELD[typeValue];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Outstanding-issues summary (docs/65 Step 62) — only once errors are
          revealed, so a form that's simply not filled in yet doesn't open
          shouting. */}
      {reveal && issueCount > 0 && (
        <div style={{ display: "flex", gap: 11, alignItems: "flex-start", border: `1px solid ${C.redLine}`, background: C.redSoft, borderRadius: 11, padding: "12px 14px" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5" />
            <circle cx="12" cy="16" r=".6" fill={C.red} />
          </svg>
          <div style={{ fontSize: 12.5, color: C.redDeep, lineHeight: 1.5 }}>
            <strong>{issueCount} {issueCount === 1 ? "field needs" : "fields need"} attention.</strong>{" "}
            Sections with outstanding items are marked below. Required fields are marked with{" "}
            <span style={{ color: C.red, fontWeight: 700 }}>*</span>.
          </div>
        </div>
      )}
      {/* Connect an existing trust (docs/65 Step 57) — picking one loads its
          full record into this form, so the fields below show the connected
          trust's real details rather than a blank form that would overwrite
          them on the next save. Hidden on the standalone Trust pages (Step
          66): there, the whole point is to create THIS trust, and the page
          has its own save action. */}
      {showConnect && (
      <div
        style={{
          border: `1px solid ${linked ? C.green : C.line}`,
          background: linked ? C.greenBg : "#fafbfa",
          borderRadius: 12,
          padding: "13px 15px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            {/* An action picker, not a bound field — `value` stays empty so
                selecting always fires connectExisting(); which trust is
                currently linked is shown in the status line below instead. */}
            <Fld label={linked ? "Connect a different trust" : "Connect an existing trust"}>
              <Select
                value=""
                onChange={(e) => connectExisting(e.target.value)}
                options={trustOptions.map((o) => o.label)}
                placeholder={
                  trustsLoading ? "Loading trusts…" : trustOptions.length ? "Search existing trusts…" : "No saved trusts yet"
                }
              />
            </Fld>
          </div>
          {linked && (
            <button
              type="button"
              onClick={disconnect}
              style={{
                flexShrink: 0,
                background: "none",
                border: `1px solid ${C.line}`,
                borderRadius: 9,
                padding: "9px 14px",
                fontSize: 12.5,
                fontWeight: 600,
                color: C.mid,
                cursor: "pointer",
                fontFamily: "inherit",
                height: 38,
              }}
            >
              Disconnect
            </button>
          )}
        </div>
        <div style={{ fontSize: 11.5, color: linked ? C.greenText : C.sub, marginTop: 8 }}>
          {connecting ? (
            "Loading trust details…"
          ) : linked ? (
            <>
              Connected to <strong>{t.full_trust_name || "an existing trust"}</strong> — saving updates that record, and this
              company reuses it instead of creating a copy.
            </>
          ) : (
            "Or fill the form below and press Save to create a new trust record."
          )}
        </div>
      </div>
      )}

      {/* eKYB OCR pre-fill (docs/65 Step 50) — same "start from a document"
          pattern as the Company wizard's Entity Details step, scaled down
          (no doc-type picker; this endpoint only accepts a trust deed). */}
      <div style={{ border: `1px dashed ${C.green}`, background: "#f2f8f6", borderRadius: 12, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
          </svg>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: C.green }}>Start from a document</span>
          <span
            style={{
              background: C.green,
              color: "#fff",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: ".05em",
              textTransform: "uppercase",
              padding: "2px 7px",
              borderRadius: 5,
            }}
          >
            OCR
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Fld label="Trust deed">
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setTrustOcrFile(e.target.files?.[0] || null)}
                style={{ ...fld, padding: "8px 10px" }}
              />
            </Fld>
          </div>
          <button
            type="button"
            onClick={runTrustOcr}
            disabled={!trustOcrFile || trustOcrLoading}
            style={{
              flexShrink: 0,
              background: !trustOcrFile || trustOcrLoading ? "#9db8ae" : C.green,
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "10px 16px",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: !trustOcrFile || trustOcrLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              height: 38,
            }}
          >
            {trustOcrLoading ? "Extracting…" : "Extract & pre-fill"}
          </button>
        </div>
      </div>

      <TrustSection title="Trust identity" issues={issues("identity")} group="identity" only={sections}>
        <div style={{ ...trustFieldGrid, marginBottom: 12 }}>
          <VField label="Full trust name" required {...vf("full_trust_name")}>
            <Input value={t.full_trust_name} onChange={(e) => patch("full_trust_name", e.target.value)} placeholder="Legal name of the trust" />
          </VField>
          <VField label="Country of establishment" required {...vf("country")}>
            <Select value={t.country} onChange={(e) => patch("country", e.target.value)} options={["", ...COUNTRY_OPTIONS]} />
          </VField>
          <Fld label="Governing law">
            <Input value={t.governing_law} onChange={(e) => patch("governing_law", e.target.value)} placeholder="e.g. VIC" />
          </Fld>
        </div>
        <div style={trustFieldGrid}>
          <VField label="Industry" required {...vf("industry")}>
            <Input value={t.industry} onChange={(e) => patch("industry", e.target.value)} />
          </VField>
          <VField label="Nature of business" required {...vf("nature_of_business")}>
            <Input value={t.nature_of_business} onChange={(e) => patch("nature_of_business", e.target.value)} />
          </VField>
          <VField label="Annual income" required {...vf("annual_income")}>
            <Input value={t.annual_income} onChange={(e) => patch("annual_income", e.target.value)} placeholder="e.g. $500,000 - $1,000,000" />
          </VField>
          <VField label="Estimated trading volume" required {...vf("estimated_trading_volume")}>
            <Input value={t.estimated_trading_volume} onChange={(e) => patch("estimated_trading_volume", e.target.value)} placeholder="e.g. $50,000 per month" />
          </VField>
        </div>
      </TrustSection>

      {/* Identifiers are optional — which ones a trust has depends on what it
          is — but anything typed here is format-checked (docs/65 Step 62). */}
      <TrustSection title="Trust identification" hint="Registry and tax identifiers of the trust itself." issues={issues("identification")} group="identification" only={sections}>
        <div style={{ ...trustFieldGrid, marginBottom: 12 }}>
          <VField label="ABN" {...vf("abn")}>
            <Input mono value={t.abn} onChange={(e) => patch("abn", e.target.value)} placeholder="11 digits" />
          </VField>
          <VField label="ACN" {...vf("acn")}>
            <Input mono value={t.acn} onChange={(e) => patch("acn", e.target.value)} placeholder="9 digits" />
          </VField>
          <Fld label="Registration number">
            <Input mono value={t.registration_number} onChange={(e) => patch("registration_number", e.target.value)} />
          </Fld>
          <VField label="TFN (if applicable)" {...vf("tfn")}>
            <Input mono value={t.tfn} onChange={(e) => patch("tfn", e.target.value)} />
          </VField>
        </div>
        <div style={trustFieldGrid}>
          <Fld label="Tax residency">
            <Select value={t.tax_residency} onChange={(e) => patch("tax_residency", e.target.value)} options={["", ...COUNTRY_OPTIONS]} />
          </Fld>
          <VField label="Date established" {...vf("date_established")}>
            <Input type="date" max={todayISO()} value={t.date_established} onChange={(e) => patch("date_established", e.target.value)} />
          </VField>
          <VField label="Date of deed" {...vf("date_of_deed")}>
            <Input type="date" max={todayISO()} value={t.date_of_deed} onChange={(e) => patch("date_of_deed", e.target.value)} />
          </VField>
        </div>
      </TrustSection>

      <TrustSection
        title="Settlor"
        hint="The person or company that settled the trust."
        issues={issues("settlor")} group="settlor" only={sections}
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11.5, color: C.sub }}>Settlor is a company</span>
            <Seg value={t.settlor_is_company} onChange={(v) => patch("settlor_is_company", v)} options={["No", "Yes"]} />
          </div>
        }
      >
        <div style={{ ...trustFieldGrid, marginBottom: t.settlor_is_company === "Yes" ? 0 : 12 }}>
          <VField label="Settlor name" required {...vf("settlor_name")}>
            <Input value={t.settlor_name} onChange={(e) => patch("settlor_name", e.target.value)} />
          </VField>
          {t.settlor_is_company === "Yes" ? (
            <>
              <VField label="Company name" required {...vf("settlor_company_name")}>
                <Input value={t.settlor_company_name} onChange={(e) => patch("settlor_company_name", e.target.value)} />
              </VField>
              <VField label="Registration number" required {...vf("settlor_company_reg")}>
                <Input mono value={t.settlor_company_reg} onChange={(e) => patch("settlor_company_reg", e.target.value)} />
              </VField>
            </>
          ) : (
            <VField label="Date of birth" {...vf("settlor_dob")}>
              <Input type="date" max={todayISO()} value={t.settlor_dob} onChange={(e) => patch("settlor_dob", e.target.value)} />
            </VField>
          )}
          {/* The nominal sum stated on the deed (commonly $10). Currency is
              captured separately so a trust settled outside Australia isn't
              silently read as AUD. */}
          <Fld label="Settled sum">
            <Input
              mono
              type="number"
              min="0"
              step="any"
              value={t.settled_sum_amount}
              onChange={(e) => patch("settled_sum_amount", e.target.value)}
              placeholder="e.g. 10"
            />
          </Fld>
          <Fld label="Settled sum currency">
            <Input
              value={t.settled_sum_currency}
              onChange={(e) => patch("settled_sum_currency", e.target.value)}
              placeholder="e.g. AUD"
            />
          </Fld>
        </div>
        {t.settlor_is_company !== "Yes" && (
          <div style={trustFieldGrid}>
            <Fld label="Street"><Input value={t.settlor_street} onChange={(e) => patch("settlor_street", e.target.value)} /></Fld>
            <Fld label="Suburb"><Input value={t.settlor_suburb} onChange={(e) => patch("settlor_suburb", e.target.value)} /></Fld>
            <Fld label="State"><Input value={t.settlor_state} onChange={(e) => patch("settlor_state", e.target.value)} /></Fld>
            <Fld label="Postcode"><Input value={t.settlor_postcode} onChange={(e) => patch("settlor_postcode", e.target.value)} /></Fld>
            <Fld label="Country of residence">
              <Select value={t.settlor_country} onChange={(e) => patch("settlor_country", e.target.value)} options={["", ...COUNTRY_OPTIONS]} />
            </Fld>
          </div>
        )}
      </TrustSection>

      <TrustSection title="Trust type" issues={issues("trust_type")} group="trust_type" only={sections}>
        <div style={{ ...trustFieldGrid, marginBottom: 12 }}>
          <VField label="Trust type" required {...vf("trust_type")}>
            <Select value={t.trust_type} onChange={(e) => patch("trust_type", e.target.value)} options={TRUST_TYPES} />
          </VField>
          {/* Only render the variant's identifier when it names something
              the generic Trust identification section above doesn't already
              ask for. Before Step 59 an SMSF showed "ABN" twice — once here,
              once there — as two inputs for one fact; the model now treats
              the generic field as canonical and mirrors it into the variant,
              so asking twice is both redundant and a way to enter a
              contradiction. */}
          {idField && !GENERIC_TRUST_ID_FIELDS.includes(idField.key) && (
            <VField label={idField.label} required {...vf("trust_type_id")}>
              <Input value={t.trust_type_id} onChange={(e) => patch("trust_type_id", e.target.value)} />
            </VField>
          )}
        </div>
        {typeValue === "unregulated_trust" && (
          <div style={trustFieldGrid}>
            <VField label="Type description" required {...vf("unregulated_type_description")}>
              <Input value={t.unregulated_type_description} onChange={(e) => patch("unregulated_type_description", e.target.value)} />
            </VField>
            {/* Only meaningful — and only required — once the trust says it
                is registered. */}
            <VField label="Regulatory body" required={t.unregulated_is_registered === "Yes"} {...vf("unregulated_regulatory_body")}>
              <Input value={t.unregulated_regulatory_body} onChange={(e) => patch("unregulated_regulatory_body", e.target.value)} />
            </VField>
            <Fld label="Registered?">
              <Seg value={t.unregulated_is_registered} onChange={(v) => patch("unregulated_is_registered", v)} />
            </Fld>
          </div>
        )}
        {typeValue === "other_superannuation_trust" && (
          <div style={trustFieldGrid}>
            <VField label="Regulator name" required {...vf("other_super_regulator_name")}>
              <Input value={t.other_super_regulator_name} onChange={(e) => patch("other_super_regulator_name", e.target.value)} />
            </VField>
          </div>
        )}
      </TrustSection>

      <TrustSection title="Principal address" issues={issues("principal_address")} group="principal_address" only={sections}>
        <TrustAddressFields value={t.principal_address} onChange={(a) => patch("principal_address", a)} vf={vf} prefix="principal_address" />
      </TrustSection>

      <TrustSection
        title="Postal address"
        issues={issues("postal_address")} group="postal_address" only={sections}
        action={<Seg value={t.postal_same_as_principal} onChange={(v) => patch("postal_same_as_principal", v)} options={["Same as principal", "Different"]} />}
      >
        {t.postal_same_as_principal === "Same as principal" ? (
          <div style={{ fontSize: 13, color: C.sub }}>Same as the principal address above.</div>
        ) : (
          <TrustAddressFields value={t.postal_address} onChange={(a) => patch("postal_address", a)} vf={vf} prefix="postal_address" />
        )}
      </TrustSection>

      <TrustSection title="Contact information" issues={issues("contact")} group="contact" only={sections}>
        <div style={trustFieldGrid}>
          <VField label="Email" required {...vf("contact_email")}>
            <Input type="email" value={t.contact_email} onChange={(e) => patch("contact_email", e.target.value)} />
          </VField>
          <VField label="Phone" required {...vf("contact_phone")}>
            <Input value={t.contact_phone} onChange={(e) => patch("contact_phone", e.target.value)} />
          </VField>
          <VField label="Website" {...vf("contact_website")}>
            <Input value={t.contact_website} onChange={(e) => patch("contact_website", e.target.value)} placeholder="e.g. example.com.au" />
          </VField>
        </div>
      </TrustSection>

      <TrustSection title="Account purpose" issues={issues("account_purpose")} group="account_purpose" only={sections}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            ["digital_currency_exchange", "Digital currency exchange"],
            ["peer_to_peer", "Peer-to-peer (P2P)"],
            ["fx", "FX"],
            ["other", "Other"],
          ].map(([key, label]) => (
            <label key={key} style={{ display: "flex", gap: 9, alignItems: "center", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={t.account_purpose[key]}
                onChange={(e) => patchAccountPurpose(key, e.target.checked)}
                style={{ width: 16, height: 16, accentColor: C.green, flexShrink: 0 }}
              />
              <span style={{ fontSize: 13, color: C.body }}>{label}</span>
            </label>
          ))}
        </div>
        {/* Section-level rather than per-checkbox: the rule is about the set,
            not about any one box. */}
        {err("account_purpose") && <div style={{ ...errCss, marginTop: 10 }} data-invalid="true">{err("account_purpose")}</div>}
      </TrustSection>

      <TrustSection
        title="Company trustee(s)"
        issues={issues("company_trustees")} group="company_trustees" only={sections}
        action={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11.5, color: C.sub }}>Has company trustees</span>
            <Seg value={t.has_company_trustees} onChange={(v) => patch("has_company_trustees", v)} />
          </div>
        }
      >
        {t.has_company_trustees !== "Yes" ? (
          <div style={{ fontSize: 13, color: C.sub }}>No company trustees — the trust is administered by the individual trustees below.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {err("company_trustees") && <div style={errCss} data-invalid="true">{err("company_trustees")}</div>}
            {t.company_trustees.map((c, i) => (
              <div key={i} style={{ border: `1px solid ${C.hair}`, borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 10 }}>
                  <div style={{ flex: 2 }}>
                    <VField label="Company name" required {...vf(`company_trustees.${i}.company_name`)}>
                      <Input value={c.company_name} onChange={(e) => patchCompanyTrustee(i, "company_name", e.target.value)} />
                    </VField>
                  </div>
                  <div style={{ flex: 1 }}>
                    <VField label="ACN / registration number" required {...vf(`company_trustees.${i}.registration_number`)}>
                      <Input mono value={c.registration_number} onChange={(e) => patchCompanyTrustee(i, "registration_number", e.target.value)} />
                    </VField>
                  </div>
                  <div style={{ flex: 1 }}>
                    <VField label="ABN" {...vf(`company_trustees.${i}.abn`)}>
                      <Input mono value={c.abn} onChange={(e) => patchCompanyTrustee(i, "abn", e.target.value)} />
                    </VField>
                  </div>
                  {t.company_trustees.length > 1 && smallRemoveBtn(() => removeCompanyTrustee(i))}
                </div>
                <div style={{ ...trustFieldGrid, marginBottom: 10 }}>
                  <Fld label="Registered street"><Input value={c.street} onChange={(e) => patchCompanyTrustee(i, "street", e.target.value)} /></Fld>
                  <Fld label="Suburb"><Input value={c.suburb} onChange={(e) => patchCompanyTrustee(i, "suburb", e.target.value)} /></Fld>
                  <Fld label="State"><Input value={c.state} onChange={(e) => patchCompanyTrustee(i, "state", e.target.value)} /></Fld>
                  <Fld label="Postcode"><Input value={c.postcode} onChange={(e) => patchCompanyTrustee(i, "postcode", e.target.value)} /></Fld>
                  <Fld label="Country"><Select value={c.country} onChange={(e) => patchCompanyTrustee(i, "country", e.target.value)} options={["", ...COUNTRY_OPTIONS]} /></Fld>
                </div>
                <Fld label="Director(s) — comma-separated">
                  <Input value={c.directors} onChange={(e) => patchCompanyTrustee(i, "directors", e.target.value)} placeholder="e.g. Jane Doe, John Smith" />
                </Fld>
              </div>
            ))}
            <AddBtn onClick={addCompanyTrustee}>Add company trustee</AddBtn>
          </div>
        )}
      </TrustSection>

      {/* Every trustee is fully identified, not just the first — a trustee
          without a DOB and address can't be screened (docs/65 Step 62). */}
      <TrustSection title="Individual trustees" issues={issues("trustees")} group="trustees" only={sections} action={<AddBtn onClick={addTrustee}>Add trustee</AddBtn>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {err("trustees") && <div style={errCss} data-invalid="true">{err("trustees")}</div>}
          {t.trustees.map((tr, i) => (
            <div key={i} style={{ border: `1px solid ${C.hair}`, borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 10 }}>
                <div style={{ flex: 2 }}>
                  <VField label="Full name" required {...vf(`trustees.${i}.full_name`)}>
                    <Input value={tr.full_name} onChange={(e) => patchTrustee(i, "full_name", e.target.value)} placeholder="Trustee name" />
                  </VField>
                </div>
                <div style={{ flex: 1 }}>
                  <VField label="Date of birth" required {...vf(`trustees.${i}.dob`)}>
                    <Input type="date" max={todayISO()} value={tr.dob} onChange={(e) => patchTrustee(i, "dob", e.target.value)} />
                  </VField>
                </div>
                {t.trustees.length > 1 && smallRemoveBtn(() => removeTrustee(i))}
              </div>
              <div style={trustFieldGrid}>
                <VField label="Street" required {...vf(`trustees.${i}.street`)}>
                  <Input value={tr.street} onChange={(e) => patchTrustee(i, "street", e.target.value)} />
                </VField>
                <VField label="Suburb" required {...vf(`trustees.${i}.suburb`)}>
                  <Input value={tr.suburb} onChange={(e) => patchTrustee(i, "suburb", e.target.value)} />
                </VField>
                <VField label="State" required {...vf(`trustees.${i}.state`)}>
                  <Input value={tr.state} onChange={(e) => patchTrustee(i, "state", e.target.value)} />
                </VField>
                <VField label="Postcode" required {...vf(`trustees.${i}.postcode`)}>
                  <Input value={tr.postcode} onChange={(e) => patchTrustee(i, "postcode", e.target.value)} />
                </VField>
                <VField label="Country" required {...vf(`trustees.${i}.country`)}>
                  <Select value={tr.country} onChange={(e) => patchTrustee(i, "country", e.target.value)} options={["", ...COUNTRY_OPTIONS]} />
                </VField>
              </div>
            </div>
          ))}
        </div>
        <label style={{ display: "flex", gap: 9, alignItems: "center", cursor: "pointer", marginTop: 12 }}>
          <input
            type="checkbox"
            checked={t.has_additional_trustees === "Yes"}
            onChange={(e) => patch("has_additional_trustees", e.target.checked ? "Yes" : "No")}
            style={{ width: 16, height: 16, accentColor: C.green, flexShrink: 0 }}
          />
          <span style={{ fontSize: 13, color: C.body }}>There are additional trustees not listed above</span>
        </label>
      </TrustSection>

      <TrustSection
        title="Control of the trust"
        hint="Who can appoint or remove the trustee, and anyone else exercising effective control."
        issues={issues("control")} group="control" only={sections}
        action={<AddBtn onClick={addController}>Add controlling person</AddBtn>}
      >
        <div style={{ ...trustFieldGrid, marginBottom: 12 }}>
          <Fld label="Appointor(s) — comma-separated">
            <Input value={t.appointors} onChange={(e) => patch("appointors", e.target.value)} placeholder="Person(s) with power to appoint/remove the trustee" />
          </Fld>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
          {t.controlling_persons.length === 0 && (
            <div style={{ fontSize: 13, color: C.sub }}>No controlling persons recorded.</div>
          )}
          {t.controlling_persons.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
              <div style={{ flex: 2, minWidth: 160 }}>
                <VField label="Controlling person" required {...vf(`controlling_persons.${i}.full_name`)}>
                  <Input value={p.full_name} onChange={(e) => patchController(i, "full_name", e.target.value)} placeholder="Full name" />
                </VField>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <VField label="Role" required {...vf(`controlling_persons.${i}.role`)}>
                  <Input value={p.role} onChange={(e) => patchController(i, "role", e.target.value)} placeholder="e.g. Appointor" />
                </VField>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <Fld label="PEP status">
                  <Select value={p.pep} onChange={(e) => patchController(i, "pep", e.target.value)} options={PEP_STATUS_OPTIONS.map(([l]) => l)} />
                </Fld>
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <Fld label="Sanctions status">
                  <Select value={p.sanctions} onChange={(e) => patchController(i, "sanctions", e.target.value)} options={SANCTIONS_STATUS_OPTIONS.map(([l]) => l)} />
                </Fld>
              </div>
              {smallRemoveBtn(() => removeController(i))}
            </div>
          ))}
        </div>
      </TrustSection>

      <TrustSection
        title="Authorised representatives"
        hint="People authorised to act for the trust — accountants, agents, signatories."
        issues={issues("reps")} group="reps" only={sections}
        action={<AddBtn onClick={addRep}>Add representative</AddBtn>}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {t.authorised_reps.length === 0 && (
            <div style={{ fontSize: 13, color: C.sub }}>No authorised representatives recorded.</div>
          )}
          {t.authorised_reps.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ flex: 2 }}>
                <VField label="Full name" required {...vf(`authorised_reps.${i}.full_name`)}>
                  <Input value={r.full_name} onChange={(e) => patchRep(i, "full_name", e.target.value)} />
                </VField>
              </div>
              <div style={{ flex: 1 }}>
                <VField label="Role" required {...vf(`authorised_reps.${i}.role`)}>
                  <Input value={r.role} onChange={(e) => patchRep(i, "role", e.target.value)} placeholder="e.g. Accountant, Agent" />
                </VField>
              </div>
              {smallRemoveBtn(() => removeRep(i))}
            </div>
          ))}
        </div>
      </TrustSection>

      <TrustSection title="Source of funds &amp; wealth" issues={issues("funds")} group="funds" only={sections}>
        <div style={trustFieldGrid}>
          <Fld label="Source of funds">
            <Input value={t.source_of_funds} onChange={(e) => patch("source_of_funds", e.target.value)} placeholder="e.g. Business income, investment returns" />
          </Fld>
          <Fld label="Source of wealth">
            <Input value={t.source_of_wealth} onChange={(e) => patch("source_of_wealth", e.target.value)} placeholder="e.g. Accumulated business profits, inheritance" />
          </Fld>
        </div>
      </TrustSection>

      <TrustSection title="Beneficiaries" issues={issues("beneficiaries")} group="beneficiaries" only={sections} action={<AddBtn onClick={addBeneficiary}>Add beneficiary</AddBtn>}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {t.beneficiaries.length === 0 && <div style={{ fontSize: 13, color: C.sub }}>No beneficiaries recorded.</div>}
          {err("beneficiaries") && <div style={errCss} data-invalid="true">{err("beneficiaries")}</div>}
          {t.beneficiaries.map((b, i) => (
            <div key={i} style={{ border: `1px solid ${C.hair}`, borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 10 }}>
                <div style={{ flex: 2 }}>
                  <VField label="Named beneficiaries" required {...vf(`beneficiaries.${i}.named_beneficiaries`)}>
                    <Input
                      value={b.named_beneficiaries}
                      onChange={(e) => patchBeneficiary(i, "named_beneficiaries", e.target.value)}
                      placeholder="e.g. Jane Smith"
                    />
                  </VField>
                </div>
                <div style={{ flex: 1 }}>
                  <Fld label="Beneficiary class">
                    <Input
                      value={b.beneficiary_classes}
                      onChange={(e) => patchBeneficiary(i, "beneficiary_classes", e.target.value)}
                      placeholder="e.g. Grandchildren"
                    />
                  </Fld>
                </div>
                {smallRemoveBtn(() => removeBeneficiary(i))}
              </div>
              <div style={trustFieldGrid}>
                <VField label="Beneficiary type" required {...vf(`beneficiaries.${i}.beneficiary_type`)}>
                  <Select
                    value={b.beneficiary_type}
                    onChange={(e) => patchBeneficiary(i, "beneficiary_type", e.target.value)}
                    options={["", ...BENEFICIARY_TYPES.map(([l]) => l)]}
                    placeholder="Select type"
                  />
                </VField>
                <VField label="Beneficial interest %" {...vf(`beneficiaries.${i}.interest_percent`)}>
                  <Input mono value={b.interest_percent} onChange={(e) => patchBeneficiary(i, "interest_percent", e.target.value)} placeholder="0" />
                </VField>
                {b.beneficiary_type === "Individual" && (
                  <VField label="Date of birth" required {...vf(`beneficiaries.${i}.dob`)}>
                    <Input type="date" max={todayISO()} value={b.dob} onChange={(e) => patchBeneficiary(i, "dob", e.target.value)} />
                  </VField>
                )}
              </div>
            </div>
          ))}
        </div>
      </TrustSection>

      <TrustSection
        title="Documents"
        issues={issues("documents")} group="documents" only={sections}
        action={
          <label style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", color: C.green, fontSize: 12, fontWeight: 600 }}>
            <input type="file" multiple style={{ display: "none" }} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
            + Add document
          </label>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {t.documents.length === 0 && <div style={{ fontSize: 13, color: C.sub }}>No documents attached.</div>}
          {err("documents") && <div style={errCss} data-invalid="true">{err("documents")}</div>}
          {t.documents.map((d) => (
            <div key={d._uploadId} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", border: `1px solid ${C.hair}`, borderRadius: 9, padding: "8px 10px" }}>
              <div style={{ flex: "0 0 auto", fontSize: 12, color: C.sub, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }} title={d.name}>
                {d.name}
              </div>
              {/* No <Fld> wrapper on this row (it's a compact inline layout),
                  so the required message rides in the title/placeholder and
                  the red border comes from `invalid` directly. */}
              <div style={{ flex: 1 }} data-invalid={err(`doc.${d._uploadId}.docType`) ? "true" : undefined}>
                <Input
                  value={d.docType}
                  onChange={(e) => patchDocType(d._uploadId, e.target.value)}
                  onBlur={vf(`doc.${d._uploadId}.docType`).onTouch}
                  invalid={Boolean(err(`doc.${d._uploadId}.docType`))}
                  title={err(`doc.${d._uploadId}.docType`) || undefined}
                  placeholder="Document type (required)"
                  style={{ height: 32, fontSize: 12.5 }}
                />
              </div>
              <div style={{ flex: "0 0 138px" }} title="Expiry date (if any)">
                <Input
                  type="date"
                  value={d.expiry || ""}
                  onChange={(e) =>
                    onChange({ ...t, documents: t.documents.map((x) => (x._uploadId === d._uploadId ? { ...x, expiry: e.target.value } : x)) })
                  }
                  style={{ height: 32, fontSize: 12 }}
                />
              </div>
              {/* Verification is officer-set on the review side — display
                  only here, never editable in the wizard (docs/65 Step 55). */}
              {d.verification_status === "verified" && <span style={{ fontSize: 11.5, color: C.green, flexShrink: 0 }}>Verified</span>}
              {d.verification_status === "rejected" && <span style={{ fontSize: 11.5, color: C.red, flexShrink: 0 }}>Rejected</span>}
              {d.status === "uploading" && <span style={{ fontSize: 11.5, color: C.sub, flexShrink: 0 }}>Uploading…</span>}
              {d.status === "error" && (
                <button type="button" onClick={() => retryUpload(d)} style={{ fontSize: 11.5, color: C.red, background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}>
                  Retry
                </button>
              )}
              {d.status === "done" && <span style={{ fontSize: 11.5, color: C.green, flexShrink: 0 }}>Uploaded</span>}
              {smallRemoveBtn(() => removeDoc(d._uploadId))}
            </div>
          ))}
        </div>
      </TrustSection>

      {/* Save (docs/65 Step 57) — persists this trust as a real TrustKyc
          record straight away, rather than waiting for the whole company
          wizard to be submitted. That's what makes "connect an existing
          trust" useful: a saved trust is immediately linkable from another
          company. Saving is optional — an unsaved trust still gets created
          when the company itself is submitted. Hidden on the standalone Trust
          pages (Step 66), which carry their own save action. */}
      {showSaveBar && (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          borderTop: `1px solid ${C.line}`,
          paddingTop: 14,
        }}
      >
        <div style={{ fontSize: 11.5, color: issueCount ? C.red : C.sub, flex: 1, minWidth: 200 }}>
          {issueCount
            ? `${issueCount} ${issueCount === 1 ? "field needs" : "fields need"} attention before this trust can be saved.`
            : linked
              ? "Changes are saved to the connected trust record."
              : "Not saved yet — this trust is created when the company is submitted, or save it now to reuse it elsewhere."}
        </div>
        {/* Deliberately not disabled while incomplete: clicking it is how the
            user asks "what's missing?" and reveals every outstanding field. */}
        <button
          type="button"
          onClick={saveTrust}
          disabled={saving}
          style={{
            flexShrink: 0,
            background: saving ? "#9db8ae" : C.green,
            color: "#fff",
            border: "none",
            borderRadius: 9,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {saving ? "Saving…" : linked ? "Save changes" : "Save trust"}
        </button>
      </div>
      )}
    </div>
  );
}

export { TRUST_TYPES, TRUST_TYPE_ID_FIELD, GENERIC_TRUST_ID_FIELDS, PEP_STATUS_OPTIONS, SANCTIONS_STATUS_OPTIONS, BENEFICIARY_TYPES, emptyTrustAddress, emptyTrustee, emptyCompanyTrustee, emptyAuthorisedRep, emptyControllingPerson, emptyTrustBeneficiary, emptyTrust, buildTrustAddress, buildResidentialAddress, splitNames, buildTrustPayload, trustKycToWizardState, applyOcrToTrust, TrustSection, trustFieldGrid, smallRemoveBtn, validateTrust, TrustAddressFields, TrustFields, TRUST_SECTION_KEYS };
