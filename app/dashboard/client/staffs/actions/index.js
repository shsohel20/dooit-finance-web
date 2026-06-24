"use server";

import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export const getStaffs = async (params) => {
  const queryString = getQueryString(params);
  const response = await fetchWithAuth(`staff?${queryString}`);
  return response.json();
};

export const onboardStaff = async (staffId) => {
  const response = await fetchWithAuth(`staff/${staffId}/sumsub/run-aml`, {
    method: "POST",
  });
  console.log("onboard response", response);
  return response.json();
};

export const getStaffDetails = async (staffId) => {
  const response = await fetchWithAuth(`staff/${staffId}`);
  return response.json();
};
