"use client";

import { Input } from "@/components/ui/input";

const FIELDS = [
  "Activity period — start",
  "Activity period — end",
  "Review window — from",
  "Review window — to",
];

export default function DateRangeStep() {
  return (
    <div className="max-w-[560px]">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((label) => (
          <div key={label}>
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">{label}</div>
            <Input type="date" className="text-sm" />
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-border bg-muted/30 px-3.5 py-3 text-[13px] text-muted-foreground">
        Selected activity window spans <strong className="text-heading">46 days</strong>. All flagged
        transactions fall inside this range.
      </div>
    </div>
  );
}
