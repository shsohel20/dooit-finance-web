'use server'

import { fetchWithAuth } from "@/services/serverApi"


export const getTransactions = async () => {
  const response = await fetchWithAuth('transaction', {
    method: 'GET',
  })
  return response.json()
}

export const getTransactionById = async (id) => {
  const response = await fetchWithAuth(`transaction/${id}`, {
    method: 'GET',
  })
  console.log(' transaction response', response);
  return response.json()
}