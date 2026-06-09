"use server";

import { BASE_URL, fetchWithAuth, IMAGE_SERVER_URL } from "@/services/serverApi";

export const logout = async () => {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  return res.json();
};

export const fileUploadOnCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  //add headers
  const apiKey = process.env.IMAGE_API_KEY;
  // console.log("apiKey", apiKey);
  const res = await fetchWithAuth(
    `file-vault/upload`,
    {
      method: "POST",
      // headers: {
      //   "x-api-key": apiKey,
      // },
      body: formData,
    },
    false,
    false,
    true,
  );
  console.log("upload res", res);
  return res.json();
};

export const getLoggedInUser = async () => {
  const response = await fetchWithAuth("auth/me");
  return response.json();
};

export const chatWithNissa = async (message) => {
  const response = await fetchWithAuth(
    "query-json",
    {
      method: "POST",
      body: JSON.stringify(message),
    },
    false,
    true,
  );
  return response.json();
};
