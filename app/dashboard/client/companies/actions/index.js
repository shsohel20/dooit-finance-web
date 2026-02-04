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