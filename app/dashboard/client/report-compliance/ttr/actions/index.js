'use server'
import { fetchWithAuth } from '@/services/serverApi';


export const createTTR = async (formData) => {
  const response = await fetchWithAuth('ttr-report/new', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  return response.json();
}

export const getTTRById = async (id) => {
  const response = await fetchWithAuth(`ttr-report/${id}`);
  return response.json();
}

export const getTTRList = async () => {
  const response = await fetchWithAuth('ttr-report');
  return response.json();
}

export const updateTTR = async (id, formData) => {
  const response = await fetchWithAuth(`ttr-report/${id}`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  })
  return response.json();
}