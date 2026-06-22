"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JOB_TITLE_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from "./constants";

const getOptionLabel = (options, value) =>
  options.find((option) => option.value === value)?.label || value;

export default function PersonCard({ person, index, onEdit, onRemove }) {
  const fullName = [person.personal?.firstName, person.personal?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {fullName || `Person ${index + 1}`}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {person.contact?.workEmail}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1">
            {person.employment?.jobTitle && (
              <span>{getOptionLabel(JOB_TITLE_OPTIONS, person.employment.jobTitle)}</span>
            )}
            {person.employment?.employmentType && (
              <span>
                {getOptionLabel(EMPLOYMENT_TYPE_OPTIONS, person.employment.employmentType)}
              </span>
            )}
            {person.contact?.phone && <span>{person.contact.phone}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={onEdit}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
