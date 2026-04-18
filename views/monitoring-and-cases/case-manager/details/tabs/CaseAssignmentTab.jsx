"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import {
  IconUserCheck,
  IconHistory,
  IconAlertTriangle,
  IconCheck,
} from "@tabler/icons-react";
import { analysts } from "@/lib/case-manager-data";
import { dateShowFormat } from "@/lib/utils";

const priorityVariants = {
  High: "danger",
  Medium: "warning",
  Low: "info",
};

export default function CaseAssignmentTab({ caseData }) {
  const assignment = caseData?.assignment;
  const [selectedAnalyst, setSelectedAnalyst] = useState(assignment?.assignedAnalyst || "");
  const [notes, setNotes] = useState(assignment?.notes || "");
  const [saved, setSaved] = useState(false);

  if (!assignment) return null;

  const handleSave = () => {
    // In production this would call an API
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Current Assignment */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconUserCheck className="size-4" />
            Current Assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Assigned Analyst</Label>
            <Select value={selectedAnalyst} onValueChange={setSelectedAnalyst}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="Select analyst" />
              </SelectTrigger>
              <SelectContent>
                {analysts.map((a) => (
                  <SelectItem key={a.id} value={a.name}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Priority Level</Label>
            <div className="flex items-center gap-2">
              <StatusPill
                icon={<IconAlertTriangle />}
                variant={priorityVariants[assignment.priority]}
              >
                {assignment.priority}
              </StatusPill>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Analyst Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add notes..."
              className="text-sm resize-none"
            />
          </div>

          <Button
            size="sm"
            className="w-full gap-1.5"
            onClick={handleSave}
          >
            {saved ? (
              <>
                <IconCheck className="size-3.5" />
                Saved
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Assignment History */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconHistory className="size-4" />
            Assignment History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignment.history?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history available.</p>
          ) : (
            <div className="relative ml-3 space-y-0 border-l border-border pl-5">
              {assignment.history?.map((h, i) => (
                <div key={i} className="relative pb-5 last:pb-0">
                  <span className="absolute -left-[22px] flex size-3.5 items-center justify-center rounded-full bg-primary ring-2 ring-background" />
                  <p className="text-sm font-semibold text-heading">{h.analyst}</p>
                  <p className="text-xs text-muted-foreground">
                    {h.action} · {dateShowFormat(h.date)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
