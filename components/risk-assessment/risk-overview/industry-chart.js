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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const data = [
  { industry: 'Tech', customers: 125, avgRisk: 32 },
  { industry: 'Finance', customers: 98, avgRisk: 45 },
  { industry: 'Health', customers: 87, avgRisk: 28 },
  { industry: 'Retail', customers: 76, avgRisk: 38 },
  { industry: 'Mfg', customers: 65, avgRisk: 42 },
  { industry: 'Energy', customers: 54, avgRisk: 51 },
];

const chartConfig = {
  customers: {
    label: 'Customers',
    color: 'hsl(221, 83%, 53%)',
  },
  avgRisk: {
    label: 'Avg Risk',
    color: 'hsl(262, 83%, 58%)',
  },
};

export function IndustryChart() {
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Industry Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Customers and risk by industry sector
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: 'hsl(221, 83%, 53%)' }}
              />
              <span className="text-xs text-muted-foreground">Customers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: 'hsl(262, 83%, 58%)' }}
              />
              <span className="text-xs text-muted-foreground">Avg Risk</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(220, 13%, 91%)"
            />
            <XAxis
              dataKey="industry"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: 'hsl(220, 9%, 46%)' }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="customers"
              fill="var(--color-customers)"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="avgRisk"
              fill="var(--color-avgRisk)"
              radius={[6, 6, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
