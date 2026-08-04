"use client";

import AlertDetailsPanel from "./AlertDetailsPanel";
import StepWorkspacePanel from "./StepWorkspacePanel";
import StepsChecklistPanel from "./StepsChecklistPanel";
import OsiintData from "../OsiintData";
import { useInvestigationWizard } from "./hooks/useInvestigationWizard";

/**
 * The step-driven investigation workspace: alert context on the left, the
 * active step's form in the middle, the step list + checklist on the right
 * of that, and the OSINT report furthest right. All wizard state lives in
 * `useInvestigationWizard` and is threaded down as a single `wizard` object
 * so step components stay simple props-in/callbacks-out.
 */
export default function InvestigationHub({ caseData }) {
  const wizard = useInvestigationWizard(caseData);

  return (
    <div className="flex h-[calc(100vh-260px)] min-h-[620px] gap-3.5 overflow-x-auto pb-1">
      <AlertDetailsPanel caseData={caseData} />
      <StepWorkspacePanel caseData={caseData} wizard={wizard} />
      <StepsChecklistPanel wizard={wizard} />
      <div className="w-[288px] shrink-0 overflow-y-auto rounded-xl border border-border bg-white">
        <OsiintData />
      </div>
    </div>
  );
}
