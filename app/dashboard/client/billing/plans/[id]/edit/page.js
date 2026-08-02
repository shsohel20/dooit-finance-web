import React from "react";

import PlanBuilder from "@/views/billing/plans/builder";

export const metadata = { title: "Edit plan | Billing" };

// Editing reuses the builder — a draft is the same shape as a new plan, and
// keeping one form means the create and edit paths cannot drift apart.
export default async function EditPlanPage({ params }) {
  const { id } = await params;
  return <PlanBuilder planId={id} />;
}
