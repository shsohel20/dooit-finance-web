"use client";

import { PersonOrganisationForm } from "../person-organisation-form";

export function PartC({ data, updateData }) {
  const handleUpdate = (person) => {
    updateData({ personOrganisation: [person] });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Provide as many details as possible about the person/organisation to
        which the suspicious matter relates. You may also provide a description
        in Part E.
      </p>
      <PersonOrganisationForm
        data={data.personOrganisation?.[0]}
        onUpdate={handleUpdate}
        showCustomerQuestion
      />
    </div>
  );
}
