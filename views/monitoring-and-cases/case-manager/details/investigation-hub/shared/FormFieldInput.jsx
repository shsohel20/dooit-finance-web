"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * Renders a single narrative/SMR form field from a field definition produced
 * by `investigationHubData.js`. Fields are intentionally uncontrolled — this
 * step captures free-text investigator input that is submitted as a whole
 * when the report is generated, not tracked keystroke-by-keystroke.
 */
export default function FormFieldInput({ field, defaultValue }) {
  return (
    <div className={cn(field.full && "sm:col-span-2")}>
      <div className="mb-1.5 text-xs font-semibold text-muted-foreground">{field.label}</div>
      {field.type === "textarea" ? (
        <Textarea
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          className="min-h-24 resize-y text-sm"
        />
      ) : field.type === "select" ? (
        <Select defaultValue={defaultValue}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder={field.placeholder || "Select…"} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((o) => (
              <SelectItem key={o} value={o}>
                {o}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={field.type}
          defaultValue={defaultValue}
          placeholder={field.placeholder}
          className="text-sm"
        />
      )}
    </div>
  );
}
