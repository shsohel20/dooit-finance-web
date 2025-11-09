import { CaseHeader } from "@/views/monitoring-and-cases/case-details/CaseHeader";
import CaseTabs from "@/views/monitoring-and-cases/case-details/CaseTabs";
import React from "react";

export default function CaseListDetails() {
  return (
    <div>
      <div className="min-h-screen bg-background">
        <CaseHeader />
        <div className="border-b border-border">
          <div className="container mx-auto ">
            <CaseTabs />
          </div>
        </div>
        {/* <main className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ActivityTimeline />
            <CaseOverview />
          </div>
          <AnalystNotes />
        </main> */}
      </div>
    </div>
  );
}
