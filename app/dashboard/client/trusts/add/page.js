import React, { Suspense } from "react";
import TrustForm from "@/views/trusts/form";

export default function AddTrustPage() {
  // Suspense boundary: the form reads useSearchParams (for edit mode).
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border bg-muted/40" />}>
      <TrustForm />
    </Suspense>
  );
}
