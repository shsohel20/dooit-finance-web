"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { dateShowFormat } from "@/lib/utils";
import { CASE_STATUS_VARIANT } from "./constants";

export function RecentCases({ cases }) {
  const recent = cases?.recent || [];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Recent Cases</CardTitle>
          <CardDescription>{cases?.open ?? 0} open cases</CardDescription>
        </div>
        <Link
          href="/dashboard/client/monitoring-and-cases/case-manager"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Case manager <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
            No cases raised yet
          </div>
        ) : (
          <ul className="space-y-3">
            {recent.map((item) => (
              <li key={item._id} className="flex items-center gap-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-foreground">{item.caseType || item.uid}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.uid} · {dateShowFormat(item.createdAt)}
                  </p>
                </div>
                <Badge variant={CASE_STATUS_VARIANT[item.status] || "secondary"}>
                  {item.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
