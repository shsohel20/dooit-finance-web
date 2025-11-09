'use server'

import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

export const inviteTokenValidation = async (token, cid) => {
  const response = await fetch(`${BASE_URL}customer/invite/validate?token=${token}&cid=${cid}`, {
    method: 'GET',
  })
  return response.json();
}