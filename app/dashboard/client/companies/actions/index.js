'use server'

import { fetchWithAuth } from "@/services/serverApi";

// Drops blank/null params so an untouched filter never becomes `?country=`
// (which the API would otherwise have to special-case).
const toQuery = (params = {}) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.set(k, typeof v === 'object' ? (v.value ?? '') : String(v));
  });
  return qs.toString();
}

// Server-side list query (docs/65 Step 68): page, limit, sort, search and the
// review_status/entity_type/status/country facets. Params are whitelisted
// server-side by middleware/kybListQuery.js.
export const getCompanies = async (params = {}) => {
  const qs = toQuery(params);
  const response = await fetchWithAuth(`customer/company/all${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
  return response.json();
}

// Portfolio analytics for the list dashboard (docs/65 Step 58) — computed
// server-side over the whole collection, because getCompanies() above is
// paginated and tallying its response would only ever describe page one.
export const getCompanyStats = async () => {
  const response = await fetchWithAuth('customer/company/stats', {
    method: 'GET',
  });
  return response.json();
}

export const getCompanyById = async (id) => {
  const response = await fetchWithAuth(`customer/company/${id}`, {
    method: 'GET',
  });
  return response.json();
}

export const createCompany = async (payload) => {
  const response = await fetchWithAuth('customer/company', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.json();
}

export const updateCompany = async (id, payload) => {
  const response = await fetchWithAuth(`customer/company/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.json();
}

export const updateCompanyReviewStatus = async (id, payload) => {
  const response = await fetchWithAuth(`customer/company/${id}/review-status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response.json();
}

export const getCompanyAudit = async (id) => {
  const response = await fetchWithAuth(`customer/company/${id}/audit`, {
    method: 'GET',
  });
  return response.json();
}

export const updateCompanyDocument = async (id, docId, payload) => {
  const response = await fetchWithAuth(`customer/company/${id}/documents/${docId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response.json();
}

// eKYB OCR pre-fill (docs/65 Step 48) — extraction only, doesn't create or
// touch a CompanyKyc record. `file` is a browser File from the wizard's
// "Start from a document" uploader.
export const ocrExtractCompany = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetchWithAuth(
    'customer/company/ocr',
    { method: 'POST', body: formData },
    false,
    false,
    true,
  );
  return response.json();
}

// Trust records (docs/65 Step 57) — back the "connect an existing trust"
// picker and the Save button inside the beneficial-trust modal. A trust can
// now be saved on its own, so another company can link to it later.
// Accepts either a bare search string (the trust-connect picker in the company
// wizard calls it that way) or a full params object for the Trusts list.
export const getTrusts = async (searchOrParams = '') => {
  const params =
    typeof searchOrParams === 'string'
      ? { limit: 25, ...(searchOrParams ? { search: searchOrParams } : {}) }
      : { limit: 25, ...searchOrParams };
  const response = await fetchWithAuth(`customer/trust/all?${toQuery(params)}`, {
    method: 'GET',
  });
  return response.json();
}

export const getTrustById = async (id) => {
  const response = await fetchWithAuth(`customer/trust/${id}`, {
    method: 'GET',
  });
  return response.json();
}

// The companies a trust holds an interest in (docs/65 Step 70). The link is
// stored only on the company side (shareholders[].holder_entity), so the
// trust dossier has to ask for it — without this the trust graph could show
// the parties inside the trust but never what the trust owns.
export const getCompaniesForTrust = async (id) => {
  const response = await fetchWithAuth(`customer/trust/${id}/companies`, {
    method: 'GET',
  });
  return response.json();
}

export const createTrust = async (payload) => {
  const response = await fetchWithAuth('customer/trust', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response.json();
}

export const updateTrust = async (id, payload) => {
  const response = await fetchWithAuth(`customer/trust/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response.json();
}

// eKYB OCR pre-fill for a Trust Deed (docs/65 Step 50) — used by the
// shareholder "held on behalf of a trust" form (TrustFields). Extraction
// only, doesn't create or touch a TrustKyc record.
export const ocrExtractTrust = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetchWithAuth(
    'customer/trust/ocr',
    { method: 'POST', body: formData },
    false,
    false,
    true,
  );
  return response.json();
}