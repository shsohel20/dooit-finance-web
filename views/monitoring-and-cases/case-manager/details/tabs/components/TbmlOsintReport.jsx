"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileSearch, ListChecks, ScrollText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReportQueueSidebar from "./tbml-osint-report/ReportQueueSidebar";
import ReportHeader from "./tbml-osint-report/ReportHeader";
import OverallRiskPanel from "./tbml-osint-report/OverallRiskPanel";
import FindingsTab from "./tbml-osint-report/FindingsTab";
import NarrativeReportTab from "./tbml-osint-report/NarrativeReportTab";
import SourcesAuditTab from "./tbml-osint-report/SourcesAuditTab";
import ReportFooterActionBar from "./tbml-osint-report/ReportFooterActionBar";
import mockTbmlReportData from "./tbml-osint-report/mockTbmlReportData";
import { mockReportQueue, mockCoverageStats } from "./tbml-osint-report/mockReportQueue";

/**
 * Full TBML / OSINT report review screen: an "awaiting review" queue on the
 * left, the selected report's findings / narrative / audit-trail tabs in
 * the middle, and an overall-risk scorecard + action bar around it.
 *
 * `report` defaults to the single sample payload the OSINT service returns
 * today. The queue and coverage stats are placeholder data (see
 * mockReportQueue.js) until a real queue-listing endpoint exists.
 */
export default function TbmlOsintReport({ report = mockTbmlReportData }) {
  const [activeReportId, setActiveReportId] = useState(report.report_id);

  const handleSelectQueueItem = (reportId) => {
    if (reportId === report.report_id) {
      setActiveReportId(reportId);
      return;
    }
    // The queue list is placeholder data with no backing report payload yet.
    toast.info(
      "This report isn't available in the preview — only the sample report loads real data.",
    );
  };

  const reviewMessage = report.requires_analyst_review
    ? `Requires analyst review — ${report.review_reasons?.[0] || "confirmation is needed before any action is taken."}`
    : "No further review required.";

  console.log("report", report);
  return (
    <div className="flex gap-5">
      <ReportQueueSidebar
        queue={mockReportQueue}
        activeReportId={activeReportId}
        onSelect={handleSelectQueueItem}
        coverage={mockCoverageStats}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <ReportHeader report={report} />
          <OverallRiskPanel
            score={report.overall_risk_score}
            level={report.overall_risk_level}
            requiresReview={report.requires_analyst_review}
          />
        </div>

        <Tabs defaultValue="findings">
          <TabsList>
            <TabsTrigger value="findings">
              <ListChecks className="size-3.5" /> Findings
            </TabsTrigger>
            <TabsTrigger value="narrative">
              <ScrollText className="size-3.5" /> Narrative report
            </TabsTrigger>
            <TabsTrigger value="sources">
              <FileSearch className="size-3.5" /> Sources & audit trail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="findings" className="mt-4">
            <FindingsTab report={report} />
          </TabsContent>
          <TabsContent value="narrative" className="mt-4">
            <NarrativeReportTab markdown={report.narrative_report} />
          </TabsContent>
          <TabsContent value="sources" className="mt-4">
            <SourcesAuditTab report={report} />
          </TabsContent>
        </Tabs>

        {/* <ReportFooterActionBar message={reviewMessage} reportId={report.report_id} /> */}
      </div>
    </div>
  );
}
