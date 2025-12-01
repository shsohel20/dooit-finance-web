'use server'

import { fetchWithAuth } from '@/services/serverApi';

export const createGFS = async (formData) => {
  const response = await fetchWithAuth('gfs-report/new', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  return response.json();
}

export const getGFSById = async (id) => {
  const response = await fetchWithAuth(`gfs-report/${id}`);
  return response.json();
}

export const getGFSList = async () => {
  const response = await fetchWithAuth('gfs-report');
  return response.json();
}