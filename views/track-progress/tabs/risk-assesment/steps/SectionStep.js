"use client";
import React from "react";
import { Controller } from "react-hook-form";
import FieldRenderer from "./fields/FieldRenderer";
import RatingField from "./fields/RatingField";

const CO_KEYS = new Set(["co_name", "co_email", "co_phone"]);
const SM_KEYS = new Set(["sm_name", "sm_email"]);

function RatingRow({ field, control }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{field.label}</p>
        {field.hint && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{field.hint}</p>
        )}
      </div>
      <div className="shrink-0">
        <Controller
          name={field.key}
          control={control}
          render={({ field: rhfField }) => (
            <RatingField
              value={rhfField.value}
              onChange={rhfField.onChange}
              min={field.min}
              max={field.max}
              ratingLabels={field.ratingLabels}
            />
          )}
        />
      </div>
    </div>
  );
}

function renderFields(fields, form) {
  const control = form.control;
  const elements = [];
  const seen = new Set();

  fields.forEach((field) => {
    if (seen.has(field.key)) return;

    if (field.type === "rating") {
      seen.add(field.key);
      elements.push(<RatingRow key={field.key} field={field} control={control} form={form} />);
      return;
    }

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
        </div>,
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
              <FieldRenderer key={f.key} field={f} control={control} form={form} />
            ))}
          </div>
        </div>,
      );
      return;
    }

    seen.add(field.key);
    elements.push(<FieldRenderer key={field.key} field={field} control={control} form={form} />);
  });

  return elements;
}

export default function SectionStep({ section, form }) {
  const { label, desc, fields = [] } = section;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-1">{label}</h2>
      <p className="text-sm text-muted-foreground mb-6">{desc}</p>
      <div className="flex flex-col gap-5">{renderFields(fields, form)}</div>
    </div>
  );
}
