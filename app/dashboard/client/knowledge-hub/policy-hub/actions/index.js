'use server';
import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export const getAllPolicyDocuments = async (queryParams) => {
  try {
    const response = await fetchWithAuth(`policy-hub`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching policy documents:", error);
    return [];
  }
};

export const generatePolicy = async (data) => {
  try {
    const response = await fetchWithAuth(`policy-hub/generate`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error generating policy:", error);
    return [];
  }
};

export const getPolicyById = async (id) => {
  try {
    const response = await fetchWithAuth(`policy-hub/${id}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching policy by id:", error);
    return [];
  }
};
export const updatePolicy = async (id, data) => {
  try {
    const response = await fetchWithAuth(`policy-hub/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    const res = await response.json();
    return res;
  } catch (error) {
    console.error("Error updating policy:", error);
    return [];
  }
};