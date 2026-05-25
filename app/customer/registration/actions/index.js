"use server";

import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

export const customerOnboarding = async (data) => {
  const response = await fetchWithAuth("customer/register/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};

export const checkImageLiveness = async (data) => {
  // console.log('checkImageLiveness data', JSON.stringify(data, null, 2))
  const response = await fetchWithAuth("onboarding-journey/liveness-detection", {
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await response.json();
  console.log("checkImageLiveness response", json);
  return json; // must return plain object
};

export const getDataFromDocuments = async (formData) => {
  const response = await fetchWithAuth("onboarding-journey/ocr-document", {
    method: "POST",
    // headers: { "Content-Type": "application/json" },
    body: formData,
  });
  const json = await response.json();
  return json;
};

export const verifyDocument = async (data) => {
  const response = await fetchWithAuth("onboarding-journey/verify-doc-face", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await response.json();
  return json;
};
