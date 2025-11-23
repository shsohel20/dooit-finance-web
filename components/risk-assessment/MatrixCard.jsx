"use client";

import { Card } from "@/components/ui/card";
import { Shield, AlertTriangle, Users, TrendingUp } from "lucide-react";
import { RadialChart } from "../RadialChart";

const metrics = [
  {
    id: 1,
    title: "Total Risk Items",
    value: "156",
    change: "+12 this month",
    icon: Shield,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    progress: 78,
    progressColor: "text-blue-500",
  },
  {
    id: 2,
    title: "High/Critical Risks",
    value: "23",
    change: "-3 from last month",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    iconBg: "bg-red-50 dark:bg-red-950/30",
    progress: 23,
    progressColor: "text-red-500",
  },
  {
    id: 3,
    title: "Customer Assessments",
    value: "1,247",
    change: "+89 this week",
    icon: Users,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    progress: 92,
    progressColor: "text-emerald-500",
  },
  {
    id: 4,
    title: "Risk Trend",
    value: "Improving",
    change: "15% reduction",
    icon: TrendingUp,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50 dark:bg-violet-950/30",
    progress: 65,
    progressColor: "text-violet-500",
  },
];

export function MetricCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full">
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          className="relative overflow-hidden p-6 transition-all hover:shadow-lg"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className={`rounded-lg p-2 ${metric.iconBg}`}>
                  <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-3xl font-bold tracking-tight">
                  {metric.value}
                </p>
                <p className="text-xs text-muted-foreground">{metric.change}</p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <RadialChart
                progress={metric.progress}
                className={metric.progressColor}
                size={48}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
