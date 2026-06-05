"use client";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";

const formatLabel = (type) =>
  type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Controlled select populated from the document-types API.
 *
 * Props:
 *   value       – controlled value (snake_case string)
 *   onChange    – (e) => void  OR  (value) => void
 *   name        – html name attribute
 *   className   – extra classes applied to the <select>
 *   placeholder – placeholder option label (default "Select document type")
 *   required    – boolean
 */
export default function DocumentTypeSelect({
  value = "",
  onChange,
  name = "document_type",
  className = "",
  placeholder = "Select document type",
  required = false,
}) {
  const { types, loading } = useDocumentTypes();

  const baseCls =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50";

  const handleChange = (e) => {
    if (typeof onChange === "function") {
      // support both (e) => and (value) => signatures
      try {
        onChange(e);
      } catch {
        onChange(e.target.value);
      }
    }
  };

  return (
    <select
      name={name}
      value={value}
      onChange={handleChange}
      required={required}
      disabled={loading}
      className={`${baseCls} ${className}`}
    >
      <option value="">{loading ? "Loading…" : placeholder}</option>
      {types.map((type) => (
        <option key={type} value={type}>
          {formatLabel(type)}
        </option>
      ))}
    </select>
  );
}
