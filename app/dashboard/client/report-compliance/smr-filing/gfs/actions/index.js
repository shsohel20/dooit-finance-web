'use server'

import { fetchWithAuth } from '@/services/serverApi';

export const createGFS = async (formData) => {
  const response = await fetchWithAuth('gfs-report', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  return response.json();
}

export const getGFSById = async (id) => {
  const response = await fetchWithAuth(`gfs-report/${id}`);
  return response.json();
}