"use server";

import { BASE_URL, fetchWithAuth } from "@/services/serverApi";

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

// ── Organisation already belongs to a Dooit client ───────────────────────────

/** Requester: poll approval status (`token` = the handle from `?pending=`). */
export const getXeroPendingStatus = async (token) =>
  call(`xero/signup/pending?token=${encodeURIComponent(token)}`);

/** Requester, once approved: continue into the app (single use). */
export const continueXeroPending = async (token) =>
  call("xero/signup/pending/continue", { method: "POST", body: JSON.stringify({ token }) });

/** Approver page: what the emailed link is about. Public — the token is the credential. */
export const getXeroConnectionRequest = async (token) =>
  call(`xero/connection-requests/${encodeURIComponent(token)}`);

/** Rejecting needs only the emailed token. */
export const rejectXeroConnection = async (token) =>
  call(`xero/connection-requests/${encodeURIComponent(token)}/reject`, { method: "POST" });

/**
 * Approving additionally needs a signed-in administrator of the client, so this
 * goes through `fetchWithAuth` (the session's JWT). The API enforces the rule;
 * the UI only mirrors it.
 */
export const approveXeroConnection = async (token) => {
  try {
    const res = await fetchWithAuth(`xero/connection-requests/${encodeURIComponent(token)}/approve`, {
      method: "POST",
      cache: "no-store",
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, ...body, error: body.error || body.message };
  } catch (error) {
    return { ok: false, status: 0, success: false, error: error.message };
  }
};
