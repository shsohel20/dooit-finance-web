import React from "react";

import PlanAccess from "@/views/billing/plans/access";

export const metadata = { title: "Plan access | Billing" };

export default async function PlanAccessPage({ params }) {
  const { id } = await params;
  return <PlanAccess planId={id} />;
}
