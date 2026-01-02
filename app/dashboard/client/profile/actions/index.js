'use client';

import { fetchWithAuth } from "@/services/serverApi";

export const updateProfile = async (formData, id) => {
  const response = await fetchWithAuth(`user/${id}`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  })
  return response.json();
}