"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Sticky action row: the review-required message plus the three actions an
// analyst can take on this report.
export default function ReportFooterActionBar({ message, reportId }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <p className="text-xs text-muted-foreground">{message}</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.info(`Requesting more information for ${reportId}`)}
        >
          Request information
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.success(`${reportId} cleared`)}>
          Clear
        </Button>
        <Button size="sm" onClick={() => toast.success(`${reportId} escalated to case`)}>
          Escalate to case
        </Button>
      </div>
    </div>
  );
}
