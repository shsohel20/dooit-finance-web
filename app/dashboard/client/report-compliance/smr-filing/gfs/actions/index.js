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

export const autoPopulatedGFSData = async (caseNumber) => {
  const response = await fetch(`http://4.227.188.44:8000/gfs_report`, {
    method: 'POST',
    body: JSON.stringify({ uid: caseNumber }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}