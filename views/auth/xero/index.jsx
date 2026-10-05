"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  completeXeroSignup,
  continueXeroPending,
  getXeroPendingStatus,
  getXeroSignupPrefill,
  startXeroSignup,
} from "@/app/auth/xero/actions";

const DASHBOARD = "/dashboard/client";
const POLL_MS = 4000;
// The pending handle is a secret: keep it out of the URL/history/referrers and
// in this tab's session storage so a reload can resume the wait.
const PENDING_KEY = "dooit.xero.pending";

const store = {
  get: () => {
    try {
      return window.sessionStorage.getItem(PENDING_KEY);
    } catch {
      return null;
    }
  },
  set: (v) => {
    try {
      window.sessionStorage.setItem(PENDING_KEY, v);
    } catch {}
  },
  clear: () => {
    try {
      window.sessionStorage.removeItem(PENDING_KEY);
    } catch {}
  },
};

const ERROR_TITLES = {
  denied: "Xero sign-up was cancelled",
  exists: "You already have a Dooit account",
  invalid_state: "That sign-up link expired",
};

function Status({ title, description, children }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent className="grid gap-3">{children}</CardContent>}
    </Card>
  );
}

function Spinner({ title, description }) {
  return (
    <Status title={title} description={description}>
      <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" aria-label="Loading" />
    </Status>
  );
}

/**
 * Shown when the Xero organisation already belongs to a Dooit client: we have
 * asked that client's administrator to confirm, and wait for the answer.
 */
function PendingApproval({ token, onSignedIn }) {
  const router = useRouter();
  const [info, setInfo] = useState(null);
  const [gone, setGone] = useState(false);
  const [continuing, setContinuing] = useState(false);

  useEffect(() => {
    let stopped = false;
    let timer;
    const tick = async () => {
      const res = await getXeroPendingStatus(token);
      if (stopped) return;
      if (!res.ok) return setGone(true);
      setInfo(res.data);
      if (res.data.status === "PENDING_CONFIRMATION") timer = setTimeout(tick, POLL_MS);
    };
    tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [token]);

  const restart = () => {
    store.clear();
    window.location.href = "/auth/xero";
  };

  const onContinue = async () => {
    setContinuing(true);
    const res = await continueXeroPending(token);
    if (!res.ok) {
      setContinuing(false);
      toast.error(res.error || "Could not continue. Please sign in to Dooit.");
      return;
    }
    store.clear();
    if (res.data.next === "signed_in") return onSignedIn(res.data.loginCode);
    toast.success("Connection approved. Sign in to Dooit to continue.");
    router.replace("/auth/login");
  };

  if (gone || info?.status === "EXPIRED") {
    return (
      <Status
        title="This request has expired"
        description="The administrator didn't respond in time, or the request is no longer valid. You can start again."
      >
        <Button onClick={restart}>Start again with Xero</Button>
      </Status>
    );
  }

  if (!info) return <Spinner title="Checking your request…" />;

  if (info.status === "REJECTED") {
    return (
      <Status
        title="Request declined"
        description="The administrator of the Dooit account declined this connection, so nothing was connected."
      >
        <Button variant="outline" onClick={() => router.push("/auth/login")}>
          Go to login
        </Button>
      </Status>
    );
  }

  if (info.status === "APPROVED") {
    return (
      <Status
        title="Connection approved"
        description={`${info.organisation} is now connected to Dooit.`}
      >
        <Button onClick={onContinue} disabled={continuing}>
          {continuing && <Loader2 className="animate-spin" />}
          Continue to Dooit
        </Button>
      </Status>
    );
  }

  return (
    <Status
      title="Waiting for confirmation"
      description="This Xero organisation is already associated with a Dooit client."
    >
      <p className="text-sm text-muted-foreground">
        For security, we need confirmation from the existing client administrator before connecting this Xero
        organisation. We&apos;ve sent a confirmation request to <strong>{info.maskedEmail}</strong>.
      </p>
      <p className="text-sm text-muted-foreground">Once it&apos;s approved, you can continue here.</p>
      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground" role="status">
        <Loader2 className="size-3 animate-spin" />
        Waiting for approval…
      </p>
      <Button variant="outline" onClick={() => router.push("/auth/login")}>
        Go to login
      </Button>
    </Status>
  );
}

export default function XeroSignup({ ticket, loginCode, pending, error, message }) {
  const router = useRouter();
  const started = useRef(false); // StrictMode runs effects twice; each secret is single-use

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(null);
  const [prefill, setPrefill] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [pendingToken, setPendingToken] = useState(null);

  const begin = useCallback(async () => {
    setStarting(true);
    setStartError(null);
    const res = await startXeroSignup();
    if (res.ok && res.data?.url) {
      window.location.href = res.data.url;
      return;
    }
    setStartError(res.error || "Could not start Xero sign-up");
    setStarting(false);
  }, []);

  const signInWithCode = useCallback(
    async (code) => {
      setSigningIn(true);
      const res = await signIn("xero", { loginCode: code, redirect: false });
      if (res?.error) {
        toast.error(res.code || "Xero sign-in failed. Please try again.");
        setSigningIn(false);
        setLoadError("Your sign-in link has expired. Please start again.");
        return;
      }
      router.replace(DASHBOARD);
    },
    [router]
  );

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (loginCode) {
      signInWithCode(loginCode);
    } else if (ticket) {
      getXeroSignupPrefill(ticket).then((res) => {
        if (!res.ok) return setLoadError(res.error || "This sign-up link has expired.");
        const p = res.data.prefill || {};
        setPrefill(res.data);
        setForm({
          name: p.name || "",
          clientType: "",
          clientTypeId: "",
          registrationNumber: p.registrationNumber || "",
          taxId: p.taxId || "",
          phone: p.phone || "",
          website: p.website || "",
          address: {
            street: p.address?.street || "",
            city: p.address?.city || "",
            state: p.address?.state || "",
            zipcode: p.address?.zipcode || "",
            country: p.address?.country || "",
          },
        });
      });
    } else if (pending) {
      store.set(pending);
      setPendingToken(pending);
      router.replace("/auth/xero"); // take the secret out of the address bar
    } else if (!error) {
      // A reload while waiting resumes the wait instead of starting a second request.
      const saved = store.get();
      if (saved) setPendingToken(saved);
      else begin(); // bare /auth/xero (e.g. Xero App Store launch) → go straight to Xero
    }
  }, [ticket, loginCode, pending, error, begin, signInWithCode, router]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setAddr = (key) => (e) =>
    setForm((f) => ({ ...f, address: { ...f.address, [key]: e.target.value } }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.clientType) return toast.error("Please choose your entity type");
    setSubmitting(true);
    const res = await completeXeroSignup(ticket, form);
    if (!res.ok) {
      setSubmitting(false);
      // Name/ABN clashes etc. are fixable on the form; an expired link is not.
      if (res.status === 410 || res.status === 409) setLoadError(res.error);
      else toast.error(res.error || "Could not create your account");
      return;
    }
    await signInWithCode(res.data.loginCode);
  };

  // ── Error from the API callback ────────────────────────────────────────────
  if (error || loadError || startError) {
    return (
      <Status
        title={ERROR_TITLES[error] || "Something went wrong"}
        description={loadError || startError || message || "We couldn't complete the Xero sign-up."}
      >
        <Button onClick={() => (window.location.href = "/auth/xero")}>Try again with Xero</Button>
        <Button variant="outline" onClick={() => router.push("/auth/login")}>
          Go to login
        </Button>
      </Status>
    );
  }

  if (loginCode || signingIn) {
    return <Spinner title="Signing you in…" description="Your Xero account is verified." />;
  }

  if (pendingToken) return <PendingApproval token={pendingToken} onSignedIn={signInWithCode} />;

  if (ticket) {
    if (!form) return <Spinner title="Loading your Xero details…" />;

    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Finish setting up {prefill.organisation}</CardTitle>
          <CardDescription>
            We filled this in from Xero. Check it, choose your entity type and continue — Xero is
            already connected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="xero-email">Email (from Xero)</Label>
              <Input id="xero-email" value={prefill.email} readOnly disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="xero-name">Organisation name</Label>
              <Input id="xero-name" value={form.name} onChange={set("name")} required />
            </div>

            <div className="grid gap-2">
              <Label>Entity type</Label>
              <Select
                value={form.clientTypeId}
                onValueChange={(id) => {
                  const t = prefill.entityTypes.find((x) => x.id === id);
                  setForm((f) => ({ ...f, clientTypeId: id, clientType: t?.name || "" }));
                }}
              >
                <SelectTrigger aria-label="Entity type">
                  <SelectValue placeholder="Select your entity type" />
                </SelectTrigger>
                <SelectContent>
                  {prefill.entityTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="xero-reg">ABN / registration no.</Label>
                <Input id="xero-reg" value={form.registrationNumber} onChange={set("registrationNumber")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xero-tax">Tax ID</Label>
                <Input id="xero-tax" value={form.taxId} onChange={set("taxId")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xero-phone">Phone</Label>
                <Input id="xero-phone" value={form.phone} onChange={set("phone")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xero-web">Website</Label>
                <Input id="xero-web" value={form.website} onChange={set("website")} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="xero-street">Street address</Label>
              <Input id="xero-street" value={form.address.street} onChange={setAddr("street")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="xero-city">City</Label>
                <Input id="xero-city" value={form.address.city} onChange={setAddr("city")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xero-state">State</Label>
                <Input id="xero-state" value={form.address.state} onChange={setAddr("state")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xero-zip">Postcode</Label>
                <Input id="xero-zip" value={form.address.zipcode} onChange={setAddr("zipcode")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="xero-country">Country</Label>
                <Input id="xero-country" value={form.address.country} onChange={setAddr("country")} />
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="animate-spin" />}
              Create account
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return <Spinner title="Redirecting to Xero…" description={starting ? "One moment." : undefined} />;
}
