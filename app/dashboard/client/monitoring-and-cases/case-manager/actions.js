'use server';

import { fetchWithAuth } from '@/services/serverApi';

const buildQuery = (params = {}) => {
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  );
  return new URLSearchParams(clean).toString();
};

// ── Cases ─────────────────────────────────────────────────────────────────────

export const getCases = async (params = {}) => {
  const qs = buildQuery(params);
  const res = await fetchWithAuth(`cases${qs ? `?${qs}` : ''}`);
  return res.json();
};

export const getCaseById = async (id) => {
  const res = await fetchWithAuth(`cases/${id}`);
  return res.json();
};

export const createCase = async (payload) => {
  const res = await fetchWithAuth('cases', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateCase = async (id, payload) => {
  const res = await fetchWithAuth(`cases/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateCaseStatus = async (id, status, closureReason) => {
  const res = await fetchWithAuth(`cases/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, ...(closureReason && { closureReason }) }),
  });
  return res.json();
};

export const assignInvestigators = async (id, investigatorIds) => {
  const res = await fetchWithAuth(`cases/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ investigatorIds }),
  });
  return res.json();
};

// ── Alert linkage ─────────────────────────────────────────────────────────────

export const getCaseAlerts = async (id) => {
  const res = await fetchWithAuth(`cases/${id}/alerts`);
  return res.json();
};

export const linkAlerts = async (id, alertIds) => {
  const res = await fetchWithAuth(`cases/${id}/alerts`, {
    method: 'POST',
    body: JSON.stringify({ alertIds }),
  });
  return res.json();
};

export const unlinkAlert = async (id, alertId) => {
  const res = await fetchWithAuth(`cases/${id}/alerts/${alertId}`, {
    method: 'DELETE',
  });
  return res.json();
};

// ── SAR ───────────────────────────────────────────────────────────────────────

export const fileSAR = async (id, sarNotes) => {
  const res = await fetchWithAuth(`cases/${id}/sar`, {
    method: 'POST',
    body: JSON.stringify({ sarNotes }),
  });
  return res.json();
};

// ── Notes ─────────────────────────────────────────────────────────────────────

export const getCaseNotes = async (caseId) => {
  const res = await fetchWithAuth(`cases/${caseId}/notes`);
  return res.json();
};

export const addNote = async (caseId, payload) => {
  const res = await fetchWithAuth(`cases/${caseId}/notes`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
};

// ── Audit ─────────────────────────────────────────────────────────────────────

export const getAuditLog = async (caseId) => {
  const res = await fetchWithAuth(`cases/${caseId}/audit`);
  return res.json();
};

// ── Investigators ─────────────────────────────────────────────────────────────

export const getInvestigators = async () => {
  const res = await fetchWithAuth('cases/investigators');
  return res.json();
};

// ── Alerts (used to pick alerts to link / escalate) ───────────────────────────

export const getAlerts = async (params = {}) => {
  const qs = buildQuery(params);
  const res = await fetchWithAuth(`alert${qs ? `?${qs}` : ''}`);
  return res.json();
};

export const reviewAlert = async (id) => {
  const res = await fetchWithAuth(`alert/${id}/review`, { method: 'PUT' });
  return res.json();
};

export const dismissAlert = async (id, payload = {}) => {
  const res = await fetchWithAuth(`alert/${id}/dismiss`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const escalateAlertToCase = async (id, payload = {}) => {
  const res = await fetchWithAuth(`alert/${id}/escalate`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
};
