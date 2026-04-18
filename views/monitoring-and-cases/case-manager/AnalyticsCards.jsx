"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconClipboardList,
  IconCircleCheck,
  IconAlertCircle,
  IconClock,
} from "@tabler/icons-react";
import { caseAnalytics } from "@/lib/case-manager-data";

const metricCards = [
  {
    label: "Total Reviews",
    valueKey: "totalReviews",
    changeKey: "totalReviewsChange",
    icon: IconClipboardList,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "Completed Reviews",
    valueKey: "completedReviews",
    changeKey: "completedReviewsChange",
    icon: IconCircleCheck,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Open Reviews",
    valueKey: "openReviews",
    changeKey: "openReviewsChange",
    icon: IconAlertCircle,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    label: "Avg Review Time",
    valueKey: "avgReviewTimeDays",
    changeKey: "avgReviewTimeChange",
    icon: IconClock,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    suffix: " days",
  },
];

export default function AnalyticsCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {metricCards.map((card) => {
        const Icon = card.icon;
        const value = caseAnalytics[card.valueKey];
        const change = caseAnalytics[card.changeKey];
        const isPositive = change >= 0;

        return (
          <Card key={card.label} className="border border-border shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-1 text-2xl font-bold text-heading">
                    {value}
                    {card.suffix || ""}
                  </p>
                  <div
                    className={cn("mt-1 flex items-center gap-1 text-xs font-medium", {
                      "text-green-600": isPositive,
                      "text-red-500": !isPositive,
                    })}
                  >
                    {isPositive ? (
                      <IconArrowUpRight className="size-3.5" />
                    ) : (
                      <IconArrowDownRight className="size-3.5" />
                    )}
                    <span>{Math.abs(change)}% vs last month</span>
                  </div>
                </div>
                <div className={cn("rounded-lg p-2.5", card.iconBg)}>
                  <Icon className={cn("size-5", card.iconColor)} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
