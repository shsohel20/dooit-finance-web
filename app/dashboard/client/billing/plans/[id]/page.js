import React from "react";

import PlanDetails from "@/views/billing/plans/details";

export const metadata = { title: "Plan details | Billing" };

export default async function PlanDetailsPage({ params }) {
  const { id } = await params;
  return <PlanDetails planId={id} />;
}
