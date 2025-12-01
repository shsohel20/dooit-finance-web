'use server'

import { fetchWithAuth } from '@/services/serverApi';

export const createIFTI = async (formData) => {
  const response = await fetchWithAuth('ifti-report/new', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  // revalidateTag('iftis');
  return response.json();
}

export const getIFTIById = async (id) => {
  const response = await fetchWithAuth(`ifti-report/${id}`, {
    method: 'GET'
  })
  return response.json();
}

export const updateIFTI = async (id, formData) => {
  const response = await fetchWithAuth(`ifti-report/${id}`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  })
  return response.json();
}

export const getIFTIList = async () => {
  const response = await fetchWithAuth('ifti-report', {
    method: 'GET'
  })
  return response.json();
}