"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { alertsData, alertsTrendData } from "@/lib/dashboard-data";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function AlertsOverview() {
  return (
    <Card className="border-0 p-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Alert Management
            </CardTitle>
            <p className="text-sm text-muted-foreground">SLA compliance and resolution tracking</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {alertsData.total} Total Alerts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">SLA Met</span>
            </div>
            <p className="text-xl font-bold text-foreground">{alertsData.slaMet}%</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Avg Resolution</span>
            </div>
            <p className="text-xl font-bold text-foreground">{alertsData.avgResolution}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">False Positive</span>
            </div>
            <p className="text-xl font-bold text-foreground">{alertsData.falsePositiveRate}%</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Open (P1)</span>
            </div>
            <p className="text-xl font-bold text-foreground">{alertsData.byPriority.p1.open}</p>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Alerts by Priority</h4>
          {Object.entries(alertsData.byPriority).map(([priority, data]) => (
            <div key={priority} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={priority === "p1" ? "destructive" : "secondary"}
                    className="text-xs uppercase w-8 justify-center"
                  >
                    {priority}
                  </Badge>
                  <span className="text-muted-foreground">{data.target} target</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-foreground font-medium">{data.open} open</span>
                  <span className="text-success text-xs">{data.slaMet}% met</span>
                </div>
              </div>
              <Progress value={data.slaMet} className="h-2" />
            </div>
          ))}
        </div>

        {/* Alerts Trend Chart */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Weekly Alert Trend</h4>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertsTrendData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: " var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: " var(--card)",
                    border: "1px solid  var(--border)",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-xs text-foreground capitalize">{value}</span>
                  )}
                />
                <Bar dataKey="opened" fill=" var(--danger)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="closed" fill=" var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill=" var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
