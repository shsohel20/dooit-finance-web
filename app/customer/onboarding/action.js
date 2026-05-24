"use server";

import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

export const customerOnboardingStepTracking = async (data) => {
  const response = await fetchWithAuth(`onboarding-journey/background`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};
