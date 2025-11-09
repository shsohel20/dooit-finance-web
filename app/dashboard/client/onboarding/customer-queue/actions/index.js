'use server';
import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export async function getCustomers(queryParams) {
  const queryString = getQueryString(queryParams);
  const response = await fetchWithAuth(`customer?isActive=true&${queryString}`, {
    method: "GET",
  });
  console.log('response => ', response);
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