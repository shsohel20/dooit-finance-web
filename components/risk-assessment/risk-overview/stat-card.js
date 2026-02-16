'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export function StatCard({
  title,
  value,
  change,
  icon,
  description,
  sparklineData = [30, 45, 35, 50, 40, 60, 55, 70, 65, 80],
  accentColor = 'hsl(221, 83%, 53%)',
}) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  const chartData = sparklineData.map((v, i) => ({ index: i, value: v }));

  return (
    <Card className="relative overflow-hidden border hover:shadow-lg transition-shadow duration-300">
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ backgroundColor: accentColor }}
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <div className="h-4 w-4" style={{ color: accentColor }}>
                  {icon}
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {title}
              </p>
            </div>
            <div className="flex items-end gap-3">
              <p className="text-3xl font-bold tracking-tight">{value}</p>
              {change !== undefined && (
                <div
                  className={cn(
                    'mb-1 flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                    isPositive && 'bg-emerald-50 text-emerald-600',
                    isNegative && 'bg-red-50 text-red-600'
                  )}
                >
                  {isPositive && <ArrowUpIcon className="h-3 w-3" />}
                  {isNegative && <ArrowDownIcon className="h-3 w-3" />}
                  {isPositive && '+'}
                  {change}%
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className="h-12 w-24 opacity-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id={`gradient-${title}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={accentColor}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor={accentColor}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={accentColor}
                  strokeWidth={1.5}
                  fill={`url(#gradient-${title})`}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
