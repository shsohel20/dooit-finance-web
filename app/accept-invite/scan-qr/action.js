"use server";
import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

export const sendInviteForScanQR = async (inviteData) => {
  const response = await fetch(`${BASE_URL}customer/invite-from-qr`, {
    method: "POST",
    body: JSON.stringify(inviteData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
};
