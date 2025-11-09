'use server';
import { fetchWithAuth } from "@/services/serverApi";

export async function getCustomers() {
  const response = await fetchWithAuth(`customer?isActive=true`, {
    method: "GET",
  });
  return response.json();

}