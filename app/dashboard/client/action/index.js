"use server";

import { fetchWithAuth } from "@/services/serverApi";

export const toggleEncryption = async (data) => {
  const endpoint = "privacy/all/bulk";
  const response = await fetchWithAuth(endpoint, { method: "PUT", body: JSON.stringify(data) });
  return response.json();
};
