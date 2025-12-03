'use server';

import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

export const customerOnboarding = async (data) => {
  const response = await fetchWithAuth('customer/register/onboarding', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response.json();
}

export const checkImageLiveness = async (data) => {
  const response = fetch('http://4.227.188.44:5030/liveness-detection', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  return response
}
