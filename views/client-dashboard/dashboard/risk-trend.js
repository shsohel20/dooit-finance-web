"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { riskTrendData } from "@/lib/dashboard-data";

const COLORS = {
  critical: "hsl(var(--destructive))",
  high: "hsl(25, 95%, 53%)",
  medium: "hsl(45, 93%, 47%)",
  low: "hsl(var(--success))",
};

export function RiskTrendChart() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Risk Assessment Trend
        </CardTitle>
        <p className="text-sm text-muted-foreground">Monthly breakdown over the last 8 months</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={riskTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.low} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.low} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.medium} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.medium} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.high} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.high} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.critical} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.critical} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [value.toLocaleString(), ""]}
              />
              <Legend
                iconType="circle"
                formatter={(value) => (
                  <span className="text-sm text-foreground capitalize">{value}</span>
                )}
              />
              <Area
                type="monotone"
                dataKey="low"
                stackId="1"
                stroke={COLORS.low}
                fill="url(#colorLow)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="medium"
                stackId="2"
                stroke={COLORS.medium}
                fill="url(#colorMedium)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="high"
                stackId="3"
                stroke={COLORS.high}
                fill="url(#colorHigh)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="critical"
                stackId="4"
                stroke={COLORS.critical}
                fill="url(#colorCritical)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
