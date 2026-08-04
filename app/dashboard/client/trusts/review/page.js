import React, { Suspense } from "react";
import TrustReview from "@/views/trusts/review";

export default function TrustReviewPage() {
  return (
    <Suspense fallback={<div className="h-64 animate-pulse rounded-xl border bg-muted/40" />}>
      <TrustReview />
    </Suspense>
  );
}
