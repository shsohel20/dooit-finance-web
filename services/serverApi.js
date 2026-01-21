export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6830/api/v1/";
export const AI_URL = process.env.NEXT_PUBLIC_AI_BASE_URL || "http://4.227.188.44:8000/";
export const NISA_URL = process.env.NEXT_PUBLIC_NISA_BASE_URL || "http://localhost:8000/";

import { auth } from "@/auth";

export async function fetchWithAuth(endpoint, options = {}, isAi = false, isNisa = false) {
  const session = await auth(); // ✅ works anywhere on the server
  const token = session?.user?.accessToken;
  if (!token) {
    console.log("No valid token found. User might not be logged in.");
  }
  const allOptions = {
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...options,
  };

  try {
    const res = await fetch(`${isAi ? AI_URL : isNisa ? NISA_URL : BASE_URL}${endpoint}`, {
      ...allOptions,
    });

    return res;
  } catch (error) {
    console.error("Error fetching data:", error);
    return { success: false, error: error.message };
  }
}
