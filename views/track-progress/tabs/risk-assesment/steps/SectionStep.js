"use client";
import React from "react";
import FieldRenderer from "./fields/FieldRenderer";

const CO_KEYS = new Set(["co_name", "co_email", "co_phone"]);
const SM_KEYS = new Set(["sm_name", "sm_email"]);

function renderFields(fields, control) {
  const elements = [];
  const seen = new Set();

  fields.forEach((field) => {
    if (seen.has(field.key)) return;

    if (CO_KEYS.has(field.key)) {
      const coFields = fields.filter((f) => CO_KEYS.has(f.key));
      coFields.forEach((f) => seen.add(f.key));
      elements.push(
        <div key="compliance-officer-group" className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Compliance Officer
          </p>
          <div className="grid grid-cols-3 gap-4">
            {coFields.map((f) => (
              <FieldRenderer key={f.key} field={f} control={control} />
            ))}
          </div>
        </div>
      );
      return;
    }

    if (SM_KEYS.has(field.key)) {
      const smFields = fields.filter((f) => SM_KEYS.has(f.key));
      smFields.forEach((f) => seen.add(f.key));
      elements.push(
        <div key="senior-manager-group" className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Senior Manager
          </p>
          <div className="grid grid-cols-2 gap-4">
            {smFields.map((f) => (
              <FieldRenderer key={f.key} field={f} control={control} />
            ))}
          </div>
        </div>
      );
      return;
    }

    seen.add(field.key);
    elements.push(
      <FieldRenderer key={field.key} field={field} control={control} />
    );
  });

  return elements;
}

export default function SectionStep({ section, form }) {
  const { label, desc, fields = [] } = section;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-1">{label}</h2>
      <p className="text-sm text-muted-foreground mb-6">{desc}</p>
      <div className="flex flex-col gap-5">{renderFields(fields, form.control)}</div>
    </div>
  );
}
