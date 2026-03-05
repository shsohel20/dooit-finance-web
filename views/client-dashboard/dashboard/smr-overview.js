"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { smrData } from "@/lib/dashboard-data";
import { FileText, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

const URGENCY_COLORS = {
  safe: "hsl(var(--success))",
  moderate: "hsl(var(--warning))",
  high: "hsl(var(--destructive))",
};

export function SMROverview() {
  const offenceData = smrData.likelyOffences.map((item) => ({
    name: item.offence.length > 12 ? item.offence.slice(0, 12) + "..." : item.offence,
    fullName: item.offence,
    value: item.percentage,
  }));

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">SMR Cases</CardTitle>
            <p className="text-sm text-muted-foreground">Suspicious Matter Reports</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {smrData.totalCases} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <FileText className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-foreground">{smrData.compliance}%</p>
            <p className="text-xs text-muted-foreground">Compliance</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
            <p className="text-lg font-bold text-foreground">{smrData.avgFilingTime}</p>
            <p className="text-xs text-muted-foreground">Avg Filing</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50 text-center">
            <CheckCircle2 className="h-4 w-4 mx-auto mb-1 text-success" />
            <p className="text-lg font-bold text-foreground">
              {smrData.withinSla}/{smrData.totalCases}
            </p>
            <p className="text-xs text-muted-foreground">Within SLA</p>
          </div>
        </div>

        {/* Urgency Levels */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Urgency Breakdown
          </h4>
          <div className="space-y-2">
            {Object.entries(smrData.urgencyLevels).map(([level, data]) => (
              <div key={level} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: URGENCY_COLORS[level] }}
                    />
                    <span className="capitalize text-foreground">{level}</span>
                    {level === "safe" && (
                      <span className="text-xs text-muted-foreground">(48+ hrs)</span>
                    )}
                    {level === "moderate" && (
                      <span className="text-xs text-muted-foreground">(24-48 hrs)</span>
                    )}
                    {level === "high" && (
                      <span className="text-xs text-muted-foreground">({"<"}24 hrs)</span>
                    )}
                  </div>
                  <span className="font-medium text-foreground">{data.count}</span>
                </div>
                <Progress
                  value={data.percentage}
                  className={`h-1.5 ${
                    level === "safe"
                      ? "[&>div]:bg-success"
                      : level === "moderate"
                        ? "[&>div]:bg-warning"
                        : "[&>div]:bg-destructive"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Likely Offences Chart */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Likely Offences Distribution</h4>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={offenceData}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                  axisLine={false}
                  tickLine={false}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value, _, props) => [`${value}%`, props.payload.fullName]}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {offenceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Suspicion Reasons */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-2">Top Suspicion Reasons</h4>
          <div className="space-y-1.5">
            {smrData.suspicionReasons.slice(0, 3).map((item, index) => (
              <div key={item.reason} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-secondary text-xs flex items-center justify-center text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-foreground truncate max-w-[180px]">{item.reason}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.percentage}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
