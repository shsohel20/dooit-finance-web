'use server';

import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

export const individualCustomerRegistration = async (data) => {
  const response = await fetchWithAuth('customer/register/onboarding', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response.json();
}