'use server'

import { fetchWithAuth } from "@/services/serverApi"
import { revalidateTag } from "next/cache"


export async function createBranch(formData) {
  const response = await fetchWithAuth('branch/new', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
  const res = await response.json()
  if (res.success || res.succeed) {
    revalidateTag('branches')
  }
  return res
}


export async function getBranches() {
  const response = await fetchWithAuth('branch', {
    method: 'GET',
    next: {
      tags: ["branches"],
    }
  })
  return response.json()
}

export async function getBranchById(id) {
  const response = await fetchWithAuth(`branch/${id}`, {
    method: 'GET'
  })
  return response.json()
}