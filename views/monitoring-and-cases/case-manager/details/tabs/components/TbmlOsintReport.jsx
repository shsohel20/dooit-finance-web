"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import mockTbmlRuns from "./tbml-osint-report/mockTbmlRuns";
import RunSwitcher from "./tbml-osint-report/RunSwitcher";
import NewScreeningDialog from "./tbml-osint-report/NewScreeningDialog";
import ScreeningSummaryCard from "./tbml-osint-report/ScreeningSummaryCard";
import ExtractedProductsTable from "./tbml-osint-report/ExtractedProductsTable";
import LineItemAnalysisCard from "./tbml-osint-report/LineItemAnalysisCard";
import ReferencesCard from "./tbml-osint-report/ReferencesCard";
import NarrativeReportSection from "./tbml-osint-report/NarrativeReportSection";
import DocumentExtractRail from "./tbml-osint-report/DocumentExtractRail";
import AbsentFieldsCard from "./tbml-osint-report/AbsentFieldsCard";
import OsintResultsRail from "./tbml-osint-report/OsintResultsRail";
import RunAuditTrailCard from "./tbml-osint-report/RunAuditTrailCard";

/**
 * TBML screening tab: a switcher across every screening run performed on
 * this case's trade documents (original invoice, an amendment, a credit
 * note, ...), the selected run's price-vs-OSINT analysis and references in
 * the primary column, and a side rail with the document extract, absent
 * fields and raw OSINT research for that run.
 *
 * `runs` defaults to mockTbmlRuns until this is wired up to a real
 * screening-history endpoint.
 */
export default function TbmlOsintReport({ runs = mockTbmlRuns }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [uploadOpen, setUploadOpen] = useState(false);
  const run = runs[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-success">
        <Check className="size-3.5" />
        {run.createdAtLabel}
      </p>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[1fr_380px]">
        <div className="flex min-w-0 flex-col gap-4">
          <RunSwitcher runs={runs} activeIndex={activeIndex} onSelect={setActiveIndex} onOpenUpload={() => setUploadOpen(true)} />

          <ScreeningSummaryCard run={run} />

          <ExtractedProductsTable run={run} />

          {run.lineAnalyses.map((lineItem) => (
            <LineItemAnalysisCard key={`${run.id}-${lineItem.lineNumber}`} lineItem={lineItem} />
          ))}

          <ReferencesCard run={run} />

          <NarrativeReportSection run={run} />
        </div>

        <div className="flex flex-col gap-4">
          <DocumentExtractRail key={`extract-${run.id}`} run={run} />
          <AbsentFieldsCard fields={run.absentFields} />
          <OsintResultsRail key={`osint-${run.id}`} results={run.osintResults} />
          <RunAuditTrailCard audit={run.audit} />
        </div>
      </div>

      <NewScreeningDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  );
}
