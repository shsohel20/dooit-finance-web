"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconDatabase, IconCopy } from "@tabler/icons-react";
import { cn, dateShowFormatWithTime } from "@/lib/utils";
import { toast } from "sonner";

function MetaRow({ label, value, mono = false, copyable = false }) {
  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(String(value));
    toast.success("Copied");
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-1.5 group">
        <span
          className={cn(
            "text-sm text-foreground",
            mono &&
              "font-mono text-xs bg-muted/40 border border-border rounded px-2 py-0.5 max-w-[200px] truncate"
          )}
        >
          {value ?? "—"}
        </span>
        {copyable && value && (
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
            title="Copy"
          >
            <IconCopy className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function MetadataSection({ staff }) {
  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <IconDatabase className="h-4 w-4 text-primary" />
          </div>
          System Metadata
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12">
          <div>
            <MetaRow label="Staff Record ID" value={staff?._id} mono copyable />
            <MetaRow label="Unique ID (UID)" value={staff?.uid} mono copyable />
            <MetaRow label="Sequence Number" value={`#${staff?.sequence}`} />
            <MetaRow label="Schema Version" value={`v${staff?.__v}`} />
          </div>
          <div>
            <MetaRow label="Client" value={staff?.client?.name} />
            <MetaRow label="Client ID" value={staff?.client?._id} mono copyable />
            <MetaRow label="Created By" value={staff?.createdBy?.name} />
            <MetaRow
              label="Created At"
              value={staff?.createdAt ? dateShowFormatWithTime(staff.createdAt) : "—"}
            />
            <MetaRow
              label="Last Updated"
              value={staff?.updatedAt ? dateShowFormatWithTime(staff.updatedAt) : "—"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
