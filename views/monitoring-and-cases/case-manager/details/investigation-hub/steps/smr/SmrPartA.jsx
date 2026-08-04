"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OptionRow from "../../shared/OptionRow";
import {
  SMR_SERVICE_OPTIONS,
  SMR_REASON_OPTIONS,
  SMR_PROVIDED_OPTIONS,
} from "../../data/investigationHubData";

export default function SmrPartA({ caseData, wizard }) {
  const { sel, toggleMulti, setRadio, reasonDraft, setReasonDraft, addReason, customReasons } = wizard;

  return (
    <div>
      <div className="mb-5 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Alert / Case Number</div>
          <Input defaultValue={caseData?.displayId || caseData?.uid} className="text-sm" />
        </div>
        <div>
          <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Reporting entity</div>
          <Input defaultValue={caseData?.organisation || "—"} className="text-sm" />
        </div>
      </div>

      <div className="mb-3 text-[13px] font-bold text-heading">
        1. Please specify the designated service(s) to which the suspicious matter relates
      </div>
      <div className="mb-5 grid gap-x-5 gap-y-2 rounded-xl border border-border p-4 sm:grid-cols-2">
        {SMR_SERVICE_OPTIONS.map((o) => (
          <OptionRow
            key={o}
            label={o}
            selected={(sel.services || []).includes(o)}
            multi
            dense
            onClick={() => toggleMulti("services", o)}
          />
        ))}
      </div>

      <div className="mb-2.5 text-[13px] font-bold text-heading">Was the designated service(s):</div>
      <div className="mb-5 flex gap-2.5">
        {SMR_PROVIDED_OPTIONS.map((o) => (
          <OptionRow
            key={o}
            label={o}
            selected={sel.provided === o}
            onClick={() => setRadio("provided", o)}
          />
        ))}
      </div>

      <div className="mb-3 text-[13px] font-bold text-heading">
        2. Please specify the reason(s) for the suspicion
      </div>
      <div className="grid gap-x-5 gap-y-2 rounded-xl border border-border p-4 sm:grid-cols-2">
        {[...SMR_REASON_OPTIONS, ...customReasons].map((o) => (
          <OptionRow
            key={o}
            label={o}
            selected={(sel.reasons || []).includes(o)}
            multi
            dense
            onClick={() => toggleMulti("reasons", o)}
          />
        ))}
      </div>

      <div className="mb-2 mt-4 text-xs font-semibold text-muted-foreground">Other, please specify:</div>
      <div className="flex gap-2.5">
        <Input
          value={reasonDraft}
          onChange={(e) => setReasonDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addReason()}
          placeholder="Add another reason for suspicion…"
          className="flex-1 text-sm"
        />
        <Button variant="outline" onClick={addReason} className="shrink-0">
          + Add
        </Button>
      </div>
    </div>
  );
}
