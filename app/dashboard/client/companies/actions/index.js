'use server'

import { fetchWithAuth } from "@/services/serverApi";

export const getCompanies = async () => {
  const response = await fetchWithAuth('customer/company/all', {
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
export const getTrusts = async (search = '') => {
  const qs = new URLSearchParams({ limit: '25', ...(search ? { search } : {}) });
  const response = await fetchWithAuth(`customer/trust/all?${qs}`, {
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