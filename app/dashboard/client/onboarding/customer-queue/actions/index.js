'use server';
import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export async function getCustomers(queryParams) {
  const queryString = getQueryString(queryParams);
  const url = `customer?isActive=true&${queryString}`;
  console.log('url => ', url);
  const response = await fetchWithAuth(url, {
    method: "GET",
  });

  return response.json();
}

export const sendInvite = async (inviteData) => {
  const response = await fetchWithAuth('customer/invite', {
    method: 'POST',
    body: JSON.stringify(inviteData)
  })
  return response.json();
}

export const getCustomerById = async (id) => {
  const response = await fetchWithAuth(`customer/${id}`, {
    method: 'GET',
  })
  return response.json();
}

export const createInstantReport = async (reportData) => {
  const response = await fetchWithAuth('report-notify/new', {
    method: 'POST',
    body: JSON.stringify(reportData)
  })
  return response.json();
}