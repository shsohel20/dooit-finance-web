"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/badge";
import {
  IconBuilding,
  IconUsers,
  IconNetwork,
  IconPennant,
} from "@tabler/icons-react";

const riskVariants = {
  High: "danger",
  Medium: "warning",
  Low: "info",
};

export default function RelationshipsTab({ caseData }) {
  const rel = caseData?.relationships;
  if (!rel) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Companies */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconBuilding className="size-4" />
            Linked Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rel.companies?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No linked companies.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {rel.companies?.map((co, i) => (
                <div key={i} className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm font-semibold text-heading">{co.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{co.registrationNo}</p>
                  <Badge variant="outline" className="mt-1.5 text-xs">
                    {co.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individuals */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconUsers className="size-4" />
            Related Individuals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rel.individuals?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No related individuals.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {rel.individuals?.map((ind, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                  <div>
                    <p className="text-sm font-semibold text-heading">{ind.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{ind.relationship}</p>
                  </div>
                  {ind.riskTag && (
                    <StatusPill icon={<IconPennant />} variant={riskVariants[ind.riskTag]}>
                      {ind.riskTag}
                    </StatusPill>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stakeholders */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconNetwork className="size-4" />
            Stakeholders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rel.stakeholders?.length === 0 ? (
            <p className="text-sm text-muted-foreground">No stakeholders found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {rel.stakeholders?.map((sh, i) => (
                <div key={i} className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-sm font-semibold text-heading">{sh.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {sh.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {sh.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
