import React, { Suspense } from "react";
import AddCompany from "@/views/companies/add";

export default function EditCompanyPage() {
  return (
    <div>
      <Suspense>
        <AddCompany />
      </Suspense>
    </div>
  );
}
