"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { kycStatusData } from "@/lib/dashboard-data";
import { Clock, CheckCircle, XCircle, FileSearch } from "lucide-react";

const COLORS = {
  approved: "hsl(var(--success))",
  pending: "hsl(var(--warning))",
  rejected: "hsl(var(--destructive))",
  inReview: "hsl(var(--primary))",
};

export function KYCStatusChart() {
  const data = [
    { name: "Approved", value: kycStatusData.approved, color: COLORS.approved, icon: CheckCircle },
    { name: "Pending", value: kycStatusData.pending, color: COLORS.pending, icon: Clock },
    { name: "Rejected", value: kycStatusData.rejected, color: COLORS.rejected, icon: XCircle },
    { name: "In Review", value: kycStatusData.inReview, color: COLORS.inReview, icon: FileSearch },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">KYC Status</CardTitle>
            <p className="text-sm text-muted-foreground">Customer verification overview</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {total.toLocaleString()} Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value, name) => [
                  `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50"
              >
                <Icon className="h-4 w-4" style={{ color: item.color }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                  <p className="text-sm font-semibold text-foreground">
                    {item.value.toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
              <p className="text-lg font-bold text-foreground">{kycStatusData.completionRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Avg Processing</p>
              <p className="text-lg font-bold text-foreground">{kycStatusData.avgProcessingTime}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
