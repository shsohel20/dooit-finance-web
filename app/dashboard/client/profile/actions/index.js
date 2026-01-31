"use server";

import { fetchWithAuth } from "@/services/serverApi";

export const updateProfile = async (formData, id) => {
  const url = `user/${id}`;
  console.log("url", url);
  const response = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
  return response.json();
};

export const updateClientProfile = async (formData, id) => {
  const url = `client/${id}`;
  const response = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
  return response.json();
};

export const updateBranchProfile = async (formData, id) => {
  const url = `branch/${id}`;
  console.log("branch url", url);
  const response = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(formData),
  });
  return response.json();
};
