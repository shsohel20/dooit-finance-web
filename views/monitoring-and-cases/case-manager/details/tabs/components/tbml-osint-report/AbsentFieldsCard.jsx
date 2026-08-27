"use client";

// Fields the extraction model deliberately left blank rather than guessing
// at, for the document behind this run.
export default function AbsentFieldsCard({ fields }) {
  if (!fields?.length) return null;

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4">
      <span className="text-xs font-semibold tracking-wide text-heading uppercase">Fields absent from document</span>
      <div className="flex flex-wrap gap-1.5">
        {fields.map((field) => (
          <span key={field} className="rounded bg-muted px-2 py-1 text-[11px] text-muted-foreground">
            {field}
          </span>
        ))}
      </div>
      <span className="text-[11px] leading-relaxed text-muted-foreground">
        Engine left these empty rather than inferring values.
      </span>
    </div>
  );
}
