"use server";

import { fetchWithAuth, BASE_URL } from "@/services/serverApi";

export const getCustomers = async (query) => {
  const url = `risk-assessment/utils/customers?q=${encodeURIComponent(query || "")}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};

// CRA V2: optional entityType narrows the product catalogue server-side
export const getRiskFactors = async (entityType) => {
  const qs = entityType ? `?entityType=${encodeURIComponent(entityType)}` : "";
  const url = `risk-assessment/utils/risk-factors${qs}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};

export const calculateRiskScore = async (customerData) => {
  const url = `risk-assessment/risk/assess`;
  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(customerData),
  });
  const data = await response.json();
  return data;
};

export const saveResult = async (payload) => {
  const url = `risk-assessment/risk/assess/save`;
  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const data = await response.json();
  return data;
};

export const getAllAssessments = async () => {
  const url = `risk-assessment`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};

// ── CRA V2 detail / ECDD gate / audit trail ──────────────────────────────────

export const getAssessmentById = async (id) => {
  const url = `risk-assessment/${id}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};

export const updateAssessmentNotes = async (id, notes) => {
  const url = `risk-assessment/${id}`;
  const response = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify({ notes }),
  });
  const data = await response.json();
  return data;
};

export const ecddApprove = async (id, payload) => {
  const url = `risk-assessment/${id}/ecdd-approve`;
  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
  const data = await response.json();
  return data;
};

export const ecddDecline = async (id, payload) => {
  const url = `risk-assessment/${id}/ecdd-decline`;
  const response = await fetchWithAuth(url, {
    method: "POST",
    body: JSON.stringify(payload || {}),
  });
  const data = await response.json();
  return data;
};

export const getAuditTrail = async (id) => {
  const url = `risk-assessment/${id}/audit`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};

export const getAuditTrailExportUrl = async (id) => {
  const url = `risk-assessment/${id}/audit/export`;
  return `${BASE_URL}${url}`;
};
