"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import useAlertStore from "@/app/store/alerts";
import { formatDateTime } from "@/lib/utils";

const existingNotes = [
  {
    date: "2023-05-12",
    content:
      "Initial review completed. Multiple high-value transactions detected without clear business purpose.",
  },
  {
    date: "2023-05-13",
    content:
      "RFI sent to customer requesting clarification on transaction purposes.",
  },
];

export function AnalystNotes() {
  const [note, setNote] = useState("");
  const { details } = useAlertStore();
  console.log("analyst notes", details?.activityNote);
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Analyst Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {details?.activityNote?.map((note, index) => (
          <div
            key={index}
            className="rounded-lg bg-muted/30 border border-border p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-primary">
                {formatDateTime(note.uploadedAt)?.date}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {note.note}
            </p>
          </div>
        ))}
        <div className="space-y-3 pt-2">
          <Textarea
            placeholder="Write note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground resize-none"
          />
          <div className="flex justify-end">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
