"use client";

import { toast } from "sonner";
import NarrativeReportTab from "./NarrativeReportTab";

// Card wrapper around the parsed narrative-report markdown, with the
// "export to case file" action from the mockup.
export default function NarrativeReportSection({ run }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold tracking-wide text-heading uppercase">Narrative report</span>
        <button
          type="button"
          onClick={() => toast.success(`Narrative for ${run.id} exported to case file`)}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Export to case file
        </button>
      </div>
      <NarrativeReportTab markdown={run.narrative} />
    </div>
  );
}
