export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6830/api/v1/";
export const AI_URL = process.env.NEXT_PUBLIC_AI_BASE_URL || "http://4.227.188.44:8000/";
export const NISA_URL = process.env.NEXT_PUBLIC_NISA_BASE_URL || "http://localhost:8000/";
export const IMAGE_SERVER_URL = process.env.NEXT_PUBLIC_IMAGE_SERVER_URL;

import { auth } from "@/auth";

export async function fetchWithAuth(endpoint, options = {}, isAi = false, isNisa = false) {
  const session = await auth(); // ✅ works anywhere on the server
  const token = session?.user?.accessToken;
  if (!token) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
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
    const endpointUrl = `${isAi ? AI_URL : isNisa ? NISA_URL : BASE_URL}${endpoint}`;
    const res = await fetch(endpointUrl, {
      ...allOptions,
    });

    return res;
  } catch (error) {
    const isConnRefused = error?.cause?.code === "ECONNREFUSED";
    if (!isConnRefused) console.error("[fetchWithAuth] Unexpected fetch error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Service unavailable", error: error.message }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
