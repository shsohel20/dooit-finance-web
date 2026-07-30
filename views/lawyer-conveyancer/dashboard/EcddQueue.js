"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import { dateShowFormat, riskLevelVariants } from "@/lib/utils";

export function EcddQueue({ ecdd }) {
  const queue = ecdd?.queue || [];

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">ECDD Queue</CardTitle>
          <CardDescription>
            {ecdd?.pendingCount ?? 0} case{(ecdd?.pendingCount ?? 0) === 1 ? "" : "s"} awaiting a
            compliance officer decision
          </CardDescription>
        </div>
        <Link
          href="/dashboard/client/risk-assessment/customer"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          View all <ArrowUpRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {queue.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
            No ECDD decisions pending
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4 font-medium">Customer</th>
                  <th className="pb-2 pr-4 font-medium">Assessment</th>
                  <th className="pb-2 pr-4 font-medium">Risk</th>
                  <th className="pb-2 pr-4 font-medium">Score</th>
                  <th className="pb-2 font-medium">Assessed</th>
                </tr>
              </thead>
              <tbody>
                {queue.map((item) => (
                  <tr key={item._id} className="border-b border-border/50 last:border-0">
                    <td className="py-2.5 pr-4 text-foreground">{item.customerName}</td>
                    <td className="py-2.5 pr-4 text-muted-foreground">{item.uid}</td>
                    <td className="py-2.5 pr-4">
                      <Badge variant={riskLevelVariants[item.riskLabel] || "secondary"}>
                        {item.riskLabel || "—"}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-4 text-foreground">{item.riskScore ?? "—"}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {item.createdAt ? dateShowFormat(item.createdAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
