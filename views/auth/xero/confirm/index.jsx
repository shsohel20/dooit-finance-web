"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { approveXeroConnection, rejectXeroConnection } from "@/app/auth/xero/actions";

function Notice({ icon, title, description, children }) {
  return (
    <Card>
      <CardHeader className="text-center">
        {icon && <div className="mx-auto mb-2">{icon}</div>}
        <CardTitle className="text-xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {children && <CardContent className="grid gap-3">{children}</CardContent>}
    </Card>
  );
}

export default function ConfirmXeroConnection({ token, request, error, signedIn, intent }) {
  const router = useRouter();
  const [busy, setBusy] = useState(null); // "approve" | "reject"
  const [outcome, setOutcome] = useState(null); // "approved" | "rejected"
  const [problem, setProblem] = useState(null);

  if (!request) {
    return (
      <Notice
        icon={<XCircle className="size-8 text-rose-600" />}
        title="Link not valid"
        description={error || "This confirmation link is invalid or has expired."}
      />
    );
  }

  if (outcome === "approved") {
    return (
      <Notice
        icon={<CheckCircle2 className="size-8 text-emerald-600" />}
        title="Xero connected"
        description={`${request.organisation} is now connected to your Dooit account. We've let the requester know.`}
      >
        <Button onClick={() => router.push("/dashboard/client/system-settings/xero")}>Go to Xero settings</Button>
      </Notice>
    );
  }

  if (outcome === "rejected") {
    return (
      <Notice
        icon={<XCircle className="size-8 text-slate-500" />}
        title="Request rejected"
        description="Nothing was connected and your account is unchanged. We've let the requester know."
      />
    );
  }

  if (request.status !== "PENDING_CONFIRMATION") {
    const text = {
      APPROVED: "This request has already been approved.",
      REJECTED: "This request was rejected.",
      EXPIRED: "This request has expired. If it's still needed, ask the requester to start again from Xero.",
    }[request.status];
    return <Notice title="Nothing to do" description={text || "This request has already been handled."} />;
  }

  const act = async (kind) => {
    setBusy(kind);
    setProblem(null);
    const res = kind === "approve" ? await approveXeroConnection(token) : await rejectXeroConnection(token);
    setBusy(null);
    if (res.ok) {
      setOutcome(kind === "approve" ? "approved" : "rejected");
    } else {
      setProblem(res.error || "Something went wrong. Please try again.");
      toast.error(res.error || "Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Connect Xero organisation</CardTitle>
        <CardDescription>Review this request before connecting.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        <dl className="grid gap-3 rounded-lg border p-4 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Organisation</dt>
            <dd className="font-medium">{request.organisation}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Requested by</dt>
            <dd className="font-medium">
              {request.requester?.name && <div>{request.requester.name}</div>}
              <div>{request.requester?.email}</div>
            </dd>
          </div>
        </dl>

        <p className="text-sm text-muted-foreground">
          This will connect this Xero organisation to your existing Dooit client account. It does not give the
          requester access to your account.
        </p>

        {!signedIn && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
            To approve, sign in as the administrator of the Dooit account, then open this link again. You can reject
            without signing in.
          </div>
        )}

        {problem && (
          <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {problem}
          </div>
        )}

        <div className="grid gap-2 sm:grid-cols-2">
          {signedIn ? (
            <Button onClick={() => act("approve")} disabled={!!busy} variant={intent === "reject" ? "outline" : "default"}>
              {busy === "approve" && <Loader2 className="animate-spin" />}
              Approve Connection
            </Button>
          ) : (
            <Button onClick={() => router.push("/auth/login")} variant={intent === "reject" ? "outline" : "default"}>
              Sign in to approve
            </Button>
          )}
          <Button variant={intent === "reject" ? "default" : "outline"} onClick={() => act("reject")} disabled={!!busy}>
            {busy === "reject" && <Loader2 className="animate-spin" />}
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
