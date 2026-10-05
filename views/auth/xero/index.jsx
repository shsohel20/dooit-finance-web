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
  getXeroSignupPrefill,
  startXeroSignup,
} from "@/app/auth/xero/actions";

const DASHBOARD = "/dashboard/client";

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

export default function XeroSignup({ ticket, loginCode, error, message }) {
  const router = useRouter();
  const started = useRef(false); // StrictMode runs effects twice; each secret is single-use

  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState(null);
  const [prefill, setPrefill] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [form, setForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [signingIn, setSigningIn] = useState(false);

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
    } else if (!error) {
      begin(); // bare /auth/xero (e.g. Xero App Store launch) → go straight to Xero
    }
  }, [ticket, loginCode, error, begin, signInWithCode]);

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
