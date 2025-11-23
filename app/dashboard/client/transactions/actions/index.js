'use server'

import { fetchWithAuth } from "@/services/serverApi"


export const getTransactions = async () => {
  const response = await fetchWithAuth('transaction', {
    method: 'GET',
  })
  return response.json()
}