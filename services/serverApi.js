

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6830/api/v1/";


import { auth } from "@/auth";

export async function fetchWithAuth(endpoint, options = {}) {
  const session = await auth(); // ✅ works anywhere on the server
  const token = session?.user?.accessToken;
  if (!token) {
    throw new Error("No valid token found. User might not be logged in.");
  }
  const allOptions = {
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    ...options,
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...allOptions,
  });
  console.log("allOptions", allOptions);

  return res;
}
