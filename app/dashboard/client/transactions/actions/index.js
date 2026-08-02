"use server";

import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export const getTransactions = async (queryParams) => {
  const queryString = getQueryString(queryParams);
  const response = await fetchWithAuth(`transaction?${queryString}`, {
    method: "GET",
  });
  return response.json();
};

export const getTransactionById = async (id) => {
  const response = await fetchWithAuth(`transaction/${id}`, {
    method: "GET",
  });
  return response.json();
};

export const createTransaction = async (data) => {
  const response = await fetchWithAuth("transaction/new", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const updateTransaction = async (id, data) => {
  const response = await fetchWithAuth(`transaction/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response.json();
};

// ── Dashboard stats ───────────────────────────────────────────────────────────
// period: "30d" | "6m" | "1y" | "all"
export const getTransactionDashboardStats = async (period = "30d") => {
  const response = await fetchWithAuth(`transaction/stats?period=${period}`, { method: "GET" });
  return response.json();
};

// ── Export CSV ────────────────────────────────────────────────────────────────
// Returns { success, data: base64String } — client decodes and triggers download
export const exportTransactionsCsv = async (queryParams) => {
  const queryString = getQueryString(queryParams);
  const response = await fetchWithAuth(
    `transaction/export/csv?${queryString}`,
    { method: "GET" }
  );
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, message: err.message || "Export failed" };
  }
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return { success: true, data: base64 };
};

// ── Import CSV ────────────────────────────────────────────────────────────────
// Accepts the file as an ArrayBuffer (serialisable across the server-action boundary).
// The client reads the File as ArrayBuffer before calling this action.
export const importTransactionsCsv = async (fileArrayBuffer, fileName) => {
  const { auth } = await import("@/auth");
  const session  = await auth();
  const token    = session?.user?.accessToken;
  if (!token) return { success: false, message: "Not authenticated" };

  const { BASE_URL } = await import("@/services/serverApi");

  // Reconstruct Blob from the transferred ArrayBuffer
  const blob     = new Blob([fileArrayBuffer], { type: "text/csv" });
  const formData = new FormData();
  formData.append("file", blob, fileName || "transactions.csv");

  try {
    const res = await fetch(`${BASE_URL}transaction/import/csv`, {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}` },
      body:    formData,
    });
    return res.json();
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// ── Download single transaction PDF ──────────────────────────────────────────
// Returns { success, data: base64String } — client decodes and triggers download
export const downloadTransactionPdf = async (id) => {
  const response = await fetchWithAuth(`transaction/${id}/pdf`, {
    method: "GET",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return { success: false, message: err.message || "PDF generation failed" };
  }
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return { success: true, data: base64 };
};
