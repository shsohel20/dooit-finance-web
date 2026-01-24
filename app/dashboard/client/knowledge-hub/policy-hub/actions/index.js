import { getQueryString } from "@/lib/utils";
import { fetchWithAuth } from "@/services/serverApi";

export const getAllPolicyDocuments = async (queryParams) => {
  try {
    const response = await fetch(`http://31.97.71.194:5052/api/v1/company/${queryParams}`, {
      method: "GET",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching policy documents:", error);
    return [];
  }
};
