'use server'

import { fetchWithAuth } from "@/services/serverApi";

export const inviteTokenValidation = async (token, cid) => {
  const response = await fetchWithAuth(`customer/invite/validate?token=${token}&cid=${cid}`, {
    method: 'GET',
  })
  return response.json();
}