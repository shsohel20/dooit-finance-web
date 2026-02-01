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
  console.log("image server url", IMAGE_SERVER_URL);
  const res = await fetch(`${IMAGE_SERVER_URL}files/upload-api`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.IMAGE_API_KEY,
    },
    body: formData,
  });
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
