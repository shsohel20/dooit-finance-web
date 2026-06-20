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
  const response = await fetchWithAuth(`clients/${clientId}/risk-questions`, {
    method: "PUT",
    body: JSON.stringify(answers),
  });
  return response.json();
};

export {
  createEmployee,
  getStuffsByRole,
  getOcrData,
  getRiskAssessmentQuestions,
  clientOnboardingInit,
  submitRiskAssessmentAnswers,
  trackOnboardingStep,
};
