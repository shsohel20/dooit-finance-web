"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  change,
  trend,
  prefix = "",
  suffix = "",
  icon,
  className,
}) {
  const isPositiveTrend = trend === "up";
  const trendColor = isPositiveTrend ? "text-success" : "text-destructive";
  const TrendIcon = isPositiveTrend ? ArrowUpRight : ArrowDownRight;

  return (
    <Card className={cn("border-border/50 shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground tracking-tight">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix}
            </p>
          </div>
          {icon && <div className="p-2 bg-secondary rounded-lg text-primary">{icon}</div>}
        </div>
        {change !== undefined && (
          <div className={cn("flex items-center gap-1 mt-3 text-sm font-medium", trendColor)}>
            <TrendIcon className="h-4 w-4" />
            <span>{Math.abs(change)}%</span>
            <span className="text-muted-foreground font-normal ml-1">vs last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
