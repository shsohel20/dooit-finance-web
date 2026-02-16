'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const data = [
  { month: 'Jan', low: 45, medium: 30, high: 15, critical: 10 },
  { month: 'Feb', low: 48, medium: 28, high: 14, critical: 10 },
  { month: 'Mar', low: 50, medium: 27, high: 13, critical: 10 },
  { month: 'Apr', low: 52, medium: 26, high: 12, critical: 10 },
  { month: 'May', low: 55, medium: 25, high: 12, critical: 8 },
  { month: 'Jun', low: 58, medium: 24, high: 11, critical: 7 },
  { month: 'Jul', low: 60, medium: 22, high: 10, critical: 6 },
  { month: 'Aug', low: 63, medium: 20, high: 9, critical: 5 },
];

const chartConfig = {
  low: {
    label: 'Low Risk',
    color: 'hsl(160, 84%, 39%)',
  },
  medium: {
    label: 'Medium Risk',
    color: 'hsl(38, 92%, 50%)',
  },
  high: {
    label: 'High Risk',
    color: 'hsl(25, 95%, 53%)',
  },
  critical: {
    label: 'Critical',
    color: 'hsl(0, 84%, 60%)',
  },
};

export function RiskTrendChart() {
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Risk Trends
            </CardTitle>
            <CardDescription className="text-xs">
              Monthly risk distribution over 8 months
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {Object.entries(chartConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span className="text-xs text-muted-foreground">
                  {config.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillLow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(160, 84%, 39%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(160, 84%, 39%)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillMedium" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(38, 92%, 50%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(38, 92%, 50%)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillHigh" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(25, 95%, 53%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(25, 95%, 53%)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillCritical" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(0, 84%, 60%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(0, 84%, 60%)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(220, 13%, 91%)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{
                stroke: 'hsl(221, 83%, 53%)',
                strokeWidth: 1,
                strokeDasharray: '4 4',
              }}
            />
            <Area
              type="monotone"
              dataKey="low"
              stroke="var(--color-low)"
              strokeWidth={2}
              fill="url(#fillLow)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(0, 0%, 100%)' }}
            />
            <Area
              type="monotone"
              dataKey="medium"
              stroke="var(--color-medium)"
              strokeWidth={2}
              fill="url(#fillMedium)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(0, 0%, 100%)' }}
            />
            <Area
              type="monotone"
              dataKey="high"
              stroke="var(--color-high)"
              strokeWidth={2}
              fill="url(#fillHigh)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(0, 0%, 100%)' }}
            />
            <Area
              type="monotone"
              dataKey="critical"
              stroke="var(--color-critical)"
              strokeWidth={2}
              fill="url(#fillCritical)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: 'hsl(0, 0%, 100%)' }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
