'use server';

import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

export const logout = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
  })
  return res.json();
}

export const fileUploadOnCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file)
  const res = await fetch(`${BASE_URL}fileupload/cloud-file`, {
    method: 'POST',
    body: formData,
  })
  return res.json();
}
