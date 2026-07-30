"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarClock } from "lucide-react";
import { cn, dateShowFormat, riskLevelVariants } from "@/lib/utils";

export function UpcomingReviews({ reviews }) {
  const upcoming = reviews?.upcoming || [];
  const overdueCount = reviews?.overdueCount ?? 0;
  const now = Date.now();

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          CRA Reviews
          {overdueCount > 0 && <Badge variant="danger">{overdueCount} overdue</Badge>}
        </CardTitle>
        <CardDescription>
          {reviews?.dueSoonCount ?? 0} due within 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {upcoming.length === 0 ? (
          <div className="flex h-[180px] items-center justify-center text-sm text-muted-foreground">
            No reviews due in the next 30 days
          </div>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((item) => {
              const overdue = item.nextReviewDate && new Date(item.nextReviewDate).getTime() < now;
              return (
                <li key={item._id} className="flex items-center gap-3 text-sm">
                  <CalendarClock
                    className={cn(
                      "h-4 w-4 shrink-0",
                      overdue ? "text-danger" : "text-muted-foreground"
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-foreground">{item.customerName}</p>
                    <p className={cn("text-xs", overdue ? "text-danger" : "text-muted-foreground")}>
                      {overdue ? "Overdue — " : "Due "}
                      {dateShowFormat(item.nextReviewDate)}
                    </p>
                  </div>
                  <Badge variant={riskLevelVariants[item.riskLabel] || "secondary"}>
                    {item.riskLabel || "—"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
