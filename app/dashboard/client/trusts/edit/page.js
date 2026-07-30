import React, { Suspense } from "react";
import TrustForm from "@/views/trusts/form";

// Same stepped intake wizard as /trusts/add — editing walks the same steps,
// pre-filled from the stored record (docs/65 Step 67).
export default function EditTrustPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border bg-muted/40" />}>
      <TrustForm />
    </Suspense>
  );
}
