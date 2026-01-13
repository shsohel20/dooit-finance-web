'use server';

import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";


const getAllRoles = async () => {
  const response = await fetchWithAuth('role');
  return response.json();
}

const getAllUsers = async (queryParams) => {
  const queryString = getQueryString(queryParams);
  const response = await fetchWithAuth(`user?${queryString}`);
  return response.json();
}

export { getAllRoles, getAllUsers };