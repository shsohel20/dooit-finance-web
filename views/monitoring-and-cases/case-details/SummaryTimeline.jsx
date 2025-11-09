"use client";
import React from "react";
import { ActivityTimeline } from "./ActivityTimeline";
import { CaseOverview } from "./CaseOverview";
import { AnalystNotes } from "./AnalystNote";

const SummaryAndTimeline = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivityTimeline />
        <CaseOverview />
      </div>
      <AnalystNotes />
    </>
  );
};

export default SummaryAndTimeline;
