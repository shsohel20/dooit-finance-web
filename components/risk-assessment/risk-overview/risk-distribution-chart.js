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
import { PieChart, Pie, Cell } from 'recharts';

const data = [
  { name: 'Low Risk', value: 245, fill: 'hsl(160, 84%, 39%)' },
  { name: 'Medium Risk', value: 156, fill: 'hsl(38, 92%, 50%)' },
  { name: 'High Risk', value: 87, fill: 'hsl(25, 95%, 53%)' },
  { name: 'Critical', value: 42, fill: 'hsl(0, 84%, 60%)' },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

const chartConfig = {
  low: { label: 'Low Risk', color: 'hsl(160, 84%, 39%)' },
  medium: { label: 'Medium Risk', color: 'hsl(38, 92%, 50%)' },
  high: { label: 'High Risk', color: 'hsl(25, 95%, 53%)' },
  critical: { label: 'Critical', color: 'hsl(0, 84%, 60%)' },
};

export function RiskDistributionChart() {
  return (
    <Card className="border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Risk Distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Customer breakdown by risk category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <ChartContainer
            config={chartConfig}
            className="h-[200px] w-[200px] flex-shrink-0"
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex-1 space-y-3">
            {data.map((item) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.fill }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm font-mono font-semibold tabular-nums">
                        {item.value}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.fill,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="border-t pt-2 mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Total Customers
              </span>
              <span className="text-sm font-bold font-mono">{total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
