"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { riskAssessmentData } from "@/lib/dashboard-data";

const COLORS = {
  unacceptable: "var(--danger)",
  high: "hsl(25, 95%, 53%)",
  medium: "hsl(45, 93%, 47%)",
  low: "var(--success)",
};

export function RiskBreakdownChart() {
  const data = [
    {
      name: "Unacceptable",
      value: riskAssessmentData.breakdown.unacceptable.count,
      color: COLORS.unacceptable,
    },
    { name: "High", value: riskAssessmentData.breakdown.high.count, color: COLORS.high },
    { name: "Medium", value: riskAssessmentData.breakdown.medium.count, color: COLORS.medium },
    { name: "Low", value: riskAssessmentData.breakdown.low.count, color: COLORS.low },
  ];

  return (
    <Card className="border-0 p-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Risk Level Distribution
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {riskAssessmentData.totalAssessed.toLocaleString()} assessments in{" "}
          {riskAssessmentData.period}
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
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
                  `${value.toLocaleString()} (${((value / riskAssessmentData.totalAssessed) * 100).toFixed(1)}%)`,
                  name,
                ]}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
              <div
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground truncate">{item.name}</p>
                <p className="text-sm font-semibold text-foreground">
                  {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
