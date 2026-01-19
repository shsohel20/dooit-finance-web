'use server';

import { fetchWithAuth } from "@/services/serverApi";

export const getAllRules = async () => {
  const response = await fetchWithAuth('client-rule')
  return response.json()
}