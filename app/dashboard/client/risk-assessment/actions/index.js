"use server";

import { fetchWithAuth } from "@/services/serverApi";

export const getCustomers = async (query) => {
  const url = `risk-assessment/utils/customers?q=${query}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data;
};

export const getRiskFactors = async () => {
  const url = `risk-assessment/utils/risk-factors`;
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
