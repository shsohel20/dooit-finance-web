"use client";

import { useState } from "react";
import { Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import AlertDetailsPanel from "./AlertDetailsPanel";
import StepWorkspacePanel from "./StepWorkspacePanel";
import StepsChecklistPanel from "./StepsChecklistPanel";
import OsiintData from "../OsiintData";
import { useInvestigationWizard } from "./hooks/useInvestigationWizard";

/**
 * The step-driven investigation workspace: alert context on the left, the
 * active step's form in the middle, and the step list + checklist on the
 * right of that. The OSINT report opens in a slide-out drawer via the
 * "OSINT Report" button so the main workspace stays uncluttered. All wizard
 * state lives in `useInvestigationWizard` and is threaded down as a single
 * `wizard` object so step components stay simple props-in/callbacks-out.
 */
export default function InvestigationHub({ caseData }) {
  const wizard = useInvestigationWizard(caseData);
  const [osintOpen, setOsintOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[620px] gap-3.5 overflow-x-auto pb-1 relative pt-10">
      <AlertDetailsPanel caseData={caseData} />
      <StepWorkspacePanel caseData={caseData} wizard={wizard} />
      <StepsChecklistPanel wizard={wizard} />
      <div className="shrink-0">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setOsintOpen(true)}
          className={"absolute top-0 right-0"}
        >
          <Radar className="w-3.5 h-3.5 z-10" />
          OSINT Report
        </Button>
      </div>

      <Sheet open={osintOpen} onOpenChange={setOsintOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>OSINT Report</SheetTitle>
            <SheetDescription>
              Open-source intelligence findings and data sources for this customer.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <OsiintData caseData={caseData} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
