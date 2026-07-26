'use server'

import { fetchWithAuth } from "@/services/serverApi";

export const getCompanies = async () => {
  const response = await fetchWithAuth('customer/company/all', {
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