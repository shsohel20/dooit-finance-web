"use client";

import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/**
 * A selectable card/row used across the wizard for radio and checkbox style
 * choices (triage decisions, red-flag checklists, typologies, SMR service
 * lists...). `multi` only changes the mark's shape (square vs round) so
 * radio vs checkbox intent stays visually clear.
 */
export default function OptionRow({ label, selected, multi, onClick, dense = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-2.5 text-left transition-colors",
        dense
          ? "rounded-md px-1 py-1.5 text-[13px]"
          : "mb-2 w-full rounded-lg border px-3.5 py-3 text-sm font-medium",
        !dense && (selected ? "border-primary bg-primary/5 text-primary" : "border-border bg-white text-heading"),
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-[18px] shrink-0 items-center justify-center border text-[10px] font-bold",
          multi ? "rounded-[5px]" : "rounded-full",
          selected ? "border-primary bg-primary text-white" : "border-muted-foreground/40 bg-white text-transparent",
        )}
      >
        <IconCheck className="size-3" strokeWidth={3} />
      </span>
      <span className={cn(dense ? "text-muted-foreground" : "", selected && dense && "font-semibold text-heading")}>
        {label}
      </span>
    </button>
  );
}
