"use server";

import { fetchWithAuth } from "@/services/serverApi";

export const createModule = async (data) => {
  const response = await fetchWithAuth("training-modules", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
};
