"use client";

import { Badge } from "@/components/ui/badge";
import ReportQueueItem from "./ReportQueueItem";
import CoverageStats from "./CoverageStats";

// Left column: the list of reports awaiting analyst review plus a rollup of
// screening coverage for the past week.
export default function ReportQueueSidebar({ queue, activeReportId, onSelect, coverage }) {
  return (
    <aside className="flex w-72 shrink-0 flex-col gap-4 border-r border-border pr-4">
      <div>
        <div className="mb-2 flex items-center gap-2 px-1">
          <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Awaiting review
          </p>
          <Badge variant="outline" className="text-[10px]">
            {queue.length}
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          {queue.map((item) => (
            <ReportQueueItem
              key={item.reportId}
              item={item}
              active={item.reportId === activeReportId}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <CoverageStats stats={coverage} />
    </aside>
  );
}
