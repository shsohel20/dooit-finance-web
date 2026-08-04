import React from "react";

import InvoiceDetails from "@/views/billing/invoices/details";

export const metadata = { title: "Invoice | Billing" };

export default async function InvoiceDetailsPage({ params }) {
  const { id } = await params;
  return <InvoiceDetails invoiceId={id} />;
}
