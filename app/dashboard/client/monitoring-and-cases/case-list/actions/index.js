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


export const createRFI = async (data) => {
  const response = await fetchWithAuth(`rfi/new`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

export const getRFIList = async () => {
  const response = await fetchWithAuth(`rfi`);
  return response.json();
}

export const getRFIById = async (id) => {
  const response = await fetchWithAuth(`rfi/${id}`);
  return response.json();
}