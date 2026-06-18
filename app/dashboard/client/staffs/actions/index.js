"use server";

import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export const getStaffs = async (params) => {
  const queryString = getQueryString(params);
  const response = await fetchWithAuth(`staff?${queryString}`);
  return response.json();
};
