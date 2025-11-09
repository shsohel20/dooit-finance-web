import React from "react";
import { ClientForm } from "../(components)/ClientForm";
export default async function ClientEditFormPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <ClientForm id={id} />
    </div>
  );
}
