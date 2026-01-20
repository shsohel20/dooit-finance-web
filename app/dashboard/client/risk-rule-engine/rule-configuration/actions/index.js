'use server';

import { fetchWithAuth } from "@/services/serverApi";

export const getAllRules = async () => {
  const response = await fetchWithAuth('client-rule')
  return response.json()
}

export const getRuleById = async (id) => {
  const response = await fetchWithAuth(`client-rule/${id}`)
  return response.json()
}

export const updateRule = async (id, data) => {
  const response = await fetchWithAuth(`client-rule/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  return response.json()
}