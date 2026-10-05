"use server";

import { BASE_URL } from "@/services/serverApi";

// "Sign up with Xero" — public endpoints. None of these carry a session: each
// step is authorised by a one-time secret (ticket / loginCode) issued by the API.

const call = async (endpoint, options) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, ...body };
  } catch (error) {
    return { ok: false, status: 0, success: false, error: error.message };
  }
};

/** Returns `{ data: { url } }` — where to send the browser to consent at Xero. */
export const startXeroSignup = async () => call("xero/signup/start");

/** What Xero knows about the organisation, to pre-fill the registration form. */
export const getXeroSignupPrefill = async (ticket) =>
  call(`xero/signup/prefill?ticket=${encodeURIComponent(ticket)}`);

/** Creates the account + client and returns `{ data: { loginCode } }`. */
export const completeXeroSignup = async (ticket, form) =>
  call("xero/signup/complete", { method: "POST", body: JSON.stringify({ ticket, ...form }) });
