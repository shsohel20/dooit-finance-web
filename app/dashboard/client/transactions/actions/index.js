'use server'

import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi"


export const getTransactions = async (queryParams) => {
  const queryString = getQueryString(queryParams);
  const response = await fetchWithAuth(`transaction?${queryString}`, {
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

export const createTransaction = async (data) => {
  const response = await fetchWithAuth('transaction/new', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return response.json()
}
