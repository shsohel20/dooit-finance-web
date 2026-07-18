"use server";
import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export async function getCustomers(queryParams) {
  const queryString = getQueryString(queryParams);
  const url = `customer?isActive=true&${queryString}`;
  const response = await fetchWithAuth(url, {
    method: "GET",
  });

  return response.json();
}

export async function exportCustomersExcel(queryParams = {}) {
  const queryString = getQueryString(queryParams);
  const url = `customer/export${queryString ? `?${queryString}` : ""}`;
  const response = await fetchWithAuth(url, { method: "GET" });

  if (!response || typeof response.arrayBuffer !== "function") {
    return { success: false, error: "Network error while exporting" };
  }
  if (!response.ok) {
    return { success: false, error: `Export failed (${response.status})` };
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const cd = response.headers?.get?.("content-disposition") || "";
  const match = /filename="?([^"]+)"?/.exec(cd);
  const filename = match ? match[1] : `customers-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return { success: true, base64, filename };
}

// Sumsub-style per-customer KYC applicant report (PDF) — returns base64 for
// client-side download (same contract as exportCustomersExcel).
export async function exportCustomerKycPdf(id) {
  const response = await fetchWithAuth(`customer/${id}/kyc-export`, { method: "GET" });

  if (!response || typeof response.arrayBuffer !== "function") {
    return { success: false, error: "Network error while exporting" };
  }
  if (!response.ok) {
    return { success: false, error: `Export failed (${response.status})` };
  }

  const buffer = await response.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");

  const cd = response.headers?.get?.("content-disposition") || "";
  const match = /filename="?([^"]+)"?/.exec(cd);
  const filename = match ? match[1] : `KYC_Report_${id}.pdf`;

  return { success: true, base64, filename };
}

// Manual KYC decision (approve / reject / status change) with audit note.
export async function updateCustomerKycStatus(id, body) {
  const response = await fetchWithAuth(`customer/${id}/kyc-status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return response.json();
}

// Manual approve/reject of a single verification journey step (e.g. ID Document).
export async function reviewJourneyStep(customerId, journeyId, stepType, body) {
  const response = await fetchWithAuth(
    `customer/${customerId}/journeys/${journeyId}/steps/${stepType}/review`,
    {
      method: "PATCH",
      body: JSON.stringify(body),
    },
  );
  return response.json();
}

// Reviewer-side customer documents (Documents tab).
export async function addCustomerDocuments(id, documents) {
  const response = await fetchWithAuth(`customer/${id}/documents`, {
    method: "POST",
    body: JSON.stringify({ documents }),
  });
  return response.json();
}

export async function removeCustomerDocument(id, url) {
  const response = await fetchWithAuth(`customer/${id}/documents?url=${encodeURIComponent(url)}`, {
    method: "DELETE",
  });
  return response.json();
}

export async function getCustomerStats(queryParams = {}) {
  const queryString = getQueryString(queryParams);
  const url = `customer/stats${queryString ? `?${queryString}` : ""}`;
  const response = await fetchWithAuth(url, {
    method: "GET",
  });
  return response.json();
}

// Staff-side standalone document OCR — session auth, no invite token needed
// (unlike onboarding-journey/ocr-document). Payload: { cardType?, documents: [{ url, docType }] }.
export const ocrStaffDocument = async (payload) => {
  const response = await fetchWithAuth("ocr/document", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.json();
};

// Manual import of an individual customer (doc 59) — creates the customer,
// links/creates the portal user and queues the background Sumsub chain.
export const manualImportCustomer = async (payload) => {
  const response = await fetchWithAuth("customer/manual-import", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.json();
};

export const sendInvite = async (inviteData) => {
  const response = await fetchWithAuth("customer/invite", {
    method: "POST",
    body: JSON.stringify(inviteData),
  });
  return response.json();
};

export const getCustomerById = async (id) => {
  const response = await fetchWithAuth(`customer/${id}`, {
    method: "GET",
  });
  return response.json();
};

// ── AML matches (per-hit compliance review) ──────────────────────────────────
export const getAmlMatches = async (customerId) => {
  const response = await fetchWithAuth(`sumsub/aml-matches/${customerId}`, {
    method: "GET",
  });
  return response.json();
};

export const updateAmlMatch = async (id, body) => {
  const response = await fetchWithAuth(`sumsub/aml-matches/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  return response.json();
};

export const createInstantReport = async (reportData) => {
  const response = await fetchWithAuth("report-notify/new", {
    method: "POST",
    body: JSON.stringify(reportData),
  });
  return response.json();
};

export const getCustomerTransactions = async (customerId) => {
  const response = await fetchWithAuth(`transaction?customer=${customerId}`, {
    method: "GET",
  });
  return response.json();
};

export const getCustomerRelations = async (payload) => {
  const url = `http://31.97.71.194:5055/api/v1/hierarchy/analyze `;
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};

export const getCustomerRelationsGraph = async (id) => {
  const url = `http://31.97.71.194:5055/api/v1/relationships/${id}`;
  const response = await fetch(url, {
    method: "GET",
  });
  return response.json();
};

export const getOSINTdata = async (entityType, entityId) => {
  const url = `https://osint.dooit.ai/api/v1/osint/${entityType}/${entityId}`;
  const response = await fetch(url, {
    method: "GET",
  });
  return response.json();
};

export const getOSINTScreenshots = async (entityType, entityId) => {
  const url = `https://osint.dooit.ai/api/v1/osint/${entityType}/${entityId}/screenshots`;
  const response = await fetch(url, {
    method: "GET",
  });
  return response.json();
};
