"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconLink, IconEye } from "@tabler/icons-react";

const statusVariants = {
  Active: "success",
  "Under Review": "warning",
  Closed: "outline",
  // Case model statuses
  open: "info",
  under_investigation: "warning",
  pending_review: "warning",
  closed: "outline",
  escalated: "danger",
};

export default function RelatedCasesTab({ caseData }) {
  const router = useRouter();
  const relatedCases = caseData?.relatedCases;

  if (!relatedCases || relatedCases.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No related cases found.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <IconLink className="size-4" />
          Related Cases ({relatedCases.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {relatedCases.map((rc, i) => {
            return (
              <div key={rc._id || i} className="flex items-center justify-between py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-sm font-semibold text-heading">{rc.caseId}</span>
                  <Badge variant="outline" className="w-fit text-xs">
                    {rc.caseType}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill variant={statusVariants[rc.status]}>{rc.status}</StatusPill>
                  {rc._id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() =>
                        router.push(
                          `/dashboard/client/monitoring-and-cases/case-manager/${rc._id}`,
                        )
                      }
                    >
                      <IconEye className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
