"use client";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import SingleSelectField from "./SingleSelectField";
import MultiSelectField from "./MultiSelectField";
import YesNoField from "./YesNoField";
import RatingField from "./RatingField";

function FieldInput({ field, rhfField }) {
  const { type, placeholder, options, min, max, ratingLabels } = field;

  switch (type) {
    case "text":
    case "email":
      return <Input {...rhfField} type={type} placeholder={placeholder} />;
    case "date":
      return <Input {...rhfField} type="date" />;
    case "single-select":
      return (
        <SingleSelectField value={rhfField.value} onChange={rhfField.onChange} options={options} />
      );
    case "multi-select":
      return (
        <MultiSelectField value={rhfField.value} onChange={rhfField.onChange} options={options} />
      );
    case "yes-no":
      return <YesNoField value={rhfField.value} onChange={rhfField.onChange} options={options} />;
    case "rating":
      return (
        <RatingField
          value={rhfField.value}
          onChange={rhfField.onChange}
          min={min}
          max={max}
          ratingLabels={ratingLabels}
        />
      );
    default:
      return null;
  }
}

export default function FieldRenderer({ field, control, form }) {
  const formControl = form?.control ?? control;
  const { key, label, required, hint, value } = field;
  // Seed the form from the schema's resolved value. For entity_type the API now
  // returns the canonical EntityType name (which matches the field options), so
  // it can be set directly — no client-side id→label remapping needed.
  useEffect(() => {
    if (form) {
      form.setValue(key, value ?? "");
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>}
      <Controller
        name={key}
        control={formControl}
        render={({ field: rhfField }) => <FieldInput field={field} rhfField={rhfField} />}
      />
    </div>
  );
}
