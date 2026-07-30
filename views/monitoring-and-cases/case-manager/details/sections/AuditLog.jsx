"use client";

import { useMemo } from "react";
import CollapsibleSection from "../components/CollapsibleSection";
import { IconHistory } from "@tabler/icons-react";
import { dateShowFormatWithTime } from "@/lib/utils";

export default function AuditLog({ auditLog, sectionRef }) {
  const sorted = useMemo(
    () => [...(auditLog || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [auditLog],
  );

  return (
    <CollapsibleSection
      id="audit-log"
      title="Audit Log"
      icon={IconHistory}
      badge={sorted.length}
      defaultOpen={false}
      sectionRef={sectionRef}
    >
      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No audit entries recorded.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="sticky top-0 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 font-medium">Timestamp</th>
                <th className="px-3 py-2 font-medium">User</th>
                <th className="px-3 py-2 font-medium">Action</th>
                <th className="px-3 py-2 font-medium">Details</th>
                <th className="px-3 py-2 font-medium">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sorted.map((entry) => (
                <tr key={entry.id} className="align-top">
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                    {dateShowFormatWithTime(entry.date)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 font-medium text-heading">{entry.user}</td>
                  <td className="px-3 py-2 text-heading">{entry.action}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {/* AuditLog is event-shaped (action + details). Fall back to
                        the before/after pair for locally-logged entries. */}
                    {entry.details ||
                      [entry.previousValue, entry.newValue].filter(Boolean).join(" → ") ||
                      "—"}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-muted-foreground">
                    {entry.source || entry.device || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CollapsibleSection>
  );
}
