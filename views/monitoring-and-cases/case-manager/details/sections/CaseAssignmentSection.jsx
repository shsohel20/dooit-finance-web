"use client";

import CollapsibleSection from "../components/CollapsibleSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { IconUserCheck, IconHistory, IconUserPlus } from "@tabler/icons-react";
import { dateShowFormat, getInitials } from "@/lib/utils";
import { analysts } from "@/lib/case-manager-data";

export default function CaseAssignmentSection({ assignedAnalyst, assignment, onOpenReassign, sectionRef }) {
  if (!assignment) return null;

  const profile = analysts.find((a) => a.name === assignedAnalyst);

  return (
    <CollapsibleSection
      id="assignment"
      title="Case Assignment"
      icon={IconUserCheck}
      sectionRef={sectionRef}
      actions={
        <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={onOpenReassign}>
          <IconUserPlus className="size-3.5" />
          Assign / Reassign
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex items-start gap-3 rounded-lg border border-border p-3.5">
          <Avatar className="size-11">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {getInitials(assignedAnalyst)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-heading">{assignedAnalyst}</p>
            <p className="text-xs text-muted-foreground">{profile?.team || "—"}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="outline" className="text-xs">
                {profile?.activeCases ?? "—"} active cases
              </Badge>
              <Badge variant="outline" className="text-xs">
                {profile?.availability || "Unknown"}
              </Badge>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <IconHistory className="size-3.5" />
            Assignment History
          </p>
          {assignment.history?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history available.</p>
          ) : (
            <div className="relative ml-3 space-y-0 border-l border-border pl-5">
              {assignment.history?.map((h, i) => (
                <div key={i} className="relative pb-4 last:pb-0">
                  <span className="absolute -left-[22px] flex size-3.5 items-center justify-center rounded-full bg-primary ring-2 ring-background" />
                  <p className="text-sm font-semibold text-heading">{h.analyst}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.action} · {dateShowFormat(h.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </CollapsibleSection>
  );
}
