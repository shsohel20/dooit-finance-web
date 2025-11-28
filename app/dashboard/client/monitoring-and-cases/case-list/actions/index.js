'use server'

import { fetchWithAuth } from "@/services/serverApi";

const endpoint = 'alert'

export const getCaseDetails = async (id) => {
  const response = await fetchWithAuth(`${endpoint}/${id}`);
  return response.json();
}

export const getCaseList = async () => {
  const response = await fetchWithAuth(`${endpoint}`);
  return response.json();
}