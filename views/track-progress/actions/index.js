"use server";

import { fetchWithAuth } from "@/services/serverApi";

const createEmployee = async (employeeData) => {
  const response = await fetchWithAuth("staff", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
  return response.json();
};

const getStuffsByRole = async (roleid) => {
  const response = await fetchWithAuth(`staff/role/${roleid}`);
  return response.json();
};

const getOcrData = async (payload) => {
  const response = await fetchWithAuth(`ocr/document`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.json();
};

const getRiskAssessmentQuestions = async () => {
  const response = await fetchWithAuth(`client/risk-questions/schema`);
  return response.json();
};

const clientOnboardingInit = async (data) => {
  const response = await fetchWithAuth(`onboarding-step/init`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return response.json();
};

const trackOnboardingStep = async (payload) => {
  const response = await fetchWithAuth(`onboarding-step/step`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return response.json();
};

const submitRiskAssessmentAnswers = async (clientId, answers) => {
  const url = `client/${clientId}/risk-questions`;
  const response = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(answers),
  });
  return response.json();
};

const getRiskRegisters = async (entityName) => {
  const response = await fetchWithAuth(`risk-register/by-entity/${entityName}`);
  return response.json();
};

// Draft → In Review
const submitRiskRegister = async (id) => {
  const response = await fetchWithAuth(`risk-register/${id}/submit`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return response.json();
};

// Re-run the scoring engine with stored answers/ctrlEff
const recalculateRiskRegister = async (id) => {
  const response = await fetchWithAuth(`risk-register/${id}/recalculate`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return response.json();
};

// Reviewer override of a single scenario row (L, C, control effectiveness,
// reviewer notes, status). Returns { row, summary } on success.
const overrideRiskRegisterScenario = async (id, ref, payload) => {
  const response = await fetchWithAuth(
    `risk-register/${id}/scenarios/${encodeURIComponent(ref)}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
  return response.json();
};

// Streams a styled .xls workbook — returns the raw HTML string so the
// client can build a Blob and trigger the download.
const exportRiskRegisterExcel = async (id) => {
  const response = await fetchWithAuth(`risk-register/${id}/export`);
  if (!response || typeof response.text !== "function") {
    return { success: false, error: "Network error while exporting" };
  }
  if (!response.ok) {
    try {
      const errJson = await response.json();
      return { success: false, error: errJson.error || "Export failed" };
    } catch {
      return { success: false, error: "Export failed" };
    }
  }
  const html = await response.text();
  return { success: true, data: html };
};

export {
  createEmployee,
  getStuffsByRole,
  getOcrData,
  getRiskAssessmentQuestions,
  clientOnboardingInit,
  submitRiskAssessmentAnswers,
  trackOnboardingStep,
  getRiskRegisters,
  submitRiskRegister,
  recalculateRiskRegister,
  overrideRiskRegisterScenario,
  exportRiskRegisterExcel,
};
