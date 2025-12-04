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
  const response = await fetch('http://4.227.188.44:5030/liveness-detection', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await response.json();
  return json; // must return plain object
};
