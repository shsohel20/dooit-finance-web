"use client";

import CollapsibleSection from "../components/CollapsibleSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { IconMessageCircle, IconPlus } from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";

const statusVariants = {
  Pending: "warning",
  Responded: "success",
  Expired: "danger",
};

export default function RFISection({ rfis, onOpenCreateRFI, sectionRef }) {
  const list = rfis || [];

  return (
    <CollapsibleSection
      id="rfi"
      title="Request for Information (RFI)"
      icon={IconMessageCircle}
      badge={list.length}
      sectionRef={sectionRef}
      actions={
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onOpenCreateRFI}>
          <IconPlus className="size-3.5" />
          Create New RFI
        </Button>
      }
    >
      {list.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No information requests sent yet.</p>
      ) : (
        <div className="divide-y rounded-lg border">
          {list.map((rfi) => (
            <div key={rfi.id} className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-heading">{rfi.id}</span>
                  <StatusPill variant={statusVariants[rfi.status] || "outline"}>{rfi.status}</StatusPill>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{rfi.message}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {rfi.documents.map((doc) => (
                    <Badge key={doc} variant="outline" className="text-xs">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                <p>
                  Sent by <span className="font-medium text-heading">{rfi.sentBy}</span>
                </p>
                <p>Due {dateShowFormat(rfi.dueDate)}</p>
                {rfi.respondedDate ? (
                  <p className="text-success">Responded {dateShowFormat(rfi.respondedDate)}</p>
                ) : (
                  <p>Not yet responded</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}
